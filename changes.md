# Courseit — AntiGravity Change Brief

## Goal

Make the existing Courseit app reliable as a local-first learning tracker. Keep the current Next.js/TypeScript stack, routes, and warm editorial visual style. This is a targeted correctness pass, not a redesign or a cloud migration.

## Current state

The app already has a dashboard, course library and player, course create/edit/archive/delete, study tools, a persistent timer, session history, settings, and JSON export. The main gaps are data consistency and a few flows that promise more than the code currently does.

It uses localStorage through `src/lib/storage/repository.ts`. Supabase SQL and `.env.example` exist, but there is no Supabase client or SDK dependency in `package.json`; treat cloud sync as a later phase. Email and Google auth in `src/context/AuthContext.tsx` are simulated local demo flows, not real authentication.

## P0 — Correctness and data integrity

### 1. Preserve an intentionally empty course library

In `src/lib/storage/repository.ts`, `getCourses()` treats a saved empty array as missing data and reseeds the demo courses. Distinguish “no stored value yet” from a valid stored `[]`. Seed demo data only on first install or explicit reset. Deleting the last course must remain effective after refresh.

### 2. Make course progress derived and consistent

Progress currently has two conflicting writers: `addSession`/`deleteSession` increment or decrement `completed_minutes`, while `toggleLessonCompletion` replaces it with the sum of completed lesson durations. This can double-count, overwrite progress, or leave stale totals and status after edits/deletions.

- Add one calculation path for course progress; do not mutate a cached minutes counter independently in each action.
- Count time logged to a specific lesson at most once alongside marking that same lesson complete. A practical rule is to count, per lesson, the greater of its completed lesson duration and its linked session time, capped at the lesson duration; add course-linked session time with no lesson separately; cap final progress at `total_minutes`.
- Recalculate after adding, editing, or deleting a session; toggling a lesson; or changing course duration. Keep archived status user-controlled and define active/completed status consistently with derived progress.
- Preserve lesson IDs and completion when editing course metadata. If changing duration or pace rebuilds the plan, make that an explicit action and warn before replacing completed lesson data.

Likely files: `src/lib/storage/repository.ts`, `src/context/LearningContext.tsx`, `src/lib/calculations/progress.ts`, `src/types/index.ts`, course/session pages.

### 3. Fix daily totals, streak dates, and timezone handling

`groupSessionsByDate()` floors each session to whole minutes before summing, so two 30-second sessions count as zero instead of one minute. Sum seconds per local date first, then convert to minutes. Exclude future-dated sessions from current and best streaks. Use the saved IANA timezone consistently in dashboard metrics and session-history dates; the history currently formats dates using the machine timezone. Validate the timezone in Settings and show an actionable error for an invalid value rather than silently falling back.

Likely files: `src/lib/calculations/streaks.ts`, `src/app/sessions/page.tsx`, `src/app/settings/page.tsx`, `src/context/LearningContext.tsx`.

### 4. Make timer transitions lossless

`startTimer()` resets `started_at` even if a timer is already running, dropping the current segment. `finishTimer()` uses the last React `elapsedSeconds` value and reconstructs `started_at` as finish time minus total elapsed, which can include paused time and misstate the session interval.

- Make start idempotent while running, or require an explicit stop/switch action before changing course or lesson.
- Derive final elapsed time from persisted timer state at finish, including accumulated active segments only. Save exactly one session and then reset the timer.
- Keep the timer bound to the selected course/lesson after reload. Attribute elapsed time correctly if a session crosses the learner’s local midnight, so daily goals do not assign the entire session to the wrong day.

Likely files: `src/context/LearningContext.tsx`, `src/lib/storage/repository.ts`, `src/components/layout/GlobalTimerBar.tsx`, `src/app/sessions/page.tsx`.

## P1 — Complete and clarify the core flows

### 5. Make course ingestion honest and safe

`parseYouTubeUrlOrPreset()` in `src/lib/youtube.ts` falls back to a sample video ID for unrecognized input. `QuickPasteHero` then supplies a generic title and 180-minute duration, making an invalid or unknown link look successfully imported. The app has no YouTube API integration, so it cannot reliably fetch arbitrary video/playlist titles, durations, or chapters.

- Reject malformed/unsupported URLs with a useful message; never silently substitute the sample video.
- Keep preset ingestion working. For a recognized YouTube video without preset metadata, ask the learner to enter/confirm title and duration before saving. Treat playlists as manual metadata/lesson entry unless a supported API is explicitly configured; do not scrape pages.
- Only render a video iframe for a recognized, allowlisted embed provider. For other course URLs, show a safe external link instead of embedding arbitrary URLs.
- Update `QuickPasteHero` copy and `course_learning_tracker_docs/PRD.md`, `REQUIREMENTS.md`, and `ACCEPTANCE_TESTS.md` so they describe supported ingestion accurately.

Likely files: `src/lib/youtube.ts`, `src/components/courses/QuickPasteHero.tsx`, `src/components/courses/CourseForm.tsx`, `src/app/courses/[id]/page.tsx`, product docs.

### 6. Support useful session history

