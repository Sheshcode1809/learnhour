# Learnhour technical architecture — as built

**Reviewed:** 2026-11-05. This replaces the earlier aspirational architecture sketch. Source code is authoritative; see [TEST_REPORT.md](TEST_REPORT.md) for verification and limitations.

## Stack

- Next.js 14 App Router, React, TypeScript, Tailwind CSS.
- Browser local storage for learning records and preferences.
- Supabase JavaScript client for optional Auth only; Auth is off by default. There is no application CRUD or synchronization against Supabase Postgres.
- Vitest for calculation, URL parsing, and timer-helper unit tests.
- Lucide React for interface icons.

## Route map

| Route | Purpose |
|---|---|
| `/` | Public landing page |
| `/dashboard` | Learner dashboard |
| `/courses` | Course library |
| `/courses/new` | Course creation |
| `/courses/[id]` | Course player and lesson tools |
| `/sessions` | Timer and study-session history |
| `/settings` | Goal, local data export, and preferences |
| `/auth/login`, `/auth/signup`, `/auth/callback` | Optional Supabase Auth flows |
| `/about`, `/contact` | Public product and support information |
| `/privacy`, `/terms` | Draft legal information; currently noindex |
| `/landing` | Redirects to `/` |

## Key implementation areas

- `src/context/LearningContext.tsx`: client-side course/session/timer state and persistence coordination.
- `src/lib/storage/repository.ts`: local-storage record validation, read/write operations, defaults, and reset behavior.
- `src/lib/calculations/`: progress, streak, day-planning, and timer calculations.
- `src/lib/supabase/client.ts` and `src/context/AuthContext.tsx`: opt-in Supabase Auth and local guest path.
- `src/lib/youtube.ts`: strict supported-host parsing and embed URL validation; no server-side URL fetching or metadata scraping.
- `src/app/robots.ts` and `src/app/sitemap.ts`: indexing policy and origin-dependent public sitemap.

## Data and authentication boundaries

Course, lesson, note, quiz/flashcard content, preference, active-timer, and session records remain in the current browser's local storage. Export is available; import/restore, server-side backups, and cross-device sync are not implemented. Authentication does not move those records to an account.

The SQL file in `supabase/migrations/` is an unconnected starter schema. Its types and relationships do not fully match the local model. It has not been applied, tested, or security-verified. Do not deploy it or advertise RLS protection until the migration and data adapter are designed and verified in staging. See [SUPABASE_MIGRATION_PLAN.md](SUPABASE_MIGRATION_PLAN.md).

## Build and known limits

- The 2026-11-05 local production build succeeded in an elevated run and generated 19 static pages. The normal sandboxed run hit Windows `EPERM` while creating `.next` directories; one Edge-runtime route is not statically generated.
- Brand fonts are not bundled. System font stacks are used because build-time Google Fonts fetching failed in the restricted environment.
- The responsive route audit has not completed. Do not infer a responsive pass from the presence of the script or old screenshots.
- No Lighthouse, Core Web Vitals, formal accessibility, live Auth, database, or RLS results are available.
