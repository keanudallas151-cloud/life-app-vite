# src/data/GEMINI.md

Use this file when working in `src/data/`.

## What lives here

- `content.js` contains the main reading library and personalization helpers.
- `quiz.js` contains structured quiz banks grouped by topic and difficulty.
- `tailoring.js` supports onboarding and recommendation flows.
- `posts.js` contains seeded or fallback Post-It content.

## Rules for changes here

- Treat exported object shapes as API contracts for the UI. If you rename keys or fields, update every consumer that depends on them.
- Keep this folder primarily data-first. Avoid moving rendering logic or component concerns into these files.
- Preserve stable content identifiers. Reader progress, related-content links, personalization, and saved state depend on consistent keys.
- When adding new quiz or content entries, match the surrounding schema exactly instead of inventing one-off fields.
- Keep copy edits and data additions surgical. Large structural rewrites here can break multiple screens at once because `src/App.jsx` and related components depend on this data directly.

## Watch-outs

- `content.js` includes helper functions like `buildProfile`, `computeEssentialScore`, and `getPersonalisedRelated`; content tags and category names need to stay aligned with those helpers.
- Quiz data is grouped by topic and difficulty, so moving questions between buckets changes the user experience even if the raw content stays the same.
- Seed posts are fallback content. Do not assume they are the primary source of truth when the Supabase feed is available.
