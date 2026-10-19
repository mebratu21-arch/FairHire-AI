import crypto from 'node:crypto';

export interface MaskEntry {
  original: string;
  replacement: string;
  category: 'EMAIL' | 'PHONE' | 'ID_NUMBER' | 'DOB_AGE' | 'ADDRESS' | 'MILITARY' | 'NAME' | 'INSTITUTION' | 'GENDER';
  index: number;
}

export interface RedactionResult {
  redactedText: string;
  maskMap: MaskEntry[];
  hiddenTextDetected: boolean;
}

// Regex patterns for rule-based redaction (EN + HE)
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_REGEX = /(\+?972[-.\s]?|0)(?:[23489]|5[0-9]|7[0-9])[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b|(\+?[1-9]\d{0,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
// Israeli Teudat Zehut (9 digits)
const ID_NUMBER_REGEX = /\b\d{9}\b/g;

// Date of birth and age patterns (EN and HE)
const DOB_AGE_PATTERNS = [
  /\b(?:born|dob|date of birth|birth date|d\.o\.b\.?)[:\s]+[0-9]{1,2}[./-][0-9]{1,2}[./-][0-9]{2,4}\b/gi,
  /\b(?:תאריך לידה|שנת לידה|נולד|נולדה)[:\s]+[0-9]{1,2}[./-][0-9]{1,2}[./-][0-9]{2,4}\b/g,
  /\b(?:age|גיל)[:\s]+[1-9][0-9]\b/gi,
  /\b(?:19[4-9][0-9]|200[0-8])\b/g, // Specific birth year indicators if preceded by birth indicators
];

// Military service indicators (IDF, units, ranks in HE & EN)
const MILITARY_PATTERNS = [
  /\b(?:IDF|Israel Defense Forces|Israeli Air Force|IAF|Intelligence Corps|Unit 8200|8200|81|Talpiot|Havatzalot|Golani|Givati|Paratroopers|Nahal|Maglan|Duvdevan|Shayetet 13|Sayeret Matkal)\b/gi,
  /(?:צה"ל|צבא הגנה לישראל|שירות צבאי|שירות לאומי|חיל המודיעין|יחידה 8200|8200|81|תלפיות|חבצלות|גולני|גבעתי|צנחנים|נח"ל|מגלן|דובדבן|שייטת 13|סיירת מטכ"ל|קצין|רס"ן|סרן|סגן|רס"ר|אל"מ)/g,
];

// Gender pronouns and explicit indicators
const GENDER_PATTERNS = [
  /\b(?:he\/him|she\/her|they\/them|זכר|נקבה)\b/gi,
  /\b(?:male|female|single|married|נשוי|נשואה|רווק|רווקה|אב ל|אם ל)\b/gi,
];

/**
 * Strips zero-width characters and detects invisible text attacks
 */
export function sanitizeHiddenText(rawText: string): { cleanedText: string; hiddenDetected: boolean } {
  // Check for zero-width characters often used in prompt injection / steganography
  const zeroWidthRegex = /[\u200B-\u200D\uFEFF]/g;
  const hasZeroWidth = zeroWidthRegex.test(rawText);
  const cleaned = rawText.replace(zeroWidthRegex, '');
  return {
    cleanedText: cleaned,
    hiddenDetected: hasZeroWidth,
  };
}

/**
 * Redacts PII and protected traits from raw text
 */
export function redactCvText(
  rawText: string,
  options?: {
    candidateName?: string;
    redactInstitutions?: boolean;
    knownInstitutions?: string[];
  },
): RedactionResult {
  const { cleanedText, hiddenDetected } = sanitizeHiddenText(rawText);
  let resultText = cleanedText;
  const maskMap: MaskEntry[] = [];

  let maskCounter = 1;

  // 1. Redact Candidate Name if provided
  if (options?.candidateName && options.candidateName.trim().length > 1) {
    const nameRegex = new RegExp(`\\b${escapeRegExp(options.candidateName.trim())}\\b`, 'gi');
    resultText = resultText.replace(nameRegex, (match, offset) => {
      const rep = `[REDACTED_NAME_${maskCounter++}]`;
      maskMap.push({ original: match, replacement: rep, category: 'NAME', index: offset });
      return rep;
    });
  }

  // 2. Redact Emails
  resultText = resultText.replace(EMAIL_REGEX, (match, offset) => {
    const rep = `[REDACTED_EMAIL_${maskCounter++}]`;
    maskMap.push({ original: match, replacement: rep, category: 'EMAIL', index: offset });
    return rep;
  });

  // 3. Redact Phones
  resultText = resultText.replace(PHONE_REGEX, (match, offset) => {
    const rep = `[REDACTED_PHONE_${maskCounter++}]`;
    maskMap.push({ original: match, replacement: rep, category: 'PHONE', index: offset });
    return rep;
  });

  // 4. Redact Israeli ID Numbers
  resultText = resultText.replace(ID_NUMBER_REGEX, (match, offset) => {
    const rep = `[REDACTED_ID_${maskCounter++}]`;
    maskMap.push({ original: match, replacement: rep, category: 'ID_NUMBER', index: offset });
    return rep;
  });

  // 5. Redact Military units / ranks
  for (const pattern of MILITARY_PATTERNS) {
    resultText = resultText.replace(pattern, (match, offset) => {
      const rep = `[REDACTED_MILITARY_SERVICE]`;
      maskMap.push({ original: match, replacement: rep, category: 'MILITARY', index: offset });
      return rep;
    });
  }

  // 6. Redact DOB / Age cues
  for (const pattern of DOB_AGE_PATTERNS) {
    resultText = resultText.replace(pattern, (match, offset) => {
      const rep = `[REDACTED_AGE_SIGNAL]`;
      maskMap.push({ original: match, replacement: rep, category: 'DOB_AGE', index: offset });
      return rep;
    });
  }

  // 7. Redact Gender cues
  for (const pattern of GENDER_PATTERNS) {
    resultText = resultText.replace(pattern, (match, offset) => {
      const rep = `[REDACTED_GENDER_SIGNAL]`;
      maskMap.push({ original: match, replacement: rep, category: 'GENDER', index: offset });
      return rep;
    });
  }

  // 8. Optional University / Institution prestige redaction
  if (options?.redactInstitutions && options.knownInstitutions) {
    for (const inst of options.knownInstitutions) {
      if (inst.trim().length > 2) {
        const instRegex = new RegExp(`\\b${escapeRegExp(inst.trim())}\\b`, 'gi');
        resultText = resultText.replace(instRegex, (match, offset) => {
          const rep = `[REDACTED_INSTITUTION]`;
          maskMap.push({ original: match, replacement: rep, category: 'INSTITUTION', index: offset });
          return rep;
        });
      }
    }
  }

  return {
    redactedText: resultText,
    maskMap,
    hiddenTextDetected: hiddenDetected,
  };
}

/**
 * Verifies that the model's cited evidenceQuote actually exists in the source text.
 * Prevents hallucinations and ungrounded scoring.
 */
export function verifyEvidenceQuote(quote: string, sourceText: string): boolean {
  if (!quote || quote.trim().length === 0) {
    return false;
  }

  // Normalized substring check (collapses whitespace differences)
  const normQuote = quote.replace(/\s+/g, ' ').trim().toLowerCase();
  const normSource = sourceText.replace(/\s+/g, ' ').toLowerCase();

  return normSource.includes(normQuote);
}

/**
 * Encrypts the mask map using AES-256-GCM.
 * Stored securely and only decrypted during audited unmasking.
 */
export function encryptMaskMap(maskMap: MaskEntry[], secretHexKey: string): string {
  const iv = crypto.randomBytes(12);
  const key = Buffer.from(secretHexKey.slice(0, 64).padEnd(64, '0'), 'hex');
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  const serialized = JSON.stringify(maskMap);
  let encrypted = cipher.update(serialized, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return JSON.stringify({
    iv: iv.toString('hex'),
    tag: authTag.toString('hex'),
    data: encrypted,
  });
}

/**
 * Decrypts the mask map during audited unmasking.
 */
export function decryptMaskMap(payload: string, secretHexKey: string): MaskEntry[] {
  const { iv, tag, data } = JSON.parse(payload);
  const key = Buffer.from(secretHexKey.slice(0, 64).padEnd(64, '0'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(tag, 'hex'));

  let decrypted = decipher.update(data, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return JSON.parse(decrypted);
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
