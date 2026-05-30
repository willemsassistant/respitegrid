import Fastify from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import { parseRegistration, requireRole } from './modules/auth';
import {
  caregiverApprovalReadiness,
  parseCareRecipient,
  parseCaregiverProfile,
  parseFamilyProfile,
  parseVisitRequest,
  previewVisitRisk,
} from './modules/intake';

const app = Fastify({ logger: true });

await app.register(cors, { origin: true, credentials: true });
await app.register(sensible);

app.get('/health', async () => ({ status: 'ok', service: 'respitegrid-api' }));
app.get('/api/meta', async () => ({
  name: 'RespiteGrid API',
  mode: 'foundation',
  modules: ['auth', 'families', 'caregivers', 'matching', 'risk', 'admin'],
}));

app.post('/api/auth/register', async (request) => {
  return { ok: true, user: parseRegistration(request.body) };
});

app.post('/api/family/profile/preview', async (request) => ({
  ok: true,
  data: parseFamilyProfile(request.body),
}));
app.post('/api/family/recipients/preview', async (request) => ({
  ok: true,
  data: parseCareRecipient(request.body),
}));
app.post('/api/caregiver/profile/preview', async (request) => {
  const caregiver = parseCaregiverProfile(request.body);
  return {
    ok: true,
    data: caregiver,
    approvalReadiness: caregiverApprovalReadiness({
      id: 'preview',
      userId: 'preview',
      approvalStatus: 'pending_review',
      identityStatus: 'not_started',
      backgroundStatus: 'not_started',
      averageRating: 0,
      cancellationRate: 0,
      completedVisitsCount: 0,
      highSeverityIncidentCountLast180d: 0,
      jobsAcceptedLast7d: 0,
      jobsOfferedLast7d: 0,
      lateRate: 0,
      maxTravelMiles: caregiver.maxTravelMiles,
      medianOfferResponseMinutes: 999,
      noShowCountLast90d: 0,
      openOffersLast24h: 0,
      hourlyRateCents: caregiver.hourlyRateCents,
      displayName: caregiver.displayName,
      languages: caregiver.languages,
      skills: caregiver.skills.map((name) => ({ name, verified: false })),
    }),
  };
});

app.post('/api/visit-requests/preview', async (request) => {
  const body = (request.body ?? {}) as Record<string, unknown>;
  const visitRequest = parseVisitRequest(body);
  const recipient = parseCareRecipient(body.recipient);
  const family = parseFamilyProfile(body.family);

  return {
    ok: true,
    request: visitRequest,
    risk: previewVisitRisk(
      {
        id: 'preview',
        familyProfileId: 'family-preview',
        ...visitRequest,
      },
      {
        id: 'recipient-preview',
        familyProfileId: 'family-preview',
        firstName: recipient.firstName,
        preferredLanguage: recipient.preferredLanguage,
        petPresent: recipient.petPresent,
        fallRisk: recipient.fallRisk,
        mobilityLevel: recipient.mobilityLevel,
        cognitiveStatus: recipient.cognitiveStatus,
      },
      {
        id: 'family-preview',
        userId: 'user-preview',
        firstName: family.firstName,
        lastName: family.lastName,
        relationshipToRecipient: family.relationshipToRecipient,
        completedBookingsCount: 0,
        preferredContactMethod: family.preferredContactMethod,
      },
    ),
  };
});

app.get(
  '/api/admin/queue',
  { preHandler: requireRole(['admin']) },
  async () => ({
    caregiverApprovals: 0,
    highRiskVisits: 0,
    bookingsNeedingBackup: 0,
  }),
);

const port = Number(process.env.PORT ?? 4001);
const host = process.env.HOST ?? '0.0.0.0';

app.listen({ port, host }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
