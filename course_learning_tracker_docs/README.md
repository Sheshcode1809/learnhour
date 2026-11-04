# Courseit — Course & Learning Progress Tracker

A focused, elegant web application designed to help learners conquer 8-, 10-, and 12-hour YouTube video lectures and online courses by studying for **one hour a day**.

Directly inspired by the reference video:
> *"Stop watching 12-hour YouTube lectures without finishing. Paste a long video, get a daily 1-hour study course, track your streak, and retain what you learn."*

---

## Key Features

1. **"Paste a long video. Get a course."**
   - Paste any YouTube video or playlist link to automatically build a structured day-by-day learning plan.
   - Intelligent day-wise curriculum generator dividing multi-hour tutorials into bite-sized daily modules (~60 mins each).
   - Also supports manual course creation with custom providers, duration, and descriptions.

2. **Interactive Course Player**
   - Embedded video player with YouTube embed support and lesson timeline.
   - Day tabs (`Day 1`, `Day 2`, `Day 3`...) with lesson checklists and active progress indicators.
   - **Study Tools**:
     - **Interactive Quiz**: Test retention with instant feedback and answer explanations.
     - **Timestamped Notes**: Pin notes directly to learning moments.
     - **Flashcards**: Flippable study cards for key concepts.

3. **Habit Enforcement & Session Timer**
   - Persistent floating study timer (start, pause, resume, finish) that stays running across route transitions and page refreshes.
   - Manual study session logging for offline learning.
   - Real-time aggregation of today's study minutes against your daily target (default: 60 minutes).

4. **Calm, Editorial Dashboard ("Today")**
   - Scenic illustrated nature banner bringing warmth and focus to your workspace.
   - Daily target card (completed vs remaining minutes).
   - Learning streak counter (current streak & best streak).
   - "Continue Learning" instant resume action for your active course.
   - 7-day weekly study activity visual chart.

5. **Storage & Cloud Sync Architecture**
   - **Local-first**: Works instantly out of the box with zero configuration via `localStorage`, seeded with high-quality sample courses (Python 2026, Neural Networks, System Design).
   - **Supabase-ready**: Full Postgres schema migrations with Row Level Security (RLS) provided under `supabase/migrations/` for multi-device cloud sync.

---

## Tech Stack

- **Next.js 14 / App Router**
- **TypeScript** (Strict mode)
- **Tailwind CSS** (Editorial warm cream `#FAF8F5`, deep charcoal, forest green `#2D5A27`, terracotta `#C85A32`)
- **Lucide React Icons**
- **Zod Validation**
- **Vitest** for calculation unit testing
- **Supabase** (Postgres + Auth RLS migrations ready)

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run unit tests
```bash
npm test
```

### 4. Build for production
```bash
npm run build
```

---

## Supabase Production Setup (Optional)

1. Create a project at [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env.local` and set your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Run the SQL migrations found in `supabase/migrations/001_initial_schema.sql` in the Supabase SQL Editor.
