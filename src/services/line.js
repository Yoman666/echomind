import { middleware, Client } from '@line/bot-sdk';
import { config } from '../config.js';

export const lineMiddleware = middleware({
  channelSecret: config.line.channelSecret,
});

export const lineClient = new Client({
  channelAccessToken: config.line.channelAccessToken,
});

export const SAVED_REPLY = 'saved successfully';

export async function replyText(replyToken, text) {
  await lineClient.replyMessage(replyToken, {
    type: 'text',
    text,
  });
}