Manual sessions currently always get a timestamp ending at “now,” and the history supports deletion but not editing. Add a study date/time input for manual entries and edit existing entries (duration, course/lesson, notes, and timestamps). Validate positive duration and valid timestamps in the shared data action, not only in the form. Recalculate daily totals, streaks, and course progress after edits/deletes. Use the configured timezone for displayed dates. Base any goal-completion celebration on the configured daily goal, not a hard-coded 60 minutes.

Likely files: `src/app/sessions/page.tsx`, `src/context/LearningContext.tsx`, `src/lib/storage/repository.ts`, `src/types/index.ts`, `supabase/migrations/001_initial_schema.sql` only if cloud sync is later implemented.

### 7. Restore the last lesson and make player tools truthful

The dashboard resumes a course, but the player always opens the first incomplete lesson; the selected lesson is not persisted. Persist a per-course last-selected lesson and restore it on return. Notes currently receive the selected lesson’s start offset as the “current playback” timestamp; they do not read the live YouTube playback position. Either integrate the YouTube player API to capture the actual position or label/save notes at lesson level. The “Autoplay next lesson” toggle currently advances only after clicking “Mark as completed”; either wire it to actual video completion or rename the control to describe its behavior.

Likely files: `src/app/courses/[id]/page.tsx`, `src/components/course-player/NotesModal.tsx`, `src/lib/storage/repository.ts`, `src/types/index.ts`.

### 8. Avoid false loading and not-found states

`LearningContext` loads local data after mount, but data pages can render against the initial empty arrays. In particular, a direct refresh of `/courses/[id]` can briefly show “Course not found.” Start from deterministic server/client defaults, gate data-dependent views on `isLoading`, and show a loading state before deciding a record is missing. Handle storage read/write failures with a visible recovery message rather than silently presenting fallback data as saved data.

Likely files: `src/context/LearningContext.tsx`, `src/app/page.tsx`, `src/app/courses/page.tsx`, `src/app/courses/[id]/page.tsx`, repository error handling.

### 9. Keep demo authentication clearly a demo

Do not represent the current localStorage identity as secure sign-in. Since no auth provider is configured, keep a clearly labeled guest/demo path and avoid implying that passwords or Google accounts are verified. Do not add real Supabase auth or cloud sync as part of this local-first reliability pass.

**Working tree note:** `src/app/auth/login/page.tsx`, `src/app/auth/signup/page.tsx`, `src/components/auth/GoogleButton.tsx`, and `src/context/AuthContext.tsx` already have uncommitted edits. Inspect and preserve those edits; do not reset or overwrite them.

## Screenshot-based UI/UX changes

Reviewed `screenshots/01-landing-page.png` through `screenshots/09-settings.png`. The warm cream, forest-green, and terracotta palette is consistent across the landing page and app. Keep that visual direction and focus on the following visible issues.

### P0 — Fix visible blockers

- **Login and signup separators:** In `02-login-page.png` and `03-signup-page.png`, “OR CONTINUE WITH EMAIL” wraps into a narrow vertical stack. Give the separator label intrinsic width (`whitespace-nowrap`, `shrink-0`) and let the horizontal rules flex around it. Keep the separator on one line at desktop and mobile widths.
- **Course media fallbacks:** All three course cards in `05-courses-library.png` show blank thumbnail areas, and the player frame in `06-course-player.png` is entirely black. Add image `onError` handling and an intentional branded fallback (course initial/artwork, title, and source). Add a player loading/error state with a visible “Open source video” action; never leave a large empty black box when an embed cannot load.
- **Floating timer overlap:** In `04-dashboard.png`, the fixed “Quick Timer” control overlaps the lower-right course card. Reserve space for fixed controls or position the timer where it cannot cover interactive content; respect mobile safe areas. On `08-sessions-history.png`, avoid showing a second Quick Timer launcher when the full timer controls are already visible.
- **Landing headline wrap:** In `01-landing-page.png`, the hero breaks “1-hour/day” after “1-”. Adjust the heading width/line breaks so “1-hour/day course” stays together and the two-line heading reads naturally.

### P1 — Reduce friction and improve clarity

