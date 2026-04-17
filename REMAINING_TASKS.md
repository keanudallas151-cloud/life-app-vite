# Life. — Remaining Tasks

**Session date:** 2026-04-17
**Session covered:** Prompts 1–3 (partial) from the original 5-prompt execution plan.
**Status:** All listed completed work is committed to `main`. Remaining work below.

---

## ✅ What This Session Completed

### Authentication
- **Password toggle fully locked in place.** Rewrote the toggle to use `translate3d(0,-50%,0)` with fixed dimensions. The `:active`, `:hover`, and `:focus-visible` states all reuse the same transform — no more vertical jump, flicker, or re-flow when clicked. Text reservation (`padding-right: 72px`) stops overlap with the input.

### UI Cleanup
- **Save Quote feature entirely removed** — button, state, useEffect, helpers, saved-quotes section, and all prop wiring (`highlights`, `onSaveHighlight`, `onRemoveHighlight`) cleaned out.
- **Copy Link button removed** from the reader toolbar; the star/save button was enlarged (44×44) to fill the space.
- **Continue Reading card now dismissible** via a × button. The button lives above the main tap area (proper `z-index` stacking) and calls `clearResumeTopic()`.

### Reading Experience
- **Parchment paper texture** applied to the reader page — light mode uses a warm aged-paper tint; dark mode uses a darker skin-toned parchment. Both use layered gradients + subtle horizontal fibres.
- **Page-turn sounds differentiated** — `pageturn_next` plays `next_page.mp3`, `pageturn_prev` plays `previous_page.mp3`. Wired through `useSound.js`.
- **Scroll-to-top on page turn** — `scrollToTopOfPage()` now scrolls the inner page div, the `.life-main-scroll` container, and the window as fallback. Both button clicks and dot-nav use it.
- **Progress bar repositioned** — percentage sits at top-right above the bar; page number sits top-right below the bar.
- **"From the Author"** wrapped in decorative serif quotation marks (italics, green accents).

### Progress Dashboard
- **All challenge items are now tappable buttons** with routing. New challenges added: "Improve Communication" → Quiz page, "Set a personal goal" → new GoalSettingPage.
- **GoalSettingPage created** — CRUD for personal goals with deadlines, progress slider, completion state. Persists via `LS`.

### Daily Growth
- **Fully interactive.** Each of the 6 items opens a dedicated modal:
  - **Journal** (Morning Reflection, Network, Evening Audit) — textarea with per-day persistence
  - **Timer** (Practice Speaking) — 2-minute countdown with Start/Pause
  - **Checklist** (Review Finances) — 4 items you tick off before "Mark done"
  - **Redirect** (Learn One Thing) — routes to Home to read a topic
- Progress strip at the top shows `completed/total` for today.

### Dark Mode
- **Reader, QuizPage, Tailor** — all now accept a `t` theme prop with fallback to `C` constant. Every `C.*` reference inside these files was swapped to `t.*`. Dark mode now theming works consistently across these pages.

### Notifications
- **Badge count centered** in the red circle (fixed line-height, tight font stack, `99+` overflow handling).
- **Panel is scrollable** — flex column with bounded `max-height: min(460px, calc(100dvh - 80px))` and `overflow-y: auto` on the list.
- **Swipe-to-delete** — new `SwipeableNotification` component: drag left > 80px reveals red "Delete" background then removes the item. Works on touch and mouse.
- **Tap to navigate** — `handleNotifTap` marks as read and routes to relevant page (tailoring detection, daily_growth default).

### Profile & Navigation
- **Gear icon forced to a perfect circle** — added `aspectRatio: "1/1"`, min/max width/height = 40.
- **Hamburger aligned with logo + search** — `alignItems: center`, matched 40×40 button dimensions for the toggle.

### Quiz System
- **Dark mode fix** — `C.*` → `t.*` swap throughout QuizPage (see Dark Mode above).
- **Communication topic added** with 48 questions (16 easy / 16 medium / 16 hard). Covers sentence completion, public speaking, vocal technique, negotiation, linguistics.
- **Vocal warmups + conversation practice data** added to `quiz.js` under `communication_audio` (warmups, conversation prompts). `mp3Url: null` placeholders ready for MP3 integration — structure is in place.
- **Question counts increased:** Daily 10 → **15**, Blitz 10 → **15**, Multiple / True-False 8 → **12**.
- **Communication registered in `TOPIC_META`** — appears automatically in the topic grid.

