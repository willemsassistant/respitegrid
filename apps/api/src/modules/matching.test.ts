import { describe, expect, it } from 'vitest';
import {
  CareRecipient,
  CaregiverProfile,
  FamilyProfile,
  VisitRequest,
} from '@respitegrid/types';
import { computeCareFitScore, computeDistanceScore } from './matching';
import { computeVisitRisk } from './risk';

const family: FamilyProfile = {
  id: 'family-1',
  userId: 'user-1',
  firstName: 'Ava',
  lastName: 'Stone',
  completedBookingsCount: 0,
  preferredContactMethod: 'sms',
  favoriteCaregiverIds: [],
};

const recipient: CareRecipient = {
  id: 'recipient-1',
  familyProfileId: 'family-1',
  firstName: 'Eleanor',
  preferredLanguage: 'Spanish',
  petPresent: true,
  fallRisk: true,
  mobilityLevel: 'walker',
  cognitiveStatus: 'dementia',
};

const request: VisitRequest = {
  id: 'visit-1',
  familyProfileId: 'family-1',
  careRecipientId: 'recipient-1',
  requestedStartAt: '2026-07-10T18:00:00-04:00',
  requestedEndAt: '2026-07-10T21:00:00-04:00',
  serviceType: 'companionship',
  requiredSkills: ['dementia_experience'],
  preferredSkills: ['pet_friendly'],
  preferredLanguage: 'Spanish',
  maxBudgetCents: 9000,
  notes: 'Please help with dinner and keep her company.',
  riskLevel: 'medium',
};

const caregiver: CaregiverProfile = {
  id: 'caregiver-1',
  userId: 'user-2',
  displayName: 'Maria',
  approvalStatus: 'approved',
  identityStatus: 'verified',
  backgroundStatus: 'clear',
  hourlyRateCents: 3000,
  maxTravelMiles: 10,
  skills: [
    { name: 'dementia_experience', verified: true },
    { name: 'pet_friendly', verified: true },
    { name: 'fall_risk_support', verified: true },
  ],
  languages: ['English', 'Spanish'],
  averageRating: 4.9,
  completedVisitsCount: 27,
  cancellationRate: 0.02,
  lateRate: 0.01,
  noShowCountLast90d: 0,
  highSeverityIncidentCountLast180d: 0,
  jobsOfferedLast7d: 4,
  jobsAcceptedLast7d: 3,
  medianOfferResponseMinutes: 12,
  openOffersLast24h: 0,
};

describe('risk and matching foundation', () => {
  it('computes transportation and restricted-term risk correctly', () => {
    const risk = computeVisitRisk(
      {
        ...request,
        serviceType: 'transportation',
        notes: 'Needs oxygen support and a ride',
      },
      recipient,
      family,
      new Date('2026-07-10T08:00:00-04:00'),
    );

    expect(risk.level).toBe('blocked');
    expect(risk.flags).toContain('transportation');
    expect(
      risk.flags.some((flag) => flag.startsWith('restricted:oxygen')),
    ).toBe(true);
  });

  it('ranks a strong caregiver highly', () => {
    const score = computeCareFitScore({
      request,
      recipient,
      family,
      caregiver,
      travelMinutes: 18,
      continuity: {
        completedVisits: 2,
        averageRating: 5,
        lastVisitWithinDays: 14,
      },
      availabilityCovered: true,
    });

    expect(score.finalScore).toBeGreaterThan(80);
    expect(score.explanation.positive_factors).toContain(
      'Has dementia experience',
    );
  });

  it('applies major penalties when caregiver lacks dementia support', () => {
    const score = computeCareFitScore({
      request,
      recipient,
      family,
      caregiver: {
        ...caregiver,
        skills: caregiver.skills.filter(
          (skill) => skill.name !== 'dementia_experience',
        ),
        completedVisitsCount: 1,
      },
      travelMinutes: 10,
    });

    expect(score.components.riskPenalty).toBeGreaterThanOrEqual(45);
  });

  it('scores travel time reasonably', () => {
    expect(computeDistanceScore(8)).toBe(100);
    expect(computeDistanceScore(35)).toBe(45);
    expect(computeDistanceScore(75)).toBe(0);
  });
});
