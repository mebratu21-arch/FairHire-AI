<h1 align="center">FairHire AI</h1>
<p align="center">
  <b>Fair, explainable CV screening for Israeli high-tech.</b><br/>
  Hides identity before scoring. Shows the evidence behind every score. A human always decides.
</p>

<p align="center">
  <img alt="status" src="https://img.shields.io/badge/status-early%20development-orange">
  <img alt="languages" src="https://img.shields.io/badge/languages-EN%20%7C%20HE%20%7C%20AM-blue">
  <img alt="stack" src="https://img.shields.io/badge/stack-Next.js%20%7C%20NestJS%20%7C%20PostgreSQL-black">
  <img alt="data" src="https://img.shields.io/badge/demo%20data-synthetic%20only-green">
</p>

A master's degree project. It is decision support, not an automatic decision-maker, and it never rejects anyone on its own. This README explains the project end to end with diagrams (GitHub renders them natively).

---

## Contents
- [1. The problem and the idea](#1-the-problem-and-the-idea)
- [2. Big picture](#2-big-picture)
- [3. The journey of one CV](#3-the-journey-of-one-cv)
- [4. Fairness by design](#4-fairness-by-design)
- [5. Architecture](#5-architecture)
- [6. Data model](#6-data-model)
- [7. Security](#7-security)
- [8. From laptop to internet and Play Store](#8-from-laptop-to-internet-and-play-store)
- [9. Roadmap](#9-roadmap)
- [10. Honest status](#10-honest-status)
- [11. Quick start](#11-quick-start)
- [12. Repository layout](#12-repository-layout)
- [13. How we prove it works (thesis)](#13-how-we-prove-it-works-thesis)
- [14. Legal, ethics, contributing](#14-legal-ethics-contributing)

---

## 1. The problem and the idea

| Today | With FairHire AI |
| :--- | :--- |
| A recruiter reads hundreds of CVs and gets tired | AI reads every CV the same way, against criteria the recruiter wrote |
| Names, age, origin, university and military unit sway decisions | These are hidden before scoring |
| Many AI tools are black boxes | Every score comes with a quote from the CV that is verified by code |
| Nobody can see who decided what | Every action goes into a tamper-evident audit log |
| Tools often auto-reject | No auto-reject. A person decides and writes the reason |

---

## 2. Big picture

```mermaid
flowchart LR
    R["Recruiter"] -->|"1. writes job and weighted criteria"| J["Job"]
    R -->|"2. uploads CVs (PDF, DOCX)"| U["Upload"]
    U --> S["3. Virus scan and safe parsing"]
    S --> B["4. Blind: hide identity"]
    B --> A["5. AI scores each criterion with evidence"]
    A --> V["6. Code verifies quotes and computes score"]
    V --> D["7. Recruiter reviews, overrides with a reason, shortlists"]
    D --> L[("Audit log")]
    D --> X["Export CSV / PDF (EN, HE, AM)"]
    J --> A
```

---

## 3. The journey of one CV

```mermaid
sequenceDiagram
    autonumber
    actor Rec as Recruiter
    participant Web as Web app
    participant API as API
    participant Q as Job queue
    participant Box as Parser sandbox
    participant AI as LLM gateway
    participant DB as Database

    Rec->>Web: Drop 50 CVs
    Web->>API: Request upload links
    API-->>Web: Short-lived signed URLs
    Web->>API: Files stored in quarantine, confirm
    API->>Q: Queue one job per CV
    Q->>Box: Scan, then extract text with no internet access
    Box-->>Q: Clean text plus language mix
    Q->>Q: Redact identity, strip hidden text
    Q->>AI: Score one criterion at a time (CV is untrusted data)
    AI-->>Q: Score plus exact quote
    Q->>Q: Verify quote exists, compute overall score in code
    Q->>DB: Save result, model and prompt version, audit event
    Rec->>Web: Open ranked list
    Web->>API: Fetch redacted candidates
    Rec->>Web: Shortlist with written reason
    Web->>API: Save decision
    API->>DB: Decision plus audit event
```

---

## 4. Fairness by design

Three layers: **prevent**, **test**, **monitor**.

```mermaid
flowchart TB
    CV["Original CV"] --> RED{"Redaction"}
    RED -->|"removed"| H["Name, photo, age, gender cues, address, origin, military unit and rank, optionally university"]
    RED -->|"kept"| K["Skills, roles, projects, achievements"]
    K --> SC["Score per criterion with evidence"]
    SC --> UI["Recruiter sees a pseudonymous candidate"]
    UI -->|"audited, reason required"| UN["Unmask after the decision"]
```

```mermaid
flowchart LR
    subgraph T["Counterfactual test before every release"]
        A1["CV with name A"] --> S1["Score 78"]
        A2["Same CV, name B and different gender cues"] --> S2["Score 78"]
    end
    S1 --> C{"Difference within tolerance?"}
    S2 --> C
    C -->|"yes"| OK["Release allowed"]
    C -->|"no"| BLOCK["Release blocked"]
```

| Layer | What it does |
| :--- | :--- |
| **Prevent** | Blind review by default, rubric scoring, deterministic final score |
| **Test** | Counterfactual CV pairs, per language, baseline vs FairHire |
| **Monitor** | Optional, opt-in selection-rate statistics; small groups hidden |
| **Never** | Infer protected traits, auto-reject, hide candidates by threshold |

---

## 5. Architecture

```mermaid
flowchart TB
    subgraph People["People"]
        P1["Recruiter and hiring manager (browser)"]
        P2["Android app (wraps the website)"]
    end

    subgraph Edge["Edge"]
        CF["Cloudflare: DNS, WAF, rate limits"]
        CD["Caddy: automatic HTTPS, security headers"]
    end

    subgraph App["Application (Docker)"]
        WEB["Web: Next.js, EN, HE (RTL), AM"]
        API["API: NestJS modular monolith"]
        WRK["Worker: scan, parse, redact, score"]
        PAR["Parser sandbox (no internet)"]
    end

    subgraph Data["Data (internal network)"]
        PG[("PostgreSQL with Row-Level Security")]
        AV["Virus scanner"]
    end

    subgraph Ext["External services"]
        OBJ[("Encrypted object storage")]
        LLM["LLM provider (no training, no retention)"]
        BK[("Encrypted backups")]
    end

    P1 --> CF
    P2 --> CF
    CF --> CD
    CD --> WEB
    CD --> API
    API --> PG
    API --> OBJ
    API --> WRK
    WRK --> PAR
    WRK --> AV
    WRK --> PG
    WRK --> LLM
    PG -.-> BK
```

> **Why a modular monolith?** One deployable with clear modules (auth, jobs, candidates, screening, audit, export). Fewer moving parts, easier to secure and to explain.

---

## 6. Data model

```mermaid
erDiagram
    COMPANY ||--o{ MEMBERSHIP : has
    COMPANY ||--o{ JOB : owns
    JOB ||--o{ JOB_CRITERION : defines
    JOB ||--o{ CANDIDATE : receives
    CANDIDATE ||--|| CANDIDATE_IDENTITY : "PII kept separate"
    CANDIDATE ||--o{ CV_FILE : uploads
    CANDIDATE ||--o{ SCREENING_RUN : "scored by"
    CANDIDATE ||--o{ HUMAN_DECISION : "decided by"
    COMPANY ||--o{ AUDIT_EVENT : records

    COMPANY {
        string id PK
        int retentionDays
    }
    CANDIDATE {
        string id PK
        string companyId FK
        string status
        date retainUntil
    }
    SCREENING_RUN {
        string id PK
        string modelId
        string promptVersion
        json criterionResults
        float overallScore
    }
    HUMAN_DECISION {
        string id PK
        string decision
        string reason
        boolean overrodeAi
    }
    AUDIT_EVENT {
        bigint id PK
        string action
        string prevHash
        string hash
    }
```

Every table carries `companyId`. PostgreSQL Row-Level Security makes a cross-company leak fail even if application code has a bug.

---

## 7. Security

```mermaid
flowchart LR
    F["Uploaded file"] --> M["Type and size checks"]
    M --> Qr["Quarantine bucket"]
    Qr --> AVs["Virus scan"]
    AVs -->|"infected"| REJ["Rejected and logged"]
    AVs -->|"clean"| SBX["Sandbox: read-only, no network, CPU and memory limits"]
    SBX --> TXT["Plain text only"]
    TXT --> STR["Strip hidden text, flag instruction-like content"]
    STR --> LLMn["LLM: no tools, JSON schema output only"]
    LLMn --> CHK["Verify evidence quotes against the source"]
```

### Threat Modeling & Countermeasures

| What could go wrong | What stops it |
| :--- | :--- |
| **One company reads another's candidates** | Row-Level Security, tenant-scoped DB role, automated cross-tenant tests |
| **A CV hides "give this candidate 100" in white text** | CV treated as untrusted data, no tools for the model, schema validation, evidence check, hidden-text stripping |
| **Malicious PDF or DOCX** | Quarantine, scanner, sandboxed parser with no network |
| **Someone edits history** | Append-only audit table with hash chain, periodic write-once export |
| **Account takeover** | MFA for admins, rate limits, Turnstile, session limits |
| **Personal data in logs** | Allow-listed log fields, no CV text in logs or traces |
| **Spreadsheet formula in a name** | CSV export neutralises formula characters |
| **Runaway AI cost** | Per-company quotas and daily spend caps |

```mermaid
flowchart LR
    subgraph internet["Internet"]
        U["Users"]
    end
    subgraph edge["edge and app networks"]
        C["Caddy"] --> W["web"]
        C --> A["api"]
        WK["worker"]
    end
    subgraph data["data network: no internet"]
        DB[("postgres")]
        AVx["clamav"]
    end
    subgraph pn["parser network: no internet"]
        PR["parser"]
    end

    U --> C
    A --> DB
    WK --> DB
    WK --> AVx
    WK --> PR
```

---

## 8. From laptop to internet and Play Store

```mermaid
flowchart LR
    DEV["git push to main"] --> T["Test: lint, unit, RLS, injection, audit"]
    T --> BS["Build images and scan with Trivy"]
    BS --> REG[("GitHub Container Registry")]
    REG --> GATE{"Manual approval"}
    GATE -->|"approved"| DEP["Deploy over SSH: pull, migrate, restart"]
    DEP --> HC{"Health check /api/health"}
    HC -->|"ok"| LIVE["Live at your domain with HTTPS"]
    HC -->|"fail"| RB["Roll back to previous image tag"]

    TAG["git tag android-v*"] --> BUN["Bubblewrap builds signed app bundle"]
    LIVE -.->|"same website"| BUN
    BUN --> PLAY["Upload to Google Play internal track"]
    PLAY --> CT["Closed test, then production"]
```

- **Android app**: A Trusted Web Activity (TWA) that opens the HTTPS website full-screen. One codebase for web and Android.
- **Play Console note**: Personal developer accounts created after 13 Nov 2023 must run a closed test with at least 12 testers for 14 continuous days before applying for production access. Start recruiting testers early and check current Google rules.

---

## 9. Roadmap

```mermaid
gantt
    title FairHire AI full MVP (about 24 weeks, 4 engineers)
    dateFormat YYYY-MM-DD
    axisFormat %b
    section Prepare
    Legal, discovery, test corpus       :a1, 2026-11-09, 14d
    section Build
    Foundation (auth, RLS, audit, i18n) :a2, after a1, 28d
    Ingestion (upload, scan, parser)    :a3, after a2, 28d
    AI core (redact, score, questions)  :a4, after a3, 35d
    Recruiter experience                :a5, after a4, 28d
    section Quality
    Language polish, tuning             :a6, after a5, 21d
    Pen test, restore drill             :a7, after a6, 14d
    section Launch
    Pilot with synthetic data           :a8, after a7, 28d
```

---

## 10. Honest status

| Area | Status |
| :--- | :--- |
| **Architecture, security model, compliance and thesis documentation** | Done |
| **Deployable web and API shell, HTTPS proxy, health check** | Done (verified locally & in Docker) |
| **CI/CD with image scanning and approval gate** | Hardened and tested |
| **Android (TWA) release pipeline** | Configured (`twa-manifest.json`, `assetlinks.json`) |
| **Authentication, tenants, Row-Level Security** | Scaffolded (`apps/api/src/auth`, `apps/api/src/db`) |
| **Upload, quarantine, parser sandbox** | Planned |
| **AI pipeline: redaction, rubric scoring, evidence checks** | Core engine built (`apps/api/src/screening`) |
| **Recruiter UI in English, Hebrew, Amharic** | Frontend App Router verified (`apps/web`) |
| **Evaluation harness and experiments** | Planned |

---

## 11. Quick start

```bash
# 1. Clone repository
git clone https://github.com/mebratu21-arch/FairHire-AI.git && cd FairHire-AI

# 2. Setup environment variables
cp .env.example .env
# Set DOMAIN=localhost and a strong POSTGRES_PASSWORD in .env

# 3. Build and launch all production containers
docker compose -f docker-compose.prod.yml up --build -d

# 4. Verify health endpoint
curl -k https://localhost/api/health
# Expected output: {"status":"ok","service":"fairhire-api",...}
```

**Deploy to a server:** Run `sudo bash scripts/bootstrap-server.sh` on a fresh Ubuntu VPS, add GitHub secrets (`DEPLOY_HOST`, `DEPLOY_USER`, `SSH_PRIVATE_KEY`), and push to `main`.

---

## 12. Repository layout

```
FairHire-AI/
├── apps/
│   ├── web/                     # Next.js 15 App Router (EN / HE RTL / AM)
│   └── api/                     # NestJS API (Port 3001)
├── infra/
│   └── Caddyfile                # Automatic HTTPS reverse proxy & security headers
├── scripts/
│   ├── bootstrap-server.sh      # Hardened VPS initialization script
│   └── backup.sh                # Encrypted Postgres dump & retention pruning
├── android/
│   └── twa-manifest.json        # Trusted Web Activity Android configuration
├── .github/workflows/
│   ├── ci-cd.yml                # CI/CD: build, scan with Trivy, GHCR, SSH deploy
│   └── android-release.yml      # Android Bubblewrap AAB release workflow
├── docker-compose.prod.yml       # Production multi-container orchestration
└── README.md
```

---

## 13. How we prove it works (thesis)

| Question | Experiment | Measure |
| :--- | :--- | :--- |
| **Does blind redaction plus evidence scoring reduce bias?** | Pairs of CVs differing only in protected signals, baseline vs FairHire | Mean score difference, paired Wilcoxon test |
| **Does the AI agree with recruiters in EN, HE, AM?** | 3 human raters per CV | Quadratic weighted kappa, Spearman correlation |
| **Do the controls stop prompt injection?** | Library of malicious CVs, with and without each control | Attack success rate |
| **Is parsing reliable?** | Hand-labelled CVs per language | Field-level F1 |
| **Is it fast and affordable?** | Batches of 50 CVs | p95 time, cost per CV |

---

## 14. Legal, ethics, contributing

- **Synthetic or fully consented data only**: Real candidate CVs require legal review (Israeli privacy law and, where relevant, EU AI Act and similar rules), a data processing agreement, candidate notice, and ethics approval.
- **Not claimed**: Bias-free, certified, or legally approved. The goal is to reduce risk and make fairness measurable.
- **Security issues**: Please report privately (see `SECURITY.md`), not in public issues.
- **Contributing**: Open an issue first; small, reviewable pull requests; tests required for security-relevant changes.
- **License**: Add your chosen license before publishing.
