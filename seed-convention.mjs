import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://gvprzcdzaxtawahkfhbu.supabase.co',
  'sb_publishable_XM6K04t33w-mOpzDDdeykg_FS5Xyx5w'
);

const events = [
  // ── Tuesday, June 30 ──
  {
    title: 'NextGen Varsity Quartet Contest',
    date: '2025-06-30',
    start_time: '17:00:00',
    end_time: '21:30:00',
    location: "America's Center Dome",
    notes: null,
    owner: 'vocal_spectrum',
  },

  // ── Wednesday, July 1 ──
  {
    title: 'Quartet Quarterfinals Session #1',
    date: '2025-07-01',
    start_time: '09:45:00',
    end_time: '15:00:00',
    location: "America's Center Dome",
    notes: null,
    owner: 'vocal_spectrum',
  },
  {
    title: 'Quartet Quarterfinals Session #2',
    date: '2025-07-01',
    start_time: '16:30:00',
    end_time: '22:00:00',
    location: "America's Center Dome",
    notes: null,
    owner: 'vocal_spectrum',
  },
  {
    title: 'Vocal Spectrum 20th Anniversary Party',
    date: '2025-07-01',
    start_time: '22:00:00',
    end_time: '23:59:00',
    location: 'Marriott - Majestic',
    notes: null,
    owner: 'vocal_spectrum',
  },

  // ── Thursday, July 2 ──
  {
    title: 'Gold Medal Hour - Lemon Squeezy',
    date: '2025-07-02',
    start_time: '10:00:00',
    end_time: '10:50:00',
    location: 'Marriott - Majestic',
    notes: null,
    owner: 'vocal_spectrum',
  },
  {
    title: 'Gold Medal Hour - Vocal Majority',
    date: '2025-07-02',
    start_time: '11:30:00',
    end_time: '12:30:00',
    location: 'Hilton - TBD',
    notes: null,
    owner: 'vocal_spectrum',
  },
  {
    title: 'Quartet Semifinals',
    date: '2025-07-02',
    start_time: '17:00:00',
    end_time: '21:30:00',
    location: "America's Center Dome",
    notes: null,
    owner: 'vocal_spectrum',
  },

  // ── Friday, July 3 ──
  {
    title: 'Chorus Contest Session #1',
    date: '2025-07-03',
    start_time: '09:45:00',
    end_time: '13:30:00',
    location: "America's Center Dome",
    notes: null,
    owner: 'vocal_spectrum',
  },
  {
    title: 'Chorus Contest Session #2',
    date: '2025-07-03',
    start_time: '14:45:00',
    end_time: '18:00:00',
    location: "America's Center Dome",
    notes: null,
    owner: 'vocal_spectrum',
  },

  // ── Saturday, July 4 ──
  {
    title: 'Chorus Contest Session #3',
    date: '2025-07-04',
    start_time: '09:45:00',
    end_time: '16:30:00',
    location: "America's Center Dome",
    notes: null,
    owner: 'vocal_spectrum',
  },
  {
    title: 'Quartet Finals & Finale',
    date: '2025-07-04',
    start_time: '17:45:00',
    end_time: '22:00:00',
    location: "America's Center Dome",
    notes: null,
    owner: 'vocal_spectrum',
  },
];

const { data, error } = await supabase.from('events').insert(events).select();
if (error) {
  console.error('❌ Error:', error.message);
} else {
  console.log(`✅ Inserted ${data.length} events successfully:`);
  data.forEach((e) => console.log(`  · [${e.owner}] ${e.title} — ${e.date} ${e.start_time}`));
}
