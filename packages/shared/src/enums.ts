// Shared enums — mirrors Prisma enums but usable on the frontend without Prisma
export const Roles = ['ADMIN', 'RECRUITER', 'HIRING_MANAGER', 'AUDITOR'] as const;
export type Role = (typeof Roles)[number];

export const JobStatuses = ['DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED'] as const;
export type JobStatus = (typeof JobStatuses)[number];

export const CriterionKinds = ['MUST_HAVE', 'NICE_TO_HAVE'] as const;
export type CriterionKind = (typeof CriterionKinds)[number];

export const CandidateStatuses = [
  'NEW',
  'PARSING',
  'PARSE_FAILED',
  'READY',
  'SCREENING',
  'SCREENED',
  'SHORTLISTED',
  'REJECTED',
  'ON_HOLD',
  'DELETED',
] as const;
export type CandidateStatus = (typeof CandidateStatuses)[number];

export const ScanStatuses = ['PENDING', 'CLEAN', 'INFECTED', 'REJECTED'] as const;
export type ScanStatus = (typeof ScanStatuses)[number];

export const Decisions = ['SHORTLIST', 'REJECT', 'ON_HOLD'] as const;
export type Decision = (typeof Decisions)[number];

export const Locales = ['en', 'he', 'am'] as const;
export type Locale = (typeof Locales)[number];

export const RtlLocales = ['he'] as const;
export type RtlLocale = (typeof RtlLocales)[number];

export const QuestionTypes = ['TECHNICAL', 'BEHAVIOURAL', 'VALUES', 'SCENARIO'] as const;
export type QuestionType = (typeof QuestionTypes)[number];

export const QuestionSafetyStatuses = ['OK', 'PROHIBITED_TOPIC', 'PENDING_REVIEW'] as const;
export type QuestionSafetyStatus = (typeof QuestionSafetyStatuses)[number];

export function isRtl(locale: string): boolean {
  return (RtlLocales as readonly string[]).includes(locale);
}
