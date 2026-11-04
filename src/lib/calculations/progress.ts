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

