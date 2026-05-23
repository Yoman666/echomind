import { Router } from 'express';
import { lineMiddleware, replyText, SAVED_REPLY } from '../services/line.js';
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

router.post('/', lineMiddleware, async (req, res) => {
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
});

export default router;
