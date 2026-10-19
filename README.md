<div align="center">

  <img src="https://raw.githubusercontent.com/mebratu21-arch/FairHire-AI/main/apps/web/public/logo.png" alt="FairHire AI Logo" width="100" onerror="this.src='https://img.icons8.com/fluency/96/scales.png'" />

  # FairHire AI
  ### Intelligent, Bias-Free Tech Recruitment Platform
  
  **Screen CVs • Detect & Mitigate Bias • Generate Objective Interview Kits**  
  *Built specifically for the Israeli high-tech ecosystem with native Hebrew (RTL), English, and Amharic support.*

  <p align="center">
    <a href="https://github.com/mebratu21-arch/FairHire-AI/actions"><img src="https://img.shields.io/github/actions/workflow/status/mebratu21-arch/FairHire-AI/ci.yml?branch=main&style=for-the-badge&logo=github&color=3b82f6" alt="CI Status" /></a>
    <a href="https://github.com/mebratu21-arch/FairHire-AI/releases"><img src="https://img.shields.io/github/v/release/mebratu21-arch/FairHire-AI?style=for-the-badge&color=10b981" alt="Release" /></a>
    <a href="https://github.com/mebratu21-arch/FairHire-AI/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-amber.svg?style=for-the-badge" alt="License" /></a>
    <a href="https://github.com/mebratu21-arch/FairHire-AI/stargazers"><img src="https://img.shields.io/github/stars/mebratu21-arch/FairHire-AI?style=for-the-badge&logo=github&color=6366f1" alt="Stars" /></a>
    <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-%3E=20.0-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node" /></a>
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-15_App_Router-black?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
  </p>

  <p align="center">
    <a href="#-project-description">Overview</a> •
    <a href="#-key-features">Key Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-architecture-overview">Architecture</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-roadmap">Roadmap</a>
  </p>

</div>

---

## 💡 Project Description

**FairHire AI** is an enterprise-grade AI decision-support platform designed to transform technical hiring. In traditional recruitment, subconscious bias, non-standard Hebrew/English CV parsing artifacts, and arbitrary ranking algorithms often penalize talented candidates.

FairHire AI changes this paradigm by placing **fairness, evidence, and compliance at the core**:
- 🛡️ **Decision Support, Not Decision Maker:** The AI never rejects, ranks-and-hides, or auto-disqualifies candidates. Recruiters make and justify every decision.
- 🙈 **Blind Screening by Default:** Automatically redacts names, contact info, age indicators, gender signals, and military units (e.g. IDF 8200) prior to LLM evaluation.
- 🎯 **Cited Evidence Verification:** Scoring is criterion-by-criterion against recruiter-defined rubrics. Every evaluation cites a verbatim quote from the CV verified in code.
- 📜 **Israeli Equal Employment Compliance:** Aligned with Israeli Equal Employment Opportunities Law and Protection of Privacy Law (Amendment 13).

---

## 📸 Demo & Screenshots

<div align="center">

### 🖥️ Recruiter Blind Review Dashboard
<!-- Add your screenshot here: apps/web/public/screenshots/dashboard-preview.png -->
```
+----------------------------------------------------------------------------------------------------+
|  [SHIELD] FairHire.ai                  [BLIND SCREENING ACTIVE]                 [EN] [עב] [አማ]    |
+----------------------------------------------------------------------------------------------------+
|  Candidate CV-00042 (Pseudonymous)                   Deterministic Rubric Score: 88 / 100         |
|  Applied: Senior Backend Engineer (Tel Aviv)         Missing Must-Haves: NONE                      |
|                                                                                                    |
|  [CRITERION EVALUATION]                                                                            |
|  * 5+ years backend TypeScript & Node.js [MUST-HAVE]                    Score: 3 / 3 (Strong)      |
|    Evidence: "Developed high-scale distributed backend services with PostgreSQL and Redis." [VERIFIED]
|                                                                                                    |
|  * Bilingual RTL / Hebrew UI localization [NICE-TO-HAVE]                Score: 3 / 3 (Strong)      |
|    Evidence: "Built accessible user interfaces with RTL support and internationalization." [VERIFIED]  |
|                                                                                                    |
|  [AWARENESS NOTES]                                                                                 |
|  * [MILITARY_SERVICE] Redacted from evaluation model. Original contained unit signal.              |
|                                                                                                    |
|  [RECRUITER ACTION REQUIRED]                                                                       |
|  Reason for decision: [ Why are you shortlisting this candidate?                         ]         |
|  [ Shortlist ]      [ Hold ]      [ Reject ]      [ Reveal Identity (Audited) ]                    |
+----------------------------------------------------------------------------------------------------+
```
*Figure 1: Recruiter Blind Evaluation view showcasing criterion-level scoring, cited evidence verification, and mandatory reason logging.*

