# Technical Architecture

## Stack
- **Framework**: Next.js (App Router, Server & Client Components)
- **Language**: TypeScript (strict mode, zero `any`)
- **Styling**: Tailwind CSS with custom theme tokens matching the reference video (warm beige `#FAF8F5`, charcoal `#1C1917`, forest green `#2D5A27`, terracotta `#C85A32`)
- **Icons**: Lucide React
- **Validation**: Zod schema validation
- **Persistence**: Hybrid Storage Architecture:
  - Client-safe, zero-config local storage repository (`LocalCourseRepository`) ensuring instant offline readiness and seamless persistence.
  - Supabase client and schema migrations (`supabase/migrations/`) ready for multi-device sync with Row Level Security (RLS).
- **Testing**: Vitest unit tests for calculations (streaks, durations, daily targets).

## Architecture & Code Organization
```text
src/
  app/
    layout.tsx               # Root layout, theme provider, global timer provider
    page.tsx                 # Dashboard ("Today") view: daily goal, streak, recents
    courses/
      page.tsx               # My Courses library with status filters and progress
      new/page.tsx           # "Paste a long video. Get a course" & manual builder
      [id]/page.tsx          # Interactive Course Player (video, day tabs, lessons, study tools)
    sessions/
      page.tsx               # Learning sessions history, manual session entry, timer
    settings/
      page.tsx               # Daily target preferences, timezone, backup/export
    globals.css              # Theme CSS variables & Tailwind styles
  components/
    layout/
      Sidebar.tsx            # Left navigation with brand, links, recents, and user pill
      Header.tsx             # Responsive header with mobile drawer toggle
      GlobalTimerBar.tsx     # Persistent floating study timer widget
    dashboard/
      DailyGoalCard.tsx      # Target vs completed minutes visual indicator
      StreakCard.tsx         # Streak flame, current streak, best streak
      WeeklySummaryChart.tsx # 7-day bar breakdown of study minutes
      ContinueLearning.tsx   # Hero resume card for most recent course
      CourseGrid.tsx         # Responsive course cards with progress bars
    course-player/
      VideoPlayer.tsx        # YouTube / embeddable responsive player
      DayTabs.tsx            # Day 1, Day 2, Day 3 lesson split
      LessonList.tsx         # Lesson playlist with completion checks
      QuizModal.tsx          # Interactive quiz modal with feedback
      NotesModal.tsx         # Video notes pinned to timestamps
      FlashcardsModal.tsx    # Spaced repetition flashcards
    courses/
      CourseForm.tsx         # Manual course creation & edit form
      QuickPasteHero.tsx     # "Paste a long video. Get a course." component
    sessions/
      ManualSessionModal.tsx # Log study session manually
      SessionTable.tsx       # Filterable session logs
    ui/                      # Reusable buttons, badges, modals, inputs, progress bars
  features/
    storage/
      repository.ts          # Storage abstraction interface
      localStorageAdapter.ts # LocalStorage implementation with seed presets
      supabaseAdapter.ts     # Supabase implementation
    context/
      LearningContext.tsx    # State provider for courses, sessions, active timer, preferences
  lib/
    calculations/
      progress.ts            # Course percentage, completed & remaining minutes
      streaks.ts             # Streak calculation across calendar days
      dayPlanner.ts          # Logic to break N-hour course into 60m daily plans
    youtube.ts               # YouTube URL parser and chapter/preset extractor
    types.ts                 # Full TypeScript interfaces
```

## Calculation & Data Integrity Logic
1. **Course Completion & Remaining Duration**:
   - `completedMinutes`: sum of completed lesson minutes or linked session durations.
   - `remainingMinutes`: `Math.max(0, totalMinutes - completedMinutes)`.
   - `percentage`: `totalMinutes > 0 ? Math.min(100, Math.round((completedMinutes / totalMinutes) * 100)) : 0`.
2. **Daily Goal Calculation**:
   - Filter all sessions where `session.started_at` matches the user's local date (`YYYY-MM-DD`).
   - Sum `duration_seconds` and convert to minutes: `todayMinutes = Math.floor(totalSeconds / 60)`.
   - Status: Complete if `todayMinutes >= dailyGoalMinutes`.
3. **Streak Calculation**:
   - Iterate backward from today.
   - If today is complete, streak includes today. If today is in progress, it does not break yesterday's streak.
   - Consecutive preceding days with `>= dailyGoalMinutes` increment `currentStreak`.
   - `bestStreak`: maximum consecutive completed days found in full history.
4. **Persistent Timer Logic**:
   - Timer records `startedAt` timestamp when running.
   - On tick or page reload: `elapsed = accumulatedSeconds + Math.floor((Date.now() - startedAt) / 1000)`.
   - Stored in persistent storage on every state transition (start, pause, reset, finish) to prevent data loss.
