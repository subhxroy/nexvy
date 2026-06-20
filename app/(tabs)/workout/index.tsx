import { useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '../../../src/components/navigation/Header';
import { Card } from '../../../src/components/ui/Card';
import { MonoLabel } from '../../../src/components/ui/MonoLabel';
import { QuickStartCard } from '../../../src/components/workout/QuickStartCard';

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
            <View className="py-6 items-center">
              <Text className="text-4xl mb-3">💪</Text>
              <Text className="text-white text-body-sm font-medium">No workouts yet</Text>
              <Text className="text-mute text-caption mt-1 text-center">
                Start your first workout to see history here
              </Text>
            </View>
          </Card>
        </View>

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
