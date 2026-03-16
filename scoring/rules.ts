import { signalWeights, thresholds } from './config';
import type { AnomalyResult } from '@/lib/types';

export interface ContractLike {
  id: string;
  agency: string;
  supplier: string;
  amount: number;
  category: string;
  awardedAt: string;
  sourceUrl: string;
}

export interface AmendmentLike {
  contractId: string;
  amountDelta: number;
  amendedAt: string;
}

const daysBetween = (a: Date, b: Date) => Math.abs((a.getTime() - b.getTime()) / (1000 * 3600 * 24));

export function detectSupplierConcentration(contracts: ContractLike[]): AnomalyResult[] {
  const grouped = new Map<string, ContractLike[]>();
  for (const c of contracts) {
    const key = `${c.agency}::${c.category}`;
    grouped.set(key, [...(grouped.get(key) ?? []), c]);
  }

  const findings: AnomalyResult[] = [];
  for (const [key, rows] of grouped.entries()) {
    const total = rows.reduce((acc, row) => acc + row.amount, 0);
    const bySupplier = new Map<string, number>();
    for (const row of rows) bySupplier.set(row.supplier, (bySupplier.get(row.supplier) ?? 0) + row.amount);

    for (const [supplier, spend] of bySupplier.entries()) {
      const concentration = spend / Math.max(total, 1);
      if (concentration >= thresholds.supplierConcentrationPct) {
        const [agency, category] = key.split('::');
        findings.push({
          id: `sc-${agency}-${supplier}-${category}`,
          title: `High supplier concentration in ${agency}`,
          summary: `${supplier} accounts for ${(concentration * 100).toFixed(1)}% of ${category} spending in this cohort.`,
          riskLevel: concentration > 0.65 ? 'high' : 'medium',
          confidence: 78,
          score: signalWeights.supplierConcentration,
          signalType: 'supplier_concentration',
          explainability: [
            `Supplier share ${(concentration * 100).toFixed(1)}% exceeds threshold ${(thresholds.supplierConcentrationPct * 100).toFixed(0)}%.`,
            `Cohort includes ${rows.length} awards.`
          ],
          alternativeExplanations: [
            'Specialised market with limited qualified suppliers.',
            'Emergency procurement period may have reduced competition.'
          ],
          linkedSources: rows.filter((r) => r.supplier === supplier).slice(0, 5).map((r) => ({
            id: r.id,
            sourceType: 'contract',
            sourceUrl: r.sourceUrl,
            publishedAt: r.awardedAt
          })),
          timelineEvents: rows.filter((r) => r.supplier === supplier).slice(0, 5).map((r) => ({ date: r.awardedAt, label: `Award ${r.id}` }))
        });
      }
    }
  }
  return findings;
}

export function detectAmendmentSpike(contracts: ContractLike[], amendments: AmendmentLike[]): AnomalyResult[] {
  const byContract = new Map<string, AmendmentLike[]>();
  for (const amendment of amendments) {
    byContract.set(amendment.contractId, [...(byContract.get(amendment.contractId) ?? []), amendment]);
  }

  return contracts
    .map((contract): AnomalyResult | null => {
      const related = byContract.get(contract.id) ?? [];
      const totalDelta = related.reduce((acc, a) => acc + a.amountDelta, 0);
      const pct = totalDelta / Math.max(contract.amount, 1);
      if (related.length < thresholds.amendmentCount || pct < thresholds.amendmentIncreasePct) return null;

      return {
        id: `am-${contract.id}`,
        title: `Amendment spike for contract ${contract.id}`,
        summary: `${related.length} amendments increased value by ${(pct * 100).toFixed(1)}% post-award.`,
        riskLevel: pct >= 0.5 ? 'high' : 'medium',
        confidence: 75,
        score: signalWeights.repeatedAmendments,
        signalType: 'amendment_spike',
        explainability: [
          `Amendment count ${related.length} exceeds threshold ${thresholds.amendmentCount}.`,
          `Post-award growth ${(pct * 100).toFixed(1)}% exceeds threshold ${(thresholds.amendmentIncreasePct * 100).toFixed(1)}%.`
        ],
        alternativeExplanations: ['Scope change due to policy updates.', 'Contract phasing may have shifted budget timing.'],
        linkedSources: [{ id: contract.id, sourceType: 'contract', sourceUrl: contract.sourceUrl, publishedAt: contract.awardedAt }],
        timelineEvents: [
          { date: contract.awardedAt, label: 'Initial award' },
          ...related.map((a) => ({ date: a.amendedAt, label: `Amendment +${a.amountDelta}` }))
        ]
      };
    })
    .filter((x): x is AnomalyResult => x !== null);
}

