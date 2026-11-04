import { CourseLesson, DayPlanGroup } from '@/types';

export function groupLessonsByDay(lessons: CourseLesson[]): DayPlanGroup[] {
  if (!lessons || lessons.length === 0) return [];

  const dayMap = new Map<number, CourseLesson[]>();

  for (const lesson of lessons) {
    const day = lesson.day_number || 1;
    if (!dayMap.has(day)) {
      dayMap.set(day, []);
    }
    dayMap.get(day)!.push(lesson);
  }

  const sortedDays = Array.from(dayMap.keys()).sort((a, b) => a - b);

  return sortedDays.map((dayNum) => {
    const dayLessons = (dayMap.get(dayNum) || []).sort((a, b) => a.order_index - b.order_index);
    const totalMinutes = dayLessons.reduce((acc, l) => acc + (l.duration_minutes || 0), 0);
    const isCompleted = dayLessons.length > 0 && dayLessons.every((l) => l.is_completed);

    return {
      day_number: dayNum,
      total_minutes: totalMinutes,
      lessons: dayLessons,
      is_completed: isCompleted,
    };
  });
}

export function generateLessonsForCourse(
  courseId: string,
  totalMinutes: number,
  courseTitle: string,
  dailyPaceMinutes: number = 60
): CourseLesson[] {
  const safeTotal = Math.max(15, totalMinutes || 60);
  const targetPerDay = Math.max(30, dailyPaceMinutes || 60);

  // Divide into lessons of around 15-25 minutes each
  const lessonDuration = 20;
  const lessonCount = Math.max(1, Math.round(safeTotal / lessonDuration));
  const lessons: CourseLesson[] = [];

  let accumulatedInDay = 0;
  let currentDay = 1;

  for (let i = 0; i < lessonCount; i++) {
    const isLast = i === lessonCount - 1;
    const duration = isLast
      ? safeTotal - (i * lessonDuration) > 0 ? safeTotal - (i * lessonDuration) : lessonDuration
      : lessonDuration;

    lessons.push({
      id: `${courseId}-lesson-${i + 1}`,
      course_id: courseId,
      day_number: currentDay,
      order_index: i + 1,
      title: `${courseTitle} — Part ${i + 1}`,
      duration_minutes: duration,
      video_start_seconds: i * lessonDuration * 60,
      is_completed: false,
    });

    accumulatedInDay += duration;
    if (accumulatedInDay >= targetPerDay && !isLast) {
      currentDay += 1;
      accumulatedInDay = 0;
    }
  }

  return lessons;
}
