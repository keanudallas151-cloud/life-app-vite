# Copilot Instructions for `life-app`

## Build, lint, and test commands

- Install dependencies with `npm install` for normal local setup, or `npm ci` to match CI.
- Start local development with `npm run dev`.
- Lint the repo with `npm run lint`.
- Build for production with `npm run build`.
- Run the production build locally with `npm run start`.
- The Next.js build output goes to `dist/` because `next.config.mjs` sets `distDir: "dist"`.
- There is currently no automated test script or test file pattern in `package.json`, so there is no supported single-test command yet.

## High-level architecture

- The active app entry is `app/page.jsx`, not the old Vite shell. It dynamically imports `src/App.jsx` with SSR disabled and wraps it in `ErrorBoundary` and `ToastProvider`.
- `src/App.jsx` is the main controller for the product. It restores Supabase auth state, handles onboarding and auth flows, owns most app state, and renders the main shell when `screen === "app"`.
- Navigation is state-driven inside `src/App.jsx`, not route-driven:
  - `screen` controls top-level flows like `loading`, `landing`, `signin`, `register`, `verify_email`, `reset_password`, `theme_picker`, `tailor_*`, `privacy_policy`, `terms_conditions`, and `app`.
  - `page` controls in-app surfaces such as `home`, `reading`, `quiz`, `postit`, `profile`, `setting_preferences`, `progress_dashboard`, `categories`, `where_to_start`, `networking`, `leaderboard`, `daily_growth`, `goal_setting`, `mentorship`, `premium`, and `momentum_hub`.
  - Do not introduce React Router for these flows.
- The shell is mobile-first. `src/App.jsx`, `src/components/BottomNav.jsx`, and `src/index.css` work together to keep the fixed top/bottom chrome and the main content area aligned on small screens and iOS safe-area devices.
- App content is data-driven:
  - `src/data/content.js` holds the main reading library.
  - `src/data/quiz.js`, `src/data/posts.js`, and `src/data/tailoring.js` back quiz, community, and onboarding flows.
- Supabase is the backend boundary:
  - `src/supabaseClient.js` uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` as the canonical env vars.
  - Legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `VITE_*` public names still exist as migration fallbacks.
  - `src/systems/useUserData.js`, `useQuizStats.js`, and `usePostIt.js` are the main cloud-sync hooks.
- `app/layout.jsx` injects global CSS and extra public assets like `password-toggle-fix.*` and `home-hero-polish.*`, so some UI behavior is patched from `public/` instead of only from React components.
- The repo still contains legacy Vite-era files (`src/main.jsx`, `index.html`, `vite.config.js`), but `npm run dev` and `npm run build` use Next.js.

## Key conventions

- Treat `src/App.jsx` as a high-risk integration file. Make targeted edits and reuse existing hooks/components instead of adding another top-level state system.
- Keep the current `screen` / `page` state-routing model when adding new surfaces.
- Preserve the single main scroll container: `.life-main-scroll` inside the app shell. Do not move primary scrolling onto `body` or `html`.
- Reuse the theme system from `src/systems/theme.js`:
  - `useTheme()` returns the active theme object as `t`.
  - In components, prefer `t.*` theme values instead of hardcoded colors.
  - `C` and `DARK` are palette/token definitions; do not spread new ad hoc color values across JSX when an existing theme token fits.
- Shared/global styling belongs in `src/index.css`. App-level component overrides belong in `src/App.css`.
- Respect the mobile shell constraints already encoded in `src/index.css`:
  - iOS safe-area padding is used widely.
  - the bottom nav stays fixed.
  - interactive controls generally keep a 44px minimum touch target.
  - mobile form controls use 16px sizing to avoid iOS zoom behavior.
- Reuse the `LS` helper in `src/systems/storage.js` for local persistence. Existing user-scoped keys in `src/App.jsx` use prefixes like `prefs_`, `bk_`, `nt_`, `rd_`, `tsd_`, `mom_`, `notif_`, and `rp_`; follow those patterns instead of inventing a second storage scheme.
- Supabase-aware features are expected to degrade without crashing when env vars or newer columns are missing. Existing hooks already contain guest-mode and legacy-schema fallback behavior; extend those patterns rather than bypassing them.
- Lazy-loaded app surfaces are centralized in `src/components/AppShell.jsx` and rendered through `Suspense` fallbacks from `src/App.jsx`. Follow that pattern for heavy screens.
- Top-level pages and major sections use `data-page-tag` markers (for example `#profile`, `#post_it`, `#register_page`, `#dashboard_home`). Add a tag when creating a new page or major section so the code stays easy to trace later.

## UI patterns worth reusing

- Password fields use the shared `.life-password-field` / `.life-password-toggle` pattern with `data-password-toggle="true"`. Reuse the existing markup and CSS instead of inventing a new password-toggle implementation.
- Use the existing icon helper from `src/icons/Ic.jsx` rather than adding a second icon pattern.
- For orientation before larger refactors, read `AI_PROMPT_HELPER.md` first.

## Data and auth behavior

- User data like bookmarks, notes, read progress, profile state, and momentum state can come from:
  - Supabase via `useUserData(userId)` when signed in and configured.
  - local storage via `LS` when in guest mode or when Supabase is unavailable.
- Keep the existing cloud-or-local write pattern when adding new persisted state: write through the cloud hook when a user-backed data source is available, otherwise update local state and `LS`.
- Core auth flows live in `src/App.jsx`: OAuth sign-in, email/password sign-in, registration, forgot password, password reset, and sign-out.
- Access to the main app is gated on `session.user.email_confirmed_at`. Unconfirmed users are redirected to `verify_email`.

## Build and deployment notes

- Build command: `npm run build`
- Lint command: `npm run lint`
- Vercel config lives in `vercel.json` and currently uses:
  - `buildCommand: "npm run build"`
  - `outputDirectory: "dist"`
  - `framework: "nextjs"`
- Use `next.config.mjs` as the active Next config. Do not add a parallel `next.config.js`.

## Constraints

- Do not rewrite `src/App.jsx` from scratch.
- Do not add React Router.
- Do not add new npm dependencies unless they are clearly necessary.
- Do not add `overflow` to `body` or `html`.
- Do not commit `.env` files or expose Supabase service-role credentials in client code.
- Before finishing non-trivial code changes, run `npm run lint` and `npm run build`.
