import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

export async function fetchEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) throw error;
  return data;
}

export async function addEvent(event) {
  const { data, error } = await supabase
    .from('events')
    .insert([event])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateEvent(id, updates) {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteEventById(id) {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function findAndDeleteEvent(search) {
  let query = supabase.from('events').select('id, title, owner, date');

  if (search.owner) query = query.eq('owner', search.owner);
  if (search.date) query = query.eq('date', search.date);

  const { data, error } = await query;
  if (error) throw error;

  if (!data || data.length === 0) return null;

  let match = data;
  if (search.title_contains) {
    const needle = search.title_contains.toLowerCase();
    match = data.filter((e) => e.title.toLowerCase().includes(needle));
  }

  if (match.length === 0) return null;

  // Delete the closest match (first)
  const target = match[0];
  await deleteEventById(target.id);
  return target;
}

export function subscribeToEvents(callback) {
  const channel = supabase
    .channel('events-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'events' },
      () => callback()
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}
