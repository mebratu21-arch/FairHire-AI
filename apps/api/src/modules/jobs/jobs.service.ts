import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DbService } from '../../common/db/db.service';
import { AuditService } from '../audit/audit.service';
import { CreateJob, UpdateJob, JobCriterion } from '@fairhire/shared';

@Injectable()
export class JobsService {
  constructor(
    private readonly db: DbService,
    private readonly auditService: AuditService,
  ) {}

  async list(companyId: string) {
    return this.db.client.job.findMany({
      where: { companyId },
      include: {
        criteria: { orderBy: { position: 'asc' } },
        _count: { select: { candidates: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(companyId: string, jobId: string) {
    const job = await this.db.client.job.findFirst({
      where: { id: jobId, companyId },
      include: {
        criteria: { orderBy: { position: 'asc' } },
        _count: { select: { candidates: true } },
      },
    });

    if (!job) {
      throw new NotFoundException(`Job ${jobId} not found`);
    }

    return job;
  }

  async create(companyId: string, userId: string, data: CreateJob) {
    if (!data.criteria || data.criteria.length === 0) {
      throw new BadRequestException('At least one criterion is required');
    }

    const job = await this.db.client.job.create({
      data: {
        companyId,
        title: data.title,
        description: data.description,
        language: data.language as any,
        seniority: data.seniority,
        location: data.location,
        createdById: userId,
        status: 'DRAFT',
        criteria: {
          create: data.criteria.map((c, idx) => ({
            companyId,
            label: c.label,
            description: c.description,
            kind: c.kind as any,
            weight: c.weight,
            position: idx,
          })),
        },
      },
      include: { criteria: true },
    });

    await this.auditService.record({
      companyId,
      actorId: userId,
      action: 'job.create',
      entity: 'Job',
      entityId: job.id,
      metadata: { title: job.title, criteriaCount: job.criteria.length },
    });

    return job;
  }

  async update(companyId: string, jobId: string, userId: string, data: UpdateJob) {
    await this.getById(companyId, jobId);

    const updated = await this.db.client.job.update({
      where: { id: jobId },
      data: {
        ...(data.title ? { title: data.title } : {}),
        ...(data.description ? { description: data.description } : {}),
        ...(data.language ? { language: data.language as any } : {}),
        ...(data.seniority !== undefined ? { seniority: data.seniority } : {}),
        ...(data.location !== undefined ? { location: data.location } : {}),
      },
    });

    await this.auditService.record({
      companyId,
      actorId: userId,
      action: 'job.update',
      entity: 'Job',
      entityId: jobId,
      metadata: { fields: Object.keys(data) },
    });

    return updated;
  }

  async replaceCriteria(companyId: string, jobId: string, userId: string, criteria: JobCriterion[]) {
    await this.getById(companyId, jobId);

    if (criteria.length < 1 || criteria.length > 10) {
      throw new BadRequestException('A job must have between 1 and 10 criteria');
    }

    // Atomic replacement in transaction
    const result = await this.db.client.$transaction(async (tx) => {
      await tx.jobCriterion.deleteMany({ where: { jobId, companyId } });
      await tx.jobCriterion.createMany({
        data: criteria.map((c, idx) => ({
          jobId,
          companyId,
          label: c.label,
          description: c.description,
          kind: c.kind as any,
          weight: c.weight,
          position: idx,
        })),
      });

      return tx.jobCriterion.findMany({
        where: { jobId },
        orderBy: { position: 'asc' },
      });
    });

    await this.auditService.record({
      companyId,
      actorId: userId,
      action: 'job.criteria_update',
      entity: 'Job',
      entityId: jobId,
      metadata: { count: criteria.length },
    });

    return result;
  }

  async publish(companyId: string, jobId: string, userId: string) {
    const job = await this.getById(companyId, jobId);

    if (job.criteria.length === 0) {
      throw new BadRequestException('Cannot publish a job without screening criteria');
    }

    const updated = await this.db.client.job.update({
      where: { id: jobId },
      data: { status: 'PUBLISHED' },
    });

    await this.auditService.record({
      companyId,
      actorId: userId,
      action: 'job.publish',
      entity: 'Job',
      entityId: jobId,
    });

    return updated;
  }

  async duplicate(companyId: string, jobId: string, userId: string) {
    const source = await this.getById(companyId, jobId);

    const duplicated = await this.db.client.job.create({
      data: {
        companyId,
        title: `${source.title} (Copy)`,
        description: source.description,
        language: source.language,
        seniority: source.seniority,
        location: source.location,
        status: 'DRAFT',
        createdById: userId,
        criteria: {
          create: source.criteria.map((c) => ({
            companyId,
            label: c.label,
            description: c.description,
            kind: c.kind,
            weight: c.weight,
            position: c.position,
          })),
        },
      },
      include: { criteria: true },
    });

    await this.auditService.record({
      companyId,
      actorId: userId,
      action: 'job.duplicate',
      entity: 'Job',
      entityId: duplicated.id,
      metadata: { sourceJobId: jobId },
    });

    return duplicated;
  }
}
