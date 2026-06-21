import { useMemo } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '../../../src/components/navigation/Header';
import { useAuthStore } from '../../../src/stores/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { queryCollection } from '../../../src/services/firebase/firestore';
import { Workout } from '../../../src/types/workout.types';
import { exercises as allExercises } from '../../../src/constants/exercises';
import { calculateEpley1RM } from '../../../src/utils/formatters';
import { Card } from '../../../src/components/ui/Card';
import { LineChart } from '../../../src/components/ui/LineChart';
import { format } from '../../../src/utils/dateHelpers';
import { SkeletonLoader } from '../../../src/components/ui/SkeletonLoader';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();

  const exerciseInfo = useMemo(() => {
    return allExercises.find((e) => e.id === id);
  }, [id]);

  // Query workouts from Firestore
  const { data: workouts, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['exercise-history', user?.uid, id],
    queryFn: async () => {
      if (!user) return [];
      return queryCollection<Workout>(
        `users/${user.uid}/workouts`,
        [],
        'completedAt',
        'desc'
      );
    },
    enabled: !!user,
  });

  // Extract all logs for this exercise
  const exerciseLogs = useMemo(() => {
    if (!workouts) return [];
    const logs = [];
    for (const w of workouts) {
      const ex = w.exercises.find((e) => e.exerciseId === id);
      if (ex) {
        const volume = ex.sets.reduce((sum, s) => sum + s.weightKg * s.reps, 0);
        const maxWeight = Math.max(...ex.sets.map((s) => s.weightKg), 0);
        const max1RM = Math.max(...ex.sets.map((s) => calculateEpley1RM(s.weightKg, s.reps)), 0);
        
        let dateObj: Date;
        if (w.completedAt) {
          // completedAt could be Firestore Timestamp
          dateObj = typeof (w.completedAt as any).toDate === 'function' 
            ? (w.completedAt as any).toDate() 
            : new Date((w.completedAt as any).seconds * 1000);
        } else {
          dateObj = new Date();
        }

        logs.push({
          workoutId: w.id,
          workoutName: w.name,
          date: dateObj,
          sets: ex.sets,
          volume,
          maxWeight,
          estimated1RM: Math.round(max1RM * 10) / 10,
        });
      }
    }
    return logs;
  }, [workouts, id]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (exerciseLogs.length === 0) return { maxWeight: 0, maxVolume: 0, totalSets: 0 };
    const maxWeight = Math.max(...exerciseLogs.map((l) => l.maxWeight), 0);
    const maxVolume = Math.max(...exerciseLogs.map((l) => l.volume), 0);
    const totalSets = exerciseLogs.reduce((sum, l) => sum + l.sets.length, 0);
    return { maxWeight, maxVolume, totalSets };
  }, [exerciseLogs]);

  // Chart data: chronological order (oldest to newest), max last 7 points
  const chartData = useMemo(() => {
    const sorted = [...exerciseLogs].reverse().slice(-7);
    return {
      values: sorted.map((l) => l.estimated1RM),
      labels: sorted.map((l) => {
        // Format as "DD/MM" or similar
        const d = l.date;
        return `${d.getDate()}/${d.getMonth() + 1}`;
      }),
    };
  }, [exerciseLogs]);

  const recentLogs = useMemo(() => {
    return exerciseLogs.slice(0, 5); // display past 5 logs
  }, [exerciseLogs]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#0b0b0b]">
        <Header title={exerciseInfo?.name ?? 'Details'} showBack onBackPress={() => router.back()} />
        <View className="px-4 mt-4">
          <SkeletonLoader type="home" />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#0b0b0b]">
      <Header
        title={exerciseInfo?.name ?? 'Exercise Details'}
        subtitle={(exerciseInfo?.muscleGroup ?? 'STRENGTH').toUpperCase()}
        showBack
        onBackPress={() => router.back()}
      />

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#f36458"
          />
        }
      >
        {/* Est. 1RM Trend Chart */}
        <View className="mt-4">
          <Text className="text-[#f36458] text-mono-eyebrow mb-2">EST. 1RM TREND (EPLEY)</Text>
          <Card>
            {chartData.values.length > 0 ? (
              <LineChart
                data={chartData.values}
                labels={chartData.labels}
                color="#f36458"
                gradientColor="#f36458"
                suffix="kg"
              />
            ) : (
              <View className="py-8 items-center">
                <Text className="text-mute text-caption">No completed logs yet</Text>
              </View>
            )}
          </Card>
        </View>

        {/* Volume & Weight Stats */}
        <View className="mt-6 flex-row space-x-3">
          <View className="flex-1">
            <Text className="text-[#797979] text-mono-eyebrow mb-2">MAX WEIGHT</Text>
            <Card className="items-center py-4 bg-[#212121]">
              <Text className="text-white text-heading-lg font-bold">
                {stats.maxWeight} <Text className="text-ash text-caption">kg</Text>
              </Text>
            </Card>
          </View>

          <View className="flex-1">
            <Text className="text-[#797979] text-mono-eyebrow mb-2">MAX VOLUME</Text>
            <Card className="items-center py-4 bg-[#212121]">
              <Text className="text-white text-heading-lg font-bold">
                {stats.maxVolume} <Text className="text-ash text-caption">kg</Text>
              </Text>
            </Card>
          </View>
        </View>

        {/* Exercise History List */}
        <View className="mt-6 mb-8">
          <Text className="text-[#797979] text-mono-eyebrow mb-3">EXERCISE LOGS HISTORY</Text>

          {recentLogs.length === 0 ? (
            <Card className="py-6 items-center">
              <Text className="text-mute text-caption">Perform this exercise to log history</Text>
            </Card>
          ) : (
            recentLogs.map((log, idx) => (
              <Card key={`${log.workoutId}-${idx}`} className="mb-3 bg-[#212121] border border-[#353535]">
                <View className="flex-row items-center justify-between pb-2 border-b border-[#353535] mb-2">
                  <Text className="text-white text-body-sm font-semibold">{log.workoutName}</Text>
                  <Text className="text-mute text-caption">
                    {log.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </Text>
                </View>

                {/* Sets */}
                <View className="space-y-1">
                  {log.sets.map((set, sIdx) => (
                    <View key={sIdx} className="flex-row items-center justify-between py-1">
                      <Text className="text-[#797979] text-caption-tight">
                        Set {set.setNumber} {set.isWarmup ? '(Warmup)' : ''}
                      </Text>
                      <Text className="text-ash text-caption-tight font-medium">
                        {set.weightKg} kg x {set.reps} reps
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Volume calculation */}
                <View className="flex-row justify-between items-center mt-3 pt-2 border-t border-[#353535]/50">
                  <Text className="text-[#797979] text-[10px] uppercase font-bold tracking-wider">Volume</Text>
                  <Text className="text-[#f36458] text-[11px] font-bold">{log.volume} kg</Text>
                </View>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
