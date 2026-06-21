import { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/stores/useAuthStore';
import { useNutritionStore } from '../../src/stores/useNutritionStore';
import { useWorkoutStore } from '../../src/stores/useWorkoutStore';
import { useProgress } from '../../src/hooks/useProgress';
import { useStepCounter } from '../../src/hooks/useStepCounter';
import { Card } from '../../src/components/ui/Card';
import { MonoLabel } from '../../src/components/ui/MonoLabel';
import { Avatar } from '../../src/components/ui/Avatar';
import { ScalePressable } from '../../src/components/ui/ScalePressable';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useAuthStore();
  const { todayLog, fetchTodayLog } = useNutritionStore();
  const { activeWorkout, elapsedSeconds } = useWorkoutStore();
  const { workoutSummary, coachReport } = useProgress();
  const { steps } = useStepCounter();

  useEffect(() => {
    if (profile?.uid) {
      fetchTodayLog(profile.uid);
    }
  }, [profile?.uid, fetchTodayLog]);

  const calorieTarget = profile?.dailyCalorieTarget ?? 2000;
  const caloriesConsumed = todayLog?.totalCalories ?? 0;
  const remainingCalories = Math.max(0, calorieTarget - caloriesConsumed);

  const targetProtein = profile?.macroTargets?.protein ?? 150;
  const targetCarbs = profile?.macroTargets?.carbs ?? 200;
  const targetFat = profile?.macroTargets?.fat ?? 60;

  const consumedProtein = todayLog?.macros?.protein ?? 0;
  const consumedCarbs = todayLog?.macros?.carbs ?? 0;
  const consumedFat = todayLog?.macros?.fat ?? 0;

  const stepGoal = 10000;
  const stepsPercent = Math.round(Math.min((steps / stepGoal) * 100, 100));

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return h > 0
      ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      : `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <View className="flex-1 bg-canvas">
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingTop: insets.top + 20 }} className="flex-row items-center justify-between mb-8">
          <View className="flex-row items-center">
            <Avatar name={profile?.displayName} photoURL={profile?.photoURL} size={40} />
            <View className="ml-3">
              <Text className="text-mute text-mono-eyebrow uppercase tracking-widest">
                WELCOME BACK
              </Text>
              <Text className="text-text-primary text-heading-md font-medium">
                {profile?.displayName ?? 'Athlete'}
              </Text>
            </View>
          </View>
          <ScalePressable onPress={() => router.push('/(tabs)/profile/settings')}>
            <Ionicons name="settings-outline" size={22} color="#808080" />
          </ScalePressable>
        </View>

        {/* Active Workout Resume Banner */}
        {activeWorkout && (
          <ScalePressable
            onPress={() => router.push('/(tabs)/workout/active')}
            className="mb-6 bg-brand-dim border border-brand/30 rounded-card p-4 flex-row items-center justify-between"
          >
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 rounded-full bg-brand items-center justify-center mr-3">
                <Ionicons name="play" size={18} color="#ffffff" />
              </View>
              <View className="flex-1">
                <Text className="text-brand text-mono-eyebrow uppercase tracking-widest font-medium">
                  WORKOUT IN PROGRESS
                </Text>
                <Text className="text-text-primary text-body font-semibold mt-0.5" numberOfLines={1}>
                  {activeWorkout.name}
                </Text>
                <Text className="text-mute text-caption">
                  Elapsed: {formatDuration(elapsedSeconds)}
                </Text>
              </View>
            </View>
            <View className="w-8 h-8 rounded-full bg-white/5 items-center justify-center ml-2">
              <Ionicons name="arrow-forward" size={16} color="#FF5722" />
            </View>
          </ScalePressable>
        )}

        {/* Daily Progress Bento Layout */}
        <View className="flex-row gap-3 mb-6">
          {/* Left: Calories Card */}
          <Card outerClassName="flex-[1.2]">
            <View className="flex-1 justify-between">
              <View>
                <View className="flex-row justify-between items-start mb-2">
                  <MonoLabel text="CALORIES" />
                  <Ionicons name="flame-outline" size={16} color="#FF5722" />
                </View>
                <Text className="text-text-primary text-[32px] font-medium leading-none tracking-tighter mt-1">
                  {Math.round(caloriesConsumed)}
                </Text>
                <Text className="text-text-secondary text-caption mt-0.5">
                  of {calorieTarget} kcal
                </Text>
              </View>
              <View>
                <View className="h-1 bg-graphite rounded-full overflow-hidden mb-2">
                  <View
                    style={{ width: `${Math.min((caloriesConsumed / calorieTarget) * 100, 100)}%` }}
                    className="h-full bg-brand"
                  />
                </View>
                <Text className="text-brand text-meta font-medium">
                  {remainingCalories} kcal left
                </Text>
              </View>
            </View>
          </Card>

          {/* Right Column Stack */}
          <View className="flex-1 gap-3">
            {/* Steps Bento Cell */}
            <Card>
              <View className="flex-row justify-between items-start mb-1">
                <MonoLabel text="STEPS" />
                <Ionicons name="walk-outline" size={16} color="#10B981" />
              </View>
              <Text className="text-text-primary text-[20px] font-medium tracking-tight mt-1">
                {steps.toLocaleString()}
              </Text>
              <Text className="text-text-secondary text-meta">
                {stepsPercent}% of goal
              </Text>
            </Card>

            {/* Streak Bento Cell */}
            <Card>
              <View className="flex-row justify-between items-start mb-1">
                <MonoLabel text="STREAK" />
                <Ionicons name="flash-outline" size={16} color="#3B82F6" />
              </View>
              <Text className="text-text-primary text-[20px] font-medium tracking-tight mt-1">
                {workoutSummary?.streakDays ?? 0} Days
              </Text>
              <Text className="text-text-secondary text-meta">
                Keep active!
              </Text>
            </Card>
          </View>
        </View>

        {/* Quick Actions Bento Row */}
        <View className="flex-row gap-3 mb-8">
          <ScalePressable
            onPress={() => router.push('/(tabs)/workout')}
            className="flex-1 bg-surface border border-border/50 p-1.5 rounded-card"
          >
            <View className="bg-canvas-soft rounded-[14px] p-3 h-full justify-between min-h-[96px]">
              <View className="w-8 h-8 rounded-full bg-brand items-center justify-center mb-3">
                <Ionicons name="barbell" size={16} color="#ffffff" />
              </View>
              <View>
                <Text className="text-text-primary text-body-sm font-semibold">Workout</Text>
                <Text className="text-text-secondary text-meta mt-0.5" numberOfLines={1}>Log session</Text>
              </View>
            </View>
          </ScalePressable>

          <ScalePressable
            onPress={() => router.push('/(tabs)/nutrition')}
            className="flex-1 bg-surface border border-border/50 p-1.5 rounded-card"
          >
            <View className="bg-canvas-soft rounded-[14px] p-3 h-full justify-between min-h-[96px]">
              <View className="w-8 h-8 rounded-full bg-[#3B82F6] items-center justify-center mb-3">
                <Ionicons name="nutrition" size={16} color="#ffffff" />
              </View>
              <View>
                <Text className="text-text-primary text-body-sm font-semibold">Log Meal</Text>
                <Text className="text-text-secondary text-meta mt-0.5" numberOfLines={1}>Track food</Text>
              </View>
            </View>
          </ScalePressable>

          <ScalePressable
            onPress={() => router.push('/(tabs)/activity')}
            className="flex-1 bg-surface border border-border/50 p-1.5 rounded-card"
          >
            <View className="bg-canvas-soft rounded-[14px] p-3 h-full justify-between min-h-[96px]">
              <View className="w-8 h-8 rounded-full bg-[#10B981] items-center justify-center mb-3">
                <Ionicons name="fitness" size={16} color="#ffffff" />
              </View>
              <View>
                <Text className="text-text-primary text-body-sm font-semibold">Start Run</Text>
                <Text className="text-text-secondary text-meta mt-0.5" numberOfLines={1}>GPS track</Text>
              </View>
            </View>
          </ScalePressable>
        </View>

        {/* Weekly AI Coach Insight Card */}
        {coachReport && (
          <Card outerClassName="mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <View className="px-2 py-0.5 bg-brand-dim rounded-full mr-2">
                  <Text className="text-brand text-[9px] font-mono tracking-widest uppercase">
                    AI COACH
                  </Text>
                </View>
                <MonoLabel text="WEEKLY INSIGHT" />
              </View>
              <Text className="text-text-secondary text-meta">
                Mondays
              </Text>
            </View>
            <Text className="text-text-primary text-body font-medium leading-relaxed mb-2">
              "{coachReport.summary}"
            </Text>
            <Text className="text-text-secondary text-caption leading-relaxed mb-4">
              <Text className="text-text-primary font-medium">Suggestion: </Text>
              {coachReport.suggestion}
            </Text>

            <ScalePressable
              onPress={() => router.push('/(tabs)/profile')}
              className="bg-surface border border-border/80 rounded-full py-2.5 px-4 items-center justify-center flex-row"
            >
              <Text className="text-text-primary text-button-sm mr-2 font-medium">View Coach Analytics</Text>
              <View className="w-5 h-5 rounded-full bg-white/5 items-center justify-center">
                <Ionicons name="arrow-forward" size={12} color="#a3a3a3" />
              </View>
            </ScalePressable>
          </Card>
        )}

        {/* Today's Plan */}
        <Card outerClassName="mb-6">
          <MonoLabel text="TODAY'S PLAN" className="mb-3" />
          <ScalePressable
            onPress={() => router.push('/(tabs)/workout')}
            className="flex-row items-center justify-between py-2"
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-brand-dim items-center justify-center mr-3">
                <Ionicons name="barbell-outline" size={16} color="#FF5722" />
              </View>
              <View>
                <Text className="text-text-primary text-body-sm font-medium">Strength Training</Text>
                <Text className="text-text-secondary text-caption">Complete your daily routine</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#525252" />
          </ScalePressable>
          <View className="h-px bg-border/80 my-2" />
          <ScalePressable
            onPress={() => router.push('/(tabs)/nutrition')}
            className="flex-row items-center justify-between py-2"
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-[#3B82F6]/10 items-center justify-center mr-3">
                <Ionicons name="nutrition-outline" size={16} color="#3B82F6" />
              </View>
              <View>
                <Text className="text-text-primary text-body-sm font-medium">Remaining: {remainingCalories} cal</Text>
                <Text className="text-text-secondary text-caption">
                  P: {Math.round(consumedProtein)}/{targetProtein}g · C: {Math.round(consumedCarbs)}/{targetCarbs}g · F: {Math.round(consumedFat)}/{targetFat}g
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#525252" />
          </ScalePressable>
        </Card>

        {/* Recent Activity */}
        <Card outerClassName="mb-8">
          <MonoLabel text="RECENT WORKOUTS" className="mb-3" />
          {workoutSummary?.recentWorkouts && workoutSummary.recentWorkouts.length > 0 ? (
            <View>
              {workoutSummary.recentWorkouts.slice(0, 3).map((w, idx) => (
                <View key={w.id}>
                  <ScalePressable
                    onPress={() => router.push(`/(tabs)/workout/${w.id}`)}
                    className="flex-row items-center justify-between py-2.5"
                  >
                    <View className="flex-row items-center">
                      <View className="w-8 h-8 rounded-full bg-brand-dim items-center justify-center mr-3">
                        <Ionicons name="barbell-outline" size={16} color="#FF5722" />
                      </View>
                      <View>
                        <Text className="text-text-primary text-body-sm font-medium">{w.name}</Text>
                        <Text className="text-text-secondary text-caption">
                          {w.exercises?.length ?? 0} exercises · {Math.round(w.durationSeconds / 60)} min
                        </Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#525252" />
                  </ScalePressable>
                  {idx < Math.min(workoutSummary.recentWorkouts.length, 3) - 1 && (
                    <View className="h-px bg-border/50 my-1" />
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View className="py-3">
              <Text className="text-text-secondary text-caption text-center">No recent workouts</Text>
              <Text className="text-text-secondary text-caption text-center mt-1">
                Start your first workout to see data here
              </Text>
            </View>
          )}
        </Card>

        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
