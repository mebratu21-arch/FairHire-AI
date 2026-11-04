import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Pool } from 'pg';

export interface TenantContext {
  tenantId: string;
}

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);

  /**
   * pg.Pool is created lazily. When DATABASE_URL is absent at runtime the
   * process already failed in validateEnv() (main.ts), so pool creation here
   * is always safe. The non-null assertion is intentional; env validation
   * guarantees the value exists before this code runs.
   */
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  private pool = new Pool({ connectionString: process.env.DATABASE_URL! });

  async onModuleInit(): Promise<void> {
    this.logger.log('Database Service initialised — pool connected to Postgres.');
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
    this.logger.log('Database Service pool closed.');
  }

  /**
   * Runs `SELECT 1` to confirm the database is reachable.
   * Used by the health endpoint.
   */
  async ping(): Promise<void> {
    await this.pool.query('SELECT 1');
  }

  /**
   * Executes query within isolated PostgreSQL transaction scoped by tenant_id.
   * Enforces Row-Level Security (RLS) so foreign tenant rows are invisible.
   */
  async withTenant<T>(tenantId: string, run: (tenantContext: TenantContext) => Promise<T>): Promise<T> {
    if (!tenantId) {
      throw new Error('Database tenant context missing: tenantId is required for RLS');
    }
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('SELECT set_config($1, $2, true)', ['app.current_tenant_id', tenantId]);
      const result = await run({ tenantId });
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}
