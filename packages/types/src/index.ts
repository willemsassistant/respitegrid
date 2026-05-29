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
