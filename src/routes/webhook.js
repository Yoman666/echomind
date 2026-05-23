import { Router } from 'express';
import { getLineMiddleware, replyText, SAVED_REPLY } from '../services/line.js';
import { classifyText } from '../services/openai.js';
import { saveEntry } from '../services/supabase.js';

const router = Router();

function lineErrorMessage(error) {
  const message = error instanceof Error ? error.message : '';

  if (message.includes('insufficient_quota') || message.includes('quota')) {
    return 'OpenAI 額度不足，請到 platform.openai.com 加值或檢查帳單後再試。';
  }
  if (message.startsWith('API_ERROR:')) {
    return 'AI 分類失敗，請稍後再試。';
  }
  if (message.startsWith('VALIDATION_ERROR:')) {
    return '訊息格式無法分類，請換個方式描述再試。';
  }

  return '儲存失敗，請稍後再試。';
}

async function handleTextMessage(event) {
  const userMessage = event.message.text;
  const lineUserId = event.source.userId;

  if (!lineUserId) {
    return;
  }

  const result = await classifyText(userMessage);
  if (!result.ok) {
    throw new Error(`${result.error.code}: ${result.error.message}`);
  }

  await saveEntry({
    lineUserId,
    classification: result.data,
  });

  await replyText(event.replyToken, SAVED_REPLY);
}

function lineSignatureMiddleware(req, res, next) {
  try {
    return getLineMiddleware()(req, res, next);
  } catch (error) {
    console.error('LINE middleware config error:', error);
    return res.status(503).json({
      error: 'Missing LINE_CHANNEL_SECRET',
      hint: 'Render → Environment → add LINE_CHANNEL_SECRET from LINE Console → Basic settings → Channel secret',
    });
  }
}

router.post('/', lineSignatureMiddleware, async (req, res) => {
  try {
    const events = req.body.events ?? [];
    console.log(`[webhook] received ${events.length} event(s)`);

    await Promise.all(
      events.map(async (event) => {
        if (event.type !== 'message' || event.message.type !== 'text') {
          return;
        }

        try {
          console.log('[webhook] text message:', event.message?.text);
          await handleTextMessage(event);
          console.log('[webhook] saved successfully');
        } catch (error) {
          console.error('Webhook handler error:', error);

          if (event.replyToken) {
            await replyText(event.replyToken, lineErrorMessage(error));
          }
        }
      })
    );

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook route error:', error);
    if (!res.headersSent) {
      res.status(500).send('Webhook handler failed');
    }
  }
});

router.use((err, req, res, _next) => {
  console.error('LINE signature / webhook error:', err?.message || err);

  if (!res.headersSent) {
    const isSignature =
      err?.message?.includes('signature') ||
      err?.status === 401 ||
      err?.statusCode === 401;

    if (isSignature) {
      res
        .status(401)
        .send('Invalid LINE signature — check LINE_CHANNEL_SECRET on Render');
      return;
    }

    res.status(500).send('Internal webhook error');
  }
});

export default router;
