import type { AnomalyResult } from './types';

export const demoAnomalies: AnomalyResult[] = [
  {
    id: 'a1',
    title: 'High supplier concentration in ICT services',
    summary: 'One supplier holds 62% of sampled agency ICT contract value.',
    riskLevel: 'high',
    confidence: 78,
    score: 20,
    signalType: 'supplier_concentration',
    explainability: ['Supplier share exceeds configured concentration threshold.'],
    alternativeExplanations: ['Specialised vendor market may limit competition.'],
    linkedSources: [{ id: 'CN-1001', sourceType: 'AusTender', sourceUrl: 'https://www.tenders.gov.au/' }],
    timelineEvents: [{ date: '2024-04-03', label: 'Award issued' }]
  },
  {
    id: 'a2',
    title: 'Repeated contract amendments after award',
    summary: 'Contract value increased by 48% after four amendments.',
    riskLevel: 'medium',
    confidence: 75,
    score: 15,
    signalType: 'amendment_spike',
    explainability: ['Amendment count and value increase exceeded thresholds.'],
    alternativeExplanations: ['Scope uplift due to policy updates.'],
    linkedSources: [{ id: 'CN-1054', sourceType: 'AusTender', sourceUrl: 'https://www.tenders.gov.au/' }],
    timelineEvents: [
      { date: '2024-01-10', label: 'Initial award' },
      { date: '2024-03-22', label: 'Amendment +$80k' }
    ]
  }
];
