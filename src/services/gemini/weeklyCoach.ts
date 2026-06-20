import { generateContent } from './client';

interface WeeklyData {
  totalWorkouts: number;
  totalVolumeKg: number;
  totalDurationMinutes: number;
  averageCaloriesPerDay: number;
  streakDays: number;
  weeklyDistanceKm: number;
}

interface CoachingMessage {
  summary: string;
  insight: string;
  suggestion: string;
}

const SYSTEM_PROMPT = `You are a premium fitness coach AI for the Nexvy app. Based on the user's weekly data, generate a short, motivational coaching message. Return ONLY a valid JSON object with no markdown, no code fences. Schema:
{
  "summary": string (one sentence summary of the week),
  "insight": string (one observation about their data),
  "suggestion": string (one actionable tip for next week)
}`;

export async function generateWeeklyCoach(data: WeeklyData): Promise<CoachingMessage> {
  const prompt = `This week's training data:
- Workouts completed: ${data.totalWorkouts}
- Total volume: ${data.totalVolumeKg} kg
- Total training time: ${data.totalDurationMinutes} minutes
- Average daily calories: ${data.averageCaloriesPerDay}
- Current streak: ${data.streakDays} days
- Weekly distance: ${data.weeklyDistanceKm} km

Generate a coaching message for this athlete.`;

  const rawResponse = await generateContent(`${SYSTEM_PROMPT}\n\n${prompt}`);

  let cleanedResponse = rawResponse.trim();
  if (cleanedResponse.startsWith('```json')) {
    cleanedResponse = cleanedResponse.slice(7);
  }
  if (cleanedResponse.startsWith('```')) {
    cleanedResponse = cleanedResponse.slice(3);
  }
  if (cleanedResponse.endsWith('```')) {
    cleanedResponse = cleanedResponse.slice(0, -3);
  }
  cleanedResponse = cleanedResponse.trim();

  try {
    const parsed = JSON.parse(cleanedResponse) as CoachingMessage;
    return {
      summary: parsed.summary ?? 'Great work this week!',
      insight: parsed.insight ?? 'Keep pushing your limits.',
      suggestion: parsed.suggestion ?? 'Try increasing your training volume next week.',
    };
  } catch {
    return {
      summary: 'Great work this week!',
      insight: 'You showed consistency in your training.',
      suggestion: 'Try to increase your training frequency next week.',
    };
  }
}
