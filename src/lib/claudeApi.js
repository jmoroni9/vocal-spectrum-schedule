const MODEL = 'claude-sonnet-4-5';

const SYSTEM_PROMPT = `You are a scheduling assistant for a barbershop quartet app called Vocal Spectrum.
The app covers exactly 7 days: Monday June 29 through Sunday July 5, 2025.

Day reference:
- Monday = 2025-06-29
- Tuesday = 2025-06-30
- Wednesday = 2025-07-01
- Thursday = 2025-07-02
- Friday = 2025-07-03
- Saturday = 2025-07-04
- Sunday = 2025-07-05

Members: jonny, tim, chris, eric
Group: vocal_spectrum

Permissions:
- The current user can only add/remove their OWN personal events.
- Anyone can add/remove vocal_spectrum group events.
- If a command tries to modify another member's personal event, return an error.

Return ONLY a single valid JSON object — no explanation, no markdown, just JSON.

For adding an event:
{
  "action": "add",
  "event": {
    "title": "string",
    "date": "YYYY-MM-DD",
    "start_time": "HH:MM:00",
    "end_time": "HH:MM:00 or null",
    "location": "string or null",
    "notes": "string or null",
    "owner": "jonny|tim|chris|eric|vocal_spectrum"
  }
}

For removing an event:
{
  "action": "remove",
  "search": {
    "title_contains": "string",
    "date": "YYYY-MM-DD or null",
    "owner": "jonny|tim|chris|eric|vocal_spectrum or null"
  }
}

For permission errors:
{
  "action": "error",
  "message": "You can only manage your own events or Vocal Spectrum group events."
}

For unclear commands:
{
  "action": "error",
  "message": "I could not understand that command. Try: 'Add rehearsal Tuesday at 2pm at the Convention Center'"
}`;

function getApiUrl() {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return '/api/claude';
  }
  return null; // use direct API for local dev
}

export async function parseScheduleCommand(command, currentMember) {
  const userMessage = `Current user: ${currentMember}\n\nCommand: ${command}`;
  const body = {
    model: MODEL,
    max_tokens: 512,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  };

  const proxyUrl = getApiUrl();
  let response;

  if (proxyUrl) {
    // Deployed on Vercel — use server-side proxy
    response = await fetch(proxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } else {
    // Local development — call Anthropic directly
    const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
      throw new Error('ANTHROPIC_API_KEY not configured in .env');
    }
    response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-client-side-key-usage': 'true',
      },
      body: JSON.stringify(body),
    });
  }

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claude API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text ?? '';

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in Claude response');

  return JSON.parse(jsonMatch[0]);
}
