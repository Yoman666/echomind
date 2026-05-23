import express from 'express';
import { config } from './config.js';
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

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});
