-- ============================================================
-- FairHire AI — Postgres Row-Level Security Policies
-- Run with the migrate role (DATABASE_MIGRATE_URL) after migrations.
-- The application role (fairhire_app) has NO ability to bypass RLS.
-- ============================================================

-- ─────────────────────────────────────────────
-- Application roles
-- ─────────────────────────────────────────────

-- Create roles if they don't exist (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'fairhire_app') THEN
    CREATE ROLE fairhire_app LOGIN PASSWORD 'changeme_in_production';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'fairhire_migrate') THEN
    CREATE ROLE fairhire_migrate LOGIN PASSWORD 'changeme_in_production' CREATEROLE;
  END IF;
END $$;

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO fairhire_app;
GRANT USAGE ON SCHEMA public TO fairhire_migrate;

-- Grant table-level permissions to application role
-- AuditEvent: INSERT only — no UPDATE or DELETE ever
GRANT SELECT, INSERT ON audit_events TO fairhire_app;
-- All other tables: full CRUD
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO fairhire_app;
-- Sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO fairhire_app;
-- Revoke UPDATE/DELETE on audit_events explicitly (belt and suspenders)
REVOKE UPDATE, DELETE ON audit_events FROM fairhire_app;

-- Migrate role needs full access
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO fairhire_migrate;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO fairhire_migrate;

-- ─────────────────────────────────────────────
-- Enable RLS on all tenant-scoped tables
-- ─────────────────────────────────────────────

ALTER TABLE companies           ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships         ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs                ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_criteria        ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_assignments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates          ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_notes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_files            ENABLE ROW LEVEL SECURITY;
ALTER TABLE screening_runs      ENABLE ROW LEVEL SECURITY;
ALTER TABLE human_decisions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events        ENABLE ROW LEVEL SECURITY;
ALTER TABLE equity_self_ids     ENABLE ROW LEVEL SECURITY;
ALTER TABLE llm_cost_logs       ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────
-- RLS Helper function
-- The API sets this at the start of every request transaction:
--   SET LOCAL app.company_id = '<company_id>';
-- ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION current_company_id() RETURNS TEXT AS $$
  SELECT current_setting('app.company_id', TRUE);
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- ─────────────────────────────────────────────
-- Policies — companies
-- ─────────────────────────────────────────────

DROP POLICY IF EXISTS companies_tenant ON companies;
CREATE POLICY companies_tenant ON companies
  USING (id = current_company_id());

-- ─────────────────────────────────────────────
-- Policies — memberships
-- ─────────────────────────────────────────────

DROP POLICY IF EXISTS memberships_tenant ON memberships;
CREATE POLICY memberships_tenant ON memberships
  USING ("companyId" = current_company_id());

-- ─────────────────────────────────────────────
-- Policies — jobs
-- ─────────────────────────────────────────────

DROP POLICY IF EXISTS jobs_tenant ON jobs;
CREATE POLICY jobs_tenant ON jobs
  USING ("companyId" = current_company_id());

-- ─────────────────────────────────────────────
-- Policies — job_criteria
-- ─────────────────────────────────────────────

DROP POLICY IF EXISTS job_criteria_tenant ON job_criteria;
CREATE POLICY job_criteria_tenant ON job_criteria
  USING ("companyId" = current_company_id());

-- ─────────────────────────────────────────────
-- Policies — job_assignments (scoped via job)
-- ─────────────────────────────────────────────

DROP POLICY IF EXISTS job_assignments_tenant ON job_assignments;
CREATE POLICY job_assignments_tenant ON job_assignments
  USING (
    EXISTS (
      SELECT 1 FROM jobs j
      WHERE j.id = "jobId"
        AND j."companyId" = current_company_id()
    )
  );

-- ─────────────────────────────────────────────
-- Policies — candidates
-- ─────────────────────────────────────────────

DROP POLICY IF EXISTS candidates_tenant ON candidates;
CREATE POLICY candidates_tenant ON candidates
  USING ("companyId" = current_company_id());

-- ─────────────────────────────────────────────
-- Policies — candidate_identities
-- ─────────────────────────────────────────────

