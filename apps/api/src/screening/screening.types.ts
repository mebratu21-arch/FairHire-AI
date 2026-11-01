import { z } from 'zod';

export const CriterionScoreSchema = z.object({
  criterionId: z.string(),
  name: z.string(),
  score: z.number().min(0).max(100),
  weight: z.number().min(0).max(1),
  reasoning: z.string(),
  evidenceQuotes: z.array(z.string()),
});

export const CandidateEvaluationSchema = z.object({
  candidateToken: z.string(),
  criteriaScores: z.array(CriterionScoreSchema),
  overallScore: z.number().min(0).max(100),
  verifiedQuotesValid: z.boolean(),
  redactedPiiCount: z.number(),
  adversarialTokensDetected: z.boolean(),
  evaluatedAt: z.string(),
});

export type CriterionScore = z.infer<typeof CriterionScoreSchema>;
export type CandidateEvaluation = z.infer<typeof CandidateEvaluationSchema>;

export interface ScreeningCriterion {
  id: string;
  name: string;
  description: string;
  weight: number; // e.g. 0.4, 0.35, 0.25 (sums to 1.0)
  targetKeywords: string[];
}
