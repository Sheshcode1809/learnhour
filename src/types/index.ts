export type CourseStatus = 'active' | 'completed' | 'archived';

export interface CourseLesson {
  id: string;
  course_id: string;
  day_number: number;
  order_index: number;
  title: string;
  duration_minutes: number;
  video_url?: string;
  video_start_seconds?: number;
  is_completed: boolean;
  completed_at?: string | null;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CourseNote {
  id: string;
  course_id: string;
  lesson_id?: string | null;
  timestamp_seconds?: number | null;
  title: string;
  content: string;
  created_at: string;
}

export interface Flashcard {
  id: string;
  course_id: string;
  concept: string;
  definition: string;
}

export interface Course {
  id: string;
  user_id?: string;
  title: string;
  provider: string; // e.g. "freeCodeCamp.org", "YouTube", "Coursera", "Custom"
  course_url: string;
  embed_url: string;
  thumbnail_url?: string;
  description: string;
  total_minutes: number;
  completed_minutes: number;
  daily_pace_minutes: number; // default 60
  status: CourseStatus;
  lessons: CourseLesson[];
  quizzes?: QuizQuestion[];
  notes?: CourseNote[];
  flashcards?: Flashcard[];
  created_at: string;
  updated_at: string;
}

export interface LearningSession {
  id: string;
  user_id?: string;
  course_id?: string | null;
  lesson_id?: string | null;
  course_title?: string;
  started_at: string; // UTC ISO string
  ended_at: string;   // UTC ISO string
  duration_seconds: number;
  notes?: string;
  created_at: string;
}

export interface ActiveTimerState {
  is_running: boolean;
  course_id: string | null;
  lesson_id: string | null;
  started_at: number | null; // epoch timestamp in ms
  accumulated_seconds: number;
}

export interface UserPreferences {
  user_id: string;
  name: string;
  daily_goal_minutes: number;
  timezone: string;
  tier: string;
  created_at: string;
  updated_at: string;
}

export interface DayPlanGroup {
  day_number: number;
  total_minutes: number;
  lessons: CourseLesson[];
  is_completed: boolean;
}
