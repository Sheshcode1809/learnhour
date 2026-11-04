# Production Readiness Checklist

This checklist audits functional, architectural, performance, and security readiness for Courseit.

---

## 1. Core Feature Completeness & Quality

- [x] **Marketing Landing Page (`/` and `/landing`)**:
  - Clear value proposition: "Paste a long video. Get a 1-hour/day course."
  - Direct CTAs to Quick Course Builder, Dashboard, and Login/Signup.
  - Featured Masterclasses directly route to verified courses (`python-2026`, `neural-networks`, `system-design`).
  - No broken links, dummy buttons, or placeholder anchors.
- [x] **Authentication & Identity (`/auth/login`, `/auth/signup`)**:
  - Demo Guest Google Sign-In with 1-click seamless redirection to `/dashboard`.
  - Email/Password form with validation.
  - Transparent labeling that guest mode operates in local storage unless Supabase credentials are configured.
- [x] **Dashboard & Daily Tracker (`/dashboard`)**:
  - Daily goal calculation based on user preference (default 60m).
  - Streak engine calculating current streak and best streak without future-session contamination.
  - 7-day weekly activity visualization with goal completion markers.
  - One-click Resume Course and In-Progress library previews.
- [x] **Course Library (`/courses`)**:
  - Filter tabs: All, Active, Completed, Archived with live count badges.
  - Search bar searching title, provider, and description.
  - Course card menu: Quick Start Timer, Edit Course modal, Archive/Restore, and Confirm Delete dialog.
  - Empty states with actionable buttons.
- [x] **Course Player (`/courses/[id]`)**:
  - Day-wise curriculum partitioning (Day 1, Day 2, Day 3...).
  - Lesson selector with persisted state recovery (`getLastSelectedLessonId`).
  - Allowlisted YouTube embed player with safe external fallback for arbitrary URLs.
  - 1-click preset enrollment if a masterclass preset is accessed directly.
  - Smart 404 recovery with links to Browse Courses, Dashboard, and Home.
  - **Day Plan Modal**: Adjust daily study pace (30m, 45m, 60m, 90m) and mark lessons complete.
  - **Active Recall Quiz**: Interactive multiple-choice questions with score tally and instant explanations.
  - **Timestamped Notes**: Pin notes with video minute offsets.
  - **Concept Flashcards**: 3D flippable card decks for spaced repetition.
- [x] **Study Sessions & History (`/sessions`)**:
  - Focus stopwatch with start, pause, resume, reset, and finish actions.
  - Backdated manual session entry with date/time picker and validation.
  - Confetti celebration when completing daily goal.
  - Full session editing (duration, course, timestamps, notes) and deletion with automatic progress recalculation.
- [x] **Settings & Preferences (`/settings`)**:
  - Daily habit target selection (30m, 45m, 60m, 90m, 120m).
  - IANA timezone validation with clear error feedback for unrecognized timezones.
  - JSON backup download and default reset confirmation modal.

---

## 2. Security & Compliance

- [x] **No hardcoded secrets**: Zero API keys or private credentials in Git history or source files.
- [x] **Service Role Key Protection**: Supabase service-role keys are never exposed to frontend code.
- [x] **Row Level Security (RLS)**: Comprehensive policies written for `user_preferences`, `courses`, `course_lessons`, `learning_sessions`, `course_notes`, and `active_timer_state`.
- [x] **Safe Embeds**: Domain allowlist enforced (`youtube.com`, `youtube-nocookie.com`, `youtu.be`) to prevent clickjacking and malicious iframe injection.
- [x] **HTTP Security Headers**: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-DNS-Prefetch-Control: on`, `Referrer-Policy: origin-when-cross-origin` configured in `next.config.mjs`.

---

## 3. SEO & Discoverability

- [x] **Metadata**: OpenGraph, Twitter cards, keywords, and title templates configured in `src/app/layout.tsx`.
- [x] **Robots**: `src/app/robots.ts` allows public pages and disallows indexing of private user study data (`/dashboard`, `/sessions`, `/settings`, `/courses/`).
- [x] **Sitemap**: `src/app/sitemap.ts` auto-generates `/sitemap.xml`.
- [x] **Branded Favicon**: SVG cap icon added in `public/favicon.svg`.

---

## 4. Performance & Core Web Vitals

- [x] **Automated Responsive Test**: 100% PASS across 360px, 390px, 768px, 1024px, 1440px, and 1920px viewports (0 horizontal overflow issues).
- [x] **Bundle Size**: First Load JS shared by all routes is only 87.3 kB.
- [x] **Fast Cold Start**: Next.js production server initializes in < 700ms.
- [x] **Zero Memory Leaks**: Tickers and intervals are cleaned up on component unmount.

---

## 5. Verification Commands

| Command | Expected Output | Actual Result |
| :--- | :--- | :--- |
| `npm run lint` | `✔ No ESLint warnings or errors` | **PASS (0 warnings)** |
| `npx tsc --noEmit` | Exit code 0 (no output) | **PASS (0 errors)** |
| `npm test` | 19 of 19 tests passing | **PASS (19 tests passed)** |
| `npm run build` | 14 of 14 static pages generated | **PASS (All 14 routes)** |
| `node scripts/test-responsive.mjs` | Total overflow issues: 0 | **PASS (0 issues across 6 viewports)** |

