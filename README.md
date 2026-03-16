# Public Accountability Radar (MVP scaffold)

Initial scaffold implementing architecture, Prisma schema, demo seed data, and first anomaly rules.

## Quick start

```bash
npm install
npm run dev
```

## Database

Set `DATABASE_URL` in `.env`, then:

```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

## Tests

```bash
npm test
```

## Safety

This tool surfaces anomaly and risk signals only. It does not determine corruption, criminality, or misconduct.
