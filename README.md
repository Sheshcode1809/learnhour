# Learnhour — Course Learning & Habit Tracker ⏱️📚

> Transform long YouTube playlists and masterclasses into consistent, 1-hour daily learning habits.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Ready-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tests](https://img.shields.io/badge/Vitest-19%2F19%20Passing-6E9F18?style=flat-square&logo=vitest)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

## ✨ Features

- **🎯 1-Hour Daily Habit Focus**: Splits comprehensive masterclasses and tutorials into manageable 1-hour study chunks so you finish courses steadily.
- **⚡ Quick Paste & Course Generator**: Paste any YouTube video or playlist link to automatically partition it into structured daily syllabus schedules.
- **⏱️ Distraction-Free Study Timer**: Integrated stopwatch with course-linking, live focus ticker, pause, resume, and milestone confetti celebrations.
- **📝 Offline Study & Backdating**: Log offline learning sessions with retrospective date and time entry.
- **🔥 Habit Streaks & Timezone Accuracy**: Timezone-aware streak tracking (IANA compliant) ensuring your streak updates accurately at local midnight.
- **🧠 Active Study Tools Dock**:
  - **Recall Quiz**: Test conceptual understanding after each lesson.
  - **Smart Notes**: Save key takeaways and code snippets linked to specific lessons.
  - **Flashcards**: Quick-flip review cards for core terminology and principles.
  - **Day Plan**: High-level daily syllabus breakdown.
- **💾 Local-First with Optional Cloud Sync**:
  - Works 100% offline out-of-the-box using persistent local storage.
  - Multi-device cloud sync ready via Supabase PostgreSQL with Row Level Security (RLS).
- **🎨 UI/UX Pro Max Design System**: Minimal, editorial, and calm aesthetics with warm ivory canvas (`#FAF8F5`), forest green progress indicators (`#2D5A27`), and terracotta flame accents (`#C85A32`).

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **Typography**: Google Fonts via `next/font` (`Plus Jakarta Sans` & `JetBrains Mono`)
- **Icons**: Lucide React
- **Testing**: Vitest (19 unit test suites covering progress, streaks, and day planners)
- **Database / Auth (Optional)**: Supabase (PostgreSQL + RLS)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.17.0 or higher
- **npm** or **yarn** or **pnpm**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Sheshcode1809/learnhour.git
   cd learnhour
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   *(The application works out of the box in local-first mode without requiring external API keys).*

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🧪 Testing & Verification

Run the test suite:
```bash
npm test
```

Typecheck with TypeScript:
```bash
npx tsc --noEmit
```

Lint code:
```bash
npm run lint
```

Build for production:
```bash
npm run build
```

---

## 🗄️ Optional: Supabase Cloud Sync Setup

To enable multi-device synchronization and PostgreSQL storage:

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Run the complete migration schema located at:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
4. Copy your project credentials into `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```
5. Restart your server (`npm run dev`). Your app will automatically switch to cloud-backed persistence!

---

## 📂 Project Structure

```text
├── src/
│   ├── app/                    # Next.js App Router routes
│   │   ├── (auth)/             # Login & signup authentication pages
│   │   ├── courses/            # Course library, creator, & cinema player
│   │   │   ├── [id]/           # Lesson player & study tools dock
│   │   │   └── new/            # Course creation hero & manual builder
│   │   ├── dashboard/          # Today overview, habit meter, & activity chart
│   │   ├── sessions/           # Focus stopwatch & study session history
│   │   └── settings/           # Habit targets, timezone, & JSON backups
│   ├── components/             # Reusable UI & course components
│   │   ├── course-player/      # Quiz, notes, flashcards, & day plan modals
│   │   ├── courses/            # Course cards, scenic banner, & hero
│   │   └── layout/             # Sidebar, mobile drawer, & global timer bar
│   ├── context/                # Learning & Auth React context providers
│   ├── lib/
│   │   ├── calculations/       # Progress, streaks, & day planner formulas
│   │   ├── storage/            # Local-first repository & backup helpers
│   │   ├── supabase/           # Optional Supabase client configuration
│   │   └── youtube.ts          # YouTube URL parser & embed validators
│   └── tests/                  # Vitest calculation unit tests
├── supabase/
│   └── migrations/             # Production PostgreSQL schema & RLS policies
└── public/                     # Static assets & screenshots
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
