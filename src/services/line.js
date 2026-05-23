import { middleware, Client } from '@line/bot-sdk';
import { getLineChannelAccessToken, getLineChannelSecret } from '../config.js';

let lineMiddleware;
let lineClient;

function ensureLineMiddleware() {
  if (!lineMiddleware) {
    lineMiddleware = middleware({
      channelSecret: getLineChannelSecret(),
    });
  }
  return lineMiddleware;
}

function ensureLineClient() {
  if (!lineClient) {
    lineClient = new Client({
      channelAccessToken: getLineChannelAccessToken(),
    });
  }
  return lineClient;
}

export function getLineMiddleware() {
  return ensureLineMiddleware();
}

export const SAVED_REPLY = 'saved successfully';

export async function replyText(replyToken, text) {
  await ensureLineClient().replyMessage(replyToken, {
    type: 'text',
    text,
  });
}
