import { useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '../../../src/components/navigation/Header';
import { Card } from '../../../src/components/ui/Card';
import { MonoLabel } from '../../../src/components/ui/MonoLabel';
import { QuickStartCard } from '../../../src/components/workout/QuickStartCard';
import { useProgress } from '../../../src/hooks/useProgress';
import { ScalePressable } from '../../../src/components/ui/ScalePressable';

const TEMPLATES = [
  { name: 'Push Day A', exerciseCount: 6 },
  { name: 'Pull Day A', exerciseCount: 6 },
  { name: 'Leg Day A', exerciseCount: 5 },
  { name: 'Upper Body', exerciseCount: 7 },
  { name: 'Lower Body', exerciseCount: 5 },
];

export default function WorkoutHomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { workoutSummary } = useProgress();

  const handleStartWorkout = useCallback(
    (templateName: string) => {
      router.push({
        pathname: '/(tabs)/workout/active',
        params: { template: templateName },
      });
    },
    [router]
  );

  return (
    <View className="flex-1 bg-[#0b0b0b]">
      <Header
        title="Workout"
        subtitle="STRENGTH TRAINING"
        rightAction={{ icon: 'time-outline', onPress: () => router.push('/(tabs)/workout/history') }}
      />
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <QuickStartCard
          templates={TEMPLATES}
          onSelect={handleStartWorkout}
        />

        <View className="mt-6">
          <MonoLabel text="RECENT WORKOUTS" className="mb-3" />
          <Card>
            {workoutSummary?.recentWorkouts && workoutSummary.recentWorkouts.length > 0 ? (
              <View>
                {workoutSummary.recentWorkouts.slice(0, 5).map((w, idx) => (
                  <View key={w.id}>
                    <ScalePressable
                      onPress={() => router.push(`/(tabs)/workout/${w.id}`)}
                      className="flex-row items-center justify-between py-3"
                    >
                      <View className="flex-row items-center flex-1">
                        <View className="w-8 h-8 rounded-full bg-[#f36458]/10 items-center justify-center mr-3">
                          <Ionicons name="barbell-outline" size={16} color="#f36458" />
                        </View>
                        <View className="flex-1">
                          <Text className="text-white text-body-sm font-semibold">{w.name}</Text>
                          <Text className="text-mute text-caption mt-0.5" numberOfLines={1}>
                            {w.exercises?.length ?? 0} exercises · {Math.round(w.durationSeconds / 60)} min
                          </Text>
                        </View>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color="#797979" />
                    </ScalePressable>
                    {idx < Math.min(workoutSummary.recentWorkouts.length, 5) - 1 && (
                      <View className="h-px bg-[#353535]/50 my-1" />
                    )}
                  </View>
                ))}
              </View>
            ) : (
              <View className="py-8 items-center justify-center">
                <Text className="text-4xl mb-3">💪</Text>
                <Text className="text-white text-body-sm font-medium">No workouts logged yet</Text>
                <Text className="text-mute text-caption mt-1 text-center">
                  Start your first workout template to see history here
                </Text>
              </View>
            )}
          </Card>
        </View>

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}

