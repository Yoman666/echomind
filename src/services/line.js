import { middleware, Client } from '@line/bot-sdk';
import { getConfig } from '../config.js';

let lineMiddleware;
let lineClient;

function ensureLine() {
  if (!lineMiddleware) {
    const config = getConfig();
    lineMiddleware = middleware({
      channelSecret: config.line.channelSecret,
    });
    lineClient = new Client({
      channelAccessToken: config.line.channelAccessToken,
    });
  }
}

export function getLineMiddleware() {
  ensureLine();
  return lineMiddleware;
}

export const SAVED_REPLY = 'saved successfully';

export async function replyText(replyToken, text) {
  ensureLine();
  await lineClient.replyMessage(replyToken, {
    type: 'text',
    text,
  });
}
