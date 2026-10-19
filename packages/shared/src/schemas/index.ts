import { z } from 'zod';
import {
  Locales,
  CriterionKinds,
  JobStatuses,
  Decisions,
  QuestionTypes,
} from '../enums';

// ─────────────────────────────────────────────
// Company / Tenant
// ─────────────────────────────────────────────

export const UpdateCompanySchema = z.object({
  name: z.string().min(1).max(200).optional(),
  retentionDays: z.number().int().min(30).max(3650).optional(),
  featureAiAmharic: z.boolean().optional(),
  featureEquity: z.boolean().optional(),
  llmDailyBudgetUsd: z.number().min(0).max(1000).optional(),
});

// ─────────────────────────────────────────────
// User Preferences
// ─────────────────────────────────────────────

export const UpdatePreferencesSchema = z.object({
  locale: z.enum(Locales).optional(),
  blindModeDefault: z.boolean().optional(),
});

// ─────────────────────────────────────────────
// Job Criterion
// ─────────────────────────────────────────────

export const JobCriterionSchema = z.object({
  id: z.string().cuid().optional(), // omit for new criteria
  label: z.string().min(3).max(300),
  description: z.string().max(1000).optional(),
  kind: z.enum(CriterionKinds),
  weight: z.number().int().min(1).max(10),
  position: z.number().int().min(0).optional(),
});

// ─────────────────────────────────────────────
// Jobs
// ─────────────────────────────────────────────

export const CreateJobSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(10).max(10_000),
  language: z.enum(Locales).default('en'),
  seniority: z.string().max(100).optional(),
  location: z.string().max(200).optional(),
  criteria: z
    .array(JobCriterionSchema)
    .min(1, 'At least one criterion is required')
    .max(10, 'Maximum 10 criteria per job'),
});

export const UpdateJobSchema = CreateJobSchema.partial();

export const ReplaceJobCriteriaSchema = z.object({
  criteria: z
    .array(JobCriterionSchema)
    .min(1)
    .max(10),
});

// ─────────────────────────────────────────────
// Uploads
// ─────────────────────────────────────────────

const ALLOWED_MIME_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] as const;
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB
const MAX_FILES_PER_BATCH = 50;
const MAX_PAGES = 15;

export const RequestUploadSchema = z.object({
  files: z
    .array(
      z.object({
        filename: z.string().min(1).max(255),
        mimeType: z.enum(ALLOWED_MIME_TYPES),
        sizeBytes: z.number().int().positive().max(MAX_FILE_SIZE_BYTES),
      }),
    )
    .min(1)
    .max(MAX_FILES_PER_BATCH),
});

export const ConfirmUploadSchema = z.object({
  candidateExternalRef: z.string().optional(), // recruiter can set a pseudonymous label
});

// ─────────────────────────────────────────────
// Decisions
// ─────────────────────────────────────────────

export const CreateDecisionSchema = z.object({
  decision: z.enum(Decisions),
  reason: z.string().min(5, 'A reason is required').max(2000),
});

export const BulkDecisionSchema = z.object({
  candidateIds: z.array(z.string().cuid()).min(1).max(100),
  decision: z.enum(Decisions),
  reason: z.string().min(5).max(2000),
});

// ─────────────────────────────────────────────
// Notes
// ─────────────────────────────────────────────

export const CreateNoteSchema = z.object({
  content: z.string().min(1).max(5000),
});

// ─────────────────────────────────────────────
// Unmask
// ─────────────────────────────────────────────

export const UnmaskSchema = z.object({
  reason: z.string().min(5, 'A reason for unmasking is required').max(1000),
});

// ─────────────────────────────────────────────
// Users / Invitations
// ─────────────────────────────────────────────

export const InviteUserSchema = z.object({
  email: z.string().email(),
  role: z.enum(['ADMIN', 'RECRUITER', 'HIRING_MANAGER', 'AUDITOR'] as const),
});

export const ChangeRoleSchema = z.object({
  role: z.enum(['ADMIN', 'RECRUITER', 'HIRING_MANAGER', 'AUDITOR'] as const),
});

// ─────────────────────────────────────────────
// Questions
// ─────────────────────────────────────────────

export const GenerateQuestionsSchema = z.object({
  count: z.number().int().min(8).max(12).default(10),
  language: z.enum(Locales).optional(), // defaults to job language
});

