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
   - Paste a YouTube video or playlist URL ("Paste a long video. Get a course.").
   - Or create custom/manual courses with title, provider, duration, and description.
   - Intelligent day-wise curriculum generator that divides multi-hour courses into daily bite-sized (~60m) learning days (Day 1, Day 2, Day 3, etc.).
2. **Interactive Course Learning Player**:
   - Embedded video player with autoplay toggle, lesson navigation, and completion toggle.
   - Day-wise split tabs (`Day 1`, `Day 2`, `Day 3`...).
   - Interactive study tools:
     - **Quiz**: Interactive multiple-choice review quizzes per course/day with immediate feedback.
     - **Notes**: Pinned notes with timestamps and markdown support.
     - **Flashcards**: Key concepts and terms for quick spaced repetition.
3. **Session Timer & Learning Progress**:
   - Floating and in-page study timer (start, pause, resume, finish).
   - Manual session logging with duration, notes, and course association.
   - Real-time updates to daily goal progress (e.g. 60 minutes default) and course percentage.
4. **Dashboard & Habit Tracking**:
   - Greeting, current date, and daily learning target (completed vs remaining minutes).
   - Current streak and best streak calculations based on completed daily goals.
   - Weekly learning summary breakdown.
   - "Continue learning" quick-resume action for the most recently active course.
   - Course library with progress bars and status filters.
5. **Settings & Data Management**:
   - Configurable daily study goal (default: 60 minutes).
   - Timezone configuration.
   - Data export / backup and reset options.
   - Local-first persistence with seamless Supabase cloud sync ready.

## 6. Success criteria
- A new user can add a course (via URL or manual entry) in under 30 seconds.
- Day-wise plan accurately breaks long courses into structured daily modules.
- Daily study timer and manual sessions accurately increment course progress and streak counters.
- Interactive course player supports YouTube video embeds, lesson completion, quizzes, and notes.
- Responsive design functions cleanly on mobile (360px) and desktop (1440px+).
- Clean offline-first data persistence with zero data loss on page refresh.
