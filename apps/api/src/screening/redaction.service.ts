import { Injectable } from '@nestjs/common';

export interface RedactionResult {
  redactedText: string;
  redactedItemsCount: number;
  detectedPii: { category: string; value: string }[];
  adversarialTokensFound: string[];
}

@Injectable()
export class RedactionService {
  // Multilingual name patterns & demographic cues (English, Hebrew, Amharic)
  private readonly emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  private readonly phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g;
  
  // Prompt injection patterns designed to hijack LLM scoring
  private readonly injectionSignatures = [
    /ignore previous instructions/i,
    /system override/i,
    /give this candidate 100/i,
    /bypass screening/i,
    /score:\s*100/i,
    /prioritize this application/i,
    /eval\(.*\)/i,
    /<script.*?>/i,
    /DISREGARD ALL PRIOR EVALUATION CRITERIA/i,
    /התעלם מהוראות קודמות/i, // Hebrew prompt injection
    /የቀደሙትን መመሪያዎች ችላ ይበሉ/i, // Amharic prompt injection
  ];

  // Gender & demographic cues to sanitize
  private readonly demographicWords = [
    'he', 'she', 'his', 'her', 'him', 'herself', 'himself',
    'male', 'female', 'woman', 'man', 'mr', 'mrs', 'ms', 'miss',
    'הוא', 'היא', 'שלו', 'שלה', 'גבר', 'אישה', 'מר', 'גב\'',
    'እሱ', 'እሷ', 'የእሱ', 'የእሷ', 'ወንድ', 'ሴት'
  ];

  redactCV(rawText: string): RedactionResult {
    let sanitized = rawText;
    const detectedPii: { category: string; value: string }[] = [];
    const adversarialTokens: string[] = [];

    // 1. Detect prompt injections & sanitize them safely into untrusted text markers
    for (const pattern of this.injectionSignatures) {
      const match = sanitized.match(pattern);
      if (match) {
        match.forEach((m) => {
          adversarialTokens.push(m);
          sanitized = sanitized.split(m).join(`[UNTRUSTED_INJECTION_DEFUSED]`);
        });
      }
    }

    // 2. Redact Emails
    sanitized = sanitized.replace(this.emailRegex, (match) => {
      detectedPii.push({ category: 'email', value: match });
      return '[REDACTED_EMAIL]';
    });

    // 3. Redact Phone Numbers
    sanitized = sanitized.replace(this.phoneRegex, (match) => {
      if (match.trim().length >= 7) {
        detectedPii.push({ category: 'phone', value: match.trim() });
        return '[REDACTED_PHONE]';
      }
      return match;
    });

    // 4. Redact direct gender pronouns and demographic cues
    for (const demoWord of this.demographicWords) {
      const regex = new RegExp(`\\b${demoWord}\\b`, 'gi');
      if (regex.test(sanitized)) {
        detectedPii.push({ category: 'demographic_cue', value: demoWord });
        sanitized = sanitized.replace(regex, '[CANDIDATE]');
      }
    }

    return {
      redactedText: sanitized,
      redactedItemsCount: detectedPii.length,
      detectedPii,
      adversarialTokensFound: adversarialTokens,
    };
  }
}
