import {
  CareRecipient,
  CaregiverProfile,
  FamilyProfile,
  MatchExplanation,
  MatchScore,
  VisitRequest,
} from '@respitegrid/types';

export interface MatchInput {
  request: VisitRequest;
  recipient: CareRecipient;
  family: FamilyProfile;
  caregiver: CaregiverProfile;
  travelMinutes: number;
  continuity?: {
    completedVisits: number;
    averageRating: number;
    lastVisitWithinDays: number;
  } | null;
  availabilityCovered?: boolean;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function computeSkillScore(request: VisitRequest, caregiver: CaregiverProfile): number {
  const required = request.requiredSkills;
  const preferred = request.preferredSkills ?? [];
  const caregiverSkills = new Set(caregiver.skills.map((skill) => skill.name));
  const verifiedSkills = new Set(caregiver.skills.filter((skill) => skill.verified).map((skill) => skill.name));

  const requiredMatches = required.filter((skill) => caregiverSkills.has(skill)).length;
  const preferredMatches = preferred.filter((skill) => caregiverSkills.has(skill)).length;
  const verifiedMatches = required.filter((skill) => verifiedSkills.has(skill)).length;

  const requiredRatio = required.length === 0 ? 1 : requiredMatches / required.length;
  const preferredRatio = preferred.length === 0 ? 0 : preferredMatches / preferred.length;
  const verifiedBonus = required.length === 0 ? 0 : verifiedMatches / required.length;

  return clamp(70 * requiredRatio + 20 * preferredRatio + 10 * verifiedBonus, 0, 100);
}

export function computeAvailabilityScore(
  request: VisitRequest,
  caregiver: CaregiverProfile,
  exactCoverage = true,
  now = new Date(),
): number {
  if (!exactCoverage) return 0;
  const hoursUntilVisit = (new Date(request.requestedStartAt).getTime() - now.getTime()) / 3_600_000;
  const shortNoticePenalty = hoursUntilVisit < 12 ? 10 : 0;
  const responseSpeedBonus = caregiver.medianOfferResponseMinutes <= 15 ? 10 : caregiver.medianOfferResponseMinutes <= 60 ? 5 : 0;
  const offerFatiguePenalty = caregiver.openOffersLast24h >= 5 ? 10 : caregiver.openOffersLast24h >= 3 ? 5 : 0;
  return clamp(90 + responseSpeedBonus - shortNoticePenalty - offerFatiguePenalty, 0, 100);
}

export function computeDistanceScore(travelMinutes: number): number {
  if (travelMinutes <= 10) return 100;
  if (travelMinutes <= 20) return 85;
  if (travelMinutes <= 30) return 70;
  if (travelMinutes <= 45) return 45;
  if (travelMinutes <= 60) return 20;
  return 0;
}

export function computeReliabilityScore(caregiver: CaregiverProfile): number {
  const completedWeight = Math.min(caregiver.completedVisitsCount / 20, 1);
  const base = caregiver.completedVisitsCount < 3 ? 60 : caregiver.averageRating * 20;
  const cancellationPenalty = caregiver.cancellationRate * 40;
  const latePenalty = caregiver.lateRate * 20;
  const noShowPenalty = caregiver.noShowCountLast90d * 15;
  const incidentPenalty = caregiver.highSeverityIncidentCountLast180d * 25;
  const experienceBonus = completedWeight * 10;

  return clamp(base + experienceBonus - cancellationPenalty - latePenalty - noShowPenalty - incidentPenalty, 0, 100);
}

export function computePreferenceScore(
  request: VisitRequest,
  recipient: CareRecipient,
  family: FamilyProfile,
  caregiver: CaregiverProfile,
): number {
  let score = 50;
  if (recipient.preferredLanguage && caregiver.languages.includes(recipient.preferredLanguage)) score += 20;
  if (recipient.petPresent && caregiver.skills.some((skill) => skill.name === 'pet_friendly')) score += 10;
  if ((request.transportationRequired || request.serviceType === 'transportation') && caregiver.skills.some((skill) => skill.name === 'transportation')) score += 10;
  if ((family.favoriteCaregiverIds ?? []).includes(caregiver.id)) score += 20;
  return clamp(score, 0, 100);
}

export function computeContinuityScore(
  continuity: MatchInput['continuity'],
): number {
  if (!continuity) return 30;
  const visitBonus = Math.min(continuity.completedVisits * 8, 40);
  const ratingBonus = continuity.averageRating >= 4.8 ? 30 : continuity.averageRating >= 4.5 ? 20 : continuity.averageRating >= 4.0 ? 10 : 0;
  const recentBonus = continuity.lastVisitWithinDays <= 30 ? 20 : 0;
  return clamp(30 + visitBonus + ratingBonus + recentBonus, 0, 100);
}

export function computeRiskPenalty(request: VisitRequest, recipient: CareRecipient, caregiver: CaregiverProfile): number {
  let penalty = 0;
  const caregiverSkillNames = caregiver.skills.map((skill) => skill.name);

  if (recipient.fallRisk && !caregiverSkillNames.includes('fall_risk_support')) penalty += 25;
  if (recipient.cognitiveStatus === 'dementia' && !caregiverSkillNames.includes('dementia_experience')) penalty += 30;
  if ((request.serviceType === 'transportation' || request.transportationRequired) && !caregiverSkillNames.includes('transportation')) penalty += 100;
  if (caregiver.completedVisitsCount < 3 && request.riskLevel === 'medium') penalty += 15;
  if (request.riskLevel === 'high' || request.riskLevel === 'blocked') penalty += 100;

  return penalty;
}

export function computeFairnessAdjustment(caregiver: CaregiverProfile): number {
  let adjustment = 0;
  if (caregiver.jobsOfferedLast7d > 20) adjustment += 5;
  if (caregiver.jobsAcceptedLast7d > 10) adjustment += 5;
  if (caregiver.completedVisitsCount < 3 && caregiver.approvalStatus === 'approved') adjustment -= 5;
  return adjustment;
}

export function buildMatchExplanation(input: {
  recipient: CareRecipient;
  caregiver: CaregiverProfile;
  finalScore: number;
  distanceScore: number;
  reliabilityScore: number;
  riskPenalty: number;
}): MatchExplanation {
  const positive: string[] = [];
  const negative: string[] = [];
  const riskFlags: string[] = [];

  if (input.recipient.cognitiveStatus === 'dementia' && input.caregiver.skills.some((skill) => skill.name === 'dementia_experience')) {
    positive.push('Has dementia experience');
  }
  if (input.caregiver.averageRating >= 4.8) positive.push(`Average family rating ${input.caregiver.averageRating.toFixed(1)}`);
  if (input.caregiver.completedVisitsCount > 0) positive.push(`Completed ${input.caregiver.completedVisitsCount} visits`);
  if (input.distanceScore < 85) negative.push('Travel time above 15 minutes');
  if (input.riskPenalty > 0) riskFlags.push('Risk penalties applied');

  return {
    summary: `CareFit ${input.finalScore.toFixed(1)} with reliability ${input.reliabilityScore.toFixed(1)} and explainable safety filters.`,
    positive_factors: positive,
    negative_factors: negative,
    risk_flags: riskFlags,
    admin_review_required: input.riskPenalty >= 100,
  };
}

export function computeCareFitScore(input: MatchInput): MatchScore {
  const skillScore = computeSkillScore(input.request, input.caregiver);
  const availabilityScore = computeAvailabilityScore(input.request, input.caregiver, input.availabilityCovered ?? true);
  const distanceScore = computeDistanceScore(input.travelMinutes);
  const reliabilityScore = computeReliabilityScore(input.caregiver);
  const preferenceScore = computePreferenceScore(input.request, input.recipient, input.family, input.caregiver);
  const continuityScore = computeContinuityScore(input.continuity ?? null);
  const riskPenalty = computeRiskPenalty(input.request, input.recipient, input.caregiver);
  const fairnessAdjustment = computeFairnessAdjustment(input.caregiver);

  const raw =
    0.3 * skillScore +
    0.2 * availabilityScore +
    0.15 * distanceScore +
    0.15 * reliabilityScore +
    0.1 * preferenceScore +
    0.1 * continuityScore -
    riskPenalty -
    fairnessAdjustment;

  const finalScore = clamp(raw, 0, 100);

  return {
    finalScore,
    components: {
      skillScore,
      availabilityScore,
      distanceScore,
      reliabilityScore,
      preferenceScore,
      continuityScore,
      riskPenalty,
      fairnessAdjustment,
    },
    explanation: buildMatchExplanation({
      recipient: input.recipient,
      caregiver: input.caregiver,
      finalScore,
      distanceScore,
      reliabilityScore,
      riskPenalty,
    }),
  };
}
