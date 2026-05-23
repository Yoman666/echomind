import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

let cachedConfig = null;

export function getConfig() {
  if (cachedConfig) {
    return cachedConfig;
  }

  cachedConfig = {
    port: Number(process.env.PORT) || 3000,
    line: {
      channelSecret: requireEnv('LINE_CHANNEL_SECRET'),
      channelAccessToken: requireEnv('LINE_CHANNEL_ACCESS_TOKEN'),
    },
    openai: {
      apiKey: requireEnv('OPENAI_API_KEY'),
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    },
    supabase: {
      url: requireEnv('SUPABASE_URL'),
      serviceRoleKey: requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    },
  };

  return cachedConfig;
}

export function getPort() {
  return Number(process.env.PORT) || 3000;
}