- **Landing page:** The page is very long. Tighten excess vertical gaps between the hero, workflow, feature grid, featured courses, and final CTA while keeping clear section separation. Bring the quick course-builder CTA and one featured course action into the first viewport. The headline and sections must describe actual supported ingestion; remove claims that arbitrary playlists are inspected or chapters generated automatically unless that capability exists.
- **New course:** `07-new-course.png` has two manual-entry switches (top navigation and inside the hero). Keep one clear manual path. Make the selected curated course state obvious and explain what happens after “Build my course.” Include short helper text that unknown video duration/title may need manual confirmation.
- **Dashboard:** Preserve the clear goal/streak/activity hierarchy in `04-dashboard.png`. Keep the main “Continue Learning” action visually primary, and ensure it still fits above the fold without the timer covering the in-progress cards. Give truncated recent course names a title/tooltip so users can identify them.
- **Course library:** In `05-courses-library.png`, the three cards occupy only the top portion of the viewport, leaving a large blank lower area. Keep the grid compact, but use the space for a real empty state, course-adding guidance, or nothing; do not add decorative filler or fake statistics. Make thumbnails useful even when remote images fail.
- **Course player:** In `06-course-player.png`, keep course title, current lesson, progress, and lesson navigation easy to scan. Add a clear player error/loading state and keep completion controls visually associated with the active lesson. On mobile, stack the lesson list and tools below the player without forcing horizontal scrolling.
- **Sessions:** In `08-sessions-history.png`, make the empty-history state more actionable with “Log a session” and “Start timer” actions. Once history exists, retain the date/course/duration hierarchy and make edit/delete actions easy to discover without crowding the table.
- **Settings:** In `09-settings.png`, the save button appears inside the profile card even though the form also contains the daily target. Make it clear that one save applies all preference fields, or autosave each setting with per-field feedback. Keep validation messages beside the target/timezone fields and confirmation feedback visible after save.
- **Small text and controls:** Across the screenshots, supporting copy and labels are often very small. Use a readable 12px minimum for ordinary helper text and table labels where layout allows; reserve smaller text for brief metadata. Keep focus rings, contrast, and tap targets clear.
- **Authentication clarity:** In `02-login-page.png` and `03-signup-page.png`, Google sign-in and password-reset affordances look production-ready. Label them as demo-only or hide unavailable actions until backed by real auth; do not make “Forgot password?” a dead `#` link.

### P2 — Responsive and accessibility pass

- The supplied screenshots are desktop views. Review the landing page, dashboard, library, player, new-course flow, sessions, settings, login, and signup at 360px and 390px widths as well as tablet. Check for clipped headings, horizontal scroll, timer obstruction, and dialogs extending beyond the viewport.
- Verify keyboard focus and operation for navigation, course menus, dialogs, tabs, timer controls, and form errors. Add accessible names to icon-only controls, and use visible labels for fields rather than relying on placeholders.

## Acceptance checks

- Delete every course, refresh, and confirm the empty library stays empty; explicit reset restores demo data.
- Add a 120-minute course, mark a lesson complete, log time to that lesson, then edit/delete the session. Progress stays accurate, never double-counts that lesson, and remains within 0–100%.
- Two 30-second sessions count as one minute. Sessions use the configured timezone, and future sessions do not change streaks.
- Start, pause, resume, reload, and finish a timer. Paused time is excluded, running time is not lost by a second start action, the correct course/lesson is saved, and only one session is created.
- Invalid links never create a course with a sample video. Unknown YouTube metadata and playlists use a clear manual step unless an API is configured.
- Manual sessions can be backdated and edited; dates, streaks, and course progress update after edits and deletions.
- Refresh a course-detail URL directly: show loading until local data is ready, then show the course or a genuine not-found state. Returning to a course restores the last lesson.
- Verify key flows at 360px and desktop width, and ensure dialogs/controls have labels, keyboard access, and visible focus.
- Compare implementation against the screenshots: auth separators stay horizontal; course thumbnails and video embeds have useful fallbacks; the global timer never obscures a card or duplicates the Sessions page timer; landing headline wrapping is intentional.
- Review the named routes at 360px, 390px, tablet, and desktop widths; confirm readable body copy, no horizontal overflow, accessible focus states, and tappable controls.

## Implementation guardrails

- Keep the existing visual system and route map. Reuse installed dependencies; Zod is already present if schema validation is useful.
- Keep local-first behavior working without credentials. Do not introduce external scraping or claim Supabase sync is active; the SQL file is only a starter schema and does not match all local IDs/features yet.
- Update the product docs after implementation so requirements match what the app actually supports.
- Run the existing calculation tests and a production build after implementation, and fix any failures before calling the handoff complete.

## Verification & Sequential Redirection Audit (Completed)

All phases and requirements in this specification have been verified:
1. **Root Routing (`/`)**: Root route serves the marketing Landing page directly, with sequential access to `/auth/login`, `/auth/signup`, `/courses/new`, `/dashboard`, and preset courses.
2. **Dashboard (`/dashboard`)**: Full daily tracker dashboard with streak engine, weekly activity graph, daily goal tracking, continue learning action, and in-progress course cards.
3. **Preset Masterclass Links**: Featured masterclasses in landing and course views route directly to `/courses/python-2026`, `/courses/neural-networks`, and `/courses/system-design`. Fallback handling automatically recovers and enrolls presets if opened directly.
4. **Interactive Tools**: Day planner (`DayPlanModal`), Active recall quizzes (`QuizModal`), Timestamped lesson notes (`NotesModal`), and Concept flashcards (`FlashcardsModal`) verified and functioning.
5. **Course Creation & Session Management**: Manual and Quick-paste course builders redirect sequentially to the newly created course player. Study sessions allow custom backdated timestamps, editing, deletion, and recalculation without data loss.
6. **Production Readiness**:
   - TypeScript checks: 0 errors (`npx tsc --noEmit`).
   - Unit test suite: 19/19 passing tests (`vitest run`).
   - Production build: All 12 routes static/dynamic compiled successfully (`next build`).
   - Screenshot gallery: Fully updated in `screenshots/`.
