# Learnhour — product documentation

This is the earlier course-learning-tracker overview. Some documentation describes intended features rather than current implementation. For the project overview and current launch gates, start with [README](README.md), [production audit](PRODUCTION_AUDIT.md), [launch readiness](LAUNCH_READINESS.md), and [test report](TEST_REPORT.md).

## Current implementation facts

- Learnhour is a Next.js 14 App Router application with TypeScript, Tailwind, Lucide, Vitest, and browser local-storage persistence.
- Public `/` is the landing page; `/dashboard` is the learner dashboard. `/landing` redirects to `/`.
- Course, lesson, note, preference, active-timer, and learning-session data are local to the browser. Production starts without seeded sample courses or sessions.
- The timer and course/session interfaces exist. Current unit tests cover calculation, URL validation, and timer helpers; they are not a full browser journey suite.
- YouTube video URLs are accepted only from supported HTTPS hosts. Playlist pages are rejected. Custom title and duration are entered by the learner; there is no metadata scraping.
- Supabase Auth is optional and disabled by default. Supabase learning-data sync, database CRUD, and live RLS verification are not implemented.
- Settings provides JSON export. JSON import/restore is not implemented.
- About and Contact pages exist. Privacy and Terms pages are drafts and require owner/legal review.

## Run locally

```bash
npm install
npm run dev
npm test
npx tsc --noEmit
npm run lint
npm run build
```

See [environment setup](ENVIRONMENT_SETUP.md) for optional Auth variables and [deployment guide](DEPLOYMENT.md) for release prerequisites. Do not use the older planned Supabase setup notes as evidence that cloud sync works.
