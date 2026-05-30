import {
  availabilityBlockSchema,
  careRecipientSchema,
  caregiverProfileSchema,
  familyProfileSchema,
  visitRequestSchema,
} from '@respitegrid/types';
import { computeVisitRisk } from './risk';
import {
  CareRecipient,
  CaregiverProfile,
  FamilyProfile,
  VisitRequest,
} from '@respitegrid/types';

export function parseFamilyProfile(input: unknown) {
  return familyProfileSchema.parse(input);
}

export function parseCareRecipient(input: unknown) {
  return careRecipientSchema.parse(input);
}

export function parseCaregiverProfile(input: unknown) {
  return caregiverProfileSchema.parse(input);
}

export function parseAvailabilityBlock(input: unknown) {
  return availabilityBlockSchema.parse(input);
}

export function parseVisitRequest(input: unknown) {
  return visitRequestSchema.parse(input);
}

export function previewVisitRisk(
  request: VisitRequest,
  recipient: CareRecipient,
  family: FamilyProfile,
) {
  return computeVisitRisk(request, recipient, family);
}

export function caregiverApprovalReadiness(caregiver: CaregiverProfile) {
  const missing = [] as string[];
  if (!caregiver.displayName) missing.push('displayName');
  if (!caregiver.languages.length) missing.push('languages');
  if (!caregiver.skills.length) missing.push('skills');
  if (caregiver.identityStatus !== 'verified')
    missing.push('identity_verification');
  if (caregiver.backgroundStatus !== 'clear') missing.push('background_check');

  return {
    ready: missing.length === 0,
    missing,
  };
}
