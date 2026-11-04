# Acceptance Tests

## Course Management & Ingestion
- [ ] User can paste a YouTube URL on `/courses/new` and click "Build my course" to generate a day-wise plan.
- [ ] User can manually create a course with title, provider, duration, and description.
- [ ] Form validation prevents negative or empty durations.
- [ ] Course list shows active courses with accurate progress bars and remaining study time.
- [ ] User can edit course metadata and see changes reflected instantly.
- [ ] User can archive and delete a course with confirmation dialog.

## Day-Wise Plan & Interactive Course Player
- [ ] Course detail/player page breaks long courses into `Day 1`, `Day 2`, `Day 3` tabs.
- [ ] Lessons under each day tab show status, duration, and thumbnail.
- [ ] Clicking a lesson switches video playback.
- [ ] Clicking "Mark as completed" marks the active lesson complete and updates course progress percentage immediately.
- [ ] Interactive Quiz modal opens, allows selecting choices, and calculates score with instant explanations.
- [ ] Notes modal opens, displays existing pinned notes, and allows saving new notes.
- [ ] Flashcards modal allows flipping cards to review key concepts.

## Learning Sessions & Timer
- [ ] Study timer starts, pauses, resumes, and finishes accurately.
- [ ] Timer state persists across route navigation and page reloads without silent resets.
- [ ] Finishing a timer saves a new learning session and updates the course's completed time.
- [ ] User can log a manual session on `/sessions` with duration and course selection.
- [ ] Sessions with zero or negative duration are rejected.
- [ ] Sessions can be deleted with immediate recalculation of course progress and streaks.

## Goals, Streaks & Dashboard
- [ ] Dashboard displays Today's completed minutes vs configured daily goal (e.g. 60 min).
- [ ] Current streak correctly calculates consecutive days meeting the daily target.
- [ ] Best streak accurately captures maximum consecutive completed days in user history.
- [ ] Weekly activity chart accurately reflects minutes studied over the last 7 days.
- [ ] "Continue Learning" button navigates directly to the most recently active course and resumes playback.

## Settings & Persistence
- [ ] Changing daily target in `/settings` (e.g. from 60m to 45m) updates goal progress and streaks immediately.
- [ ] All data persists in local storage across browser refreshes and restarts.
- [ ] Data export generates a clean JSON backup file.
- [ ] Supabase SQL migration files and environment configurations are provided for production cloud deployment.

## Responsive UI & Accessibility
- [ ] Layout renders cleanly without horizontal scroll at 360px mobile width.
- [ ] Responsive navigation drawer / bottom bar on mobile viewports.
- [ ] Proper contrast and font readability on warm cream palette (`#FAF8F5`).
- [ ] Semantic HTML and accessible aria attributes on buttons, inputs, and modals.
