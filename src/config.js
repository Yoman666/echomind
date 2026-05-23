import dotenv from 'dotenv';

dotenv.config();

function env(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getPort() {
  return Number(process.env.PORT) || 3000;
}

export function getLineChannelSecret() {
  return env('LINE_CHANNEL_SECRET');
}

export function getLineChannelAccessToken() {
  return env('LINE_CHANNEL_ACCESS_TOKEN');
}

let cachedConfig = null;

export function getConfig() {
  if (cachedConfig) {
    return cachedConfig;
  }

  cachedConfig = {
    port: getPort(),
    line: {
      channelSecret: getLineChannelSecret(),
      channelAccessToken: getLineChannelAccessToken(),
    },
    openai: {
      apiKey: env('OPENAI_API_KEY'),
      model: process.env.OPENAI_MODEL?.trim() || 'gpt-4o-mini',
    },
    supabase: {
      url: env('SUPABASE_URL'),
      serviceRoleKey: env('SUPABASE_SERVICE_ROLE_KEY'),
    },
  };

  return cachedConfig;
}
