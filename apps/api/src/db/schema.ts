import { pgTable, uuid, text, timestamp, numeric, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const roleEnum = pgEnum('user_role', ['admin', 'recruiter', 'hiring_manager']);
export const jobStatusEnum = pgEnum('job_status', ['draft', 'published', 'archived']);
export const applicationStageEnum = pgEnum('application_stage', [
  'applied',
  'screening',
  'interview',
  'offer',
  'rejected',
]);

// 1. Tenants Table
export const tenants = pgTable('tenants', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. Users Table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .references(() => tenants.id, { onDelete: 'cascade' })
    .notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  fullName: text('full_name').notNull(),
  role: roleEnum('role').default('recruiter').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3. Job Postings Table
export const jobs = pgTable('jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .references(() => tenants.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  department: text('department').notNull(),
  location: text('location').notNull(),
  workplaceType: text('workplace_type').default('remote').notNull(),
  language: text('language').default('en').notNull(), // 'en' | 'he' | 'am'
  status: jobStatusEnum('status').default('published').notNull(),
  description: text('description').notNull(),
  screeningCriteria: jsonb('screening_criteria').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 4. Candidate Applications Table
export const applications = pgTable('applications', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .references(() => tenants.id, { onDelete: 'cascade' })
    .notNull(),
  jobId: uuid('job_id')
    .references(() => jobs.id, { onDelete: 'cascade' })
    .notNull(),
  candidateToken: text('candidate_token').notNull(),
  stage: applicationStageEnum('stage').default('applied').notNull(),
  overallScore: numeric('overall_score', { precision: 5, scale: 2 }).default('0.00').notNull(),
  verifiedQuotesValid: text('verified_quotes_valid').default('true').notNull(),
  verifiedQuotes: jsonb('verified_quotes').default([]).notNull(),
  redactedCv: text('redacted_cv').notNull(),
  candidateLanguage: text('candidate_language').default('en').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 5. Candidate Notes Table
export const candidateNotes = pgTable('candidate_notes', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .references(() => tenants.id, { onDelete: 'cascade' })
    .notNull(),
  applicationId: uuid('application_id')
    .references(() => applications.id, { onDelete: 'cascade' })
    .notNull(),
  authorId: uuid('author_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  authorName: text('author_name').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 6. Email Templates Table
export const emailTemplates = pgTable('email_templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .references(() => tenants.id, { onDelete: 'cascade' })
    .notNull(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  subject: text('subject').notNull(),
  body: text('body').notNull(),
  language: text('language').default('en').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Drizzle Relations with explicit types
export const tenantsRelations = relations(tenants, ({ many }: { many: any }) => ({
  users: many(users),
  jobs: many(jobs),
  applications: many(applications),
}));

export const jobsRelations = relations(jobs, ({ one, many }: { one: any; many: any }) => ({
  tenant: one(tenants, {
    fields: [jobs.tenantId],
    references: [tenants.id],
  }),
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one, many }: { one: any; many: any }) => ({
  job: one(jobs, {
    fields: [applications.jobId],
    references: [jobs.id],
  }),
  tenant: one(tenants, {
    fields: [applications.tenantId],
    references: [tenants.id],
  }),
  notes: many(candidateNotes),
}));
