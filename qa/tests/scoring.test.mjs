import test from 'node:test';
import assert from 'node:assert/strict';

// Deterministic calculation logic from LlmGateway
function calculateOverallScore(criteria, criterionResults) {
  let totalWeight = 0;
  let weightedScoreSum = 0;
  const missingMustHaveIds = [];

  for (const criterion of criteria) {
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

  return {
    overallScore,
    missingMustHave: missingMustHaveIds.length > 0,
    missingMustHaveIds,
  };
}

test('QA Test Suite: Deterministic Rubric Scoring & Must-Have Logic', async (t) => {
  const criteria = [
    { id: 'crit_1', label: 'Node.js Backend (5+ yrs)', kind: 'MUST_HAVE', weight: 10 },
    { id: 'crit_2', label: 'PostgreSQL Relational DB', kind: 'MUST_HAVE', weight: 8 },
    { id: 'crit_3', label: 'RTL UI / Hebrew Localization', kind: 'NICE_TO_HAVE', weight: 4 },
  ];

  await t.test('TC-SCR-001: Perfect candidate scores 100/100 with zero missing must-haves', () => {
    const results = [
      { criterionId: 'crit_1', score: 3 },
      { criterionId: 'crit_2', score: 3 },
      { criterionId: 'crit_3', score: 3 },
    ];

    const out = calculateOverallScore(criteria, results);
    assert.equal(out.overallScore, 100);
    assert.equal(out.missingMustHave, false);
    assert.equal(out.missingMustHaveIds.length, 0);
  });

  await t.test('TC-SCR-002: Flags missing must-have when score is 0, even with high other scores', () => {
    const results = [
      { criterionId: 'crit_1', score: 0 }, // MUST_HAVE failed!
      { criterionId: 'crit_2', score: 3 },
      { criterionId: 'crit_3', score: 3 },
    ];

    const out = calculateOverallScore(criteria, results);
    assert.equal(out.missingMustHave, true, 'missingMustHave flag must be true');
    assert.deepEqual(out.missingMustHaveIds, ['crit_1']);
    // Overall score is still calculated deterministically, but UI flags missing must-have
    assert.ok(out.overallScore < 100 && out.overallScore > 0);
  });

  await t.test('TC-SCR-003: Correctly applies weighted average mathematics', () => {
    // crit_1: weight 10, score 2 (66.67%) -> contribution: 666.67
    // crit_2: weight 8, score 1 (33.33%) -> contribution: 266.67
    // crit_3: weight 4, score 3 (100.0%) -> contribution: 400.00
    // totalWeight = 22
    // weightedSum = 1333.33 / 22 = 60.6%
    const results = [
      { criterionId: 'crit_1', score: 2 },
      { criterionId: 'crit_2', score: 1 },
      { criterionId: 'crit_3', score: 3 },
    ];

    const out = calculateOverallScore(criteria, results);
    assert.equal(out.overallScore, 60.6);
  });

  await t.test('TC-SCR-004: Handles candidate with zero evidence (score 0/100 without division by zero error)', () => {
    const results = [
      { criterionId: 'crit_1', score: 0 },
      { criterionId: 'crit_2', score: 0 },
      { criterionId: 'crit_3', score: 0 },
    ];

    const out = calculateOverallScore(criteria, results);
    assert.equal(out.overallScore, 0);
    assert.equal(out.missingMustHave, true);
    assert.equal(out.missingMustHaveIds.length, 2);
  });
});
