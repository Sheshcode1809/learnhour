-- Learnhour starter schema only. The application does not currently read/write these tables.
-- Do not describe this migration as active cloud synchronization or run it as a launch step.

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. User Preferences Table
create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text not null default 'Learner',
  daily_goal_minutes integer not null default 60 check (daily_goal_minutes > 0),
  timezone text not null default 'Asia/Kolkata',
  tier text not null default 'Free beta',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Courses Table
create table if not exists public.courses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  provider text not null default 'YouTube',
  course_url text not null,
  embed_url text not null,
  thumbnail_url text,
  description text,
  total_minutes integer not null check (total_minutes > 0),
  completed_minutes integer not null default 0 check (completed_minutes >= 0),
  daily_pace_minutes integer not null default 60 check (daily_pace_minutes > 0),
  status text not null default 'active' check (status in ('active', 'completed', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index courses by user and status
create index if not exists idx_courses_user_status on public.courses (user_id, status);

-- 4. Course Lessons Table
create table if not exists public.course_lessons (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid not null references public.courses(id) on delete cascade,
  day_number integer not null default 1 check (day_number > 0),
  order_index integer not null default 1,
  title text not null,
  duration_minutes integer not null default 20 check (duration_minutes > 0),
  video_url text,
  video_start_seconds integer not null default 0,
  is_completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_lessons_course on public.course_lessons (course_id, day_number, order_index);

-- 5. Learning Sessions Table
create table if not exists public.learning_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid references public.courses(id) on delete set null,
  lesson_id uuid references public.course_lessons(id) on delete set null,
  course_title text,
  started_at timestamptz not null default now(),
  ended_at timestamptz not null default now(),
  duration_seconds integer not null check (duration_seconds > 0),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_sessions_user_date on public.learning_sessions (user_id, started_at);
create index if not exists idx_sessions_course on public.learning_sessions (course_id);

-- 6. Course Notes, Flashcards & Quizzes
create table if not exists public.course_notes (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid not null references public.courses(id) on delete cascade,
  lesson_id uuid references public.course_lessons(id) on delete set null,
  timestamp_seconds integer,
  title text not null,
  content text not null,
  created_at timestamptz not null default now()
);

-- 7. Active Timer State Table (One per user)
create table if not exists public.active_timer_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  course_id uuid references public.courses(id) on delete set null,
  lesson_id uuid references public.course_lessons(id) on delete set null,
  is_running boolean not null default false,
  started_at bigint,
  accumulated_seconds integer not null default 0,
  updated_at timestamptz not null default now()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS
alter table public.user_preferences enable row level security;
alter table public.courses enable row level security;
alter table public.course_lessons enable row level security;
alter table public.learning_sessions enable row level security;
alter table public.course_notes enable row level security;
alter table public.active_timer_state enable row level security;

-- user_preferences policies
create policy "Users can view their own preferences"
  on public.user_preferences for select using (auth.uid() = user_id);
create policy "Users can update their own preferences"
  on public.user_preferences for update using (auth.uid() = user_id);
create policy "Users can insert their own preferences"
  on public.user_preferences for insert with check (auth.uid() = user_id);

-- courses policies
create policy "Users can view their own courses"
  on public.courses for select using (auth.uid() = user_id);
create policy "Users can create their own courses"
  on public.courses for insert with check (auth.uid() = user_id);
create policy "Users can update their own courses"
  on public.courses for update using (auth.uid() = user_id);
create policy "Users can delete their own courses"
  on public.courses for delete using (auth.uid() = user_id);

-- course_lessons policies (join on parent course)
create policy "Users can view lessons of their courses"
  on public.course_lessons for select
  using (exists (select 1 from public.courses c where c.id = course_lessons.course_id and c.user_id = auth.uid()));
create policy "Users can modify lessons of their courses"
  on public.course_lessons for all
  using (exists (select 1 from public.courses c where c.id = course_lessons.course_id and c.user_id = auth.uid()));

-- learning_sessions policies
create policy "Users can view their own sessions"
  on public.learning_sessions for select using (auth.uid() = user_id);
create policy "Users can create their own sessions"
  on public.learning_sessions for insert with check (auth.uid() = user_id);
create policy "Users can update their own sessions"
  on public.learning_sessions for update using (auth.uid() = user_id);
create policy "Users can delete their own sessions"
  on public.learning_sessions for delete using (auth.uid() = user_id);

-- course_notes policies (join on parent course)
create policy "Users can access notes of their courses"
  on public.course_notes for all
  using (exists (select 1 from public.courses c where c.id = course_notes.course_id and c.user_id = auth.uid()));

-- active_timer_state policies
create policy "Users can access their own timer state"
  on public.active_timer_state for all using (auth.uid() = user_id);

