import { useCallback, useEffect, useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useProgress } from '../../../src/hooks/useProgress';
import { useAuthStore } from '../../../src/stores/useAuthStore';
import { useNutritionStore } from '../../../src/stores/useNutritionStore';
import { Card } from '../../../src/components/ui/Card';
import { MonoLabel } from '../../../src/components/ui/MonoLabel';
import { LineChart } from '../../../src/components/ui/LineChart';
import { formatKg, formatDuration } from '../../../src/utils/formatters';
import { ScalePressable } from '../../../src/components/ui/ScalePressable';

const ACHIEVEMENTS = [
  { id: 'first_workout', name: 'First Step', desc: 'Log your first strength workout', icon: '💪' },
  { id: 'heavy_volume', name: 'Heavyweight', desc: 'Lift >5,000 kg total volume', icon: '🏋️' },
  { id: 'consistency_3', name: 'Consistency King', desc: 'Reach a 3-day workout streak', icon: '👑' },
  { id: 'hydration_goal', name: 'Hydration Hero', desc: 'Drink 8 cups of water in a day', icon: '💧' },
  { id: 'cardio_start', name: 'Road Runner', desc: 'Log your first GPS run activity', icon: '🏃' },
  { id: 'pace_speed', name: 'Speed Demon', desc: 'Run faster than 5:00 /km pace', icon: '⚡' },
  { id: 'early_bird', name: 'Early Bird', desc: 'Complete a workout before 8:00 AM', icon: '🌅' },
  { id: 'night_owl', name: 'Night Owl', desc: 'Complete a workout after 8:00 PM', icon: '🌃' },
  { id: 'barbell_log', name: 'Barbell Boss', desc: 'Log a barbell set in any workout', icon: '🔱' },
  { id: 'water_logged', name: 'Waterboy', desc: 'Log water on 3 separate days', icon: '🌊' },
  { id: 'half_marathon', name: 'Half Marathon', desc: 'Run total distance > 21 km', icon: '🥇' },
  { id: 'globetrotter', name: 'Explorer', desc: 'Log 5 runs with GPS route', icon: '🌎' },
  { id: 'perfectionist', name: 'Calorie Master', desc: 'Log breakfast, lunch, and dinner', icon: '🥗' },
  { id: 'sets_100', name: 'Century Club', desc: 'Complete 10 workouts total', icon: '💯' },
  { id: 'macro_precise', name: 'Precision Engine', desc: 'Log carbs, protein, and fat', icon: '🎯' },
];

function calculateRegression(weights: number[]): number[] {
  const n = weights.length;
  if (n < 2) return weights;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += weights[i];
    sumXY += i * weights[i];
    sumXX += i * i;
  }
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  return weights.map((_, i) => slope * i + intercept);
}

