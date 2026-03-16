# Detailed task list and implementation plan

## Step 0: Foundation (this iteration)
- [x] Create architecture document.
- [x] Define Prisma schema for normalized entities and provenance.
- [x] Scaffold Next.js app router structure and baseline pages.
- [x] Add disclaimer and safe language baseline.
- [x] Implement first anomaly rules (5 rules).
- [x] Add demo seed script with required data volume.

## Step 1: Ingestion hardening
- [ ] Replace stubs with resilient extractors for AusTender and GrantConnect.
- [ ] Add WA Who Buys What parser from downloadable tables.
- [ ] Add WA Auditor report index crawler and PDF parser pipeline.
- [ ] Add ingestion job logging and retry handling.
- [ ] Add idempotency tests on repeated ingestions.

## Step 2: Product UX completion
- [ ] Dashboard metrics from DB (not static demo data).
- [ ] Search page with indexed query params and filters.
- [ ] Full anomaly explorer filtering by date/jurisdiction/risk/type.
- [ ] Record detail view with raw + normalized + provenance.
- [ ] Case builder persistence, notes, and markdown export download.
- [ ] Timeline visualization using Recharts.

## Step 3: AI assisted outputs (grounded only)
- [ ] Retrieval component over stored source records.
- [ ] Brief generation with mandatory citations.
- [ ] FOI draft helper templates based on evidence gaps.
- [ ] Add confidence labels and alternative explanations for generated narrative.

## Step 4: Testing and release readiness
- [ ] Unit tests for normalization and all scoring rules.
- [ ] Playwright E2E for dashboard -> anomaly -> case export flow.
- [ ] Docker Compose with app + postgres + migration/seed commands.
- [ ] README setup and demo workflow docs.

## Planned repository file tree

```text
/app
  /about /anomalies /cases /dashboard /foi /records/[id] /search /timeline
  /api/anomalies /api/health
/lib
  demo-data.ts
  types.ts
/ingestion
  connectors.ts
  normalize.ts
/scoring
  config.ts
  rules.ts
/ai
  (reserved phase 2)
/prisma
  schema.prisma
  seed.ts
/tests
  /unit
/docs
  architecture.md
  task_list.md
```
