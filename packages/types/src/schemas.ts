import { z } from 'zod';

export const userRoleSchema = z.enum(['family', 'caregiver', 'admin']);
export const preferredContactMethodSchema = z.enum(['sms', 'email', 'phone']);
export const cognitiveStatusSchema = z.enum([
  'none',
  'mild_memory_loss',
  'dementia',
  'other',
]);
export const mobilityLevelSchema = z.enum([
  'independent',
  'cane',
  'walker',
  'wheelchair',
  'bedbound',
]);
export const serviceTypeSchema = z.enum([
  'companionship',
  'meal_prep',
  'light_housekeeping',
  'transportation',
  'dementia_supervision',
  'mobility_standby',
  'respite_sitting',
  'check_in_visit',
  'overnight',
]);
export const caregiverSkillSchema = z.enum([
  'companionship',
  'meal_prep',
  'light_housekeeping',
  'transportation',
  'dementia_experience',
  'mobility_standby',
  'fall_risk_support',
  'spanish_language',
  'pet_friendly',
  'overnight_available',
]);

export const registerUserSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(10).max(20).optional(),
  password: z.string().min(12),
  role: userRoleSchema,
});

export const familyProfileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  relationshipToRecipient: z.string().min(1).optional(),
  preferredContactMethod: preferredContactMethodSchema.default('sms'),
  referralSource: z.string().max(120).optional(),
});

export const careRecipientSchema = z.object({
  firstName: z.string().min(1),
  ageRange: z.enum(['under_60', '60_69', '70_79', '80_89', '90_plus']),
  addressLine1: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(2).max(2),
  postalCode: z.string().min(5).max(10),
  mobilityLevel: mobilityLevelSchema,
  cognitiveStatus: cognitiveStatusSchema,
  preferredLanguage: z.string().default('English'),
  petPresent: z.boolean().default(false),
  fallRisk: z.boolean().default(false),
  emergencyContactName: z.string().min(1),
  emergencyContactPhone: z.string().min(10).max(20),
  accessInstructions: z.string().max(1000).optional(),
});

export const caregiverProfileSchema = z.object({
  displayName: z.string().min(1),
  bio: z.string().max(2000).optional(),
  homePostalCode: z.string().min(5).max(10),
  maxTravelMiles: z.number().int().min(1).max(100).default(10),
  hourlyRateCents: z.number().int().min(1500).max(20000),
  languages: z.array(z.string()).min(1),
  skills: z.array(caregiverSkillSchema).min(1),
});

export const availabilityBlockSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  timezone: z.string().default('America/New_York'),
});

export const visitRequestSchema = z.object({
  careRecipientId: z.string().uuid().or(z.string().min(1)),
  requestedStartAt: z.string().datetime(),
  requestedEndAt: z.string().datetime(),
  serviceType: serviceTypeSchema,
  requiredSkills: z.array(caregiverSkillSchema).default([]),
  preferredSkills: z.array(caregiverSkillSchema).default([]),
  preferredLanguage: z.string().optional(),
  maxBudgetCents: z.number().int().min(1000),
  transportationRequired: z.boolean().default(false),
  notes: z.string().max(2000).optional(),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type FamilyProfileInput = z.infer<typeof familyProfileSchema>;
export type CareRecipientInput = z.infer<typeof careRecipientSchema>;
export type CaregiverProfileInput = z.infer<typeof caregiverProfileSchema>;
export type AvailabilityBlockInput = z.infer<typeof availabilityBlockSchema>;
export type VisitRequestInput = z.infer<typeof visitRequestSchema>;
