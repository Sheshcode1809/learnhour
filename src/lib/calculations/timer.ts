import type { ActiveTimerState } from '@/types';

export function getElapsedTimerSeconds(timer: ActiveTimerState, nowEpoch = Date.now()): number {
  const accumulated = Number.isFinite(timer.accumulated_seconds) ? Math.max(0, timer.accumulated_seconds) : 0;
  if (!timer.is_running || timer.started_at === null || !Number.isFinite(timer.started_at)) return Math.floor(accumulated);
  return Math.floor(accumulated + Math.max(0, (nowEpoch - timer.started_at) / 1000));
}

export function timerTargetMatches(timer: ActiveTimerState, courseId?: string | null, lessonId?: string | null): boolean {
  return timer.course_id === (courseId || null) && timer.lesson_id === (lessonId || null);
}

export function canSwitchTimerTarget(
  timer: ActiveTimerState,
  courseId?: string | null,
  lessonId?: string | null,
  nowEpoch = Date.now()
): boolean {
  return getElapsedTimerSeconds(timer, nowEpoch) === 0 || timerTargetMatches(timer, courseId, lessonId);
}

export function startTimerState(
  timer: ActiveTimerState,
  courseId?: string | null,
  lessonId?: string | null,
  nowEpoch = Date.now()
): ActiveTimerState {
  const sameTarget = timerTargetMatches(timer, courseId, lessonId);
  const accumulated = getElapsedTimerSeconds(timer, nowEpoch);
  return {
    is_running: true,
    course_id: courseId || null,
    lesson_id: lessonId || null,
    started_at: nowEpoch,
    accumulated_seconds: accumulated,
    session_start_epoch: sameTarget && timer.session_start_epoch !== null && timer.session_start_epoch !== undefined
      ? timer.session_start_epoch
      : nowEpoch - accumulated * 1000,
  };
}

export function pauseTimerState(timer: ActiveTimerState, nowEpoch = Date.now()): ActiveTimerState {
  return {
    ...timer,
    is_running: false,
    started_at: null,
    accumulated_seconds: getElapsedTimerSeconds(timer, nowEpoch),
  };
}

export function resumeTimerState(timer: ActiveTimerState, nowEpoch = Date.now()): ActiveTimerState {
  return {
    ...timer,
    is_running: true,
    started_at: nowEpoch,
    session_start_epoch: timer.session_start_epoch || nowEpoch - getElapsedTimerSeconds(timer, nowEpoch) * 1000,
  };
}