### Mobile Layout
- **Sidebar gaps fix** (from the very first prompt in the thread) — CSS in `index.css`:
  - `.life-sidebar` on mobile: `top: 0; bottom: 0`; padded-top `52px + safe-area`.
  - Flex column with `marginTop: auto` on Sign Out → pins Sign Out to the bottom instead of floating.
  - Device-specific widths: 360 → 92vw, 390 → 88vw/340px, 430 → 85vw/360px.
  - Backdrop covers full screen including bottom nav.

---

## ❌ Remaining Tasks — BY PRIORITY

### 🔴 HIGH PRIORITY (blocks core UX)

#### 1. Reading Pages — Book-style Prose
- **Task:** Content should flow like real book prose, not bullet statements or disconnected paragraphs.
- **Scope:** Edit `src/data/content.js` — the `text` field on every topic.
- **Effort:** Large. Each topic needs a rewrite pass.
- **Criteria:** No bullet points. Coherent paragraph flow. Proper transitions. Narrative voice.

#### 2. Title Pages for Every Subject
- **Task:** Every subject (except main categories) needs a forced-centered title page containing ONLY:
  ```
  [Subtopic]
  [Subject Title]
  ```
- **Tag:** Each title page must be tagged `{topicname}_title_page`.
- **Implementation:**
  - Add a `titlePage: true` flag to topic nodes in `src/data/content.js` OR inject automatically as page 0 in `Reader.jsx`.
  - Render centered, no other elements, no navigation dots over it.
- **Effort:** Medium. Reader.jsx logic change + content tagging.

#### 3. Inline Mid-Content Visuals
- **Task:** Images/graphs/diagrams embedded where described in the text, not only at the end.
- **Current:** `FinanceChart` and `AudioPlayer` only render on `isLast` page.
- **Implementation:**
  - Support `<!--chart:key-->` or `{{chart:key}}` inline markers in `content.js` text.
  - In `Reader.jsx` `.map(cur)` render loop, split paragraphs on these markers and inject the component where the marker appears.
- **Effort:** Medium.

#### 4. Content Expansion — SKIP UNTIL TRIGGERED
- **Task:** Every subject must eventually have 10–20 pages of content.
- **⚠️ Do NOT execute until trigger word `prompt_pages` is given.**
- **File:** `src/data/content.js`

---

### 🟠 MEDIUM PRIORITY

#### 5. Badges Redesign
- **Task:** Redesign the badge page to feel clean, even, and well-organised. Add progressively harder badges.
- **New badges required:**
  - Earn your first $1,000
  - Reach your first $1,000,000
  - Complete every subject
  - Achieve a personal goal
  - Plus more in this difficulty range — should feel earned and prestigious
- **File:** Currently badges appear to live inside `ProgressDashboardPage.jsx` or a similar section (verify — may need a dedicated `BadgesPage.jsx`).
- **Design notes:** Grid layout, locked/unlocked visual difference, clear progress to next badge, tiered difficulty (bronze/silver/gold/diamond visual hierarchy).

#### 6. Full Dark Mode Audit
- **Known remaining issues:** Any pages not yet converted from `C.*` to `t.*`.
- **Pages to verify:**
  - `ProfilePage.jsx` (currently uses `t` — likely OK, verify)
  - `SettingsPage.jsx`
  - `LeaderboardPage.jsx`
  - `MomentumHub.jsx`
  - `CategoriesPage.jsx`
  - `HelpPage.jsx`
  - `WhereToStartPage.jsx`
  - `LandingPage.jsx` / `SignInPage.jsx` / `RegisterPage.jsx`
  - `ThemePickerPage.jsx`
  - `VerifyEmailPage.jsx`
  - `ResetPasswordPage.jsx`
  - `ProgressDashboardPage.jsx` (verify — may need t-swap)
- **Acceptance criteria:**
  - Text is soft white / light gray in dark mode (not pure `#fff`, not harsh).
  - Backgrounds use `t.white` / `t.skin` not hardcoded `#fff` / `#f5f0e8`.
  - Borders use `t.border`.
  - Contrast passes WCAG AA.

#### 7. Communication Quiz — Audio MP3 Integration
- **Current state:** Structure is in place. `communication_audio` block in `quiz.js` has `warmups` and `conversation` arrays with `mp3Url: null` placeholders.
- **What's needed:** Actual MP3 files for each warmup ID. Then update `quiz.js` entries with their URLs, e.g.:
  ```js
  { id:"warm_hum", mp3Url:"/sounds/warmups/humming.mp3", ... }
  ```