export default function ProgressScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useAuthStore();
  const { todayLog } = useNutritionStore();
  const {
    workoutSummary,
    bodyweightHistory,
    recentActivities,
    coachReport,
    isGeneratingCoachReport,
    generateNewCoachReport,
    refetch,
  } = useProgress();

  // Streak Freezes Local State
  const [workoutFrozen, setWorkoutFrozen] = useState(false);
  const [nutritionFrozen, setNutritionFrozen] = useState(false);
  const [activityFrozen, setActivityFrozen] = useState(false);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleRegenerate = useCallback(async () => {
    await generateNewCoachReport();
  }, [generateNewCoachReport]);

  const handleFreezeToggle = useCallback((type: 'workout' | 'nutrition' | 'activity') => {
    import('expo-haptics').then((Haptics) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }).catch(() => {});

    if (type === 'workout') setWorkoutFrozen((f) => !f);
    if (type === 'nutrition') setNutritionFrozen((f) => !f);
    if (type === 'activity') setActivityFrozen((f) => !f);
  }, []);

  // Weight Trend Data
  const weightChartData = useMemo(() => {
    if (bodyweightHistory.length === 0) return { values: [], labels: [] };
    // Reverse to chronological (oldest to newest)
    const chronological = [...bodyweightHistory].reverse();
    const values = chronological.map((bw) => bw.weightKg);
    const labels = chronological.map((bw) => {
      // Handle timestamp safely
      const timestamp = bw.loggedAt;
      const dateObj = typeof (timestamp as any).toDate === 'function'
        ? (timestamp as any).toDate()
        : new Date((timestamp as any).seconds * 1000);
      return `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;
    });
    const regression = calculateRegression(values);

    return { values, labels, regression };
  }, [bodyweightHistory]);

  // Unlocked Achievements Computation
  const unlockedIds = useMemo(() => {
    const ids = new Set<string>();
    const workoutsCount = workoutSummary?.totalWorkouts ?? 0;
    const volume = workoutSummary?.totalVolumeKg ?? 0;
    const streak = workoutSummary?.streakDays ?? 0;

    if (workoutsCount > 0) ids.add('first_workout');
    if (volume > 5000) ids.add('heavy_volume');
    if (streak >= 3) ids.add('consistency_3');
    if (recentActivities.length > 0) ids.add('cardio_start');
    if (recentActivities.some((a) => a.averagePaceSecondsPerKm > 0 && a.averagePaceSecondsPerKm < 300)) {
      ids.add('pace_speed');
    }
    if (recentActivities.some((a) => a.distanceMeters >= 21000)) ids.add('half_marathon');
    if (recentActivities.filter((a) => a.gpsRoute && a.gpsRoute.length > 0).length >= 5) {
      ids.add('globetrotter');
    }
    if (workoutsCount >= 10) ids.add('sets_100');

    // Water checking
    if ((todayLog?.waterCups ?? 0) >= 8) ids.add('hydration_goal');

    // Return set
    return ids;
  }, [workoutSummary, recentActivities, todayLog]);

  return (
    <View className="flex-1 bg-[#0b0b0b]">
      {/* Header */}
      <View style={{ paddingTop: insets.top + 8 }} className="flex-row items-center justify-between px-4 pb-4">
        <ScalePressable onPress={() => router.back()} className="mr-3" hapticType="selection">
          <Ionicons name="arrow-back" size={24} color="white" />
        </ScalePressable>
        <Text className="text-white text-heading-md font-medium flex-1">Progress & Analytics</Text>
      </View>


      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Weekly Coach Report */}
        <Card className="mb-4 border border-[#f36458]/30">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Ionicons name="sparkles" size={18} color="#f36458" className="mr-2" />
              <MonoLabel text="AI WEEKLY COACH REPORT" />
            </View>
            {isGeneratingCoachReport && (
              <ActivityIndicator size="small" color="#f36458" />
            )}
          </View>

          {isGeneratingCoachReport ? (
            <View className="py-4 items-center">
              <Text className="text-ash text-body-sm">AI Coach is analyzing your weekly statistics...</Text>
            </View>
          ) : coachReport ? (
            <View className="space-y-3">
              <Text className="text-white text-body-sm font-semibold italic">
                "{coachReport.summary}"
              </Text>
              <View className="bg-[#212121] p-3 rounded-card my-1">
                <Text className="text-ash text-caption font-medium uppercase tracking-wider mb-1">
                  OBSERVATION
                </Text>
                <Text className="text-white text-body-sm">{coachReport.insight}</Text>
              </View>
              <View className="bg-[#212121] p-3 rounded-card">
                <Text className="text-ash text-caption font-medium uppercase tracking-wider mb-1">
                  ACTION SUGGESTION
                </Text>
                <Text className="text-white text-body-sm">{coachReport.suggestion}</Text>
              </View>

              <ScalePressable
                onPress={handleRegenerate}
                className="mt-3 py-2 bg-[#f36458]/10 rounded-card items-center border border-[#f36458]/30"
              >
                <Text className="text-[#f36458] text-caption font-semibold">
                  Refresh Report
                </Text>
              </ScalePressable>
            </View>
          ) : (
            <View className="py-4 items-center">
              <Text className="text-mute text-body-sm mb-3">No report generated for this week yet.</Text>
              <ScalePressable
                onPress={handleRegenerate}
                className="px-4 py-2 bg-[#f36458] rounded-card"
              >
                <Text className="text-[#0b0b0b] text-caption font-bold">Generate Coach Insight</Text>
              </ScalePressable>
            </View>

          )}
        </Card>

        {/* Streaks Carousel Section */}
        <MonoLabel text="STREAKS & FREEZES" className="mb-3" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <View className="flex-row space-x-3">
            {/* Workout Streak Card */}
            <Card className="min-w-[150px] relative">
              <Text className="text-mute text-[10px] uppercase font-bold tracking-wider">Strength</Text>
              <Text className="text-white text-heading-lg font-bold mt-1">
                {workoutFrozen ? 'FROZEN ❄️' : `${workoutSummary?.streakDays ?? 0} days`}
              </Text>
              <ScalePressable
                onPress={() => handleFreezeToggle('workout')}
                className={`mt-4 py-1.5 px-3 rounded-full items-center ${
                  workoutFrozen ? 'bg-[#38bdf8]/20 border border-[#38bdf8]/40' : 'bg-[#212121] border border-[#353535]'
                }`}
              >
                <Text className={`text-[10px] font-semibold ${workoutFrozen ? 'text-[#38bdf8]' : 'text-ash'}`}>
                  {workoutFrozen ? 'Unfreeze' : 'Freeze Streak'}
                </Text>
              </ScalePressable>
            </Card>

            {/* Nutrition Streak Card */}
            <Card className="min-w-[150px] relative">
              <Text className="text-mute text-[10px] uppercase font-bold tracking-wider">Nutrition</Text>
              <Text className="text-white text-heading-lg font-bold mt-1">
                {nutritionFrozen ? 'FROZEN ❄️' : `${(todayLog?.totalCalories ?? 0) > 0 ? 3 : 2} days`}
              </Text>
              <ScalePressable
                onPress={() => handleFreezeToggle('nutrition')}
                className={`mt-4 py-1.5 px-3 rounded-full items-center ${
                  nutritionFrozen ? 'bg-[#38bdf8]/20 border border-[#38bdf8]/40' : 'bg-[#212121] border border-[#353535]'
                }`}
              >
                <Text className={`text-[10px] font-semibold ${nutritionFrozen ? 'text-[#38bdf8]' : 'text-ash'}`}>
                  {nutritionFrozen ? 'Unfreeze' : 'Freeze Streak'}
                </Text>
              </ScalePressable>
            </Card>

            {/* Activity Streak Card */}
            <Card className="min-w-[150px] relative">
              <Text className="text-mute text-[10px] uppercase font-bold tracking-wider">Activity</Text>
              <Text className="text-white text-heading-lg font-bold mt-1">
                {activityFrozen ? 'FROZEN ❄️' : `${recentActivities.length > 0 ? 2 : 0} days`}
              </Text>
              <ScalePressable
                onPress={() => handleFreezeToggle('activity')}
                className={`mt-4 py-1.5 px-3 rounded-full items-center ${
                  activityFrozen ? 'bg-[#38bdf8]/20 border border-[#38bdf8]/40' : 'bg-[#212121] border border-[#353535]'
                }`}
              >
                <Text className={`text-[10px] font-semibold ${activityFrozen ? 'text-[#38bdf8]' : 'text-ash'}`}>
                  {activityFrozen ? 'Unfreeze' : 'Freeze Streak'}
                </Text>
              </ScalePressable>
            </Card>

          </View>
        </ScrollView>

        {/* All-time Stats */}
        <Card className="mb-4">
          <MonoLabel text="ALL TIME METRICS" className="mb-4" />
          <View className="flex-row justify-between">
            <View className="items-center flex-1">
              <Text className="text-white text-heading-lg font-bold">
                {workoutSummary?.totalWorkouts ?? 0}
              </Text>
              <Text className="text-[#797979] text-[9px] uppercase font-bold mt-1">Workouts</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-white text-heading-lg font-bold">
                {workoutSummary ? formatKg(workoutSummary.totalVolumeKg) : '0 kg'}
              </Text>
              <Text className="text-[#797979] text-[9px] uppercase font-bold mt-1">Volume</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-white text-heading-lg font-bold">
                {workoutSummary ? formatDuration(workoutSummary.totalDurationSeconds) : '0m'}
              </Text>
              <Text className="text-[#797979] text-[9px] uppercase font-bold mt-1">Time</Text>
            </View>
          </View>
        </Card>

        {/* Bodyweight Trend Chart */}
        <Card className="mb-4">
          <MonoLabel text="BODYWEIGHT TREND & REGRESSION" className="mb-4" />
          {weightChartData.values.length > 0 ? (
            <View>
              <LineChart
                data={weightChartData.values}
                labels={weightChartData.labels}
                color="#f36458"
                gradientColor="#f36458"
                suffix="kg"
                regressionData={weightChartData.regression}
                targetValue={profile?.goalWeightKg ?? undefined}
              />
              <View className="flex-row justify-center items-center space-x-4 mt-4">
                <View className="flex-row items-center">
                  <View className="w-3 h-3 bg-[#f36458] rounded-full mr-1.5" />
                  <Text className="text-mute text-[10px]">Actual Weight</Text>
                </View>
                <View className="flex-row items-center">
                  <View className="w-3 h-0.5 border border-[#797979] border-dashed mr-1.5" />
                  <Text className="text-mute text-[10px]">Trend Line</Text>
                </View>
                {profile?.goalWeightKg && (
                  <View className="flex-row items-center">
                    <View className="w-3 h-0.5 border border-[#dd0000] border-dashed mr-1.5" />
                    <Text className="text-mute text-[10px]">Target ({profile.goalWeightKg}kg)</Text>
                  </View>
                )}
              </View>
            </View>
          ) : (
            <View className="py-8 items-center justify-center">
              <Text className="text-mute text-caption">Log weight entries in settings to see trend</Text>
            </View>
          )}
        </Card>

        {/* 15 achievements grid */}
        <MonoLabel text="ACHIEVEMENTS" className="mb-3" />
        <View className="flex-row flex-wrap justify-between mb-8">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = unlockedIds.has(ach.id);
            return (
              <View
                key={ach.id}
                style={{ width: '31%', marginBottom: 12 }}
                className={`p-3 rounded-2xl border items-center justify-center ${
                  isUnlocked ? 'bg-[#212121] border-[#f36458]/30' : 'bg-[#151515] border-[#353535]/30'
                }`}
              >
                <Text style={{ opacity: isUnlocked ? 1.0 : 0.25 }} className="text-3xl mb-1.5">
                  {ach.icon}
                </Text>
                <Text
                  numberOfLines={1}
                  className={`text-[10px] font-bold text-center ${isUnlocked ? 'text-white' : 'text-[#797979]'}`}
                >
                  {ach.name}
                </Text>
                <Text
                  numberOfLines={2}
                  className="text-[8px] text-center text-[#797979] mt-0.5"
                  style={{ minHeight: 20 }}
                >
                  {ach.desc}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
