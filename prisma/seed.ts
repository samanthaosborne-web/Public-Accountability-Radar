import { PrismaClient, RiskLevel, SourceType } from '@prisma/client';

const prisma = new PrismaClient();

const agencies = Array.from({ length: 20 }, (_, i) => ({
  name: `Agency ${i + 1}`,
  jurisdiction: i < 12 ? 'Commonwealth' : 'Western Australia'
}));

const suppliers = Array.from({ length: 50 }, (_, i) => ({
  name: `Supplier ${i + 1}`,
  type: i % 4 === 0 ? 'Non-profit' : 'Company'
}));

async function main() {
  for (const agency of agencies) {
    await prisma.agency.upsert({ where: { name: agency.name }, update: agency, create: agency });
  }

  for (const supplier of suppliers) {
    await prisma.supplierRecipient.upsert({
      where: { name_abn: { name: supplier.name, abn: null } },
      update: supplier,
      create: supplier
    });
  }

  const agencyRows = await prisma.agency.findMany();
  const supplierRows = await prisma.supplierRecipient.findMany();

  const sourceRecords = [] as { id: string; idx: number }[];
  for (let i = 0; i < 245; i++) {
    const created = await prisma.sourceRecord.create({
      data: {
        sourceType: i % 4 === 0 ? SourceType.AUSTENDER : i % 3 === 0 ? SourceType.GRANTCONNECT : SourceType.DEMO,
        sourceUrl: `https://example.org/source/${i + 1}`,
        sourceTitle: `Demo source ${i + 1}`,
        publicationDate: new Date(2024, i % 12, (i % 27) + 1),
        identifier: `SRC-${i + 1}`,
        rawJson: { id: `SRC-${i + 1}`, note: 'Demo record' }
      }
    });
    sourceRecords.push({ id: created.id, idx: i });
  }

  for (let i = 0; i < 200; i++) {
    await prisma.contract.create({
      data: {
        externalId: `CN-${1000 + i}`,
        title: `Contract ${i + 1}`,
        category: ['ICT', 'Construction', 'Health', 'Consulting'][i % 4],
        amount: (50000 + (i % 14) * 7500).toFixed(2),
        awardedAt: new Date(2024, i % 12, (i % 27) + 1),
        agencyId: agencyRows[i % agencyRows.length].id,
        supplierId: supplierRows[i % supplierRows.length].id,
        sourceRecordId: sourceRecords[i].id
      }
    });
  }

  const contractRows = await prisma.contract.findMany();
  for (let i = 0; i < 30; i++) {
    await prisma.amendment.create({
      data: {
        contractId: contractRows[i % contractRows.length].id,
        amendedAt: new Date(2025, i % 6, (i % 27) + 1),
        amountDelta: (5000 + (i % 7) * 2000).toFixed(2),
        reason: 'Scope extension',
        sourceRecordId: sourceRecords[200 + i].id
      }
    });
  }

  for (let i = 0; i < 40; i++) {
    await prisma.grant.create({
      data: {
        externalId: `GR-${3000 + i}`,
        program: `Program ${i % 10}`,
        amount: (20000 + i * 1000).toFixed(2),
        awardedAt: new Date(2024, i % 12, (i % 27) + 1),
        agencyId: agencyRows[i % agencyRows.length].id,
        recipientId: supplierRows[(i * 2) % supplierRows.length].id,
        sourceRecordId: sourceRecords[150 + i].id
      }
    });
  }

  for (let i = 0; i < 15; i++) {
    const report = await prisma.report.create({
      data: {
        title: `WA Auditor General Report ${i + 1}`,
        reportDate: new Date(2023 + (i % 2), i % 12, 15),
        summary: 'Controls and delivery assurance review.',
        jurisdiction: 'Western Australia',
        sourceUrl: `https://audit.wa.gov.au/reports/demo-${i + 1}`,
        sourceRecordId: sourceRecords[220 + i].id,
        agencyId: agencyRows[(i + 1) % agencyRows.length].id
      }
    });

    await prisma.auditFinding.create({
      data: {
        title: `Finding ${i + 1}`,
        summary: 'Possible control weakness identified in procurement monitoring.',
        severity: i % 3 === 0 ? 'high' : 'medium',
        reportId: report.id,
        agencyId: agencyRows[(i + 1) % agencyRows.length].id,
        pageReference: `p.${12 + i}`
      }
    });
  }

  for (let i = 0; i < 25; i++) {
    await prisma.anomaly.create({
      data: {
        anomalyType: ['supplier_concentration', 'amendment_spike', 'threshold_clustering', 'repeat_awards', 'mismatch_signal'][i % 5],
        title: `Demo anomaly ${i + 1}`,
        summary: 'Spending pattern worth scrutiny and human review.',
        riskLevel: i % 3 === 0 ? RiskLevel.HIGH : i % 3 === 1 ? RiskLevel.MEDIUM : RiskLevel.LOW,
        confidenceScore: 55 + (i % 40),
        weightedScore: 10 + (i % 25),
        explainabilityJson: { rules: ['Demo rule trigger'] },
        alternativesJson: { alternatives: ['Routine procurement cycle.'] },
        timelineJson: { events: [{ date: '2024-07-01', label: 'Award' }] }
      }
    });
  }

  await prisma.user.upsert({
    where: { email: 'demo@radar.local' },
    update: { name: 'Demo Analyst' },
    create: { email: 'demo@radar.local', name: 'Demo Analyst', passwordHash: 'demo-password-hash' }
  });

  console.log('Seed complete: 20 agencies, 50 suppliers, 200 contracts, 30 amendments, 15 audit findings, 25 anomalies.');
}

main().finally(async () => {
  await prisma.$disconnect();
});
