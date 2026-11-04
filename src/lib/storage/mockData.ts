import { Course, LearningSession, UserPreferences } from '@/types';
import { PRESET_COURSES } from '../youtube';
import { getDayOffset, getTodayDateString } from '../calculations/streaks';

export const INITIAL_PREFERENCES: UserPreferences = {
  user_id: 'user-default-1',
  name: 'Abhishek Singh',
  daily_goal_minutes: 60,
  timezone: 'Asia/Kolkata',
  tier: 'Free beta',
  created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  updated_at: new Date().toISOString(),
};

export const INITIAL_COURSES: Course[] = PRESET_COURSES.map((preset) => {
  // calculate initial completed minutes from completed lessons
  const completedMinutes = preset.lessons
    .filter((l) => l.is_completed)
    .reduce((acc, l) => acc + l.duration_minutes, 0);

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
    completed_minutes: completedMinutes,
    daily_pace_minutes: preset.daily_pace_minutes,
    status: 'active',
    lessons: preset.lessons.map((l) => ({
      ...l,
      course_id: preset.key,
    })),
    quizzes: preset.quizzes,
    notes: preset.notes?.map((n) => ({ ...n, course_id: preset.key })),
    flashcards: preset.flashcards?.map((f) => ({ ...f, course_id: preset.key })),
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  };
});

export function generateSeedSessions(): LearningSession[] {
  const today = getTodayDateString();
  const yesterday = getDayOffset(today, -1);
  const twoDaysAgo = getDayOffset(today, -2);
  const threeDaysAgo = getDayOffset(today, -3);

  return [
    {
      id: 'session-1',
      user_id: 'user-default-1',
      course_id: 'python-2026',
      course_title: 'Learn Python – Interactive Course 2026',
      started_at: `${threeDaysAgo}T10:00:00.000Z`,
      ended_at: `${threeDaysAgo}T11:05:00.000Z`,
      duration_seconds: 65 * 60, // 65 min (completed daily goal)
      notes: 'Completed Day 1 overview and setup.',
      created_at: `${threeDaysAgo}T11:05:00.000Z`,
    },
    {
      id: 'session-2',
      user_id: 'user-default-1',
      course_id: 'python-2026',
      course_title: 'Learn Python – Interactive Course 2026',
      started_at: `${twoDaysAgo}T15:00:00.000Z`,
      ended_at: `${twoDaysAgo}T16:00:00.000Z`,
      duration_seconds: 60 * 60, // 60 min (completed daily goal)
      notes: 'Variables and data types practice.',
      created_at: `${twoDaysAgo}T16:00:00.000Z`,
    },
    {
      id: 'session-3',
      user_id: 'user-default-1',
      course_id: 'python-2026',
      course_title: 'Learn Python – Interactive Course 2026',
      started_at: `${yesterday}T09:30:00.000Z`,
      ended_at: `${yesterday}T10:35:00.000Z`,
      duration_seconds: 65 * 60, // 65 min (completed daily goal)
      notes: 'F-strings and string manipulation.',
      created_at: `${yesterday}T10:35:00.000Z`,
    },
    {
      id: 'session-4',
      user_id: 'user-default-1',
      course_id: 'python-2026',
      course_title: 'Learn Python – Interactive Course 2026',
      started_at: `${today}T08:00:00.000Z`,
      ended_at: `${today}T08:35:00.000Z`,
      duration_seconds: 35 * 60, // 35 min so far today (target: 60)
      notes: 'Building the Pay Up expense splitter display.',
      created_at: `${today}T08:35:00.000Z`,
    },
  ];
}
