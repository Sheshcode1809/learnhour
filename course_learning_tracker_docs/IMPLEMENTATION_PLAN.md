# Implementation Plan

## Phase 0 — Documentation and Discovery
- [x] Inspect reference video (extracted frames, analyzed UI, color palette, workflows, course player, quiz modal, day planner).
- [x] Inspect existing directory structure and tools.
- [x] Update and align all Markdown docs (`PRD.md`, `REQUIREMENTS.md`, `UI_UX_SPEC.md`, `TECHNICAL_ARCHITECTURE.md`, `DATA_MODEL.md`, `IMPLEMENTATION_PLAN.md`, `ACCEPTANCE_TESTS.md`, `README.md`).
- [x] Present architecture, page map, data model, and review to user.

## Phase 1 — Project Foundation & Shell
- Initialize Next.js project with TypeScript and Tailwind CSS.
- Configure color tokens (`cream`, `charcoal`, `forest-green`, `terracotta`) and typography.
- Build responsive App Shell:
  - Sidebar with logo "Courseit", "+ New course" CTA, navigation links (`Today`, `My courses`, `Sessions`, `Settings`), recents list, and user profile pill.
  - Mobile header and responsive drawer.
  - Persistent global floating timer bar.
- Verification: run Next.js, check console, verify responsive shell layout at 360px and 1200px.

## Phase 2 — Core Data Domain, Persistence & Calculations
- Implement complete TypeScript types (`Course`, `Lesson`, `Session`, `UserPreferences`, `TimerState`).
- Implement `LocalCourseRepository` with seed courses from reference video (10hr Python, 8hr Neural Networks, 12hr System Design).
- Build mathematical domain utilities:
  - `progress.ts` (course percentages, completed & remaining minutes, clamping).
  - `streaks.ts` (calendar day streaks, handling today/yesterday/missed days).
  - `dayPlanner.ts` (automatic division of any video into ~60 min days).
  - `youtube.ts` (URL parser for video ID, embed URLs, and duration heuristics).
- Implement unit tests for all calculations with Vitest.
- Verification: run tests and ensure 100% pass rate.

## Phase 3 — Course Management & "Paste a Long Video" Ingestion
- Build `/courses/new` with:
  - Quick-paste Hero matching reference video: "Paste a long video. Get a course."
  - Auto-parsing of YouTube links, generating day-by-day lesson schedule.
  - Manual course builder with full form validation.
  - Quick-start presets for popular developer courses.
- Build `/courses` library page with search, status filters (Active, Completed, Archived), progress bars, and course cards.
- Add course editing, archiving, and deletion with confirmation dialog.
- Verification: Add, edit, archive, and delete courses; check TypeScript and browser console.

## Phase 4 — Interactive Course Player & Study Tools
- Build `/courses/[id]` interactive learning experience:
  - Embedded video player with YouTube player integration and autoplay toggle.
  - Day tabs (`Day 1 *`, `Day 2`, `Day 3`...).
  - Interactive lesson checklist with "Mark as completed" and instant progress recalculation.
  - Study tools:
    - **Quiz Modal**: Real multiple-choice quiz questions with interactive selection and scoring.
    - **Notes Modal**: Timestamped notes list with add note form and local persistence.
    - **Flashcards Modal**: Flippable study cards for core concepts.
- Verification: Navigate lessons, switch days, take quiz, save notes, test video embed.

## Phase 5 — Study Timer, Session Logging & History
- Complete persistent study timer:
  - Accessible globally and within course player.
  - Start, pause, resume, and finish.
  - Automatic session creation linked to active course upon finish.
- Build `/sessions` page:
  - Manual session entry modal (for offline or untracked study).
  - Chronological session table with filtering, deletion, and notes view.
- Verification: Run timer, navigate pages, reload page, ensure no lost state, verify session creation.

## Phase 6 — Dashboard ("Today") & Habit Tracking
- Build `/` ("Today") dashboard:
  - Scenic illustrated nature banner.
  - Daily goal progress card (e.g. 45/60 min with progress ring / bar).
  - Streak card (fire badge, current streak, best streak).
  - "Continue Learning" hero card resuming the latest active course.
  - Weekly 7-day learning activity bar chart.
  - Active courses quick-access section.
- Build `/settings` page:
  - Daily target minute configuration (e.g., 30m, 45m, 60m, 90m).
  - Profile name and timezone.
  - Data backup: Export JSON and Reset database actions.
- Verification: Change daily goal, observe instant recalculation across dashboard and streaks.

## Phase 7 — Supabase Migrations, Testing & Final Polish
- Generate complete Supabase SQL schema migrations (`supabase/migrations/001_initial_schema.sql`) with RLS policies.
- Create `.env.example` with Supabase configuration parameters.
- Run complete test suite and production build (`npm run build`).
- Verify no TypeScript errors, no broken links, and full responsiveness across devices.
- Update documentation with final operational notes.
