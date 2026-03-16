export interface IngestionRecord {
  sourceType: 'AUSTENDER' | 'GRANTCONNECT' | 'WA_WHO_BUYS_WHAT' | 'WA_AUDITOR_GENERAL';
  sourceUrl: string;
  title: string;
  publicationDate?: string;
  agency?: string;
  supplierOrRecipient?: string;
  amount?: number;
  identifier?: string;
  raw: Record<string, unknown>;
}

export async function fetchAusTenderNotices(): Promise<IngestionRecord[]> {
  return [
    {
      sourceType: 'AUSTENDER',
      sourceUrl: 'https://www.tenders.gov.au/',
      title: 'Demo AusTender contract notice',
      publicationDate: '2024-02-10',
      agency: 'Agency 1',
      supplierOrRecipient: 'Supplier 1',
      amount: 92000,
      identifier: 'CN-1001',
      raw: { mode: 'stub', note: 'Connector to be replaced by resilient parser/API adapter.' }
    }
  ];
}

export async function fetchGrantConnectAwards(): Promise<IngestionRecord[]> {
  return [
    {
      sourceType: 'GRANTCONNECT',
      sourceUrl: 'https://www.grants.gov.au/',
      title: 'Demo GrantConnect award',
      publicationDate: '2024-03-12',
      agency: 'Agency 2',
      supplierOrRecipient: 'Supplier 2',
      amount: 150000,
      identifier: 'GR-3001',
      raw: { mode: 'stub' }
    }
  ];
}

export async function fetchWaWhoBuysWhat(): Promise<IngestionRecord[]> {
  return [
    {
      sourceType: 'WA_WHO_BUYS_WHAT',
      sourceUrl: 'https://www.wa.gov.au/government/publications/who-buys-what-and-how',
      title: 'Demo WA procurement record',
      publicationDate: '2024-05-18',
      agency: 'Agency 14',
      supplierOrRecipient: 'Supplier 7',
      amount: 87000,
      identifier: 'WA-9001',
      raw: { mode: 'stub' }
    }
  ];
}

export async function fetchWaAuditorReports(): Promise<IngestionRecord[]> {
  return [
    {
      sourceType: 'WA_AUDITOR_GENERAL',
      sourceUrl: 'https://audit.wa.gov.au/reports-and-publications/reports/',
      title: 'Demo WA Auditor General report index item',
      publicationDate: '2024-06-20',
      agency: 'Agency 14',
      identifier: 'WA-AUD-001',
      raw: { mode: 'stub', extraction: 'index only, PDF parser planned phase 2' }
    }
  ];
}
