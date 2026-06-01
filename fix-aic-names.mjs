import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://gvprzcdzaxtawahkfhbu.supabase.co',
  'sb_publishable_XM6K04t33w-mOpzDDdeykg_FS5Xyx5w'
);

const renames = [
  { from: 'Stifel Theater – Stage Door Opens', to: 'AIC Stage Door Opens' },
  { from: 'Box Dinners',                        to: 'AIC Box Dinners' },
  { from: 'Chorus Call (Backstage)',             to: 'AIC Chorus Call (Backstage)' },
  { from: '🎭 Show Time!',                      to: 'AIC Show Time!' },
  { from: 'Afterglow',                           to: 'AIC Afterglow' },
  { from: 'New Champs Reception',                to: 'AIC New Champs Reception' },
  { from: 'Quartet Sound Checks',                to: 'AIC Quartet Sound Checks' },
];

for (const { from, to } of renames) {
  const { data, error } = await supabase
    .from('events')
    .update({ title: to })
    .eq('title', from)
    .select();

  if (error) {
    console.error(`❌ Failed "${from}": ${error.message}`);
  } else {
    console.log(`✅ "${from}" → "${to}" (${data.length} row${data.length !== 1 ? 's' : ''} updated)`);
  }
}
