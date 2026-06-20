import { Timestamp } from 'firebase/firestore';

export function calculateStreak(workoutDates: string[]): number {
  if (workoutDates.length === 0) return 0;

  const uniqueDates = Array.from(new Set(workoutDates)).sort().reverse();

  const today = getTodayDateString();
  const yesterday = getPreviousDateString(today);

  const hasWorkoutToday = uniqueDates.includes(today);
  const hasWorkoutYesterday = uniqueDates.includes(yesterday);

  if (!hasWorkoutToday && !hasWorkoutYesterday) {
    return 0;
  }

  let expectedDate = hasWorkoutToday ? today : yesterday;
  let streak = 0;

  for (const dateStr of uniqueDates) {
    if (dateStr === expectedDate) {
      streak++;
      expectedDate = getPreviousDateString(expectedDate);
    } else if (dateStr < expectedDate) {
      break;
    }
  }

  return streak;
}

export function getTodayDateString(): string {
  const now = new Date();
  return formatDateString(now);
}

export function getPreviousDateString(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  date.setDate(date.getDate() - 1);
  return formatDateString(date);
}

export function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function timestampToDateString(timestamp: Timestamp): string {
  return formatDateString(timestamp.toDate());
}
