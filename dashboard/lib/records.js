import { getSupabase } from './supabase';

export const RECORD_TYPES = ['expense', 'mood', 'journal', 'learning'];

/**
 * @param {{ type?: string, limit?: number }} options
 */
export async function getRecords({ type, limit = 50 } = {}) {
  const supabase = getSupabase();

  let query = supabase
    .from('records')
    .select('id, user_id, type, title, content, tags, amount, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (type && RECORD_TYPES.includes(type)) {
    query = query.eq('type', type);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch records: ${error.message}`);
  }

  return data ?? [];
}
