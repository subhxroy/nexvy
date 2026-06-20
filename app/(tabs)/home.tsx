import { useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/stores/useAuthStore';
import { useNutritionStore } from '../../src/stores/useNutritionStore';
import { useProgress } from '../../src/hooks/useProgress';
import { useStepCounter } from '../../src/hooks/useStepCounter';
import { Card } from '../../src/components/ui/Card';
import { MonoLabel } from '../../src/components/ui/MonoLabel';
import { Avatar } from '../../src/components/ui/Avatar';
import { colors } from '../../src/constants/tokens';
import { formatCalories } from '../../src/utils/formatters';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useAuthStore();
  const { todayLog, fetchTodayLog } = useNutritionStore();
  const { workoutSummary } = useProgress();
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

  return (
    <View className="flex-1 bg-[#0b0b0b]">
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingTop: insets.top + 8 }} className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <Avatar name={profile?.displayName} photoURL={profile?.photoURL} size={40} />
            <View className="ml-3">
              <Text className="text-mute text-mono-eyebrow uppercase tracking-widest">
                WELCOME BACK
              </Text>
              <Text className="text-white text-heading-md font-medium">
                {profile?.displayName ?? 'Athlete'}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile/settings')}>
            <Ionicons name="settings-outline" size={22} color={colors.ash} />
          </TouchableOpacity>
        </View>

        {/* Daily Progress Card */}
        <Card className="mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <MonoLabel text="TODAY'S PROGRESS" />
            <Text className="text-mute text-mono-eyebrow">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <View className="items-center flex-1">
              <Text className="text-white text-heading-lg">{Math.round(caloriesConsumed)}</Text>
              <MonoLabel text="CALORIES" />
            </View>
            <View className="items-center flex-1">
              <Text className="text-white text-heading-lg">{steps}</Text>
              <MonoLabel text="STEPS" />
            </View>
            <View className="items-center flex-1">
              <Text className="text-white text-heading-lg">{stepsPercent}%</Text>
              <MonoLabel text="STEP GOAL" />
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <View className="flex-row space-x-3 mb-6">
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/workout')}
            className="flex-1 bg-[#212121] rounded-card p-4"
          >
            <View className="w-10 h-10 rounded-full bg-[#f36458] items-center justify-center mb-3">
              <Ionicons name="barbell" size={20} color="#0b0b0b" />
            </View>
            <Text className="text-white text-body font-medium">Start Workout</Text>
            <Text className="text-mute text-caption mt-1">Log your session</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(tabs)/nutrition')}
            className="flex-1 bg-[#212121] rounded-card p-4"
          >
            <View className="w-10 h-10 rounded-full bg-[#55beff] items-center justify-center mb-3">
              <Ionicons name="nutrition" size={20} color="#0b0b0b" />
            </View>
            <Text className="text-white text-body font-medium">Log Meal</Text>
            <Text className="text-mute text-caption mt-1">Track nutrition</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(tabs)/activity')}
            className="flex-1 bg-[#212121] rounded-card p-4"
          >
            <View className="w-10 h-10 rounded-full bg-[#37cd84] items-center justify-center mb-3">
              <Ionicons name="fitness" size={20} color="#0b0b0b" />
            </View>
            <Text className="text-white text-body font-medium">Start Run</Text>
            <Text className="text-mute text-caption mt-1">Track activity</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Plan */}
        <Card className="mb-4">
          <MonoLabel text="TODAY'S PLAN" className="mb-3" />
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/workout')}
            className="flex-row items-center justify-between py-2"
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-[#f36458]/10 items-center justify-center mr-3">
                <Ionicons name="barbell-outline" size={16} color="#f36458" />
              </View>
              <View>
                <Text className="text-white text-body-sm font-medium">Strength Training</Text>
                <Text className="text-mute text-caption">Complete your daily routine</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#797979" />
          </TouchableOpacity>
          <View className="h-px bg-[#353535] my-2" />
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/nutrition')}
            className="flex-row items-center justify-between py-2"
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-[#55beff]/10 items-center justify-center mr-3">
                <Ionicons name="nutrition-outline" size={16} color="#55beff" />
              </View>
              <View>
                <Text className="text-white text-body-sm font-medium">Remaining: {remainingCalories} cal</Text>
                <Text className="text-mute text-caption">
                  P: {Math.round(consumedProtein)}/{targetProtein}g · C: {Math.round(consumedCarbs)}/{targetCarbs}g · F: {Math.round(consumedFat)}/{targetFat}g
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#797979" />
          </TouchableOpacity>
        </Card>

        {/* Recent Activity */}
        <Card className="mb-6">
          <MonoLabel text="RECENT WORKOUTS" className="mb-3" />
          {workoutSummary?.recentWorkouts && workoutSummary.recentWorkouts.length > 0 ? (
            <View className="space-y-3">
              {workoutSummary.recentWorkouts.slice(0, 3).map((w) => (
                <TouchableOpacity
                  key={w.id}
                  onPress={() => router.push(`/(tabs)/workout/${w.id}`)}
                  className="flex-row items-center justify-between py-2 border-b border-[#353535]/50"
                >
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full bg-[#f36458]/10 items-center justify-center mr-3">
                      <Ionicons name="barbell-outline" size={16} color="#f36458" />
                    </View>
                    <View>
                      <Text className="text-white text-body-sm font-medium">{w.name}</Text>
                      <Text className="text-mute text-caption">
                        {w.exercises?.length ?? 0} exercises · {Math.round(w.durationSeconds / 60)} min
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#797979" />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className="py-3">
              <Text className="text-mute text-caption text-center">No recent workouts</Text>
              <Text className="text-mute text-caption text-center mt-1">
                Start your first workout to see data here
              </Text>
            </View>
          )}
        </Card>

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