<br/>

### 📱 Trilingual RTL & LTR Interface
| Hebrew (עברית - Native RTL) | English (Global Tech Standard) | Amharic (አማርኛ - Inclusion First) |
| :---: | :---: | :---: |
| כיווניות מימין לשמאל (RTL) מלאה, גופני Noto Sans Hebrew, וסינון עיוור המונע הטיה על רקע שירות צבאי ומוצא. | Clean logical layouts, strict deterministic rubric evaluation, and instant candidate evidence highlights. | የዕውር ምርጫ ስርዓት፣ የህዝብ ማንነት መረጃን በማደብዘዝ ፍትሃዊ እና ጥራት ያለው የቴክኖሎጂ ቅጥርን ያረጋግጣል። |

</div>

---

## ⚡ Key Features

| Feature | Description |
| :--- | :--- |
| **🔍 Blind CV Screening** | Redacts PII, gender cues, age/DOB, and military units before scoring. Stored using AES-256-GCM encrypted mask maps. |
| **📐 Rubric-Based Deterministic Scoring** | The model scores individual criteria from 0–3 with quotes. The 0–100 overall score is calculated in deterministic code. |
| **🔎 Anti-Hallucination Evidence Verification** | Every cited quote is verified in code as a verbatim substring in the source CV; hallucinated citations are discarded. |
| **🛡️ Adversarial Injection Defense** | Strips zero-width characters, detects instruction injection payloads, and bounds model output to strict Zod schemas. |
| **🎙️ Smart Interview Kit Generator** | Generates 8–12 structured interview questions (Technical, STAR Behavioral, Values & Working Style) with a safety classifier. |
| **🌐 Native Trilingual (EN / HE / AM)** | Complete UI and prompt packs in English, Hebrew (RTL), and Amharic with ICU plural localization. |
| **🔗 Tamper-Evident Audit Chain** | Every screening run, decision, unmask, and override is cryptographically logged with an append-only SHA-256 hash chain. |
| **🏢 Multi-Tenant Postgres RLS** | Hardened Row-Level Security (`app.company_id`) enforced per database transaction to prevent cross-tenant data leaks. |

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technologies |
| :--- | :--- |
| **Frontend UI** | ![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat-square&logo=next.js&logoColor=white) ![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) ![next-intl](https://img.shields.io/badge/next--intl-i18n-blue?style=flat-square) |
| **Backend API** | ![NestJS](https://img.shields.io/badge/NestJS_11-E0234E?style=flat-square&logo=nestjs&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js_20+-339933?style=flat-square&logo=node.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript_5.8-3178C6?style=flat-square&logo=typescript&logoColor=white) |
| **Database & Cache** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL_16-4169E1?style=flat-square&logo=postgresql&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma_6-2D3748?style=flat-square&logo=prisma&logoColor=white) ![RLS](https://img.shields.io/badge/Postgres_RLS-Enforced-success?style=flat-square) |
| **AI & LLM Gateway** | ![Google Gemini](https://img.shields.io/badge/Gemini_2.0_Flash-8E75B2?style=flat-square&logo=google&logoColor=white) ![Zod](https://img.shields.io/badge/Zod-Structured_Output-3E67B1?style=flat-square) |
| **Storage & Security** | ![Cloudflare R2](https://img.shields.io/badge/Cloudflare_R2-F38020?style=flat-square&logo=cloudflare&logoColor=white) ![MinIO](https://img.shields.io/badge/MinIO_S3-C72C48?style=flat-square&logo=minio&logoColor=white) ![ClamAV](https://img.shields.io/badge/ClamAV-Antivirus-darkred?style=flat-square) |
| **Monorepo & Tools** | ![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=flat-square&logo=turborepo&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white) |

</div>

---

## 🏗️ Architecture Overview

```mermaid
flowchart TD
    subgraph Client["Frontend (Next.js 15 App Router)"]
        UI["Web UI (EN / HE RTL / AM)"]
        BFF["Route Handlers (BFF)"]
    end

    subgraph API["Backend (NestJS Monolith)"]
        AUTH["Auth & RBAC Guards"]
        RLS_INT["Tenant Context & RLS Interceptor"]
        JOBS["Jobs & Criteria Module"]
        CAND["Candidate Module"]
        AUDIT["Audit Chain Module (SHA-256)"]
    end

    subgraph Pipeline["Ingestion & AI Screening"]
        QUAR["S3 Quarantine Bucket"]
        AV["ClamAV Scan"]
        PARSE["Sandboxed Parser"]
        RED["Redaction Engine (PII / Units)"]
        GATEWAY["LLM Gateway (Gemini 2.0 Flash)"]
        VERIFY["Evidence Verifier Substring Check"]
    end

    subgraph Storage["Data Tier"]
        PG[("PostgreSQL 16 (Row-Level Security)")]
        CLEAN["S3 Clean Encrypted Bucket"]
    end

    UI --> BFF --> AUTH --> RLS_INT
    RLS_INT --> JOBS & CAND & AUDIT
    CAND --> QUAR --> AV --> PARSE --> RED --> GATEWAY --> VERIFY
    VERIFY --> CAND
    AUDIT -.-> |Append-Only Hash Chain| PG
    JOBS & CAND --> PG
    PARSE --> CLEAN
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `>= 20.0.0`
- **Docker & Docker Compose**: For PostgreSQL, MinIO, and ClamAV
- **Google Gemini API Key**: [Get API Key here](https://aistudio.google.com/)

### Step-by-Step Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mebratu21-arch/FairHire-AI.git
   cd FairHire-AI
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database credentials and GOOGLE_GENERATIVE_AI_API_KEY
   ```

3. **Spin up local infrastructure services:**
   ```bash
   docker compose up -d
   ```

4. **Install monorepo dependencies & generate Prisma client:**
   ```bash
   npm install
   npm run db:generate
   ```

5. **Seed the database (Tenants, Admin, Criteria & Genesis Audit Block):**
   ```bash
   npm --workspace=@fairhire/db run db:seed
   ```

6. **Execute automated QA & Security test suites:**
   ```bash
   npm run test:qa
   ```

7. **Start the development servers:**
   ```bash
   npm run dev
   ```

- 🌐 **Web UI:** [http://localhost:3000](http://localhost:3000)
- 🔌 **API Server:** [http://localhost:4000](http://localhost:4000)
- 🗄️ **MinIO Console:** [http://localhost:9001](http://localhost:9001) (`minioadmin` / `minioadmin`)
- 📧 **MailHog UI:** [http://localhost:8025](http://localhost:8025)

---

## 🔐 Environment Variables

Key variables defined in `.env.example`:

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string for the app role (RLS active) | `postgresql://fairhire_app:***@localhost:5432/fairhire` |
| `DATABASE_MIGRATE_URL` | High-privilege role used exclusively by Prisma migrations | `postgresql://fairhire_migrate:***@localhost:5432/fairhire` |
| `LLM_PROVIDER` | Primary LLM provider (`google`, `openai`, `anthropic`) | `google` |
| `LLM_MODEL_PINNED` | Pinned model version for deterministic reproducibility | `gemini-2.0-flash-001` |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google Gemini API key | `AIzaSy...` |
| `ENCRYPTION_KEY` | 32-byte hexadecimal key for AES-256-GCM mask map encryption | `0123456789abcdef...` |
| `S3_ENDPOINT` | S3 / MinIO / Cloudflare R2 endpoint | `http://localhost:9000` |
| `S3_BUCKET_QUARANTINE` | Isolated bucket for uninspected CV uploads | `fairhire-quarantine` |
| `S3_BUCKET_CLEAN` | Encrypted bucket for clean, redacted CVs | `fairhire-clean` |
| `FEATURE_AI_AMHARIC_DEFAULT`| Per-tenant flag for Amharic AI evaluation rollout | `false` |

---

## 📁 Project Structure

```text
FairHire-AI/
├── apps/
│   ├── api/                   # NestJS Modular Monolith API
│   │   ├── src/common/        # RLS interceptors, DbService, RolesGuard, User context
│   │   └── src/modules/       # audit, jobs, candidates, screening modules
│   └── web/                   # Next.js 15 (App Router) Frontend
│       ├── src/i18n/          # next-intl routing for EN / HE (RTL) / AM
│       ├── src/components/    # RTL-safe Navbar, Badge, Evidence highlight components
│       └── src/app/[locale]/  # Blind dashboard & candidate evaluation interfaces
│
├── packages/
│   ├── db/                    # Prisma schema, migrations, RLS SQL & seed script
│   ├── shared/                # Zod validation schemas, enums & shared TypeScript types
│   ├── i18n/                  # Complete translation dictionaries (EN, HE, AM)
│   ├── prompts/               # Versioned prompt pack (screening@1.0.0, extraction, kit)
│   ├── redaction/             # Rule-based PII, DOB, IDF unit redaction & AES-256-GCM
│   └── llm-gateway/           # Gemini 2.0 client with quote verification & cost caps
│
├── qa/
│   └── tests/                 # QA automated unit test suites (Node.js test runner)
├── docker-compose.yml         # Local development services
└── turbo.json                 # Turborepo task orchestrator
```

---

## 🗺️ Roadmap

- [x] **Phase 0–1: Monorepo Foundation & Core Security**
  - [x] Turborepo monorepo scaffold with Next.js 15 and NestJS
  - [x] Full data model with isolated PII (`CandidateIdentity`)
  - [x] PostgreSQL Row-Level Security policies (`src/rls.sql`)
  - [x] Cryptographic SHA-256 append-only audit ledger
  - [x] Redaction engine with Israeli military unit masking and zero-width strip
  - [x] Deterministic rubric scoring with evidence substring verification
  - [x] Native trilingual shell (EN / HE [RTL] / AM)

- [ ] **Phase 2: Advanced Ingestion & Normalization**
  - [ ] Hebrew BiDi reverse-text normalization for scrambled PDFs
  - [ ] ClamAV container streaming pipeline
  - [ ] Per-section language mix detection (`{he: 0.8, en: 0.2}`)

- [ ] **Phase 3: Recruiter Experience & Interview Generator**
  - [ ] Prohibited-topic question safety filter classifier
  - [ ] Export to PDF & CSV with formula injection shielding (`=HYPERLINK` sanitization)
  - [ ] Embedded Noto Sans Hebrew and Noto Sans Ethiopic PDF font rendering

- [ ] **Phase 4: Compliance & Equity**
  - [ ] Counterfactual test runner in CI (pronoun & origin swapping variance < 2%)
  - [ ] Voluntary equity self-identification metrics (adverse impact ratio)

---

## 🤝 Contributing

We welcome contributions from engineers, designers, and fairness researchers!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Run the automated QA test suite (`npm run test:qa`)
4. Commit your Changes (`git commit -m 'feat: Add AmazingFeature'`)
5. Push to the Branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

Please ensure all commits include corresponding unit tests and follow the architectural guidelines in the repository.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

## 💬 Acknowledgements & Community

* **Google Gemini Team** for structured JSON output models.
* **Next.js & NestJS Teams** for modern web and backend primitives.
* **Israeli High-Tech Recruiting Community** for rubric design insights.

<br/>

<div align="center">
  <sub>Built with ❤️ for a more equitable, transparent Israeli High-Tech ecosystem.</sub>
</div>
