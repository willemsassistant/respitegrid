export * from './schemas';

export type UserRole = 'family' | 'caregiver' | 'admin';

export type BookingStatus =
  | 'DRAFT'
  | 'REQUESTED'
  | 'MATCHING'
  | 'OFFERED'
  | 'ACCEPTED_BY_CAREGIVER'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED_PENDING_REVIEW'
  | 'COMPLETED'
  | 'CANCELLED_BY_FAMILY'
  | 'CANCELLED_BY_CAREGIVER'
  | 'CANCELLED_BY_ADMIN'
  | 'NEEDS_BACKUP'
  | 'INCIDENT_REPORTED'
  | 'REFUNDED';

export type RiskLevel = 'low' | 'medium' | 'high' | 'blocked';

export type ServiceType =
  | 'companionship'
  | 'meal_prep'
  | 'light_housekeeping'
  | 'transportation'
  | 'dementia_supervision'
  | 'mobility_standby'
  | 'respite_sitting'
  | 'check_in_visit'
  | 'overnight';

export type CaregiverSkill =
  | 'companionship'
  | 'meal_prep'
  | 'light_housekeeping'
  | 'transportation'
  | 'dementia_experience'
  | 'mobility_standby'
  | 'fall_risk_support'
  | 'spanish_language'
  | 'pet_friendly'
  | 'overnight_available';

export type CognitiveStatus =
  | 'none'
  | 'mild_memory_loss'
  | 'dementia'
  | 'other';
export type MobilityLevel =
  | 'independent'
  | 'cane'
  | 'walker'
  | 'wheelchair'
  | 'bedbound';
export type ApprovalStatus =
  | 'draft'
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'suspended';
export type VerificationStatus =
  | 'not_started'
  | 'pending'
  | 'verified'
  | 'failed';
export type BackgroundStatus =
  | 'not_started'
  | 'pending'
  | 'clear'
  | 'review_required'
  | 'failed';

export interface FamilyProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  relationshipToRecipient?: string;
  completedBookingsCount: number;
  preferredContactMethod: 'sms' | 'email' | 'phone';
  favoriteCaregiverIds?: string[];
}

export interface CareRecipient {
  id: string;
  familyProfileId: string;
  firstName: string;
  preferredLanguage?: string;
  petPresent: boolean;
  fallRisk: boolean;
  mobilityLevel: MobilityLevel;
  cognitiveStatus: CognitiveStatus;
}

export interface SkillRecord {
  name: CaregiverSkill;
  verified: boolean;
}

export interface CaregiverProfile {
  id: string;
  userId: string;
  displayName: string;
  approvalStatus: ApprovalStatus;
  identityStatus: VerificationStatus;
  backgroundStatus: BackgroundStatus;
  hourlyRateCents: number;
  maxTravelMiles: number;
  skills: SkillRecord[];
  languages: string[];
  averageRating: number;
  completedVisitsCount: number;
  cancellationRate: number;
  lateRate: number;
  noShowCountLast90d: number;
  highSeverityIncidentCountLast180d: number;
  jobsOfferedLast7d: number;
  jobsAcceptedLast7d: number;
  medianOfferResponseMinutes: number;
  openOffersLast24h: number;
  blockedFamilyIds?: string[];
}

export interface VisitRequest {
  id: string;
  familyProfileId: string;
  careRecipientId: string;
  requestedStartAt: string;
  requestedEndAt: string;
  serviceType: ServiceType;
  requiredSkills: CaregiverSkill[];
  preferredSkills?: CaregiverSkill[];
  preferredLanguage?: string;
  maxBudgetCents: number;
  notes?: string;
  transportationRequired?: boolean;
  riskLevel?: RiskLevel;
}

export interface VisitRiskResult {
  score: number;
  level: RiskLevel;
  flags: string[];
  manualReviewRequired: boolean;
}

export interface MatchExplanation {
  summary: string;
  positive_factors: string[];
  negative_factors: string[];
  risk_flags: string[];
  admin_review_required: boolean;
}

export interface MatchScore {
  finalScore: number;
  components: {
    skillScore: number;
    availabilityScore: number;
    distanceScore: number;
    reliabilityScore: number;
    preferenceScore: number;
    continuityScore: number;
    riskPenalty: number;
    fairnessAdjustment: number;
  };
  explanation: MatchExplanation;
}