- **UI for audio practice:** Not yet built. Needs a dedicated view inside QuizPage (or its own page) that:
  - Lists the warmups, plays MP3 on tap
  - Lists conversation prompts, offers record/timer flow
- **Effort:** Small once MP3s exist. UI is ~80 lines.

#### 8. Sidebar Gap Visual Testing on Phone
- **Current state:** CSS fixes are committed. Needs visual verification on 5 target devices (Galaxy A16 360px, iPhone 17 393px, Galaxy S26 393px, Xiaomi 15 393px, iPhone 17 Pro Max 430px).
- **How to test:** Deploy → open on each phone (or Chrome devtools device emulation) → confirm:
  - No empty gaps between sidebar sections
  - Sign Out pinned to bottom (not floating)
  - Topbar visible above drawer
  - Backdrop covers entire screen
  - Touch targets ≥ 44px

---

### 🟡 LOW PRIORITY / POLISH

#### 9. Prompt 4 — Second Pass Bug Fixes
Per the original plan: *"Second pass — fix remaining bugs AND identify areas of improvement per feature."*

**Known bugs / risks from this session:**
- [ ] Verify `DailyGrowthPage` modal close on Android back button (not yet handled).
- [ ] Verify swipe-to-delete on notifications does not accidentally trigger the tap handler on fast taps (currently uses `didDrag.current` flag — edge case worth testing).
- [ ] Notification panel `top: 56` is hard-coded — on phones with larger notches it may misalign. Use `calc(56px + env(safe-area-inset-top))`.
- [ ] GoalSettingPage deadline validation — a past deadline can be entered. Add guard or visual warning.
- [ ] Progress Dashboard `setPage("communication")` — no `communication` page exists; currently routes to `quiz`. Decide if that's final or needs its own page.
- [ ] Reader.jsx — removing `stripReaderMarkup` / `formatSavedDate` was safe, but double-check no other component imports them.
- [ ] QuizPage — `C` is still imported as fallback; this is fine but can be removed once `t` is guaranteed from parent.

#### 10. Prompt 5 — Final Polish Sweep
- [ ] Alignment audit — every page's padding, margin, and max-width compared side-by-side.
- [ ] Consistency pass — same button heights (44px min on mobile), same border-radius tokens, same font weights.
- [ ] Reduced motion — verify `prefers-reduced-motion` disables the swipe / parchment / page-turn animations.
- [ ] A11y — keyboard navigation on the sidebar, focus states on Daily Growth modal, aria-labels on icon-only buttons.
- [ ] Performance — ensure parchment gradient doesn't tank FPS on older Androids (Galaxy A16).
- [ ] Check all tasks from original prompt are complete.

---

## 📁 Files Modified This Session

| File | Change |
|---|---|
| `src/App.jsx` | SwipeableNotification component, notification handlers, hamburger alignment, pass `t` to children, route goal_setting |
| `src/index.css` | Password toggle rewrite, mobile sidebar block, parchment CSS, device breakpoints, sidebar flex |
| `src/components/Reader.jsx` | Removed Save Quote + Copy Link, theme-aware, parchment class, scroll-to-top, progress bar repositioned, distinct page-turn sounds |
| `src/components/HomePage.jsx` | Continue Reading dismiss button, From the Author quotation marks |
| `src/components/ProfilePage.jsx` | Gear icon perfect circle |
| `src/components/DailyGrowthPage.jsx` | Full interactive rewrite — journal, timer, checklist tools |
| `src/components/ProgressDashboardPage.jsx` | Tappable challenges, new "Communication" and "goal" challenges |
| `src/components/QuizPage.jsx` | Dark mode (C→t), question count increases, Communication registered |
| `src/components/Tailor.jsx` | Dark mode (C→t) |
| `src/systems/useSound.js` | next_page / previous_page sound wiring |
| `src/data/quiz.js` | Communication topic (48 Qs) + communication_audio structure |
| `src/components/GoalSettingPage.jsx` | **NEW** — personal goals CRUD |

---

## 🚀 Next Session — Recommended Order

1. **Visual test on phone** — confirm sidebar + all completed work renders correctly in production.
2. **Prompt 4 bug list** above — knock out the quick fixes.
3. **Title pages + inline visuals** (high-impact, medium effort).
4. **Book-style prose rewrite** — grind through `content.js`.
5. **Badges redesign** — dedicated session, feels like its own sprint.
6. **Dark mode audit** — remaining pages, one by one.
7. **Prompt 5 polish sweep** — last.
8. **Only after all above:** trigger `prompt_pages` for content expansion.
