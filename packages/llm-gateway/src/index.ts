import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import {
  EXTRACTION_SYSTEM_PROMPT,
  formatExtractionPrompt,
  SCORING_SYSTEM_PROMPT,
  formatScoringUserPrompt,
  BIAS_NOTES_SYSTEM_PROMPT,
  formatBiasNotesUserPrompt,
  INTERVIEW_KIT_SYSTEM_PROMPT,
  formatInterviewKitUserPrompt,
  QUESTION_FILTER_SYSTEM_PROMPT,
  formatQuestionFilterUserPrompt,
  PROMPT_VERSIONS,
  SupportedLanguage,
} from '@fairhire/prompts';
import { verifyEvidenceQuote } from '@fairhire/redaction';

export interface ScreeningCriterionInput {
  id: string;
  label: string;
  kind: 'MUST_HAVE' | 'NICE_TO_HAVE';
  weight: number;
}

export interface CriterionScoringResult {
  criterionId: string;
  score: number;
  evidenceQuote: string;
  confidence: number;
  note: string;
  verified: boolean;
}

export interface ScreeningResult {
  modelId: string;
  promptVersion: string;
  criterionResults: CriterionScoringResult[];
  overallScore: number;
  missingMustHave: boolean;
  missingMustHaveIds: string[];
  biasRiskNotes: Array<{ signal: string; location: string; why_it_matters: string }>;
  injectionFlagged: boolean;
  totalTokens: number;
  estimatedCostUsd: number;
}

export interface ExtractionResult {
  roles: Array<{ title: string; employer: string; start: string | null; end: string | null; summary: string }>;
  education: Array<{ degree: string | null; institution: string | null; field: string | null; year: string | null }>;
  skills: string[];
  languages: Array<{ name: string; level: string | null }>;
  certifications: string[];
  links: string[];
  totalTokens: number;
}

export interface InterviewQuestionResult {
  criterionId: string | null;
  type: 'TECHNICAL' | 'BEHAVIOURAL' | 'VALUES' | 'SCENARIO';
  question: string;
  whatGoodLooksLike: string;
  redFlags: string;
}

export interface SafetyCheckResult {
  status: 'OK' | 'PROHIBITED_TOPIC';
  reason: string | null;
}

export class LlmGateway {
  private genAI?: GoogleGenerativeAI;
  private readonly defaultModel: string;

  constructor(apiKey?: string, defaultModel = 'gemini-2.0-flash-001') {
    const key = apiKey || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';
    if (key) {
      this.genAI = new GoogleGenerativeAI(key);
    }
    this.defaultModel = defaultModel;
  }

  /**
   * Screens a redacted CV against job criteria one by one.
   * Computes overall score deterministically in code.
   */
  async screenCv(params: {
    redactedCvText: string;
    originalCvTextForBiasNotes: string;
    criteria: ScreeningCriterionInput[];
    language: SupportedLanguage;
    pinnedModel?: string;
  }): Promise<ScreeningResult> {
    const modelName = params.pinnedModel || this.defaultModel;
    const criterionResults: CriterionScoringResult[] = [];
    let totalTokens = 0;

    // Check for obvious injection flags in raw text first
    const injectionFlagged = this.detectPromptInjection(params.redactedCvText);

    // Score criteria individually (independent evaluation to avoid rubric bleed)
    for (const criterion of params.criteria) {
      const res = await this.scoreCriterion({
        criterion,
        redactedCvText: params.redactedCvText,
        language: params.language,
        modelName,
      });

      criterionResults.push(res.result);
      totalTokens += res.tokens;
    }

    // Bias risk notes pass
    const biasNotesRes = await this.generateBiasNotes({
      originalCvText: params.originalCvTextForBiasNotes,
      language: params.language,
      modelName,
    });
    totalTokens += biasNotesRes.tokens;

    // Deterministic overall score calculation:
    // Score range is 0 to 100 based on weighted average of scores (0-3 scale normalized to 0-100)
    let totalWeight = 0;
    let weightedScoreSum = 0;
    const missingMustHaveIds: string[] = [];

    for (const criterion of params.criteria) {
      const scored = criterionResults.find((r) => r.criterionId === criterion.id);
      const scoreValue = scored ? scored.score : 0;

      if (criterion.kind === 'MUST_HAVE' && scoreValue === 0) {
        missingMustHaveIds.push(criterion.id);
      }

      const weight = criterion.weight || 5;
      totalWeight += weight;
      // score is 0-3, normalized to 0-100: (score / 3) * 100
      weightedScoreSum += (scoreValue / 3) * 100 * weight;
    }

    const overallScore = totalWeight > 0 ? Math.round((weightedScoreSum / totalWeight) * 10) / 10 : 0;

    // Gemini 2.0 Flash pricing: ~$0.10 / 1M input tokens, ~$0.40 / 1M output tokens (approximate average $0.20 / 1M)
    const estimatedCostUsd = Math.round((totalTokens * 0.0000002) * 100000) / 100000;

    return {
      modelId: modelName,
      promptVersion: PROMPT_VERSIONS.SCREENING,
      criterionResults,
      overallScore,
      missingMustHave: missingMustHaveIds.length > 0,
      missingMustHaveIds,
      biasRiskNotes: biasNotesRes.notes,
      injectionFlagged,
      totalTokens,
      estimatedCostUsd,
    };
  }

