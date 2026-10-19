import { Injectable, Logger } from '@nestjs/common';
import { DbService } from '../../common/db/db.service';
import crypto from 'node:crypto';

export interface RecordAuditEventInput {
  companyId: string;
  actorId?: string | null;
  action: string;
  entity: string;
  entityId: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly db: DbService) {}

  /**
   * Appends an event to the company's immutable hash chain.
   */
  async record(input: RecordAuditEventInput) {
    const { companyId, actorId, action, entity, entityId, metadata = {} } = input;

    // Fetch the most recent event for this company to get prevHash
    const lastEvent = await this.db.client.auditEvent.findFirst({
      where: { companyId },
      orderBy: { id: 'desc' },
      select: { hash: true },
    });

    const prevHash = lastEvent ? lastEvent.hash : 'GENESIS_0000000000000000000000000000000000000000000000000000000000000000';

    // Canonical payload for deterministic hashing (strictly no PII)
    const canonicalPayload = JSON.stringify({
      companyId,
      actorId: actorId || null,
      action,
      entity,
      entityId,
      metadata,
    });

    const hash = crypto
      .createHash('sha256')
      .update(prevHash + canonicalPayload)
      .digest('hex');

    const created = await this.db.client.auditEvent.create({
      data: {
        companyId,
        actorId: actorId || null,
        action,
        entity,
        entityId,
        metadata: metadata as any,
        prevHash,
        hash,
      },
    });

    this.logger.log(`Audit recorded: [${action}] on ${entity}:${entityId} (Company: ${companyId})`);
    return created;
  }

  /**
   * Search audit log for a company
   */
  async search(companyId: string, query?: { limit?: number; entity?: string }) {
    const limit = Math.min(query?.limit || 50, 100);
    return this.db.client.auditEvent.findMany({
      where: {
        companyId,
        ...(query?.entity ? { entity: query.entity } : {}),
      },
      orderBy: { id: 'desc' },
      take: limit,
      include: {
        actor: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  /**
   * Cryptographically verifies the entire audit hash chain for a tenant.
   * Proves no rows have been tampered with or deleted.
   */
  async verifyChain(companyId: string): Promise<{ valid: boolean; eventCount: number; brokenIndex?: number }> {
    const events = await this.db.client.auditEvent.findMany({
      where: { companyId },
      orderBy: { id: 'asc' },
    });

    if (events.length === 0) {
      return { valid: true, eventCount: 0 };
    }

    let expectedPrevHash = 'GENESIS_0000000000000000000000000000000000000000000000000000000000000000';

    for (let i = 0; i < events.length; i++) {
      const event = events[i];

      if (event.prevHash !== expectedPrevHash) {
        return { valid: false, eventCount: events.length, brokenIndex: i };
      }

      const canonicalPayload = JSON.stringify({
        companyId: event.companyId,
        actorId: event.actorId,
        action: event.action,
        entity: event.entity,
        entityId: event.entityId,
        metadata: event.metadata,
      });

      const calculatedHash = crypto
        .createHash('sha256')
        .update(event.prevHash + canonicalPayload)
        .digest('hex');

      if (calculatedHash !== event.hash) {
        return { valid: false, eventCount: events.length, brokenIndex: i };
      }

      expectedPrevHash = event.hash;
    }

    return { valid: true, eventCount: events.length };
  }
}
