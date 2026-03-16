export type RiskLevel = 'low' | 'medium' | 'high';

export type SignalType =
  | 'supplier_concentration'
  | 'amendment_spike'
  | 'threshold_clustering'
  | 'repeat_awards'
  | 'mismatch_signal';

export interface SourceReference {
  id: string;
  sourceType: string;
  sourceUrl: string;
  publishedAt?: string;
}

export interface AnomalyResult {
  id: string;
  title: string;
  summary: string;
  riskLevel: RiskLevel;
  confidence: number;
  score: number;
  signalType: SignalType;
  explainability: string[];
  alternativeExplanations: string[];
  linkedSources: SourceReference[];
  timelineEvents: { date: string; label: string }[];
}
