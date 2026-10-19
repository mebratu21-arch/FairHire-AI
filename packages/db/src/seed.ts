import { PrismaClient } from '../generated/client';
import crypto from 'node:crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding FairHire AI database...');

  // 1. Create Default Company
  const company = await prisma.company.upsert({
    where: { id: 'company_default' },
    update: {},
    create: {
      id: 'company_default',
      name: 'Acme Technologies Ltd (Israel)',
      retentionDays: 365,
      featureAiAmharic: false,
      featureEquity: true,
      llmDailyBudgetUsd: 10.0,
    },
  });

  console.log(`Company seeded: ${company.name} (${company.id})`);

  // 2. Create Default Admin User & Membership
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@acme.co.il' },
    update: {},
    create: {
      id: 'usr_admin_01',
      email: 'admin@acme.co.il',
      name: 'Tamar Levi',
      mfaEnabled: true,
      locale: 'he',
      blindModeDefault: true,
      memberships: {
        create: {
          companyId: company.id,
          role: 'ADMIN',
        },
      },
    },
  });

  console.log(`Admin user seeded: ${adminUser.name} (${adminUser.email})`);

  // 3. Create Sample Job with Weighted Criteria
  const job = await prisma.job.create({
    data: {
      companyId: company.id,
      title: 'Senior Full-Stack Engineer (Node.js & Next.js)',
      description: `We are looking for a Senior Full-Stack Engineer to architect high-reliability cloud applications.
Responsibilities include backend API architecture, database performance tuning, bi-directional RTL support for Hebrew and English, and strict security compliance.`,
      language: 'he',
      seniority: 'Senior',
      location: 'Tel Aviv (Hybrid)',
      status: 'PUBLISHED',
      createdById: adminUser.id,
      criteria: {
        create: [
          {
            companyId: company.id,
            label: '5+ years experience with Node.js and TypeScript',
            kind: 'MUST_HAVE',
            weight: 10,
            position: 0,
          },
          {
            companyId: company.id,
            label: 'PostgreSQL relational database design and performance',
            kind: 'MUST_HAVE',
            weight: 8,
            position: 1,
          },
          {
            companyId: company.id,
            label: 'Next.js App Router and modern React architecture',
            kind: 'NICE_TO_HAVE',
            weight: 6,
            position: 2,
          },
          {
            companyId: company.id,
            label: 'Bilingual RTL / Hebrew UI localization experience',
            kind: 'NICE_TO_HAVE',
            weight: 5,
            position: 3,
          },
        ],
      },
    },
  });

  console.log(`Sample job seeded: ${job.title} (${job.id})`);

  // 4. Create Genesis Audit Event with Valid Hash
  const canonicalGenesis = JSON.stringify({
    companyId: company.id,
    actorId: adminUser.id,
    action: 'system.seed',
    entity: 'Company',
    entityId: company.id,
    metadata: { version: '2.0.0', environment: 'development' },
  });

  const prevHash = 'GENESIS_0000000000000000000000000000000000000000000000000000000000000000';
  const genesisHash = crypto
    .createHash('sha256')
    .update(prevHash + canonicalGenesis)
    .digest('hex');

  await prisma.auditEvent.create({
    data: {
      companyId: company.id,
      actorId: adminUser.id,
      action: 'system.seed',
      entity: 'Company',
      entityId: company.id,
      metadata: { version: '2.0.0', environment: 'development' },
      prevHash,
      hash: genesisHash,
    },
  });

  console.log('Genesis audit event recorded with SHA-256 hash chaining.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
