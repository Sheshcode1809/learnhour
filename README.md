# Learnhour — Course Learning & Habit Tracker

Transform long YouTube playlists and masterclasses into consistent, one-hour daily learning habits.

---

## Overview

Learnhour is a personal learning and productivity tracker designed to help users complete long online courses, YouTube playlists, and masterclasses through consistent daily learning sessions.

Instead of feeling overwhelmed by lengthy courses, Learnhour breaks learning into manageable daily goals, helping users build sustainable habits and monitor their progress.

The platform follows a simple philosophy:

**One hour of focused learning every day can make a meaningful difference.**

---

## Features

### 1. Daily Learning Goals

- Set a default daily learning target of 60 minutes.
- Track daily study progress.
- Monitor completed and remaining learning time.
- Build consistent learning habits.

### 2. Course Management

- Add courses using YouTube video or playlist URLs.
- Automatically partition supported course content into structured daily learning schedules.
- Organize courses and masterclasses.
- Track total, completed, and remaining course duration.
- Monitor course completion percentages.

### 3. Distraction-Free Study Timer

- Integrated study stopwatch.
- Link study sessions to individual courses.
- Start, pause, resume, and finish sessions.
- Monitor live learning duration.
- Celebrate learning milestones.

### 4. Offline Study Tracking

- Manually record learning sessions.
- Add retrospective study entries.
- Track offline learning activities.
- Maintain an accurate learning history.

### 5. Learning Streaks

- Monitor daily learning streaks.
- Track personal best streaks.
- Use timezone-aware date calculations.
- Support IANA timezone handling.
- Ensure streak calculations remain accurate across local midnight.

### 6. Active Study Tools

Learnhour includes an integrated study tools dock:

**Recall Quiz**

- Test understanding after completing lessons.
- Practice recalling important concepts.

**Smart Notes**

- Save important takeaways.
- Store code snippets and learning notes.
- Associate notes with specific lessons.

**Flashcards**

- Create review cards for important concepts.
- Practice terminology and definitions.
- Reinforce learning through active recall.

**Day Plan**

- View daily learning schedules.
- Break larger courses into manageable study sessions.
- Organize learning activities.

### 7. Local-First Storage and Optional Cloud Sync

**Local-first mode**

- Works offline without requiring external API credentials.
- Persists learning data locally.
- Supports personal learning without mandatory registration.

**Optional cloud synchronization**

- Supabase PostgreSQL integration.
- Authentication support.
- Row Level Security (RLS).
- Multi-device synchronization when configured.

### 8. Modern User Interface

Built with a minimal, editorial, and distraction-free design system.

Design palette:

- Background: Warm Ivory `#FAF8F5`
- Progress: Forest Green `#2D5A27`
- Accent: Terracotta `#C85A32`

The interface prioritizes readability, visual consistency, and responsive layouts across desktop, tablet, and mobile devices.

---

## Tech Stack

| Technology        | Purpose                                    |
| ----------------- | ------------------------------------------ |
| Next.js 14        | React framework and App Router             |
| TypeScript 5      | Strictly typed development                 |
| Tailwind CSS 3.4  | Utility-first styling                      |
| Plus Jakarta Sans | Primary typography                         |
| JetBrains Mono    | Monospaced typography                      |
| Lucide React      | Icons                                      |
| Vitest            | Unit testing                               |
| Supabase          | Optional authentication and cloud database |
| PostgreSQL        | Persistent cloud storage                   |

---

## Getting Started

### Prerequisites

- Node.js v18.17.0 or higher
- npm, yarn, or pnpm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Sheshcode1809/learnhour.git

cd learnhour
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local`.

```bash
cp .env.example .env.local
```

The application works in local-first mode without requiring external API credentials.

### 4. Start the Development Server

```bash
npm run dev
```

### 5. Open the Application

Navigate to:

[http://localhost:3000](http://localhost:3000)

---

## Testing and Verification

Run the test suite:

```bash
npm test
```

Run TypeScript checks:

```bash
npx tsc --noEmit
```

Run linting:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

The project includes 19 Vitest test suites covering learning progress, streak calculations, and daily planning.

---

## Optional: Supabase Cloud Sync Setup

Learnhour supports optional cloud synchronization using Supabase.

### Step 1: Create a Supabase Project

Visit [Supabase](https://supabase.com/) and create a project.

### Step 2: Configure the Database

Open the SQL Editor in your Supabase dashboard.

Execute the migration located at:

```text
supabase/migrations/001_initial_schema.sql
```

### Step 3: Configure Environment Variables

Add your Supabase project credentials to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

### Step 4: Restart the Development Server

```bash
npm run dev
```

Verify that authentication, database connectivity, and Row Level Security policies are configured correctly before enabling cloud synchronization.

Never expose your Supabase service-role key in client-side code.

---

## Project Structure

```text
learnhour/
|
├── src/
│   ├── app/
│   │   ├── (auth)/              # Login and signup pages
│   │   ├── courses/             # Course library and player
│   │   │   ├── [id]/            # Course details and study tools
│   │   │   └── new/             # Course creation
│   │   ├── dashboard/           # Learning dashboard
│   │   ├── sessions/            # Timer and session history
│   │   └── settings/            # Goals, timezone, and backups
│   │
│   ├── components/
│   │   ├── course-player/       # Quiz, notes, flashcards, day plan
│   │   ├── courses/             # Course cards and components
│   │   └── layout/              # Sidebar and navigation
│   │
│   ├── context/                 # Learning and auth providers
│   │
│   ├── lib/
│   │   ├── calculations/        # Progress and streak calculations
│   │   ├── storage/             # Local storage and backup helpers
│   │   ├── supabase/            # Supabase configuration
│   │   └── youtube.ts           # YouTube URL parsing and validation
│   │
│   └── tests/                   # Vitest unit tests
│
├── supabase/
│   └── migrations/              # Database schema and RLS policies
│
├── public/                      # Static assets
│
├── .env.example
├── .gitignore
├── package.json
├── next.config.js
├── tailwind.config.ts
└── README.md
```

---

## Deployment

Learnhour can be deployed using Vercel.

Recommended deployment process:

1. Push the project to GitHub.
2. Import the repository into [Vercel](https://vercel.com/).
3. Configure the required production environment variables.
4. Configure Supabase production credentials if cloud synchronization is enabled.
5. Deploy the application.
6. Verify authentication, data persistence, and responsive behavior.

Refer to `DEPLOYMENT.md` for detailed deployment instructions if available.

---

## Future Improvements

Potential future enhancements include:

- Advanced learning analytics.
- Calendar-based study planning.
- Learning reminders and notifications.
- YouTube playlist synchronization.
- AI-powered learning recommendations.
- Advanced course completion reports.
- Exportable learning statistics.

---

## License

This project is distributed under the MIT License.

See the [LICENSE](LICENSE) file for details.

---

## Author

**Shesh Kanade**

GitHub: [@Sheshcode1809](https://github.com/Sheshcode1809)

---

**Learnhour — Learn consistently. Progress every day.**
