import { describe, it, expect } from 'vitest';
import {
  calculateCourseProgress,
  deriveCourseCompletedMinutes,
  formatDuration,
  formatSeconds,
} from '../lib/calculations/progress';
import {
  calculateStreaks,
  getDayOffset,
  getTodayDateString,
  groupSessionsByDate,
  isValidTimezone,
} from '../lib/calculations/streaks';
import { groupLessonsByDay, generateLessonsForCourse } from '../lib/calculations/dayPlanner';
import {
  extractYouTubeVideoId,
  isAllowlistedEmbedUrl,
  parseYouTubeUrlOrPreset,
} from '../lib/youtube';
import { Course, LearningSession } from '../types';

describe('Progress Calculations', () => {
  it('formats duration correctly for minutes and hours', () => {
    expect(formatDuration(0)).toBe('0m');
    expect(formatDuration(45)).toBe('45m');
    expect(formatDuration(60)).toBe('1h');
    expect(formatDuration(125)).toBe('2h 5m');
  });

  it('formats seconds into timer display', () => {
    expect(formatSeconds(0)).toBe('00:00');
    expect(formatSeconds(59)).toBe('00:59');
    expect(formatSeconds(65)).toBe('01:05');
    expect(formatSeconds(3665)).toBe('1:01:05');
  });

  it('calculates course progress percentage and remaining duration accurately', () => {
    const res1 = calculateCourseProgress(100, 25);
    expect(res1.percentage).toBe(25);
    expect(res1.remainingMinutes).toBe(75);
    expect(res1.isCompleted).toBe(false);

    // 100% completion
    const res2 = calculateCourseProgress(60, 60);
    expect(res2.percentage).toBe(100);
    expect(res2.remainingMinutes).toBe(0);
    expect(res2.isCompleted).toBe(true);

    // Over-completion clamps to 100% and 0 remaining
    const res3 = calculateCourseProgress(60, 90);
    expect(res3.percentage).toBe(100);
    expect(res3.remainingMinutes).toBe(0);
    expect(res3.isCompleted).toBe(true);

    // Zero total
    const res4 = calculateCourseProgress(0, 0);
    expect(res4.percentage).toBe(0);
    expect(res4.remainingMinutes).toBe(0);
  });
});

describe('Derived Course Completed Minutes (Single Source of Truth)', () => {
  const sampleCourse: Course = {
    id: 'course-1',
    title: 'TypeScript Deep Dive',
    provider: 'Egghead',
    course_url: 'https://youtube.com/watch?v=kL2gQWjmLc0',
    embed_url: 'https://youtube.com/embed/kL2gQWjmLc0',
    description: 'Deep dive course',
    status: 'active',
    total_minutes: 100,
    daily_pace_minutes: 30,
    completed_minutes: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    lessons: [
      {
        id: 'l1',
        course_id: 'course-1',
        title: 'Types & Interfaces',
        duration_minutes: 30,
        day_number: 1,
        order_index: 1,
        is_completed: false,
      },
      {
        id: 'l2',
        course_id: 'course-1',
        title: 'Generics',
        duration_minutes: 40,
        day_number: 1,
        order_index: 2,
        is_completed: false,
      },
      {
        id: 'l3',
        course_id: 'course-1',
        title: 'Utility Types',
        duration_minutes: 30,
        day_number: 2,
        order_index: 3,
        is_completed: false,
      },
    ],
  };

  it('counts full lesson duration when a lesson is marked completed with 0 session time', () => {
    const course: Course = {
      ...sampleCourse,
      lessons: sampleCourse.lessons.map((l) =>
        l.id === 'l1' ? { ...l, is_completed: true } : l
      ),
    };
    const completed = deriveCourseCompletedMinutes(course, []);
    expect(completed).toBe(30);
  });

  it('does not double count when a completed lesson also has linked sessions', () => {
    const course: Course = {
      ...sampleCourse,
      lessons: sampleCourse.lessons.map((l) =>
        l.id === 'l1' ? { ...l, is_completed: true } : l
      ),
    };
    const sessions: LearningSession[] = [
      {
        id: 's1',
        course_id: 'course-1',
        lesson_id: 'l1',
        duration_seconds: 45 * 60, // 45 min spent on 30 min lesson
        started_at: new Date().toISOString(),
        ended_at: new Date().toISOString(),
        created_at: '',
      },
    ];
    // Completed lesson still counts full duration (30 min), not 30 + 45
    const completed = deriveCourseCompletedMinutes(course, sessions);
    expect(completed).toBe(30);
  });

  it('caps incomplete lesson progress at lesson duration when session duration exceeds it', () => {
    const course: Course = { ...sampleCourse };
    const sessions: LearningSession[] = [
      {
        id: 's1',
        course_id: 'course-1',
        lesson_id: 'l1',
        duration_seconds: 50 * 60, // 50m on a 30m incomplete lesson
        started_at: new Date().toISOString(),
        ended_at: new Date().toISOString(),
        created_at: '',
      },
    ];
    const completed = deriveCourseCompletedMinutes(course, sessions);
    expect(completed).toBe(30); // Capped at l1's 30 mins
  });

  it('adds general course sessions without lesson ID on top of lesson progress', () => {
    const course: Course = {
      ...sampleCourse,
      lessons: sampleCourse.lessons.map((l) =>
        l.id === 'l1' ? { ...l, is_completed: true } : l
      ),
    };
    const sessions: LearningSession[] = [
      {
        id: 's_general',
        course_id: 'course-1',
        duration_seconds: 20 * 60, // 20m unassigned session
        started_at: new Date().toISOString(),
        ended_at: new Date().toISOString(),
        created_at: '',
      },
    ];
    // 30 min (l1) + 20 min (general) = 50 min
    const completed = deriveCourseCompletedMinutes(course, sessions);
    expect(completed).toBe(50);
  });

  it('caps total completed minutes at course total_minutes', () => {
    const course: Course = {
      ...sampleCourse,
      lessons: sampleCourse.lessons.map((l) => ({ ...l, is_completed: true })),
    };
    // All lessons completed = 30 + 40 + 30 = 100 min
    // Extra general session = 50 min
    const sessions: LearningSession[] = [
      {
        id: 's_extra',
        course_id: 'course-1',
        duration_seconds: 50 * 60,
        started_at: new Date().toISOString(),
        ended_at: new Date().toISOString(),
        created_at: '',
      },
    ];
    const completed = deriveCourseCompletedMinutes(course, sessions);
    expect(completed).toBe(100); // course.total_minutes is 100
  });
});

