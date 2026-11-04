import { Course, LearningSession } from '@/types';

export function formatDuration(totalMinutes: number): string {
  if (isNaN(totalMinutes) || totalMinutes <= 0) return '0m';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    return `${hours}h`;
  }
  return `${minutes}m`;
}

export function formatSeconds(totalSeconds: number): string {
  if (isNaN(totalSeconds) || totalSeconds <= 0) return '00:00';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

export function calculateCourseProgress(totalMinutes: number, completedMinutes: number) {
  const safeTotal = Math.max(0, totalMinutes || 0);
  const safeCompleted = Math.max(0, completedMinutes || 0);

  const remainingMinutes = Math.max(0, safeTotal - safeCompleted);
  const percentage = safeTotal > 0 ? Math.min(100, Math.round((safeCompleted / safeTotal) * 100)) : 0;

  return {
    percentage,
    remainingMinutes,
    completedMinutes: safeCompleted,
    totalMinutes: safeTotal,
    formattedCompleted: formatDuration(safeCompleted),
    formattedRemaining: formatDuration(remainingMinutes),
    formattedTotal: formatDuration(safeTotal),
    isCompleted: percentage >= 100,
  };
}

/**
 * Single source of truth calculation for course completed minutes.
 * Rule from AntiGravity changes.md:
 * Count, per lesson, the greater of its completed lesson duration and its linked session time,
 * capped at the lesson duration; add course-linked session time with no lesson separately;
 * cap final progress at total_minutes.
 */
export function deriveCourseCompletedMinutes(course: Course, sessions: LearningSession[]): number {
  if (!course) return 0;
  const courseSessions = (sessions || []).filter(
    (s) => s.course_id === course.id && s.duration_seconds && s.duration_seconds > 0
  );

  // Accumulate per-lesson session seconds
  const lessonSecondsMap = new Map<string, number>();
  let generalSeconds = 0;

  for (const session of courseSessions) {
    if (session.lesson_id) {
      lessonSecondsMap.set(
        session.lesson_id,
        (lessonSecondsMap.get(session.lesson_id) || 0) + session.duration_seconds
      );
    } else {
      generalSeconds += session.duration_seconds;
    }
  }

  let totalLessonMinutes = 0;
  for (const lesson of course.lessons || []) {
    const lessonDuration = lesson.duration_minutes || 0;
    const sessionSecs = lessonSecondsMap.get(lesson.id) || 0;
    const sessionMins = Math.floor(sessionSecs / 60);

    // If marked complete, count the full lesson duration.
    // If not marked complete, count linked session time capped at lesson duration.
    const countedMins = lesson.is_completed
      ? lessonDuration
      : Math.min(lessonDuration, sessionMins);

    totalLessonMinutes += countedMins;
  }

  const generalMinutes = Math.floor(generalSeconds / 60);
  const totalCompleted = totalLessonMinutes + generalMinutes;

  return Math.min(course.total_minutes, Math.max(0, totalCompleted));
}
