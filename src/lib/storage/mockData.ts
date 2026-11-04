import { Course, LearningSession, UserPreferences } from '@/types';
import { PRESET_COURSES } from '../youtube';

export const INITIAL_PREFERENCES: UserPreferences = {
  user_id: 'user-default-1',
  name: 'Learner',
  daily_goal_minutes: 60,
  timezone: 'Asia/Kolkata',
  tier: 'Free beta',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const INITIAL_COURSES: Course[] = PRESET_COURSES.map((preset) => {
  const videoId = preset.url.includes('v=') ? preset.url.split('v=')[1].slice(0, 11) : 'kL2gQWjmLc0';

  return {
    id: preset.key,
    user_id: 'user-default-1',
    title: preset.title,
    provider: preset.provider,
    course_url: preset.url,
    embed_url: `https://www.youtube.com/embed/${videoId}?enablejsapi=1`,
    thumbnail_url: preset.thumbnail_url,
    description: preset.description,
    total_minutes: preset.total_minutes,
    completed_minutes: 0,
    daily_pace_minutes: preset.daily_pace_minutes,
    status: 'active',
    lessons: preset.lessons.map((l) => ({
      ...l,
      course_id: preset.key,
      is_completed: false,
    })),
    quizzes: preset.quizzes,
    notes: preset.notes?.map((n) => ({ ...n, course_id: preset.key })),
    flashcards: preset.flashcards?.map((f) => ({ ...f, course_id: preset.key })),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
});

// Clean initial sessions (no temporary mock data)
export function generateSeedSessions(): LearningSession[] {
  return [];
}
