# Public Accountability Radar - Architecture (MVP)

## Purpose
Public Accountability Radar is a research and accountability platform that indexes Australian public spending and oversight records, generates explainable anomaly/risk signals, and enables exportable evidence briefs.

**Safety baseline:** The system must never determine corruption or misconduct. It only identifies risk signals requiring human review.

## System overview

```text
[Source Connectors]
  AusTender | GrantConnect | WA Who Buys What | WA Auditor General
          -> ingestion jobs (idempotent with source keys/checksum)
          -> normalization layer (common schema)
          -> PostgreSQL (Prisma) + provenance links
          -> scoring engine (explainable rules)
          -> anomaly records with confidence/alternatives/timeline
          -> Next.js API + UI (dashboard/search/explorer/cases/timeline)
          -> case exports (Markdown in phase 1; PDF/JSON in phase 2)
```

## Components
- **Frontend (`/app`)**: Next.js App Router + TypeScript + Tailwind; neutral journalistic UI; explicit disclaimer on core pages.
- **API (`/app/api`)**: Route handlers for anomalies, health, and upcoming case export/ingestion triggers.
- **Ingestion (`/ingestion`)**: Source connectors and normalizers. Live connectors can be swapped with robust adapters.
- **Scoring (`/scoring`)**: Configurable rule thresholds + weighted explainable signal functions.
- **AI (`/ai`)**: Reserved for retrieval-grounded summaries and brief drafting with citations (phase 2).
- **Data (`/prisma`)**: PostgreSQL schema for contracts, grants, amendments, reports, findings, anomalies, provenance, and user cases.
- **Tests (`/tests`)**: Unit tests now for scoring rules; Playwright E2E in subsequent increment.

## Data model principles
1. **Traceability first**: each derived anomaly links to source records via `Provenance`.
2. **Idempotency**: source records keyed by source type + URL + identifier.
3. **Explainability**: anomaly object stores rule triggers, score contribution, and alternative explanations.
4. **Safety language**: anomaly summaries are non-accusatory and review-oriented.

## Deployment topology (initial)
- Web/API container: Next.js app
- DB container: PostgreSQL
- Job runner: Next.js cron trigger or dedicated worker process (phase 1 can run script manually)
- Optional: pgvector extension once semantic retrieval is enabled.

## Security and legal controls
- Local auth only in MVP with demo account.
- All pages contain a disclaimer and methodology link.
- No direct allegation language in code-generated text.
- AI features must use grounded retrieval from stored source data and include citations.

## Known phase gaps
- Live connectors are currently stubs (schema-ready).
- WA Auditor report PDF extraction and page-level NLP are deferred to phase 2.
- PDF export and FOI drafting workflow are scaffolded for phase 2.
