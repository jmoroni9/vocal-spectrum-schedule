import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://gvprzcdzaxtawahkfhbu.supabase.co',
  'sb_publishable_XM6K04t33w-mOpzDDdeykg_FS5Xyx5w'
);

const events = [
  // ── AoH Rehearsals → vocal_spectrum (shows on ALL calendars) ──
  {
    title: 'AoH Rehearsal',
    date: '2025-07-03',
    start_time: '08:30:00',
    end_time: null,
    location: 'Riser Schedule - America\'s Center',
    notes: 'Check riser schedule for exact room',
    owner: 'vocal_spectrum',
  },
  {
    title: 'AoH Rehearsal',
    date: '2025-07-02',
    start_time: '17:00:00',
    end_time: null,
    location: 'Riser Schedule - America\'s Center',
    notes: 'Check riser schedule for exact room',
    owner: 'vocal_spectrum',
  },
  {
    title: 'AoH Rehearsal',
    date: '2025-07-01',
    start_time: '18:30:00',
    end_time: null,
    location: 'America\'s Center',
    notes: null,
    owner: 'vocal_spectrum',
  },

  // ── Recruits Rehearsals → Jonny ──
  {
    title: 'Recruits Rehearsal',
    date: '2025-07-03',
    start_time: '13:00:00',
    end_time: null,
    location: 'Riser Schedule - America\'s Center',
    notes: null,
    owner: 'jonny',
  },
  {
    title: 'Recruits Rehearsal',
    date: '2025-07-02',
    start_time: '21:30:00',
    end_time: null,
    location: 'Riser Schedule - America\'s Center',
    notes: null,
    owner: 'jonny',
  },

  // ── Recruits Rehearsals → Eric ──
  {
    title: 'Recruits Rehearsal',
    date: '2025-07-03',
    start_time: '13:00:00',
    end_time: null,
    location: 'Riser Schedule - America\'s Center',
    notes: null,
    owner: 'eric',
  },
  {
    title: 'Recruits Rehearsal',
    date: '2025-07-02',
    start_time: '21:30:00',
    end_time: null,
    location: 'Riser Schedule - America\'s Center',
    notes: null,
    owner: 'eric',
  },
];

const { data, error } = await supabase.from('events').insert(events).select();
if (error) {
  console.error('❌ Error:', error.message);
} else {
  console.log(`✅ Inserted ${data.length} events successfully:`);
  data.forEach((e) => console.log(`  · [${e.owner}] ${e.title} — ${e.date} ${e.start_time}`));
}
