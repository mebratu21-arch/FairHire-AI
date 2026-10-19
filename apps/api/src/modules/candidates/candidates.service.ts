import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DbService } from '../../common/db/db.service';
import { AuditService } from '../audit/audit.service';
import { CreateDecision, CandidateListFilter } from '@fairhire/shared';

@Injectable()
export class CandidatesService {
  constructor(
    private readonly db: DbService,
    private readonly auditService: AuditService,
  ) {}

  async list(companyId: string, jobId: string, filter?: CandidateListFilter) {
    const where: any = { companyId, jobId, deletedAt: null };

    if (filter?.status) {
      where.status = filter.status;
    }

    const candidates = await this.db.client.candidate.findMany({
      where,
      include: {
        screeningRuns: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        decisions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { user: { select: { name: true, email: true } } },
        },
        cvFiles: {
          take: 1,
          select: { scanStatus: true, detectedLang: true, parseConfidence: true, hiddenTextFound: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: filter?.limit || 50,
    });

    return candidates.map((c) => ({
      id: c.id,
      externalRef: c.externalRef,
      status: c.status,
      latestRun: c.screeningRuns[0] || null,
      latestDecision: c.decisions[0] || null,
      cvFile: c.cvFiles[0] || null,
      createdAt: c.createdAt,
    }));
  }

  async getById(companyId: string, candidateId: string) {
    const candidate = await this.db.client.candidate.findFirst({
      where: { id: candidateId, companyId, deletedAt: null },
      include: {
        job: { include: { criteria: true } },
        screeningRuns: { orderBy: { createdAt: 'desc' } },
        decisions: {
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        notes: { orderBy: { createdAt: 'desc' } },
        cvFiles: true,
      },
    });

    if (!candidate) {
      throw new NotFoundException(`Candidate ${candidateId} not found`);
    }

    return candidate;
  }

  /**
   * Unmasks candidate identity (audited action requiring explicit reason).
   * Blind review is default; unmasking is recorded in the immutable audit log.
   */
  async unmask(companyId: string, candidateId: string, userId: string, reason: string) {
    if (!reason || reason.trim().length < 5) {
      throw new BadRequestException('A valid reason (min 5 chars) is required to unmask candidate identity');
    }

    const candidate = await this.getById(companyId, candidateId);

    const identity = await this.db.client.candidateIdentity.findUnique({
      where: { candidateId },
    });

    await this.auditService.record({
      companyId,
      actorId: userId,
      action: 'candidate.unmask',
      entity: 'Candidate',
      entityId: candidateId,
      metadata: { reason: reason.trim(), externalRef: candidate.externalRef },
    });

    return {
      unmasked: true,
      identity: identity || { fullName: 'No identity record found', email: null, phone: null },
    };
  }

  async recordDecision(companyId: string, candidateId: string, userId: string, data: CreateDecision) {
    const candidate = await this.getById(companyId, candidateId);
    const latestRun = candidate.screeningRuns[0];

    // Check if decision contradicts AI recommendation (e.g. AI score >= 70 but REJECT, or < 50 but SHORTLIST)
    let overrodeAi = false;
    if (latestRun && latestRun.overallScore !== null) {
      if (data.decision === 'SHORTLIST' && latestRun.overallScore < 50) {
        overrodeAi = true;
      } else if (data.decision === 'REJECT' && latestRun.overallScore >= 70) {
        overrodeAi = true;
      }
    }

    const decision = await this.db.client.humanDecision.create({
      data: {
        candidateId,
        companyId,
        userId,
        decision: data.decision as any,
        reason: data.reason,
        overrodeAi,
      },
    });

    // Update candidate status
    const newStatus =
      data.decision === 'SHORTLIST'
        ? 'SHORTLISTED'
        : data.decision === 'REJECT'
          ? 'REJECTED'
          : 'ON_HOLD';

    await this.db.client.candidate.update({
      where: { id: candidateId },
      data: { status: newStatus as any },
    });

    await this.auditService.record({
      companyId,
      actorId: userId,
      action: 'candidate.decision',
      entity: 'HumanDecision',
      entityId: decision.id,
      metadata: {
        candidateId,
        decision: data.decision,
        reason: data.reason,
        overrodeAi,
      },
    });

    return decision;
  }
}
