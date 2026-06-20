import { useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useProgress } from '../../../src/hooks/useProgress';
import { Card } from '../../../src/components/ui/Card';
import { MonoLabel } from '../../../src/components/ui/MonoLabel';
import { WeightChart } from '../../../src/components/profile/WeightChart';
import { formatKg, formatDuration } from '../../../src/utils/formatters';

export default function ProgressScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    workoutSummary,
    bodyweightHistory,
    coachReport,
    isLoading,
    isGeneratingCoachReport,
    generateNewCoachReport,
    refetch,
  } = useProgress();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleRegenerate = useCallback(async () => {
    await generateNewCoachReport();
  }, [generateNewCoachReport]);

  return (
    <View className="flex-1 bg-[#0b0b0b]">
      <View style={{ paddingTop: insets.top + 8 }} className="flex-row items-center justify-between px-4 pb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-heading-md font-medium flex-1">Progress</Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Weekly Coach Report */}
        <Card className="mb-4 border border-[#f36458]/30">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Ionicons name="sparkles" size={18} color="#f36458" className="mr-2" />
              <MonoLabel text="AI COACH INSIGHT" />
            </View>
            {isGeneratingCoachReport && (
              <ActivityIndicator size="small" color="#f36458" />
            )}
          </View>

          {isGeneratingCoachReport ? (
            <View className="py-4 items-center">
              <Text className="text-ash text-body-sm">AI Coach is analyzing your stats...</Text>
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
                  ACTION STEP
                </Text>
                <Text className="text-white text-body-sm">{coachReport.suggestion}</Text>
              </View>

              <TouchableOpacity
                onPress={handleRegenerate}
                className="mt-3 py-2 bg-[#f36458]/10 rounded-card items-center border border-[#f36458]/30"
              >
                <Text className="text-[#f36458] text-caption font-semibold">
                  Refresh Report
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="py-4 items-center">
              <Text className="text-mute text-body-sm mb-3">No report generated for this week yet.</Text>
              <TouchableOpacity
                onPress={handleRegenerate}
                className="px-4 py-2 bg-[#f36458] rounded-card"
              >
                <Text className="text-[#0b0b0b] text-caption font-bold">Generate Coach Insight</Text>
              </TouchableOpacity>
            </View>
          )}
        </Card>

        {/* Streak */}
        <Card className="mb-4">
          <View className="flex-row items-center justify-between">
            <View>
              <MonoLabel text="WORKOUT STREAK" />
              <Text className="text-white text-display-hero font-medium mt-1">
                {workoutSummary?.streakDays ?? 0}
              </Text>
              <Text className="text-mute text-caption">days</Text>
            </View>
            <View className="w-16 h-16 rounded-full bg-[#f36458]/20 items-center justify-center">
              <Text className="text-3xl">🔥</Text>
            </View>
          </View>
        </Card>

        {/* Total Stats */}
        <Card className="mb-4">
          <MonoLabel text="ALL TIME" className="mb-4" />
          <View className="flex-row justify-between">
            <View className="items-center flex-1">
              <Text className="text-white text-heading-lg font-medium">
                {workoutSummary?.totalWorkouts ?? 0}
              </Text>
              <MonoLabel text="WORKOUTS" />
            </View>
            <View className="items-center flex-1">
              <Text className="text-white text-heading-lg font-medium">
                {workoutSummary ? formatKg(workoutSummary.totalVolumeKg) : '0 kg'}
              </Text>
              <MonoLabel text="VOLUME" />
            </View>
            <View className="items-center flex-1">
              <Text className="text-white text-heading-lg font-medium">
                {workoutSummary ? formatDuration(workoutSummary.totalDurationSeconds) : '0m'}
              </Text>
              <MonoLabel text="TIME" />
            </View>
          </View>
        </Card>

        {/* Weight Chart */}
        <Card className="mb-4">
          <MonoLabel text="WEIGHT TREND" className="mb-4" />
          <WeightChart
            data={bodyweightHistory.map((bw) => ({
              date: bw.date,
              weightKg: bw.weightKg,
            }))}
          />
        </Card>

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