DROP POLICY IF EXISTS candidate_identities_tenant ON candidate_identities;
CREATE POLICY candidate_identities_tenant ON candidate_identities
  USING ("companyId" = current_company_id());

-- ─────────────────────────────────────────────
-- Policies — candidate_notes
-- ─────────────────────────────────────────────

DROP POLICY IF EXISTS candidate_notes_tenant ON candidate_notes;
CREATE POLICY candidate_notes_tenant ON candidate_notes
  USING ("companyId" = current_company_id());

-- ─────────────────────────────────────────────
-- Policies — cv_files
-- ─────────────────────────────────────────────

DROP POLICY IF EXISTS cv_files_tenant ON cv_files;
CREATE POLICY cv_files_tenant ON cv_files
  USING ("companyId" = current_company_id());

-- ─────────────────────────────────────────────
-- Policies — screening_runs
-- ─────────────────────────────────────────────

DROP POLICY IF EXISTS screening_runs_tenant ON screening_runs;
CREATE POLICY screening_runs_tenant ON screening_runs
  USING ("companyId" = current_company_id());

-- ─────────────────────────────────────────────
-- Policies — human_decisions
-- ─────────────────────────────────────────────

DROP POLICY IF EXISTS human_decisions_tenant ON human_decisions;
CREATE POLICY human_decisions_tenant ON human_decisions
  USING ("companyId" = current_company_id());

-- ─────────────────────────────────────────────
-- Policies — interview_questions
-- ─────────────────────────────────────────────

DROP POLICY IF EXISTS interview_questions_tenant ON interview_questions;
CREATE POLICY interview_questions_tenant ON interview_questions
  USING ("companyId" = current_company_id());

-- ─────────────────────────────────────────────
-- Policies — audit_events (append-only)
-- ─────────────────────────────────────────────

DROP POLICY IF EXISTS audit_events_tenant ON audit_events;
CREATE POLICY audit_events_tenant ON audit_events
  USING ("companyId" = current_company_id());

-- Extra protection: forbid UPDATE and DELETE at the policy level too
DROP POLICY IF EXISTS audit_events_no_update ON audit_events;
CREATE POLICY audit_events_no_update ON audit_events
  AS RESTRICTIVE
  FOR UPDATE
  USING (false);

DROP POLICY IF EXISTS audit_events_no_delete ON audit_events;
CREATE POLICY audit_events_no_delete ON audit_events
  AS RESTRICTIVE
  FOR DELETE
  USING (false);

-- ─────────────────────────────────────────────
-- Policies — equity_self_ids
-- ─────────────────────────────────────────────

DROP POLICY IF EXISTS equity_self_ids_tenant ON equity_self_ids;
CREATE POLICY equity_self_ids_tenant ON equity_self_ids
  USING ("companyId" = current_company_id());

-- ─────────────────────────────────────────────
-- Policies — llm_cost_logs
-- ─────────────────────────────────────────────

DROP POLICY IF EXISTS llm_cost_logs_tenant ON llm_cost_logs;
CREATE POLICY llm_cost_logs_tenant ON llm_cost_logs
  USING ("companyId" = current_company_id());

-- ─────────────────────────────────────────────
-- Users and Auth tables: NOT tenant-scoped
-- but must not be readable by other tenants via joins.
-- The API layer enforces user-level access here.
-- ─────────────────────────────────────────────

-- users, accounts, sessions, verification_tokens use Auth.js session checks.
-- No RLS needed, but ensure the app role cannot read another user's session.
-- Add row-level policies per user if required in future.

-- ─────────────────────────────────────────────
-- Cross-tenant leak test helper (for CI)
-- ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION test_cross_tenant_isolation(
  p_table TEXT,
  p_company_a TEXT,
  p_company_b TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  v_count INT;
  v_sql TEXT;
BEGIN
  -- Set context to company A
  PERFORM set_config('app.company_id', p_company_a, TRUE);
  v_sql := format('SELECT COUNT(*) FROM %I WHERE "companyId" = $1', p_table);
  EXECUTE v_sql INTO v_count USING p_company_b;
  -- Should return 0; if > 0, RLS is broken
  RETURN v_count = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION test_cross_tenant_isolation IS
  'CI helper: returns TRUE if company A cannot see company B data in the given table.';
