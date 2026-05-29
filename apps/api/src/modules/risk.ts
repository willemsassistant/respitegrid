import { CareRecipient, FamilyProfile, VisitRequest, VisitRiskResult } from '@respitegrid/types';

const RESTRICTED_TERMS = [
  'injection',
  'insulin',
  'wound',
  'catheter',
  'oxygen',
  'feeding tube',
  'restrain',
  'sedate',
  'medication administration',
  'lift from bed',
  'violent',
  'threat',
  'emergency',
] as const;

export function detectRestrictedCareTerms(notes?: string): string[] {
  if (!notes) return [];
  const normalized = notes.toLowerCase();
  return RESTRICTED_TERMS.filter((term) => normalized.includes(term));
}

export function hoursUntil(isoTimestamp: string, now = new Date()): number {
  const diffMs = new Date(isoTimestamp).getTime() - now.getTime();
  return diffMs / 3_600_000;
}

export function computeVisitRisk(
  request: VisitRequest,
  recipient: CareRecipient,
  family: FamilyProfile,
  now = new Date(),
): VisitRiskResult {
  let score = 0;
  const flags: string[] = [];

  if (recipient.cognitiveStatus === 'dementia') {
    score += 20;
    flags.push('dementia');
  }

  if (recipient.fallRisk) {
    score += 20;
    flags.push('fall_risk');
  }

  if (request.serviceType === 'transportation' || request.transportationRequired) {
    score += 20;
    flags.push('transportation');
  }

  if (request.serviceType === 'overnight') {
    score += 15;
    flags.push('overnight');
  }

  if (hoursUntil(request.requestedStartAt, now) < 12) {
    score += 15;
    flags.push('short_notice');
  }

  if (family.completedBookingsCount === 0) {
    score += 15;
    flags.push('new_family');
  }

  const restrictedTerms = detectRestrictedCareTerms(request.notes);
  if (restrictedTerms.length > 0) {
    score += 100;
    flags.push(...restrictedTerms.map((term) => `restricted:${term}`));
  }

  const level = score >= 75 ? 'blocked' : score >= 50 ? 'high' : score >= 25 ? 'medium' : 'low';

  return {
    score,
    level,
    flags,
    manualReviewRequired: level === 'high' || level === 'blocked',
  };
}
