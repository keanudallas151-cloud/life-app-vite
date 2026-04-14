# Implementation Task — Life. Finalization Pass

Use `implementation_plan.md` as the source of truth for this task.

## Objective

Implement the finalization pass for the Life. app by following the phases and constraints in `implementation_plan.md`. Build on the current working tree, preserve the fixes already landed, and push the app toward a cleaner, more stable, more polished production state.

## Mandatory References

- Primary plan: `implementation_plan.md`
- Highest-risk implementation file: `src/App.jsx`
- Main shared styling file: `src/index.css`

## Execution Rules

1. Follow the phase order in `[Implementation Order]` unless a later step is blocking an earlier one.
2. Do not overwrite unrelated existing work in the repo.
3. Preserve the current password-toggle fixes, internal scroll-container fixes, and settings/dark-mode progress unless replacing them with a clearly better version.
4. Prefer small helper extraction and CSS consolidation over adding more inline complexity to `src/App.jsx`.
5. Do not add new dependencies unless absolutely necessary.
6. Only remove assets or dependencies after confirming they are truly unused.
7. Finish with `npm run lint` and `npm run build`.

## Target Outcomes

- Scroll depth and scroll-to-top behavior are fully correct across the in-app shell.
- Dark mode is consistent across the critical user-facing surfaces.
- Settings and profile are clearly labeled, grouped, and easier to use.
- Auth screens are clean on desktop and mobile, including password toggle controls.
- Reader, Quiz, and Post-It receive visible UX polish and stronger empty/error/loading states.
- Technical debt artifacts are reduced, including stale workaround files and merge-conflict leftovers.
- The implementation lands at least 30 concrete fixes/polish upgrades across UX, layout, theme, and cleanup.

## Implementation Checklist

- [ ] Phase 1: Baseline safety and repo cleanup guardrails
- [ ] Phase 2: App-shell scroll and layout stabilization
- [ ] Phase 3: Theme-system and dark-mode normalization
- [ ] Phase 4: Auth and onboarding polish
- [ ] Phase 5: Settings and profile information architecture pass
- [ ] Phase 6: Core feature polish pass
- [ ] Phase 7: Technical debt and public-asset cleanup
- [ ] Phase 8: Final validation and release readiness

## Definition of Done

- `implementation_plan.md` has been followed closely.
- The most visible live-site issues called out by the user are materially improved.
- Lint passes.
- Production build passes.
- Final summary clearly explains the fixes, upgrades, cleanup, and any deferred follow-up items.