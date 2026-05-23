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
