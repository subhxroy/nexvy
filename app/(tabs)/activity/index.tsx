import { useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../../src/components/navigation/Header';
import { Card } from '../../../src/components/ui/Card';
import { MonoLabel } from '../../../src/components/ui/MonoLabel';
import { StepBarChart } from '../../../src/components/activity/StepBarChart';
import { ActivityCard } from '../../../src/components/activity/ActivityCard';
import { useProgress } from '../../../src/hooks/useProgress';

const WEEK_STEPS = [
  { day: 'M', steps: 8432 },
  { day: 'T', steps: 6201 },
  { day: 'W', steps: 10234 },
  { day: 'T', steps: 7890 },
  { day: 'F', steps: 5400 },
  { day: 'S', steps: 12045 },
  { day: 'S', steps: 3200 },
];

export default function ActivityDashboardScreen() {
  const router = useRouter();
  const { recentActivities, isLoading, refetch } = useProgress();

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <View className="flex-1 bg-[#0b0b0b]">
      <Header
        title="Activity"
        subtitle="MOVEMENT"
      />
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Weekly Steps */}
        <Card className="mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <MonoLabel text="THIS WEEK" />
            <Text className="text-mute text-mono-eyebrow">53,402 steps</Text>
          </View>
          <StepBarChart data={WEEK_STEPS} />
        </Card>

        {/* Quick Start Run Button */}
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/activity/live-run')}
          className="bg-[#f36458] rounded-card p-6 items-center mb-6"
        >
          <Ionicons name="walk-outline" size={36} color="#0b0b0b" />
          <Text className="text-[#0b0b0b] text-heading-md font-medium mt-2">Start Run</Text>
          <Text className="text-[#0b0b0b]/70 text-body-sm mt-1">
            Track with GPS
          </Text>
        </TouchableOpacity>

        {/* Recent Activities */}
        <MonoLabel text="RECENT" className="mb-3" />
        {isLoading ? (
          <Card>
            <View className="py-8 items-center">
              <Text className="text-mute text-body-sm">Loading activities...</Text>
            </View>
          </Card>
        ) : recentActivities.length > 0 ? (
          recentActivities.map((act) => (
            <ActivityCard
              key={act.id}
              type={act.type}
              name={act.name}
              distanceMeters={act.distanceMeters}
              durationSeconds={act.durationSeconds}
              averagePaceSecondsPerKm={act.averagePaceSecondsPerKm}
              date={act.startedAt.toDate().toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
              onPress={() => router.push(`/(tabs)/activity/${act.id}`)}
            />
          ))
        ) : (
          <Card>
            <View className="py-8 items-center">
              <Text className="text-4xl mb-3">🏃</Text>
              <Text className="text-white text-body-sm font-medium">No activities yet</Text>
              <Text className="text-mute text-caption mt-1 text-center">
                Start your first run to see history here
              </Text>
            </View>
          </Card>
        )}

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
