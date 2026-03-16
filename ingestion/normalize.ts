import type { IngestionRecord } from './connectors';

export interface NormalizedRecord {
  entityType: 'contract' | 'grant' | 'report';
  agencyName?: string;
  counterpartyName?: string;
  amount?: number;
  publishedAt?: string;
  sourceUrl: string;
  sourceType: IngestionRecord['sourceType'];
  identifier?: string;
  raw: Record<string, unknown>;
}

export function normalizeRecord(record: IngestionRecord): NormalizedRecord {
  if (record.sourceType === 'WA_AUDITOR_GENERAL') {
    return {
      entityType: 'report',
      agencyName: record.agency,
      publishedAt: record.publicationDate,
      sourceType: record.sourceType,
      sourceUrl: record.sourceUrl,
      identifier: record.identifier,
      raw: record.raw
    };
  }

  const grantLike = record.sourceType === 'GRANTCONNECT';
  return {
    entityType: grantLike ? 'grant' : 'contract',
    agencyName: record.agency,
    counterpartyName: record.supplierOrRecipient,
    amount: record.amount,
    publishedAt: record.publicationDate,
    sourceType: record.sourceType,
    sourceUrl: record.sourceUrl,
    identifier: record.identifier,
    raw: record.raw
  };
}
