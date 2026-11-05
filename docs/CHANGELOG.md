# Changelog

All notable changes to the Learnhour project are documented in this file.

> **Historical entries:** The notes below record earlier work and are not current release verification. In particular, they do not establish that Learnhour was deployed, that Supabase learning-data sync exists, or that responsive tests passed. See `TEST_REPORT.md` and `LAUNCH_READINESS.md` for current evidence.

---

## [1.0.0] - 2026-11-04 (Feature build notes; not a verified production release)

### Added
- **Production SEO & Discovery**: Added dynamic `robots.ts` and `sitemap.ts`, OpenGraph metadata tags, and branded SVG favicon (`public/favicon.svg`).
- **Resilient Error Boundaries**: Added root `error.tsx` boundary with sanitized diagnostics and user-friendly "Try Again" / "Dashboard" recovery actions.
- **Branded 404 Page**: Added `not-found.tsx` matching the editorial warm-cream design language.
- **Supabase Auth client**: Added `@supabase/supabase-js`; it is optional Auth only. Learning-data synchronization is not implemented.
- **Responsive test script**: Added `scripts/test-responsive.mjs` for checks at six widths. A current browser run has not completed; see `TEST_REPORT.md`.
- **Vercel Deployment Configuration**: Added `vercel.json` and optimized `next.config.mjs` with production HTTP security headers (`nosniff`, `SAMEORIGIN`, `origin-when-cross-origin`).

### Changed
- **Navigation Polish**: Removed redundant "Dashboard" link from public landing page center navigation while keeping prominent primary CTAs.
- **Responsive Layout Fixes**:
  - Eliminated horizontal scroll on 360px and 390px mobile screens in `/courses`, `/sessions`, and `/settings`.
  - Wrapped focus timer action buttons and improved session table scroll container.
  - Sized quick goal buttons comfortably for mobile screens.
  - Adjusted course player layout to stack cleanly at 1024px laptop widths with active sidebar.
- **Production Data Cleanliness**: Removed hardcoded learner name; user preferences default to "Learner" with full customization in Settings.

### Fixed
- **Database RLS Policies**: Added missing `UPDATE` policy for `learning_sessions` and missing access policies for `course_notes` in `supabase/migrations/001_initial_schema.sql`.
- **ESLint & Code Quality**: Configured `.eslintrc.json`, installed dev dependencies, and resolved React hook dependency warning in course player.

---

## [0.9.0] - 2026-11-04 (Navigation & Habit Engine)
- Re-routed root `/` to serve the marketing landing page and moved tracker to `/dashboard`.
- Implemented persistent focus study timer with floating bar.
- Implemented streak engine and 7-day weekly activity visualization.
- Built day-wise curriculum planner, active recall quizzes, timestamped notes, and 3D flashcards.

