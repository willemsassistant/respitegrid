import Fastify from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';

const app = Fastify({ logger: true });

await app.register(cors, { origin: true, credentials: true });
await app.register(sensible);

app.get('/health', async () => ({ status: 'ok', service: 'respitegrid-api' }));
app.get('/api/meta', async () => ({
  name: 'RespiteGrid API',
  mode: 'foundation',
  modules: ['auth', 'families', 'caregivers', 'matching', 'risk', 'admin'],
}));

const port = Number(process.env.PORT ?? 4001);
const host = process.env.HOST ?? '0.0.0.0';

app.listen({ port, host }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