  private async scoreCriterion(params: {
    criterion: ScreeningCriterionInput;
    redactedCvText: string;
    language: SupportedLanguage;
    modelName: string;
  }): Promise<{ result: CriterionScoringResult; tokens: number }> {
    if (!this.genAI) {
      // Offline / test stub
      const quote = params.redactedCvText.slice(0, 30);
      return {
        result: {
          criterionId: params.criterion.id,
          score: 2,
          evidenceQuote: quote,
          confidence: 0.85,
          note: 'Evaluated offline stub',
          verified: verifyEvidenceQuote(quote, params.redactedCvText),
        },
        tokens: 150,
      };
    }

    const model = this.genAI.getGenerativeModel({
      model: params.modelName,
      systemInstruction: SCORING_SYSTEM_PROMPT(params.language),
      generationConfig: {
        temperature: 0.0,
        responseMimeType: 'application/json',
      },
    });

    const userPrompt = formatScoringUserPrompt(params.criterion, params.redactedCvText);
    const resp = await model.generateContent(userPrompt);
    const text = resp.response.text();
    const tokenCount = resp.response.usageMetadata?.totalTokenCount || 200;

    try {
      const parsed = JSON.parse(text);
      const evidenceQuote = String(parsed.evidenceQuote || '');
      const rawScore = Number(parsed.score);
      const score = Math.max(0, Math.min(3, isNaN(rawScore) ? 0 : Math.round(rawScore)));

      // Spec rule: evidenceQuote MUST be an exact substring of the CV.
      // If the quote is not found, discard or mark unverified.
      const verified = verifyEvidenceQuote(evidenceQuote, params.redactedCvText);
      const finalScore = verified ? score : 0;

      return {
        result: {
          criterionId: params.criterion.id,
          score: finalScore,
          evidenceQuote: verified ? evidenceQuote : '',
          confidence: Number(parsed.confidence) || (verified ? 0.8 : 0.2),
          note: verified ? String(parsed.note || '') : 'Evidence quote was not found in source text.',
          verified,
        },
        tokens: tokenCount,
      };
    } catch {
      return {
        result: {
          criterionId: params.criterion.id,
          score: 0,
          evidenceQuote: '',
          confidence: 0,
          note: 'Failed to parse model output',
          verified: false,
        },
        tokens: tokenCount,
      };
    }
  }

  private async generateBiasNotes(params: {
    originalCvText: string;
    language: SupportedLanguage;
    modelName: string;
  }): Promise<{ notes: Array<{ signal: string; location: string; why_it_matters: string }>; tokens: number }> {
    if (!this.genAI) {
      return { notes: [], tokens: 50 };
    }

    const model = this.genAI.getGenerativeModel({
      model: params.modelName,
      systemInstruction: BIAS_NOTES_SYSTEM_PROMPT(params.language),
      generationConfig: {
        temperature: 0.0,
        responseMimeType: 'application/json',
      },
    });

    try {
      const resp = await model.generateContent(formatBiasNotesUserPrompt(params.originalCvText));
      const parsed = JSON.parse(resp.response.text());
      return {
        notes: Array.isArray(parsed.signals) ? parsed.signals : [],
        tokens: resp.response.usageMetadata?.totalTokenCount || 100,
      };
    } catch {
      return { notes: [], tokens: 50 };
    }
  }

  async generateInterviewKit(params: {
    job: { title: string; description: string };
    criteria: ScreeningCriterionInput[];
    gaps?: string[];
    count?: number;
    language: SupportedLanguage;
  }): Promise<InterviewQuestionResult[]> {
    const count = params.count || 10;
    if (!this.genAI) {
      return [
        {
          criterionId: params.criteria[0]?.id || null,
          type: 'TECHNICAL',
          question: 'Can you describe a challenging technical project you worked on recently?',
          whatGoodLooksLike: 'Clear architecture explanation, trade-off awareness, quantitative impact.',
          redFlags: 'Vagueness on personal contributions, inability to explain design choices.',
        },
      ];
    }

    const model = this.genAI.getGenerativeModel({
      model: this.defaultModel,
      systemInstruction: INTERVIEW_KIT_SYSTEM_PROMPT(count, params.language),
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    });

    const userPrompt = formatInterviewKitUserPrompt(params.job, params.criteria, params.gaps);
    const resp = await model.generateContent(userPrompt);
    try {
      const parsed = JSON.parse(resp.response.text());
      return Array.isArray(parsed.questions) ? parsed.questions : [];
    } catch {
      return [];
    }
  }

  async filterQuestion(question: string): Promise<SafetyCheckResult> {
    if (!this.genAI) {
      return { status: 'OK', reason: null };
    }

    const model = this.genAI.getGenerativeModel({
      model: this.defaultModel,
      systemInstruction: QUESTION_FILTER_SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.0,
        responseMimeType: 'application/json',
      },
    });

    try {
      const resp = await model.generateContent(formatQuestionFilterUserPrompt(question));
      const parsed = JSON.parse(resp.response.text());
      return {
        status: parsed.status === 'PROHIBITED_TOPIC' ? 'PROHIBITED_TOPIC' : 'OK',
        reason: parsed.reason || null,
      };
    } catch {
      return { status: 'OK', reason: null };
    }
  }

  private detectPromptInjection(text: string): boolean {
    const injectionPatterns = [
      /ignore\s+(?:all\s+)?previous\s+instructions/i,
      /disregard\s+all\s+prior/i,
      /(?:rate|give|assign|award|set)\s+(?:this\s+candidate\s+)?(?:a\s+)?(?:score|rating\s+of\s+)?(?:100|maximum|highest)/i,
      /\bscore\s+(?:this\s+candidate\s+)(?:with\s+)?(?:100|maximum|highest)\b/i,
      /system\s+prompt/i,
      /<system>/i,
      /\[instruction\]/i,
    ];

    return injectionPatterns.some((pattern) => pattern.test(text));
  }
}