describe('Streak & Timezone Calculations', () => {
  const testTz = 'UTC';
  const baseDate = getTodayDateString(testTz);

  it('validates IANA timezones properly', () => {
    expect(isValidTimezone('America/New_York')).toBe(true);
    expect(isValidTimezone('Europe/London')).toBe(true);
    expect(isValidTimezone('Asia/Kolkata')).toBe(true);
    expect(isValidTimezone('UTC')).toBe(true);
    expect(isValidTimezone('Not/A_Real_Timezone')).toBe(false);
    expect(isValidTimezone('')).toBe(false);
  });

  it('sums seconds per local date before converting to minutes', () => {
    // Two 30-second sessions on the same date
    const sessions: LearningSession[] = [
      {
        id: 's1',
        started_at: `${baseDate}T10:00:00Z`,
        ended_at: `${baseDate}T10:00:30Z`,
        duration_seconds: 30,
        created_at: '',
      },
      {
        id: 's2',
        started_at: `${baseDate}T10:05:00Z`,
        ended_at: `${baseDate}T10:05:30Z`,
        duration_seconds: 30,
        created_at: '',
      },
    ];

    // If floored separately, 30s -> 0m + 0m = 0m
    // Summed first: 30s + 30s = 60s -> 1m
    const dailyMap = groupSessionsByDate(sessions, 'UTC', false);
    expect(dailyMap[baseDate]).toBe(1);
  });

  it('excludes future-dated sessions from streak calculation when excludeFuture is enabled', () => {
    const futureDate = '2099-01-01';
    const sessions: LearningSession[] = [
      {
        id: 's_future',
        started_at: `${futureDate}T12:00:00Z`,
        ended_at: `${futureDate}T13:00:00Z`,
        duration_seconds: 3600,
        created_at: '',
      },
    ];

    const dailyMap = groupSessionsByDate(sessions, 'UTC', true);
    expect(dailyMap[futureDate]).toBeUndefined();
  });

  it('calculates streak when today meets the daily goal', () => {
    const sessions: LearningSession[] = [
      {
        id: '1',
        started_at: `${getDayOffset(baseDate, -2)}T10:00:00Z`,
        ended_at: `${getDayOffset(baseDate, -2)}T11:00:00Z`,
        duration_seconds: 60 * 60, // 60 min
        created_at: '',
      },
      {
        id: '2',
        started_at: `${getDayOffset(baseDate, -1)}T10:00:00Z`,
        ended_at: `${getDayOffset(baseDate, -1)}T11:00:00Z`,
        duration_seconds: 60 * 60, // 60 min
        created_at: '',
      },
      {
        id: '3',
        started_at: `${baseDate}T10:00:00Z`,
        ended_at: `${baseDate}T11:00:00Z`,
        duration_seconds: 60 * 60, // 60 min
        created_at: '',
      },
    ];

    // Daily goal 60 min
    const res = calculateStreaks(sessions, 60, testTz);
    expect(res.todayGoalMet).toBe(true);
    expect(res.currentStreak).toBe(3);
    expect(res.bestStreak).toBe(3);
  });

  it('preserves yesterday streak when today is still in progress', () => {
    const sessions: LearningSession[] = [
      {
        id: '1',
        started_at: `${getDayOffset(baseDate, -1)}T10:00:00Z`,
        ended_at: `${getDayOffset(baseDate, -1)}T11:00:00Z`,
        duration_seconds: 60 * 60,
        created_at: '',
      },
      {
        id: '2',
        started_at: `${baseDate}T10:00:00Z`,
        ended_at: `${baseDate}T10:20:00Z`,
        duration_seconds: 20 * 60, // 20m out of 60m
        created_at: '',
      },
    ];

    const res = calculateStreaks(sessions, 60, testTz);
    expect(res.todayGoalMet).toBe(false);
    expect(res.currentStreak).toBe(1); // counts yesterday
    expect(res.remainingMinutesToday).toBe(40);
  });

  it('resets current streak to 0 if yesterday was missed and today is not completed', () => {
    const sessions: LearningSession[] = [
      {
        id: '1',
        started_at: `${getDayOffset(baseDate, -3)}T10:00:00Z`,
        ended_at: `${getDayOffset(baseDate, -3)}T11:00:00Z`,
        duration_seconds: 60 * 60,
        created_at: '',
      },
    ];

    const res = calculateStreaks(sessions, 60, testTz);
    expect(res.currentStreak).toBe(0);
    expect(res.bestStreak).toBe(1);
  });
});