export const UpdateQuestionSchema = z.object({
  question: z.string().min(10).max(1000),
  whatGoodLooksLike: z.string().max(1000).optional(),
  redFlags: z.string().max(1000).optional(),
});

// ─────────────────────────────────────────────
// Equity self-identification (voluntary)
// ─────────────────────────────────────────────

export const EquitySelfIdSchema = z.object({
  jobId: z.string().cuid(),
  genderGroup: z.string().max(50).optional(),
  ageGroup: z.string().max(20).optional(),
  originGroup: z.string().max(100).optional(),
});

// ─────────────────────────────────────────────
// Audit search
// ─────────────────────────────────────────────

export const AuditSearchSchema = z.object({
  actorId: z.string().optional(),
  entity: z.string().optional(),
  entityId: z.string().optional(),
  action: z.string().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(50),
});

// ─────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────

export const ExportSchema = z.object({
  format: z.enum(['csv', 'pdf']),
  lang: z.enum(Locales),
  idempotencyKey: z.string().uuid().optional(),
});

// ─────────────────────────────────────────────
// Candidate list filters
// ─────────────────────────────────────────────

export const CandidateListSchema = z.object({
  status: z.enum([
    'NEW', 'PARSING', 'PARSE_FAILED', 'READY', 'SCREENING',
    'SCREENED', 'SHORTLISTED', 'REJECTED', 'ON_HOLD',
  ] as const).optional(),
  scoreMin: z.number().min(0).max(100).optional(),
  scoreMax: z.number().min(0).max(100).optional(),
  language: z.enum(Locales).optional(),
  search: z.string().max(100).optional(),
  sortBy: z.enum(['score', 'createdAt', 'status']).default('score'),
  sortDir: z.enum(['asc', 'desc']).default('desc'),
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(25),
});

// ─────────────────────────────────────────────
// AI Screening result (from the LLM, Zod-validated)
// ─────────────────────────────────────────────

export const CriterionResultSchema = z.object({
  criterionId: z.string(),
  score: z.number().int().min(0).max(3),
  evidenceQuote: z.string().max(500),
  confidence: z.number().min(0).max(1),
  note: z.string().max(500).optional(),
  verified: z.boolean().default(false), // true once quote is found in source text
});

export const ScreeningOutputSchema = z.object({
  criterionResults: z.array(CriterionResultSchema),
  parseConfidence: z.number().min(0).max(1),
  injectionFlagged: z.boolean().default(false),
  biasRiskNotes: z
    .array(
      z.object({
        signal: z.string(),
        location: z.string(),
        why_it_matters: z.string(),
      }),
    )
    .default([]),
});

export const ExtractionOutputSchema = z.object({
  roles: z.array(
    z.object({
      title: z.string(),
      employer: z.string(),
      start: z.string().nullable(),
      end: z.string().nullable(),
      summary: z.string(),
    }),
  ),
  education: z.array(
    z.object({
      degree: z.string().nullable(),
      institution: z.string().nullable(),
      field: z.string().nullable(),
      year: z.string().nullable(),
    }),
  ),
  skills: z.array(z.string()),
  languages: z.array(
    z.object({
      name: z.string(),
      level: z.string().nullable(),
    }),
  ),
  certifications: z.array(z.string()),
  links: z.array(z.string()),
});

export type UpdateCompany = z.infer<typeof UpdateCompanySchema>;
export type UpdatePreferences = z.infer<typeof UpdatePreferencesSchema>;
export type JobCriterion = z.infer<typeof JobCriterionSchema>;
export type CreateJob = z.infer<typeof CreateJobSchema>;
export type UpdateJob = z.infer<typeof UpdateJobSchema>;
export type CreateDecision = z.infer<typeof CreateDecisionSchema>;
export type BulkDecision = z.infer<typeof BulkDecisionSchema>;
export type CriterionResult = z.infer<typeof CriterionResultSchema>;
export type ScreeningOutput = z.infer<typeof ScreeningOutputSchema>;
export type ExtractionOutput = z.infer<typeof ExtractionOutputSchema>;
export type CandidateListFilter = z.infer<typeof CandidateListSchema>;
export type AuditSearch = z.infer<typeof AuditSearchSchema>;
