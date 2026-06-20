import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { queryCollection, getDocument, setDocument } from '../services/firebase/firestore';
import { Workout } from '../types/workout.types';
import { BodyweightEntry } from '../types/user.types';
import { Activity } from '../types/activity.types';
import { NutritionLog } from '../types/nutrition.types';
import { calculateStreak, timestampToDateString } from '../utils/streakCalc';
import { getDateString, getWeekStart } from '../utils/dateHelpers';
import { generateWeeklyCoach } from '../services/gemini/weeklyCoach';

interface WorkoutSummary {
  totalWorkouts: number;
  totalVolumeKg: number;
  totalDurationSeconds: number;
  streakDays: number;
  recentWorkouts: Workout[];
  weeklyVolume: number[];
  monthlyWorkouts: number;
}

interface CoachReport {
  summary: string;
  insight: string;
  suggestion: string;
}

interface UseProgressReturn {
  workoutSummary: WorkoutSummary | null;
  bodyweightHistory: BodyweightEntry[];
  recentActivities: Activity[];
  coachReport: CoachReport | null;
  isLoading: boolean;
  isGeneratingCoachReport: boolean;
  refetch: () => Promise<void>;
  generateNewCoachReport: () => Promise<void>;
}

export function useProgress(): UseProgressReturn {
  const { user } = useAuthStore();
  const [workoutSummary, setWorkoutSummary] = useState<WorkoutSummary | null>(null);
  const [bodyweightHistory, setBodyweightHistory] = useState<BodyweightEntry[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [coachReport, setCoachReport] = useState<CoachReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingCoachReport, setIsGeneratingCoachReport] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // 1. Fetch Workouts
      const workouts = await queryCollection<Workout>(
        `users/${user.uid}/workouts`,
        [],
        'startedAt',
        'desc',
        50
      );

      const completedWorkouts = workouts.filter((w) => w.completedAt);
      const workoutDates = completedWorkouts.map((w) =>
        timestampToDateString(w.startedAt)
      );
      const streakDays = calculateStreak(workoutDates);

      const totalVolumeKg = completedWorkouts.reduce(
        (sum, w) => sum + (w.totalVolumeKg ?? 0),
        0
      );

      const totalDurationSeconds = completedWorkouts.reduce(
        (sum, w) => sum + (w.durationSeconds ?? 0),
        0
      );

      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthlyWorkouts = completedWorkouts.filter((w) => {
        const date = w.startedAt.toDate();
        return date >= monthStart;
      }).length;

      setWorkoutSummary({
        totalWorkouts: completedWorkouts.length,
        totalVolumeKg,
        totalDurationSeconds,
        streakDays,
        recentWorkouts: completedWorkouts.slice(0, 10),
        weeklyVolume: [0, 0, 0, 0, 0, 0, 0],
        monthlyWorkouts,
      });

      // 2. Fetch Bodyweight History
      const bodyweight = await queryCollection<BodyweightEntry>(
        `users/${user.uid}/bodyweight`,
        [],
        'loggedAt',
        'desc',
        30
      );
      setBodyweightHistory(bodyweight);

      // 3. Fetch Activities
      const activities = await queryCollection<Activity>(
        `users/${user.uid}/activities`,
        [],
        'startedAt',
        'desc',
        50
      );
      setRecentActivities(activities);

      // 4. Fetch/Handle Weekly Coach Report
      const weekStartStr = getDateString(getWeekStart());
      let coachReportData = null;
      try {
        coachReportData = await getDocument<{
          summary: string;
          insight: string;
          suggestion: string;
        }>(`users/${user.uid}/coachReports`, weekStartStr);
      } catch (err) {
        console.error('Failed to get coach report from Firestore:', err);
      }

      if (coachReportData) {
        setCoachReport(coachReportData);
      } else {
        // Auto-generate Coach Report if missing
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const weeklyWorkouts = completedWorkouts.filter((w) => {
          const date = w.startedAt.toDate();
          return date >= sevenDaysAgo;
        });

        const totalWorkoutsWeekly = weeklyWorkouts.length;
        const totalVolumeWeeklyKg = weeklyWorkouts.reduce((sum, w) => sum + (w.totalVolumeKg ?? 0), 0);
        const totalDurationMinutesWeekly = Math.round(
          weeklyWorkouts.reduce((sum, w) => sum + (w.durationSeconds ?? 0), 0) / 60
        );

        const sevenDaysAgoStr = getDateString(sevenDaysAgo);
        let nutritionLogs: NutritionLog[] = [];
        try {
          nutritionLogs = await queryCollection<NutritionLog>(
            `users/${user.uid}/nutritionLogs`,
            [
              { field: 'date', operator: '>=', value: sevenDaysAgoStr }
            ]
          );
        } catch (err) {
          console.error('Failed to query weekly nutrition logs for coaching:', err);
        }

        const loggedDays = nutritionLogs.filter((log) => log.totalCalories > 0);
        const averageCaloriesPerDay = loggedDays.length > 0
          ? Math.round(loggedDays.reduce((sum, log) => sum + log.totalCalories, 0) / loggedDays.length)
          : 0;

        const weeklyActivities = activities.filter((act) => {
          const date = act.startedAt.toDate();
          return date >= sevenDaysAgo;
        });
        const weeklyDistanceKm = weeklyActivities.reduce((sum, act) => sum + (act.distanceMeters ?? 0), 0) / 1000;

        const weeklyData = {
          totalWorkouts: totalWorkoutsWeekly,
          totalVolumeKg: totalVolumeWeeklyKg,
          totalDurationMinutes: totalDurationMinutesWeekly,
          averageCaloriesPerDay,
          streakDays,
          weeklyDistanceKm,
        };

        try {
          const report = await generateWeeklyCoach(weeklyData);
          await setDocument(`users/${user.uid}/coachReports`, report, weekStartStr);
          setCoachReport(report);
        } catch (err) {
          console.error('Auto coach report generation failed:', err);
        }
      }
    } catch (error) {
      console.error('Failed to fetch progress data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const generateNewCoachReport = useCallback(async () => {
    if (!user || !workoutSummary) return;
    setIsGeneratingCoachReport(true);
    try {
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const weeklyWorkouts = workoutSummary.recentWorkouts.filter((w) => {
        const date = w.startedAt.toDate();
        return date >= sevenDaysAgo;
      });

      const totalWorkouts = weeklyWorkouts.length;
      const totalVolumeKg = weeklyWorkouts.reduce((sum, w) => sum + (w.totalVolumeKg ?? 0), 0);
      const totalDurationMinutes = Math.round(
        weeklyWorkouts.reduce((sum, w) => sum + (w.durationSeconds ?? 0), 0) / 60
      );

      const sevenDaysAgoStr = getDateString(sevenDaysAgo);
      const nutritionLogs = await queryCollection<NutritionLog>(
        `users/${user.uid}/nutritionLogs`,
        [
          { field: 'date', operator: '>=', value: sevenDaysAgoStr }
        ]
      );

      const loggedDays = nutritionLogs.filter((log) => log.totalCalories > 0);
      const averageCaloriesPerDay = loggedDays.length > 0
        ? Math.round(loggedDays.reduce((sum, log) => sum + log.totalCalories, 0) / loggedDays.length)
        : 0;

      const weeklyActivities = recentActivities.filter((act) => {
        const date = act.startedAt.toDate();
        return date >= sevenDaysAgo;
      });
      const weeklyDistanceKm = weeklyActivities.reduce((sum, act) => sum + (act.distanceMeters ?? 0), 0) / 1000;

      const weeklyData = {
        totalWorkouts,
        totalVolumeKg,
        totalDurationMinutes,
        averageCaloriesPerDay,
        streakDays: workoutSummary.streakDays,
        weeklyDistanceKm,
      };

      const report = await generateWeeklyCoach(weeklyData);
      const weekStartStr = getDateString(getWeekStart());

      await setDocument(`users/${user.uid}/coachReports`, report, weekStartStr);
      setCoachReport(report);

      import('expo-haptics').then((Haptics) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      });
    } catch (err) {
      console.error('Failed to generate coach report:', err);
    } finally {
      setIsGeneratingCoachReport(false);
    }
  }, [user, workoutSummary, recentActivities]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    workoutSummary,
    bodyweightHistory,
    recentActivities,
    coachReport,
    isLoading,
    isGeneratingCoachReport,
    refetch: fetchData,
    generateNewCoachReport,
  };
}