describe('Day Planner Logic', () => {
  it('groups lessons into structured day groups', () => {
    const lessons = [
      {
        id: 'l1',
        course_id: 'c1',
        day_number: 1,
        order_index: 1,
        title: 'Intro',
        duration_minutes: 30,
        is_completed: true,
      },
      {
        id: 'l2',
        course_id: 'c1',
        day_number: 1,
        order_index: 2,
        title: 'Basics',
        duration_minutes: 30,
        is_completed: true,
      },
      {
        id: 'l3',
        course_id: 'c1',
        day_number: 2,
        order_index: 3,
        title: 'Intermediate',
        duration_minutes: 60,
        is_completed: false,
      },
    ];

    const dayGroups = groupLessonsByDay(lessons);
    expect(dayGroups).toHaveLength(2);
    expect(dayGroups[0].day_number).toBe(1);
    expect(dayGroups[0].total_minutes).toBe(60);
    expect(dayGroups[0].is_completed).toBe(true);

    expect(dayGroups[1].day_number).toBe(2);
    expect(dayGroups[1].total_minutes).toBe(60);
    expect(dayGroups[1].is_completed).toBe(false);
  });

  it('generates day-scheduled lessons from total minutes', () => {
    const lessons = generateLessonsForCourse('test-course', 120, 'System Design', 60);
    expect(lessons.length).toBeGreaterThanOrEqual(4);
    // verify lessons span Day 1 and Day 2
    const days = new Set(lessons.map((l) => l.day_number));
    expect(days.has(1)).toBe(true);
    expect(days.has(2)).toBe(true);
  });
});

describe('YouTube URL Parser & Embed Security', () => {
  it('extracts video ID from multiple YouTube URL formats', () => {
    expect(extractYouTubeVideoId('https://www.youtube.com/watch?v=kL2gQWjmLc0')).toBe('kL2gQWjmLc0');
    expect(extractYouTubeVideoId('https://youtu.be/kL2gQWjmLc0')).toBe('kL2gQWjmLc0');
    expect(extractYouTubeVideoId('https://www.youtube.com/embed/kL2gQWjmLc0')).toBe('kL2gQWjmLc0');
    expect(extractYouTubeVideoId('not-a-valid-url')).toBeNull();
  });

  it('parses presets with rich metadata and non-presets honestly without forged titles', () => {
    // Preset
    const presetRes = parseYouTubeUrlOrPreset('https://www.youtube.com/watch?v=kL2gQWjmLc0');
    expect(presetRes).not.toBeNull();
    expect(presetRes?.isPreset).toBe(true);
    expect(presetRes?.suggestedTitle).toBe('Learn Python – Interactive Course 2026');

    // Non-preset YouTube URL
    const customRes = parseYouTubeUrlOrPreset('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    expect(customRes).not.toBeNull();
    expect(customRes?.isPreset).toBe(false);
    expect(customRes?.suggestedTitle).toBeUndefined(); // Doesn't forge title

    // Non-YouTube URL
    const invalidRes = parseYouTubeUrlOrPreset('https://example.com/not-youtube');
    expect(invalidRes).toBeNull();
  });

  it('validates allowlisted embed URLs to prevent arbitrary iframe embeds', () => {
    expect(isAllowlistedEmbedUrl('https://www.youtube.com/embed/kL2gQWjmLc0')).toBe(true);
    expect(isAllowlistedEmbedUrl('https://youtube-nocookie.com/embed/kL2gQWjmLc0')).toBe(true);
    expect(isAllowlistedEmbedUrl('https://malicious-site.com/embed/kL2gQWjmLc0')).toBe(false);
    expect(isAllowlistedEmbedUrl('')).toBe(false);
  });
});
