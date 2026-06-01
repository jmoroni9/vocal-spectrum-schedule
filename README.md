# Vocal Spectrum Scheduler

A React Native mobile app built with Expo for the Vocal Spectrum barbershop quartet. Covers the convention week of **June 29 – July 5, 2025**.

---

## Features

- **Member selection** — tap your name on launch (Jonny, Tim, Chris, Eric)
- **5-tab calendar** — Vocal Spectrum group tab + one tab per member
- **7-day daily view** — scrollable day strip, events color-coded by owner
- **AI prompt bar** — natural-language event creation/removal via Claude
- **Real-time sync** — Supabase Realtime keeps all 4 phones in sync instantly

---

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — `npm install -g expo-cli`
- **Expo Go** app installed on your phone (iOS or Android)
- An **Anthropic API key** — get one at [console.anthropic.com](https://console.anthropic.com)

---

## Setup

### 1. Install dependencies

```bash
cd Vocal-Spectrum-Schedule
npm install
```

### 2. Add your Anthropic API key

Open `.env` and replace the placeholder:

```env
EXPO_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

The Supabase credentials are already filled in — no changes needed there.

### 3. Start the development server

```bash
npx expo start
```

This prints a QR code in your terminal.

---

## Running on your phone

### iOS
1. Open the **Camera** app and point it at the QR code.
2. Tap the banner that appears — Expo Go opens automatically.

### Android
1. Open the **Expo Go** app.
2. Tap **Scan QR code** and scan the terminal QR code.

Both phones will hot-reload as you make changes.

---

## Running on a simulator / emulator

### iOS Simulator (Mac only)
```bash
npx expo start --ios
```
Requires Xcode installed.

### Android Emulator
```bash
npx expo start --android
```
Requires Android Studio with a virtual device configured.

---

## Building a standalone app (optional)

To produce an `.ipa` / `.apk` for distribution without Expo Go:

```bash
npx eas build --platform ios
npx eas build --platform android
```

Requires an [Expo EAS](https://expo.dev/eas) account.

---

## Environment variables

| Variable | Description | Status |
|---|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ Pre-filled |
| `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key | ✅ Pre-filled |
| `EXPO_PUBLIC_ANTHROPIC_API_KEY` | Anthropic API key for Claude | ⚠️ You must fill this in |

> **Security note:** `EXPO_PUBLIC_` variables are bundled into the app binary. This is fine for a private internal-use app. Do not publish this app to a public store with your API key embedded.

---

## AI Prompt Bar — example commands

| Command | What happens |
|---|---|
| `Add rehearsal Tuesday at 2pm at the Convention Center` | Adds event to current member's calendar |
| `Add a Vocal Spectrum warm-up Friday at 8am in Room 204, notes: bring water` | Adds group event |
| `Remove Tim's dinner Thursday` | Removes if you are Tim; rejected otherwise |
| `Add Jonny's solo practice Wednesday at 10am` | Adds to Jonny's calendar if you are Jonny |

---

## Supabase schema reference

The `events` table used by this app:

```sql
create table events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  date        date not null,
  start_time  time not null,
  end_time    time,
  location    text,
  notes       text,
  owner       text not null, -- jonny | tim | chris | eric | vocal_spectrum
  created_at  timestamptz default now()
);
```

---

## Troubleshooting

**"ANTHROPIC_API_KEY not configured"** — Open `.env`, add your key, then restart `npx expo start`.

**Events not showing** — Pull down to refresh, or check your internet connection. Supabase Realtime requires a live network.

**Expo Go crashes on launch** — Run `npx expo install` to sync package versions, then restart.
