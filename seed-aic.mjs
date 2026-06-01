import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://gvprzcdzaxtawahkfhbu.supabase.co',
  'sb_publishable_XM6K04t33w-mOpzDDdeykg_FS5Xyx5w'
);

const events = [
  // ── TUE Jun 30 ──
  {
    title: 'AIC Chorus Rehearsal',
    date: '2025-06-30',
    start_time: '15:00:00',
    end_time: '18:00:00',
    location: 'Embassy Suites – Laurel Ballroom',
    notes: null,
    owner: 'vocal_spectrum',
  },
  {
    title: 'AIC Hospitality Suite Opens',
    date: '2025-06-30',
    start_time: '20:00:00',
    end_time: null,
    location: 'Embassy Suites – Room TBD',
    notes: 'Nightly thereafter beginning at 9:30 PM',
    owner: 'vocal_spectrum',
  },

  // ── WED Jul 1 ──
  {
    title: 'AIC Chorus Rehearsal',
    date: '2025-07-01',
    start_time: '19:00:00',
    end_time: '20:30:00',
    location: 'Embassy Suites – Laurel Ballroom',
    notes: null,
    owner: 'vocal_spectrum',
  },

  // ── THU Jul 2 ──
  {
    title: 'AIC Celebration Luncheon',
    date: '2025-07-02',
    start_time: '11:30:00',
    end_time: '13:00:00',
    location: 'Embassy Suites – Laurel Ballroom',
    notes: null,
    owner: 'vocal_spectrum',
  },
  {
    title: "AIC Significant's Luncheon",
    date: '2025-07-02',
    start_time: '11:30:00',
    end_time: '13:00:00',
    location: 'Embassy Suites – Mercantile Room',
    notes: null,
    owner: 'vocal_spectrum',
  },
  {
    title: 'AIC ON STAGE Rehearsal',
    date: '2025-07-02',
    start_time: '14:00:00',
    end_time: '17:00:00',
    location: 'Stifel Theater',
    notes: null,
    owner: 'vocal_spectrum',
  },
  {
    title: 'Quartet Sound Checks',
    date: '2025-07-02',
    start_time: '17:00:00',
    end_time: '18:00:00',
    location: 'ON STAGE – Stifel Theater',
    notes: null,
    owner: 'vocal_spectrum',
  },
  {
    title: 'AIC Hospitality',
    date: '2025-07-02',
    start_time: '21:30:00',
    end_time: null,
    location: 'Embassy Suites – Mercantile Room',
    notes: null,
    owner: 'vocal_spectrum',
  },

  // ── FRI Jul 3 ──
  {
    title: 'Stifel Theater – Stage Door Opens',
    date: '2025-07-03',
    start_time: '16:00:00',
    end_time: null,
    location: 'Stifel Theater',
    notes: null,
    owner: 'vocal_spectrum',
  },
  {
    title: 'AIC Chorus ON STAGE',
    date: '2025-07-03',
    start_time: '16:30:00',
    end_time: '17:30:00',
    location: 'ON STAGE – Stifel Theater',
    notes: null,
    owner: 'vocal_spectrum',
  },
  {
    title: 'Box Dinners',
    date: '2025-07-03',
    start_time: '17:30:00',
    end_time: '18:30:00',
    location: 'Room TBD',
    notes: null,
    owner: 'vocal_spectrum',
  },
  {
    title: 'Chorus Call (Backstage)',
    date: '2025-07-03',
    start_time: '19:00:00',
    end_time: null,
    location: 'Stifel Theater – Backstage',
    notes: null,
    owner: 'vocal_spectrum',
  },
  {
    title: '🎭 Show Time!',
    date: '2025-07-03',
    start_time: '19:30:00',
    end_time: null,
    location: 'Stifel Theater',
    notes: null,
    owner: 'vocal_spectrum',
  },
  {
    title: 'Afterglow',
    date: '2025-07-03',
    start_time: '22:30:00',
    end_time: null,
    location: 'Blues Museum – next to Embassy Suites',
    notes: null,
    owner: 'vocal_spectrum',
  },
  {
    title: 'More AIC Hospitality',
    date: '2025-07-04',
    start_time: '00:00:00',
    end_time: null,
    location: 'Embassy Suites – Mercantile Room',
    notes: 'Friday night into Saturday morning',
    owner: 'vocal_spectrum',
  },

  // ── SAT Jul 4 ──
  {
    title: 'New Champs Reception',
    date: '2025-07-04',
    start_time: '22:00:00',
    end_time: '23:30:00',
    location: 'St. Louis Convention Center – Rooms 220 & 221',
    notes: null,
    owner: 'vocal_spectrum',
  },
  {
    title: 'More AIC Hospitality',
    date: '2025-07-05',
    start_time: '00:00:00',
    end_time: null,
    location: 'Embassy Suites – Mercantile Room',
    notes: 'Saturday night into Sunday morning',
    owner: 'vocal_spectrum',
  },
];

const { data, error } = await supabase.from('events').insert(events).select();
if (error) {
  console.error('❌ Error:', error.message);
} else {
  console.log(`✅ Inserted ${data.length} AIC events:`);
  data.forEach((e) => console.log(`  · ${e.date} ${e.start_time} — ${e.title}`));
}
