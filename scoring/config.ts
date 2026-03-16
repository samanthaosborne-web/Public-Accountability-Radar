export const signalWeights = {
  supplierConcentration: 20,
  repeatedAmendments: 15,
  thresholdClustering: 15,
  repeatAwards: 15,
  noDeliveryEvidence: 20,
  categoryOutlier: 20,
  repeatedAuditFindings: 25
} as const;

export const thresholds = {
  supplierConcentrationPct: 0.45,
  amendmentCount: 3,
  amendmentIncreasePct: 0.25,
  thresholdWindowPct: 0.05,
  repeatWindowDays: 120
} as const;
