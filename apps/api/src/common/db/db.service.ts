import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { prisma, withTenant, PrismaClient } from '@fairhire/db';

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
  public readonly client: PrismaClient = prisma;

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }

  /**
   * Runs queries within an RLS session for the given tenant companyId
   */
  async withTenant<T>(
    companyId: string,
    fn: (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => Promise<T>,
  ): Promise<T> {
    return withTenant(this.client, companyId, fn);
  }
}
