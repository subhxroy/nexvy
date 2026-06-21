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
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getPreviousDateString(dateStr: string): string {
  const parts = dateStr.split('-');
  const year = parseInt(parts[0]!, 10);
  const month = parseInt(parts[1]!, 10) - 1;
  const day = parseInt(parts[2]!, 10);
  const date = new Date(year, month, day);
  date.setDate(date.getDate() - 1);
  const py = date.getFullYear();
  const pm = (date.getMonth() + 1).toString().padStart(2, '0');
  const pd = date.getDate().toString().padStart(2, '0');
  return `${py}-${pm}-${pd}`;
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
