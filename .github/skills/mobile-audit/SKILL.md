---
name: mobile-audit
description: 'Audit life-app UI changes for mobile, iOS, and theme compliance. Use when touching JSX, CSS, layout, components, pages, bottom nav, safe areas, touch targets, or theme colors. Triggers: mobile, iOS, safe area, touch target, theme, hardcoded color, layout, responsive.'
argument-hint: 'Optional: component or page to audit.'
---

# Mobile + Theme Audit

Fast compliance sweep for life-app UI work. Keeps the mobile-first shell and theme system intact.

## Use When

- Editing any component in `src/components/**`.
- Editing `src/index.css` or `src/App.css`.
- Adding a new page or screen.
- Changing layout, scrolling, bottom nav, or top chrome.
- Touching colors anywhere in JSX.

## Checklist

### Theme
- [ ] No hex literals in JSX (`#fff`, `#000`, etc.).
- [ ] Colors come from `t.*` via `useTheme()`, not `C.*`.
- [ ] Palette changes only happen inside `src/systems/theme.js`.
- [ ] Dark mode still works (toggle `body.life-dark`).

### Scroll Container
- [ ] `.life-main-scroll` remains the single main scroll surface.
- [ ] No `overflow` added to `body` or `html`.
- [ ] Scroll resets use `mainScrollRef.current.scrollTo({ top: 0 })`.

### Touch + Input
- [ ] Interactive elements are at least 44px tall and wide.
- [ ] `input`, `textarea`, `select` have `font-size: 16px` on mobile.
- [ ] Password fields use the `.life-password-field` + `.life-password-toggle` pattern.

### Safe Areas + Chrome
- [ ] iOS safe-area insets respected (`env(safe-area-inset-*)`).
- [ ] Bottom nav height still driven by `--life-bottom-nav-height`.
- [ ] Fixed top/bottom chrome does not overlap main content.

### Widths
- [ ] Layout holds at 320px.
- [ ] Layout holds at 430px.
- [ ] No horizontal scroll at any width in that range.

### Structure
- [ ] Heavy surfaces stay lazy-loaded via `src/components/AppShell.jsx`.
- [ ] New page has a locator tag comment (e.g. `{/* #profile_hub */}`).
- [ ] State routing still uses `screen` / `page`, not React Router.

## Output

Report each failing item with the file and line, a one-line fix recommendation, and whether it is blocking (repo rule violation) or a warning.
