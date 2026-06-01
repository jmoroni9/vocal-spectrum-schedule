import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://gvprzcdzaxtawahkfhbu.supabase.co',
  'sb_publishable_XM6K04t33w-mOpzDDdeykg_FS5Xyx5w'
);

const events = [
  // AOH on stage → vocal_spectrum (shows on all calendars)
  {
    title: 'AOH On Stage (Sings 8th)',
    date: '2025-07-03',
    start_time: '12:22:00',
    end_time: null,
    location: "America's Center - Main Stage",
    notes: 'Leave room by 12:00 PM. Chorus Contest Session #1.',
    owner: 'vocal_spectrum',
  },

  // Recruits on stage → Jonny
  {
    title: 'Recruits On Stage (Sings 18th)',
    date: '2025-07-03',
    start_time: '17:09:00',
    end_time: null,
    location: "America's Center - Main Stage",
    notes: 'Chorus Contest Session #2.',
    owner: 'jonny',
  },

  // Recruits on stage → Eric
  {
    title: 'Recruits On Stage (Sings 18th)',
    date: '2025-07-03',
    start_time: '17:09:00',
    end_time: null,
    location: "America's Center - Main Stage",
    notes: 'Chorus Contest Session #2.',
    owner: 'eric',
  },
];

const { data, error } = await supabase.from('events').insert(events).select();
if (error) {
  console.error('❌ Error:', error.message);
} else {
  console.log(`✅ Inserted ${data.length} on-stage events:`);
  data.forEach((e) => console.log(`  · [${e.owner}] ${e.title} — ${e.date} ${e.start_time}`));
}
