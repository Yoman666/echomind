import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import { getConfig } from '../config.js';
import { validateClassification } from '../lib/classification.js';

let supabase;

function ensureSupabase() {
  if (!supabase) {
    const config = getConfig();
    supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
      realtime: { transport: ws },
    });
  }
  return supabase;
}

export { validateClassification };

export async function saveEntry({ lineUserId, classification }) {
  const validated = validateClassification(classification);
  const client = ensureSupabase();

  const { data, error } = await client
    .from('records')
    .insert({
      user_id: lineUserId,
      type: validated.type,
      title: validated.title,
      content: validated.content,
      tags: validated.tags,
      amount: validated.amount,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Supabase insert failed: ${error.message}`);
  }

  return data;
}
