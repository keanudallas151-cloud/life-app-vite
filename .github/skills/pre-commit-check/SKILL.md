---
name: pre-commit-check
description: 'Run life-app validation before committing. Use when the user says commit, push, ship, finalize, or finish a change. Runs lint, build, and checks repo rules (no hardcoded colors, no overflow on body/html, single next.config, src/App.jsx edited incrementally).'
argument-hint: 'Optional: area or files changed.'
---

# Pre-Commit Check

Mandatory validation pass before any commit or push on `life-app`.

## Use When

- User says: commit, push, ship, finalize, done, ready, PR.
- Finishing a feature or bug fix.
- Reviewing a diff before it lands.

## Procedure

1. **Sync first.** Confirm branch is `main` and up to date with `origin/main`. If not, run the latest-update steps from the `start` skill before validating.
2. **Lint.**
   ```powershell
   npm run lint
   ```
   Must pass. No warnings about hardcoded colors in JSX.
3. **Build.**
   ```powershell
   npm run build
   ```
   Must succeed. Output must go to `dist/`. If it goes anywhere else, `next.config.mjs` is wrong.
4. **Repo rule sweep.** Confirm the change does not:
   - Hardcode hex colors in JSX (`t.*` only, not `C.*`, not literal `#...`).
   - Add `overflow` to `body` or `html`.
   - Introduce React Router.
   - Create `next.config.js` alongside `next.config.mjs`.
   - Add `distDir` anywhere other than `next.config.mjs`.
   - Rewrite `src/App.jsx` wholesale.
   - Commit `.env` or expose `service_role` keys.
5. **Mobile sanity.** If UI changed, confirm 44px minimum touch targets, 16px input font-size, iOS safe-area respected, and the single `.life-main-scroll` container is untouched.
6. **New page tag.** If a new page was added, confirm it has its locator tag comment (e.g. `#sidebar_lessons`) per repo convention.
7. **Commit summary.** Report: what changed, what was validated, any remaining follow-ups.

## Fail-Stop Conditions

- Lint fails.
- Build fails.
- Any repo rule above is violated.
- Workspace was behind `origin/main` and was not pulled first.

Do not proceed to commit/push if any fail-stop is hit. Report it instead.
