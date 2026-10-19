import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

// Simulation of the Audit Chain verification algorithm from AuditService
function createCanonicalHash(prevHash, event) {
  const canonicalPayload = JSON.stringify({
    companyId: event.companyId,
    actorId: event.actorId,
    action: event.action,
    entity: event.entity,
    entityId: event.entityId,
    metadata: event.metadata,
  });

  return crypto
    .createHash('sha256')
    .update(prevHash + canonicalPayload)
    .digest('hex');
}

function verifyChain(events) {
  if (events.length === 0) return { valid: true, eventCount: 0 };

  let expectedPrevHash = 'GENESIS_0000000000000000000000000000000000000000000000000000000000000000';

  for (let i = 0; i < events.length; i++) {
    const event = events[i];

    if (event.prevHash !== expectedPrevHash) {
      return { valid: false, brokenIndex: i, reason: 'prevHash mismatch' };
    }

    const calculatedHash = createCanonicalHash(event.prevHash, event);
    if (calculatedHash !== event.hash) {
      return { valid: false, brokenIndex: i, reason: 'hash payload tampering' };
    }

    expectedPrevHash = event.hash;
  }

  return { valid: true, eventCount: events.length };
}

test('QA Test Suite: Audit Log SHA-256 Hash Chain Integrity', async (t) => {
  const companyId = 'company_test_tenant_a';
  let prevHash = 'GENESIS_0000000000000000000000000000000000000000000000000000000000000000';

  const rawEvents = [
    { companyId, actorId: 'user_1', action: 'job.create', entity: 'Job', entityId: 'job_101', metadata: { title: 'Backend Dev' } },
    { companyId, actorId: 'user_1', action: 'candidate.upload', entity: 'Candidate', entityId: 'cand_201', metadata: { count: 1 } },
    { companyId, actorId: 'user_2', action: 'candidate.screen', entity: 'ScreeningRun', entityId: 'run_301', metadata: { score: 85 } },
    { companyId, actorId: 'user_1', action: 'candidate.unmask', entity: 'Candidate', entityId: 'cand_201', metadata: { reason: 'Final stage interview' } },
    { companyId, actorId: 'user_1', action: 'candidate.decision', entity: 'HumanDecision', entityId: 'dec_401', metadata: { decision: 'SHORTLIST' } },
  ];

  const chainedEvents = [];
  for (const raw of rawEvents) {
    const hash = createCanonicalHash(prevHash, raw);
    chainedEvents.push({ ...raw, prevHash, hash });
    prevHash = hash;
  }

  await t.test('TC-AUD-001: Verifies legitimate, untampered audit chain', () => {
    const result = verifyChain(chainedEvents);
    assert.equal(result.valid, true, 'Clean chain must pass integrity check');
    assert.equal(result.eventCount, 5);
  });

  await t.test('TC-AUD-002: Detects tampering with event metadata (e.g. altering unmask reason)', () => {
    // Clone chain and tamper with event 3 (unmask reason altered to hide unauthorized unmasking)
    const tampered = JSON.parse(JSON.stringify(chainedEvents));
    tampered[3].metadata.reason = 'Tampered reason not originally entered';

    const result = verifyChain(tampered);
    assert.equal(result.valid, false, 'Tampered event must fail integrity check');
    assert.equal(result.brokenIndex, 3);
    assert.equal(result.reason, 'hash payload tampering');
  });

  await t.test('TC-AUD-003: Detects deletion of an event from the middle of the chain', () => {
    // Clone chain and delete event 1 (candidate upload removed)
    const tampered = JSON.parse(JSON.stringify(chainedEvents));
    tampered.splice(1, 1);

    const result = verifyChain(tampered);
    assert.equal(result.valid, false, 'Deleted event must break prevHash linkage');
    assert.equal(result.brokenIndex, 1);
    assert.equal(result.reason, 'prevHash mismatch');
  });

  await t.test('TC-AUD-004: Detects unauthorized insertion of an event into the chain', () => {
    const tampered = JSON.parse(JSON.stringify(chainedEvents));
    const rogueEvent = {
      companyId,
      actorId: 'hacker',
      action: 'candidate.delete',
      entity: 'Candidate',
      entityId: 'cand_201',
      metadata: {},
      prevHash: tampered[1].hash,
      hash: 'fake_hash',
    };
    tampered.splice(2, 0, rogueEvent);

    const result = verifyChain(tampered);
    assert.equal(result.valid, false, 'Injected event must be detected immediately');
  });
});
