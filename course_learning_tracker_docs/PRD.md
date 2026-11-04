# Product Requirements Document (PRD)

## 1. Product summary
A personal learning tracker that turns long courses and video playlists into manageable daily study sessions, inspired directly by the reference video. The default habit is **60 minutes per day**.

## 2. Problem
Learners save long tutorials (8, 10, 12+ hours) and courses but struggle to track what they have completed, how much remains, and whether they are making consistent daily progress. The product reduces friction by converting long video courses into structured day-wise plans with an integrated timer, progress tracker, and focused learning environment.

## 3. Target users
- Self-directed learners taking long online courses and YouTube tutorials.
- Developers learning programming, AI/ML, system design, or engineering topics.
- Students needing steady habit enforcement (1 hour a day) rather than binge-watching without retention.

## 4. Value proposition
“Stop watching 12-hour YouTube lectures without finishing. Paste a long video, get a daily 1-hour study course, track your streak, and retain what you learn.”

## 5. Core Features & User Journeys
1. **Effortless Course Ingestion & Creation**:
   - Paste a YouTube video or preset URL ("Paste a long video. Get a course.").
   - Curated presets (e.g. 10-hour Python masterclass) auto-populate lessons, video timestamps, and descriptions.
   - Custom YouTube URLs extract verified video IDs and allowlisted embed links, prompting the user for honest confirmation of course title and total duration (no silent fallbacks to unrelated sample videos or fake scraping).
   - Or create custom/manual courses with title, provider, duration, and description.
   - Intelligent day-wise curriculum generator divides multi-hour courses into daily bite-sized (~60m) learning days (Day 1, Day 2, Day 3, etc.).
2. **Interactive Course Learning Player**:
   - Embedded video player with allowlisted domain verification (trusted YouTube embed targets) and external fallback link for untrusted URLs.
   - Day-wise split tabs (`Day 1`, `Day 2`, `Day 3`...) with automatic restoration of the user's `last_selected_lesson_id` per course.
   - Auto-advance on completion toggle that transitions to the next lesson once the active lesson is marked complete.
   - Interactive study tools:
     - **Quiz**: Interactive multiple-choice review quizzes per course/day with immediate feedback.
     - **Notes**: Lesson-linked notes with explicit lesson title labeling and editable playback minute markers.
     - **Flashcards**: Key concepts and terms for quick spaced repetition.
3. **Session Timer & Learning Progress**:
   - Floating and in-page study timer (start, pause, resume, finish) with lossless segment accumulation and idempotent timer start guards.
   - Manual session logging with duration, backdated study date/time, and course association.
   - Full session history management: view, edit (date, duration, course, notes), and delete sessions with positive duration validation (>0 seconds).
   - Real-time updates to daily goal progress (configured via preferences) and derived course percentage.
4. **Dashboard & Habit Tracking**:
   - Greeting, current date, and daily learning target (completed vs remaining minutes) formatted in user's configured IANA timezone.
   - Current streak and best streak calculations aggregating second-level session data per local date before minute flooring, strictly excluding future-dated sessions.
   - Weekly learning summary breakdown.
   - "Continue learning" quick-resume action navigating back to the last active course and restoring the last active lesson.
   - Course library with progress bars, status filters, and persistent empty state handling (empty libraries remain empty upon reload).
5. **Settings & Data Management**:
   - Configurable daily study goal (default: 60 minutes).
   - Validated IANA timezone selection (with fallback to system timezone).
   - Data export / backup and explicit demo data reset options.
   - Local-first persistence in browser localStorage with clear demo authentication branding.

## 6. Success criteria
- A new user can add a course (via verified preset, YouTube URL with manual confirmation, or custom entry) in under 30 seconds.
- Day-wise plan accurately breaks long courses into structured daily modules.
- Daily study timer and manual sessions accurately increment course progress via a single derived calculation rule that prevents double-counting or progress drift.
- Deleting all courses persists an empty library across reloads without unwanted sample course reseeding.
- Interactive course player supports YouTube video embeds, lesson completion, quizzes, notes, and restores the last viewed lesson.
- Responsive design functions cleanly on mobile (360px) and desktop (1440px+).
- Clean offline-first data persistence with zero data loss on page refresh.
