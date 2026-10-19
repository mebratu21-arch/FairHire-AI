# FairHire AI (v2.0)

> **Decision support for fair recruitment.** Evaluates candidate CVs strictly against recruiter-defined criteria with cited evidence quotes. Protected attributes are redacted before AI scoring. Fully auditable, multi-tenant with PostgreSQL Row-Level Security, and compliant with Israeli Equal Employment Opportunities and Privacy Protection laws.

---

## 🏛️ Architecture Overview

```text
Browser (Next.js 15 App Router — RTL Hebrew / English / Amharic)
  │
NestJS API (Modular Monolith, RLS Context, Append-Only Hash Chain)
  ├── Redaction Engine (Rule-based PII, DOB, Gender, Military & Hidden Text)
  ├── LLM Gateway (Gemini 2.0 Flash @ Temperature 0, Structured JSON, Quote Verification)
  └── Audit Service (SHA-256 Hash Chained Tamper-Evident Ledger)
  │
PostgreSQL (Row-Level Security: app.company_id enforced per request)
Cloudflare R2 / S3 (Quarantine Bucket -> ClamAV -> Clean Bucket)
```

---

## 📦 Monorepo Structure

```text
fairhire/
├── apps/
│   ├── api/                   # NestJS modular monolith
│   │   ├── src/common/        # RLS interceptor, DbService, RolesGuard, CurrentUser
│   │   └── src/modules/       # audit, jobs, candidates, screening
│   └── web/                   # Next.js 15 (App Router) + next-intl (EN/HE/AM)
│       ├── src/i18n/          # Routing & request configs (RTL detection)
│       ├── src/components/    # RTL-safe glassmorphism UI & Navbar
│       └── src/app/[locale]/  # Blind review dashboard & candidate review interface
├── packages/
│   ├── db/                    # Prisma schema, migrations, RLS SQL & seed script
│   ├── shared/                # Zod schemas, enums, TypeScript types shared across apps
│   ├── i18n/                  # Full translation dictionaries (en.json, he.json, am.json)
│   ├── prompts/               # Versioned prompt pack (extraction, scoring, bias notes)
│   ├── redaction/             # Rule-based PII masking, hidden-text stripping, AES-256-GCM
│   └── llm-gateway/           # Provider-agnostic gateway with Gemini 2.0 implementation
├── docker-compose.yml         # Local stack: PostgreSQL, MinIO, ClamAV, MailHog
└── turbo.json                 # Turborepo task pipeline
```

---

## 🛡️ Core Security & Fairness Controls

1. **Blind Review by Default:** Candidate names, emails, phones, ID numbers, birth dates, gender cues, and military service details (IDF units like 8200) are automatically redacted before sending CV text to the screening model.
2. **Deterministic Scoring:** The LLM only rates single criteria on a 0–3 scale and quotes exact evidence. The overall score (0–100) is computed in deterministic code from weighted criteria.
3. **Evidence Verification:** Every cited quote is verified as a substring in the CV text. Hallucinated quotes are rejected.
4. **Postgres Row-Level Security (RLS):** Every tenant query runs with `app.company_id` set in a transaction. No accidental cross-tenant data leaks.
5. **Tamper-Evident Audit Chain:** Every write, unmask, override, and screening run is recorded with `hash = sha256(prevHash + canonicalEvent)`. Includes `GET /api/v1/audit/verify`.
6. **Audited Unmasking:** Revealing candidate identity requires an explicit reason and is logged permanently in the audit chain.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: `>= 20.0.0`
- **Docker**: For PostgreSQL, MinIO, ClamAV

### 2. Setup Environment
```bash
cp .env.example .env.local
```

### 3. Start Local Infrastructure
```bash
docker compose up -d
```

### 4. Install Dependencies & Generate Database Client
```bash
npm install
npm run db:generate
```

### 5. Start Development Servers
```bash
npm run dev
```

- **Web UI:** [http://localhost:3000](http://localhost:3000)
- **API Server:** [http://localhost:4000](http://localhost:4000)
- **MinIO Console:** [http://localhost:9001](http://localhost:9001) (`minioadmin` / `minioadmin`)
- **MailHog:** [http://localhost:8025](http://localhost:8025)
