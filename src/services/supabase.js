import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import { config } from '../config.js';
import { validateClassification } from '../lib/classification.js';

const supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
  realtime: { transport: ws },
});

export { validateClassification };

export async function saveEntry({ lineUserId, classification }) {
  const validated = validateClassification(classification);

  const { data, error } = await supabase
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
