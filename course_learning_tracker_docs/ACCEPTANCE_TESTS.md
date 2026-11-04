# Acceptance Tests

## Course Management & Ingestion
- [ ] User can paste a preset YouTube masterclass URL on `/courses/new` and auto-populate title, duration, lessons, and day-wise plan.
- [ ] User pasting a custom YouTube URL is prompted with an explicit confirmation step for title and duration (no silent fallbacks to unrelated sample videos).
- [ ] Invalid or unsupported video links show clear actionable error messages and cannot create courses with dummy videos.
- [ ] User can manually create a course with title, provider, duration, and description.
- [ ] Form validation prevents negative or empty durations.
- [ ] Course list shows active courses with accurate progress bars and remaining study time.
- [ ] Deleting every course persists an empty course library across page reloads without re-injecting sample courses.
- [ ] Reset button in `/settings` explicitly restores demo sample data.
- [ ] User can edit course metadata and preserve custom lessons/progress unless explicitly requesting plan rebuild.
- [ ] User can archive and delete a course with confirmation dialog.

## Day-Wise Plan & Interactive Course Player
- [ ] Direct page refresh of `/courses/[id]` displays a loading state and never prematurely flashes a "Course not found" screen.
- [ ] Course detail/player page breaks long courses into `Day 1`, `Day 2`, `Day 3` tabs.
- [ ] Lessons under each day tab show status, duration, and order.
- [ ] Selecting a lesson switches video playback and persists `last_selected_lesson_id` per course so returning restores the last active lesson.
- [ ] Allowlisted embed URLs render in the video player; non-allowlisted links present a safe external link banner.
- [ ] "Auto-advance on completion" toggle switches to the next lesson when active lesson is marked complete.
- [ ] Clicking "Mark as completed" marks the active lesson complete and updates derived course progress percentage immediately without double-counting.
- [ ] Interactive Quiz modal opens, allows selecting choices, and calculates score with instant explanations.
- [ ] Notes modal opens, displays existing pinned notes with lesson context and editable minute markers, and allows saving new notes.
- [ ] Flashcards modal allows flipping cards to review key concepts.

## Learning Sessions & Timer
- [ ] Study timer starts, pauses, resumes, and finishes accurately.
- [ ] Starting the timer multiple times or switching course targets preserves accumulated seconds losslessly.
- [ ] Timer state persists across route navigation and page reloads without silent resets.
- [ ] Finishing a timer saves a single new learning session with start timestamp derived from session start epoch and updates course progress.
- [ ] User can log a manual session on `/sessions` with duration, course selection, and custom backdated date/time.
- [ ] User can edit existing sessions (duration, course, notes, date/time) with immediate recalculation of streaks and course progress.
- [ ] Sessions with zero or negative duration are strictly rejected.
- [ ] Sessions can be deleted with immediate recalculation of course progress and streaks.
- [ ] Two 30-second sessions sum to 1 minute on that day (seconds aggregated before minute conversion).

## Goals, Streaks & Dashboard
- [ ] Dashboard displays Today's completed minutes vs configured daily goal (e.g. 60 min).
- [ ] Goal completion confetti celebration triggers based on configured daily goal (not hard-coded 60m).
- [ ] Current streak correctly calculates consecutive days meeting the daily target in configured IANA timezone.
- [ ] Future-dated sessions do not artificially inflate or advance streaks.
- [ ] Best streak accurately captures maximum consecutive completed days in user history.
- [ ] Weekly activity chart accurately reflects minutes studied over the last 7 days.
- [ ] "Continue Learning" button navigates directly to the most recently active course and restores the last active lesson.

## Settings & Persistence
- [ ] Changing daily target in `/settings` updates goal progress and streaks immediately.
- [ ] Timezone input validates valid IANA timezones and shows error for invalid entries.
- [ ] All data persists in local storage across browser refreshes and restarts.
- [ ] Data export generates a clean JSON backup file.
- [ ] Clearly labeled guest/demo auth indicates local-first execution.

## Responsive UI & Accessibility
- [ ] Layout renders cleanly without horizontal scroll at 360px mobile width.
- [ ] Responsive navigation drawer / bottom bar on mobile viewports.
- [ ] Proper contrast and font readability on warm cream palette (`#FAF8F5`).
- [ ] Semantic HTML and accessible aria attributes on buttons, inputs, and modals.
