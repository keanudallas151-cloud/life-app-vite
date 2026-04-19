# src/systems/GEMINI.md

Use this file when working in `src/systems/`.

## What lives here

- Theme tokens and theme state
- Local storage helpers
- Shared app systems like momentum, reading streak, resume reading
- Supabase-backed hooks such as user data, quiz stats, and Post-It sync

## Rules for changes here

- Keep this folder focused on shared logic and persistence, not page rendering.
- Preserve the cloud-or-local behavior used across the app:
  - signed-in users sync through Supabase-aware hooks
  - guests fall back to local state and `LS`
- Extend graceful fallback behavior instead of assuming the latest schema always exists. Missing env vars or newer columns should not crash the app.
- Keep theme work centralized in `theme.js`. Components should consume `t.*` tokens rather than redefining palettes.
- Reuse `LS` from `storage.js` for browser persistence keys instead of adding raw `localStorage` calls throughout the codebase.
- When changing persistence timing, prefer the existing debounced/queued pattern used in hooks like `useUserData` over eager writes on every render.

## Watch-outs

- Hooks in this folder shape app-wide data. Small schema or timing changes can affect auth users, guests, and offline behavior differently.
- The repo intentionally supports legacy/fallback cases in several places. Avoid deleting fallback logic unless the whole app has been updated to no longer rely on it.
- `storage.js` is intentionally tiny and tolerant of private mode or quota failures, so do not replace it with logic that throws loudly on normal browser limitations.
