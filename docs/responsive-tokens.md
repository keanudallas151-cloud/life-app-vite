# Responsive design tokens (Phase 1 foundation)

Fluid, universal mobile sizing for `life-app`. One set of tokens lets a
single rule scale smoothly across iPhone SE (320), iPhone 15 (393),
Pro Max (430), and tablet (768+) — no extra `@media` breakpoints needed.

Defined in [`src/index.css`](../src/index.css) inside `:root` and
`body.life-dark`.

## Why

A grep of `src/index.css` turned up ~1,000 hard-coded `px` values and
almost zero `clamp()` usage. That is the root cause of the "unevenness"
and clashing on different phones — a 14 px label that fits a 430 px
Pro Max feels cramped on an SE and airy on a tablet.

These tokens fix that at the source: you can't ship a stray 13 px or
17 px value because the token doesn't exist.

## Tokens

### Spacing scale — use for `padding`, `margin`, `gap`
| Token | Range |
|-|-|
| `--life-space-1` | 4 → 6 px |
| `--life-space-2` | 6 → 10 px |
| `--life-space-3` | 10 → 14 px |
| `--life-space-4` | 14 → 20 px |
| `--life-space-5` | 20 → 28 px |
| `--life-space-6` | 28 → 40 px |

### Type scale — use for `font-size`
| Token | Range |
|-|-|
| `--life-text-xs`   | 11 → 12 px |
| `--life-text-sm`   | 12 → 13 px |
| `--life-text-base` | 14 → 16 px |
| `--life-text-lg`   | 16 → 18 px |
| `--life-text-xl`   | 18 → 22 px |
| `--life-text-2xl`  | 22 → 28 px |

Pair with `--life-leading-tight | -normal | -loose` for `line-height`.

### Radius — use for `border-radius`
`--life-radius-sm | -md | -lg | -xl` (xl is fluid).

### Tap target
`--life-tap-target: 44px` — Apple HIG floor, safe default for Google too.

### Surface / on-surface contrast pair
Any text or icon placed on a themed surface should read its color from
the `--life-on-surface*` tokens so contrast is guaranteed — no more
muted-on-muted or white-on-white surprises.

| Token | Meaning |
|-|-|
| `--life-surface` | Primary app surface background |
| `--life-surface-raised` | Cards, tiles, sheets on top of the surface |
| `--life-on-surface` | Primary readable text/icon color |
| `--life-on-surface-muted` | Secondary labels, metadata |
| `--life-on-surface-subtle` | Placeholder / least-emphasis text |

`body.life-dark` overrides these so the same class names work across
themes.

## Utility classes

All defined at the bottom of `src/index.css` in the
`── FIX: Universal responsive utility classes` block.

- `.life-tap-target` — enforces 44×44 min and centers the glyph.
- `.life-on-surface` / `.life-on-surface-muted` / `.life-on-surface-subtle`
- `.life-surface` / `.life-surface-raised`
- `.life-aspect-square` / `.life-aspect-video` / `.life-aspect-4x3`
- `.life-img-cover` — `object-fit: cover` + full-bleed inside a sized parent.
- `.life-avatar` — round, square-aspect, covered; good default for user pics.
- `.life-text-xs … .life-text-2xl` — fluid type helpers.
- `.life-p-1…5`, `.life-gap-1…4` — fluid spacing helpers.

## How to adopt

Adopt incrementally, page-by-page, via the numbered FIX-block pattern
already used in `src/ii-mobile-fixes.css` and
`src/components/organized/organized.css`. Suggested order (from the
Phase 2 plan):

1. Bottom nav
2. Dashboard
3. Feed cards
4. Profile page

Rule of thumb for new code:
- Replace fixed `font-size: 14px` → `font-size: var(--life-text-base)`
- Replace `padding: 16px` → `padding: var(--life-space-4)`
- Wrap any icon-only button → `className="… life-tap-target"`
- Any avatar / hero image → wrap in `.life-aspect-square` (or
  `.life-aspect-video`) and put `.life-img-cover` / `.life-avatar` on
  the `<img>` inside.

## Non-goals (for Phase 1)

- This PR does **not** change any existing rule; it only adds tokens and
  utilities. Visual output is unchanged until a surface opts in.
- This PR does **not** add a lint rule forbidding raw `px`. That is
  Phase 11 in the plan.
- This PR does **not** add container queries; those are Phase 3.
