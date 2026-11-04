import { LearningSession } from '@/types';

export function isValidTimezone(timeZone: string): boolean {
  if (!timeZone || typeof timeZone !== 'string') return false;
  try {
    Intl.DateTimeFormat(undefined, { timeZone });
    return true;
  } catch {
    return false;
  }
}

export function getSafeTimezone(timeZone?: string): string {
  if (timeZone && isValidTimezone(timeZone)) {
    return timeZone;
  }
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

export function getLocalDateString(isoDateString: string, timeZone?: string): string {
  const safeTz = getSafeTimezone(timeZone);
  try {
    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }

    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: safeTz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(date); // outputs YYYY-MM-DD
  } catch {
    const d = new Date(isoDateString);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}

export function formatDateTimeInTimezone(isoDateString: string, timeZone?: string): string {
  const safeTz = getSafeTimezone(timeZone);
  try {
    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) return isoDateString;

    return new Intl.DateTimeFormat('en-US', {
      timeZone: safeTz,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return isoDateString;
  }
}

export function getTodayDateString(timeZone?: string): string {
  return getLocalDateString(new Date().toISOString(), timeZone);
}

export function getDayOffset(dateStr: string, offsetDays: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

/**
 * Sum seconds per local date first, then convert to minutes.
 * When excludeFuture is true, future-dated sessions are omitted from streak calculation.
 */
export function groupSessionsByDate(
  sessions: LearningSession[],
  timeZone?: string,
  excludeFuture: boolean = false
): Record<string, number> {
  const dailySeconds: Record<string, number> = {};
  const safeTz = getSafeTimezone(timeZone);
  const now = new Date();
  const todayStr = getTodayDateString(safeTz);

  for (const session of sessions || []) {
    if (!session.duration_seconds || session.duration_seconds <= 0) continue;

    if (excludeFuture) {
      const sessionDate = new Date(session.started_at);
      if (!isNaN(sessionDate.getTime()) && sessionDate > now) {
        continue;
      }
    }

    const dateStr = getLocalDateString(session.started_at, safeTz);
    if (excludeFuture && dateStr > todayStr) {
      continue;
    }

    dailySeconds[dateStr] = (dailySeconds[dateStr] || 0) + session.duration_seconds;
  }

  const dailyMinutes: Record<string, number> = {};
  for (const [date, totalSecs] of Object.entries(dailySeconds)) {
    dailyMinutes[date] = Math.floor(totalSecs / 60);
  }

  return dailyMinutes;
}

export function calculateStreaks(
  sessions: LearningSession[],
  dailyGoalMinutes: number,
  timeZone?: string
) {
  const goal = Math.max(1, dailyGoalMinutes || 60);
  const safeTz = getSafeTimezone(timeZone);
  // Exclude future-dated sessions from streak calculations
  const dailyTotals = groupSessionsByDate(sessions, safeTz, true);
  const todayStr = getTodayDateString(safeTz);

  const todayMinutes = dailyTotals[todayStr] || 0;
  const todayGoalMet = todayMinutes >= goal;

  // Streak calculation:
  // Check backward day by day starting from either today (if goal met) or yesterday.
  let currentStreak = 0;
  let checkDate = todayGoalMet ? todayStr : getDayOffset(todayStr, -1);

  while (true) {
    const minutes = dailyTotals[checkDate] || 0;
    if (minutes >= goal) {
      currentStreak += 1;
      checkDate = getDayOffset(checkDate, -1);
    } else {
      break;
    }
  }

  // Calculate best streak historically across all past and present recorded dates
  const sortedDates = Object.keys(dailyTotals)
    .filter((d) => d <= todayStr && dailyTotals[d] >= goal)
    .sort();

  let bestStreak = 0;
  let tempStreak = 0;
  let previousDate: string | null = null;

  for (const date of sortedDates) {
    if (!previousDate) {
      tempStreak = 1;
    } else {
      const expectedNext = getDayOffset(previousDate, 1);
      if (date === expectedNext) {
        tempStreak += 1;
      } else {
        tempStreak = 1;
      }
    }
    if (tempStreak > bestStreak) {
      bestStreak = tempStreak;
    }
    previousDate = date;
  }

  bestStreak = Math.max(bestStreak, currentStreak);

  return {
    currentStreak,
    bestStreak,
    todayMinutes,
    todayGoalMet,
    remainingMinutesToday: Math.max(0, goal - todayMinutes),
  };
}

export function getWeeklyActivity(
  sessions: LearningSession[],
  dailyGoalMinutes: number,
  timeZone?: string
) {
  const goal = Math.max(1, dailyGoalMinutes || 60);
  const safeTz = getSafeTimezone(timeZone);
  const dailyTotals = groupSessionsByDate(sessions, safeTz, false);
  const todayStr = getTodayDateString(safeTz);

  const week = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const dateStr = getDayOffset(todayStr, -i);
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(Date.UTC(y, m - 1, d));
    const dayName = dayNames[dateObj.getUTCDay()];
    const minutes = dailyTotals[dateStr] || 0;

    week.push({
      date: dateStr,
      dayName,
      minutes,
      goalMet: minutes >= goal,
      isToday: dateStr === todayStr,
    });
  }

  return week;
}
