import { describe, expect, it } from 'vitest';
import {
  detectAmendmentSpike,
  detectMismatchSignal,
  detectRepeatAwards,
  detectSupplierConcentration,
  detectThresholdClustering,
  type AmendmentLike,
  type ContractLike
} from '@/scoring/rules';

const baseContracts: ContractLike[] = [
  { id: 'c1', agency: 'A1', supplier: 'S1', amount: 100, category: 'ICT', awardedAt: '2024-01-01', sourceUrl: 'u1' },
  { id: 'c2', agency: 'A1', supplier: 'S1', amount: 90, category: 'ICT', awardedAt: '2024-01-02', sourceUrl: 'u2' },
  { id: 'c3', agency: 'A1', supplier: 'S2', amount: 30, category: 'ICT', awardedAt: '2024-01-03', sourceUrl: 'u3' },
  { id: 'c4', agency: 'A1', supplier: 'S1', amount: 80, category: 'ICT', awardedAt: '2024-01-04', sourceUrl: 'u4' },
  { id: 'c5', agency: 'A1', supplier: 'S1', amount: 95, category: 'ICT', awardedAt: '2024-01-05', sourceUrl: 'u5' }
];

describe('scoring rules', () => {
  it('detects supplier concentration', () => {
    const anomalies = detectSupplierConcentration(baseContracts);
    expect(anomalies.length).toBeGreaterThan(0);
  });

  it('detects amendment spike', () => {
    const amendments: AmendmentLike[] = [
      { contractId: 'c1', amountDelta: 30, amendedAt: '2024-02-01' },
      { contractId: 'c1', amountDelta: 20, amendedAt: '2024-02-10' },
      { contractId: 'c1', amountDelta: 10, amendedAt: '2024-02-15' }
    ];
    const anomalies = detectAmendmentSpike(baseContracts, amendments);
    expect(anomalies[0]?.signalType).toBe('amendment_spike');
  });

  it('detects repeat awards in short window', () => {
    const anomalies = detectRepeatAwards(baseContracts);
    expect(anomalies.some((a) => a.signalType === 'repeat_awards')).toBe(true);
  });

  it('detects threshold clustering', () => {
    const nearThreshold = [95000, 96000, 97000, 98000, 99000].map((amount, i) => ({
      id: `n${i}`,
      agency: 'A2',
      supplier: `S${i}`,
      amount,
      category: 'Construction',
      awardedAt: '2024-04-01',
      sourceUrl: 'ux'
    }));

    const anomalies = detectThresholdClustering(nearThreshold, 100000);
    expect(anomalies[0]?.signalType).toBe('threshold_clustering');
  });

  it('detects mismatch where no delivery evidence exists', () => {
    const anomalies = detectMismatchSignal(
      [{ id: 'g1', title: 'Initiative 1', agency: 'A1', awardedAt: '2024-01-01', sourceUrl: 'u1' }],
      []
    );
    expect(anomalies[0]?.signalType).toBe('mismatch_signal');
  });
});
