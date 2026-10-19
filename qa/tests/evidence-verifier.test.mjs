import test from 'node:test';
import assert from 'node:assert/strict';
import { verifyEvidenceQuote } from '../../packages/redaction/src/index.ts';

test('QA Test Suite: Evidence Quote Verification & Anti-Hallucination', async (t) => {
  const sourceCv = `
    Experienced Backend Developer with 6 years building REST and GraphQL APIs.
    Architected payment processing services using PostgreSQL and Redis.
    Deployed containerized services to AWS ECS with zero-downtime rolling updates.
  `;

  await t.test('TC-EVI-001: Accepts exact verbatim match', () => {
    const quote = 'Architected payment processing services using PostgreSQL and Redis.';
    assert.equal(verifyEvidenceQuote(quote, sourceCv), true);
  });

  await t.test('TC-EVI-002: Accepts match with normalized whitespace across line breaks', () => {
    const quote = 'Architected   payment  processing services\nusing PostgreSQL and Redis.';
    assert.equal(verifyEvidenceQuote(quote, sourceCv), true, 'Normalized whitespace should match');
  });

  await t.test('TC-EVI-003: Rejects completely fabricated / hallucinated quote', () => {
    const fabricated = 'Led a team of 15 engineers across three countries.';
    assert.equal(verifyEvidenceQuote(fabricated, sourceCv), false, 'Fabricated quote must be rejected');
  });

  await t.test('TC-EVI-004: Rejects empty or whitespace-only quote', () => {
    assert.equal(verifyEvidenceQuote('', sourceCv), false);
    assert.equal(verifyEvidenceQuote('   \n  \t ', sourceCv), false);
  });

  await t.test('TC-EVI-005: Rejects quote from another candidate or altered facts', () => {
    // Subtle hallucination: "8 years" instead of "6 years"
    const altered = 'Experienced Backend Developer with 8 years building REST';
    assert.equal(verifyEvidenceQuote(altered, sourceCv), false, 'Subtle number change must be caught');
  });
});
