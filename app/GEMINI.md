# app/GEMINI.md

Use this file when working in `app/`.

## What this folder does

- This is the active Next.js shell.
- `page.jsx` is intentionally thin and only mounts the real app controller from `src/App.jsx`.
- `layout.jsx` owns global metadata, viewport config, icons, and the global CSS import.

## Rules for changes here

- Keep `app/page.jsx` thin. Do not move main app logic out of `src/App.jsx` into the Next.js route layer.
- Keep the dynamic import of `src/App.jsx` client-only (`ssr: false`) unless there is a strong reason to change the runtime model.
- Preserve the shared wrappers around the app (`ErrorBoundary` and `ToastProvider`) when editing `page.jsx`.
- Do not introduce a new Next.js route tree for the in-app experience. The product still uses state-based routing inside `src/App.jsx`.
- If you change metadata or viewport behavior in `layout.jsx`, make sure it still fits the mobile-first shell and PWA-style setup.

## Watch-outs

- `layout.jsx` imports `../src/index.css`, so global layout regressions often start there rather than inside `app/`.
- The app is built for safe-area devices, so changes to viewport or theme color should be deliberate.
- If a bug looks like a route issue, confirm whether it is really a `screen` / `page` state issue in `src/App.jsx` before changing the app shell.
