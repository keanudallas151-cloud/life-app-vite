# Changelog

## v0.6.6 — Lint fixes, iOS & mobile polish
- Fixed useEffect missing dependency in InventorsInvestors (roleChoice stale closure).
- Fixed crypto not defined error — switched to window.crypto.randomUUID().
- Suppressed three no-img-element warnings with targeted eslint-disable (justified: next.config images.unoptimized=true).
- Polished loading screen Life. dot to use a true circular styled span.
- Improved reading mode tooltip — cleaner caret, better mobile sizing, always dismissible.
- Added comprehensive mobile CSS sweep for top 20 global devices (360–430px).
- Added iOS-specific CSS: momentum scroll, touch-callout, safe area guards, tap highlight removal.
- Added Capacitor-compatible viewport and PWA meta for native iOS packaging path.
- Improved font-size on inputs/selects to prevent iOS auto-zoom.
- Added display-mode standalone improvements for installed PWA/home screen use.

## v0.6.5 — Inventors & Investors implementation
- Added the full Inventors & Investors flow under the existing networking entry.
- Added 6 in-feature pages: landing, role selection, investor setup, inventor setup, swipe discovery, and messages.
- Added production-oriented Supabase schema, RLS policies, discovery view, storage rules, and messaging RPCs.
- Added mobile-first forms with draft persistence, completeness progress, image previews, validation, and privacy toggles.
- Added swipe discovery with left = interested and right = pass, search, public-contact gating, block/report, and in-app messaging.
- Added unread message counting and conversation read tracking.
- Bumped app version from 0.6.4 to 0.6.5.

## v0.6.2 — Secret Sienna unlock flow
- Added a stricter unlock flow for Secret Sienna.
- Hid the bottom navigation in reading mode.

## v0.6.1 — Networking title correction
- Corrected the main networking page title to Investors & Inventors.

## v0.6.0 — Networking split and account customization
- Split the Discord networking page from the Inventors & Inventors surface.
- Added an account customize page.
