export const COLORS = {
  background: '#0d1b2a',
  surface: '#152536',
  surfaceAlt: '#1c3049',
  border: '#243d57',
  text: '#ffffff',
  textMuted: '#8aa4bf',
  jonny: '#3b82f6',
  tim: '#22c55e',
  chris: '#f97316',
  eric: '#a855f7',
  vocal_spectrum: '#D4A017',
  inputBg: '#1c3049',
};

export const MEMBERS = [
  { id: 'jonny', label: 'Jonny', color: COLORS.jonny },
  { id: 'tim', label: 'Tim', color: COLORS.tim },
  { id: 'chris', label: 'Chris', color: COLORS.chris },
  { id: 'eric', label: 'Eric', color: COLORS.eric },
];

export const TABS = [
  { id: 'vocal_spectrum', label: 'Vocal Spectrum', color: COLORS.vocal_spectrum },
  { id: 'jonny', label: 'Jonny', color: COLORS.jonny },
  { id: 'tim', label: 'Tim', color: COLORS.tim },
  { id: 'chris', label: 'Chris', color: COLORS.chris },
  { id: 'eric', label: 'Eric', color: COLORS.eric },
];

// June 29 – July 5, 2025
export const WEEK_DAYS = [
  { date: '2025-06-29', dayName: 'Mon', dayNum: 29, month: 'Jun' },
  { date: '2025-06-30', dayName: 'Tue', dayNum: 30, month: 'Jun' },
  { date: '2025-07-01', dayName: 'Wed', dayNum: 1, month: 'Jul' },
  { date: '2025-07-02', dayName: 'Thu', dayNum: 2, month: 'Jul' },
  { date: '2025-07-03', dayName: 'Fri', dayNum: 3, month: 'Jul' },
  { date: '2025-07-04', dayName: 'Sat', dayNum: 4, month: 'Jul' },
  { date: '2025-07-05', dayName: 'Sun', dayNum: 5, month: 'Jul' },
];

export const getMemberColor = (owner) => COLORS[owner] || COLORS.textMuted;

export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${suffix}`;
};