export function detectRepeatAwards(contracts: ContractLike[]): AnomalyResult[] {
  const findings: AnomalyResult[] = [];
  const pairs = new Map<string, ContractLike[]>();
  for (const c of contracts) {
    const key = `${c.agency}::${c.supplier}`;
    pairs.set(key, [...(pairs.get(key) ?? []), c]);
  }
  for (const [key, rows] of pairs.entries()) {
    if (rows.length < 3) continue;
    const ordered = [...rows].sort((a, b) => +new Date(a.awardedAt) - +new Date(b.awardedAt));
    const span = daysBetween(new Date(ordered[0].awardedAt), new Date(ordered[ordered.length - 1].awardedAt));
    if (span > thresholds.repeatWindowDays) continue;
    const [agency, supplier] = key.split('::');
    findings.push({
      id: `rw-${agency}-${supplier}`,
      title: `Repeat awards in compressed period`,
      summary: `${supplier} received ${rows.length} awards from ${agency} within ${Math.round(span)} days.`,
      riskLevel: rows.length >= 5 ? 'high' : 'medium',
      confidence: 72,
      score: signalWeights.repeatAwards,
      signalType: 'repeat_awards',
      explainability: [
        `Award count ${rows.length} in ${Math.round(span)} days within threshold ${thresholds.repeatWindowDays} days.`,
        'Agency-supplier pattern suggests closer review of competition context.'
      ],
      alternativeExplanations: ['Program-wide rollout using an incumbent vendor.', 'Procurement panel arrangement.'],
      linkedSources: ordered.map((r) => ({ id: r.id, sourceType: 'contract', sourceUrl: r.sourceUrl, publishedAt: r.awardedAt })),
      timelineEvents: ordered.map((r) => ({ date: r.awardedAt, label: `Award ${r.id}` }))
    });
  }
  return findings;
}

export function detectThresholdClustering(contracts: ContractLike[], threshold = 100000): AnomalyResult[] {
  const lower = threshold * (1 - thresholds.thresholdWindowPct);
  const upper = threshold;
  const near = contracts.filter((c) => c.amount >= lower && c.amount < upper);
  if (near.length < 5) return [];
  return [
    {
      id: `tc-${threshold}`,
      title: `Threshold clustering near $${threshold.toLocaleString()}`,
      summary: `${near.length} awards are clustered just below the configured threshold.`,
      riskLevel: near.length >= 10 ? 'high' : 'medium',
      confidence: 68,
      score: signalWeights.thresholdClustering,
      signalType: 'threshold_clustering',
      explainability: [
        `${near.length} contracts fall between $${lower.toFixed(0)} and $${upper.toFixed(0)}.`,
        `Window is ${(thresholds.thresholdWindowPct * 100).toFixed(1)}% below configured threshold.`
      ],
      alternativeExplanations: ['Legitimate budgeting practices may target standard funding bands.', 'Project scoping may naturally align with this value.'],
      linkedSources: near.slice(0, 10).map((r) => ({ id: r.id, sourceType: 'contract', sourceUrl: r.sourceUrl, publishedAt: r.awardedAt })),
      timelineEvents: near.slice(0, 10).map((r) => ({ date: r.awardedAt, label: `Award ${r.id}` }))
    }
  ];
}

export interface DeliveryRecord {
  id: string;
  initiativeId: string;
  evidenceType: 'audit_reference' | 'status_update';
  sourceUrl: string;
  publishedAt: string;
}

export function detectMismatchSignal(
  fundedInitiatives: { id: string; title: string; agency: string; awardedAt: string; sourceUrl: string }[],
  evidence: DeliveryRecord[]
): AnomalyResult[] {
  const evidenceSet = new Set(evidence.map((e) => e.initiativeId));
  return fundedInitiatives
    .filter((initiative) => !evidenceSet.has(initiative.id))
    .map((initiative) => ({
      id: `mm-${initiative.id}`,
      title: `Delivery evidence not found for ${initiative.title}`,
      summary: `Funding record exists but later delivery evidence was not located in indexed public records.`,
      riskLevel: 'medium' as const,
      confidence: 60,
      score: signalWeights.noDeliveryEvidence,
      signalType: 'mismatch_signal' as const,
      explainability: [
        'Initiative has an award or grant record.',
        'No linked audit excerpt or public status update found in current index.'
      ],
      alternativeExplanations: ['Delivery reporting may exist in non-indexed datasets.', 'Evidence may be pending publication cycle.'],
      linkedSources: [
        {
          id: initiative.id,
          sourceType: 'funding_record',
          sourceUrl: initiative.sourceUrl,
          publishedAt: initiative.awardedAt
        }
      ],
      timelineEvents: [{ date: initiative.awardedAt, label: 'Funding awarded' }]
    }));
}
