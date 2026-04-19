# src/components/GEMINI.md

Use this file when working in `src/components/`.

## What lives here

- Most user-facing screens and reusable UI components live in this folder.
- Large app surfaces are lazy-loaded from `AppShell.jsx`.
- Many components are rendered by `src/App.jsx` through `screen` and `page` state rather than route files.

## Rules for changes here

- Keep page navigation compatible with the existing `screen` / `page` model in `src/App.jsx`. Do not add React Router.
- Preserve `data-page-tag` coverage on major pages and sections so future edits stay traceable.
- Use the active theme object from `useTheme()` (`t.*`) for colors inside JSX. Do not hardcode raw hex colors in component code.
- Respect the mobile shell: 44px-ish tap targets, safe-area spacing, and content that fits inside `.life-main-scroll`.
- Reuse existing patterns before inventing new ones:
  - password inputs use `.life-password-field` and `.life-password-toggle`
  - heavy surfaces stay lazy-loaded through `AppShell.jsx`
  - icons come from `Ic.*`
- Treat `AppShell.jsx` as a stable boundary for lazily loaded surfaces. If you add a heavy page, wire it there with `Suspense` instead of importing it eagerly into `src/App.jsx`.

## Watch-outs

- `src/App.jsx` is the integration point for many of these components. A local component change can still break auth flow, navigation, or saved state.
- Some components are intentionally prop-driven and extracted from `App.jsx`; keep them independent when possible instead of reaching back into global state.
- If a component needs persistence, follow the existing storage or cloud hooks instead of adding ad hoc localStorage calls inside the UI.
