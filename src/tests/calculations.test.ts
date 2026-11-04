import { describe, it, expect } from 'vitest';
import { calculateCourseProgress, formatDuration, formatSeconds } from '../lib/calculations/progress';
import { calculateStreaks, getDayOffset } from '../lib/calculations/streaks';
import { groupLessonsByDay, generateLessonsForCourse } from '../lib/calculations/dayPlanner';
import { extractYouTubeVideoId } from '../lib/youtube';
import { LearningSession } from '../types';

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

describe('Streak Calculations', () => {
  const baseDate = '2026-11-04';

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
    const res = calculateStreaks(sessions, 60);
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

    const res = calculateStreaks(sessions, 60);
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

    const res = calculateStreaks(sessions, 60);
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

describe('YouTube URL Parser', () => {
  it('extracts video ID from multiple YouTube URL formats', () => {
    expect(extractYouTubeVideoId('https://www.youtube.com/watch?v=kL2gQWjmLc0')).toBe('kL2gQWjmLc0');
    expect(extractYouTubeVideoId('https://youtu.be/kL2gQWjmLc0')).toBe('kL2gQWjmLc0');
    expect(extractYouTubeVideoId('https://www.youtube.com/embed/kL2gQWjmLc0')).toBe('kL2gQWjmLc0');
    expect(extractYouTubeVideoId('not-a-valid-url')).toBeNull();
  });
});
