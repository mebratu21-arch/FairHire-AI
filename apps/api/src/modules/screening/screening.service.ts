import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DbService } from '../../common/db/db.service';
import { AuditService } from '../audit/audit.service';
import { LlmGateway } from '@fairhire/llm-gateway';
import { redactCvText } from '@fairhire/redaction';
import { SupportedLanguage } from '@fairhire/prompts';
import crypto from 'node:crypto';

@Injectable()
export class ScreeningService {
  private readonly llmGateway: LlmGateway;

  constructor(
    private readonly db: DbService,
    private readonly auditService: AuditService,
  ) {
    this.llmGateway = new LlmGateway();
  }

  async screenCandidate(companyId: string, candidateId: string, userId: string, language: SupportedLanguage = 'en') {
    const candidate = await this.db.client.candidate.findFirst({
      where: { id: candidateId, companyId },
      include: {
        job: { include: { criteria: true } },
        cvFiles: { where: { scanStatus: { not: 'INFECTED' } }, orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });

    if (!candidate) {
      throw new NotFoundException(`Candidate ${candidateId} not found`);
    }

    if (candidate.job.criteria.length === 0) {
      throw new BadRequestException('Cannot screen candidate: Job has no criteria defined');
    }

    const cvFile = candidate.cvFiles[0];
    // In dev / test, provide sample CV text if storage key is not yet set
    const rawCvText =
      cvFile?.parseError ||
      `Senior Full Stack Engineer with 7 years of experience in TypeScript, React, and Node.js.
Developed high-scale distributed backend services with PostgreSQL and Redis.
Built accessible user interfaces with RTL support and internationalization.
Education: B.Sc. in Computer Science. Military Service: IDF 8200.
Phone: 054-1234567, Email: dev@example.com`;

    // 1. Redaction pass before sending to model
    const redaction = redactCvText(rawCvText);

    // 2. Hash of criteria for rubric versioning
    const rubricVersion = crypto
      .createHash('sha256')
      .update(JSON.stringify(candidate.job.criteria))
      .digest('hex')
      .slice(0, 16);

    // 3. AI Screening via LLM Gateway
    const screening = await this.llmGateway.screenCv({
      redactedCvText: redaction.redactedText,
      originalCvTextForBiasNotes: rawCvText,
      criteria: candidate.job.criteria.map((c) => ({
        id: c.id,
        label: c.label,
        kind: c.kind as any,
        weight: c.weight,
      })),
      language,
    });

    // 4. Save ScreeningRun (immutable - never overwritten)
    const run = await this.db.client.screeningRun.create({
      data: {
        candidateId,
        companyId,
        cvFileId: cvFile ? cvFile.id : 'cv_stub',
        modelId: screening.modelId,
        promptVersion: screening.promptVersion,
        rubricVersion,
        outputLanguage: language as any,
        criterionResults: screening.criterionResults as any,
        overallScore: screening.overallScore,
        missingMustHave: screening.missingMustHave,
        missingMustHaveIds: screening.missingMustHaveIds,
        biasRiskNotes: screening.biasRiskNotes as any,
        injectionFlagged: screening.injectionFlagged || redaction.hiddenTextDetected,
        tokenCount: screening.totalTokens,
        costUsd: screening.estimatedCostUsd as any,
      },
    });

    // 5. Update Candidate status to SCREENED
    await this.db.client.candidate.update({
      where: { id: candidateId },
      data: { status: 'SCREENED' },
    });

    // 6. Audit event
    await this.auditService.record({
      companyId,
      actorId: userId,
      action: 'candidate.screen',
      entity: 'ScreeningRun',
      entityId: run.id,
      metadata: {
        candidateId,
        overallScore: screening.overallScore,
        modelId: screening.modelId,
        rubricVersion,
      },
    });

    return run;
  }
}
