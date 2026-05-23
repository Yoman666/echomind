import express from 'express';
import { getPort } from './config.js';
import webhookRouter from './routes/webhook.js';

const app = express();

app.get('/', (_req, res) => {
  res.json({
    name: 'EchoMind API',
    status: 'running',
    endpoints: {
      health: 'GET /health',
      webhook: 'POST /webhook (LINE must use this path)',
    },
    lineWebhookUrl: 'https://YOUR-RENDER-URL.onrender.com/webhook',
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const REQUIRED_ENV = [
  'LINE_CHANNEL_SECRET',
  'LINE_CHANNEL_ACCESS_TOKEN',
  'OPENAI_API_KEY',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
];

app.get('/config-status', (_req, res) => {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]?.trim());
  const configured = REQUIRED_ENV.filter((key) => process.env[key]?.trim());

  res.status(missing.length === 0 ? 200 : 503).json({
    ok: missing.length === 0,
    configured,
    missing,
    hint:
      missing.length > 0
        ? 'Add missing keys in Render → echomind-api → Environment → Save → Manual Deploy'
        : 'All required environment variables are set',
  });
});

app.use('/webhook', webhookRouter);
// Also accept POST / when LINE webhook URL omits /webhook
app.post('/', webhookRouter);

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const port = getPort();

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  const missing = [
    'LINE_CHANNEL_SECRET',
    'LINE_CHANNEL_ACCESS_TOKEN',
    'OPENAI_API_KEY',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
  ].filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.warn(
      `[warn] Missing env vars (webhook will fail until set): ${missing.join(', ')}`
    );
  }
});
