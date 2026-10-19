import { PrismaClient } from '../generated/client';

// ─────────────────────────────────────────────
// Prisma singleton with RLS tenant injection
// ─────────────────────────────────────────────

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });
}

/**
 * Global singleton — avoids creating a new client on every hot reload in dev.
 */
export const prisma = globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

/**
 * Execute a callback inside a transaction where the Postgres session-local
 * variable `app.company_id` is set. All RLS policies read this value.
 *
 * Usage:
 *   await withTenant(prisma, companyId, (tx) => tx.job.findMany())
 */
export async function withTenant<T>(
  client: PrismaClient,
  companyId: string,
  fn: (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => Promise<T>,
): Promise<T> {
  return client.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.company_id', ${companyId}, TRUE)`;
    return fn(tx);
  });
}

export * from '../generated/client';
