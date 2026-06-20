import { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWorkoutStore } from '../../../src/stores/useWorkoutStore';
import { useWorkout } from '../../../src/hooks/useWorkout';
import { useRestTimer } from '../../../src/hooks/useRestTimer';
import { Card } from '../../../src/components/ui/Card';
import { Button } from '../../../src/components/ui/Button';
import { SetRow } from '../../../src/components/workout/SetRow';
import { RestTimerCard } from '../../../src/components/workout/RestTimerCard';
import { formatDurationFull } from '../../../src/utils/formatters';
import { SetEntry, WorkoutTemplate } from '../../../src/types/workout.types';

export default function ActiveWorkoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ template?: string }>();
  const insets = useSafeAreaInsets();
  const { activeWorkout, elapsedSeconds, addSet, completeSet, updateSet, startRest } = useWorkout();
  const { isResting, restSecondsLeft, progress, skipRest } = useRestTimer();

  const exercises = activeWorkout?.exercises ?? [];
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const currentExercise = exercises[currentExerciseIndex];

  const handleAddSet = useCallback(() => {
    if (!currentExercise) return;
    const newSet: SetEntry = {
      setNumber: (currentExercise.sets?.length ?? 0) + 1,
      weightKg: 0,
      reps: 0,
      rpe: null,
      isWarmup: false,
      completedAt: null,
    };
    addSet(currentExercise.exerciseId, newSet);
  }, [currentExercise, addSet]);

  const handleCompleteSet = useCallback(
    (setIndex: number) => {
      if (!currentExercise) return;
      completeSet(currentExercise.exerciseId, setIndex);
      startRest(90);
      import('expo-haptics').then((Haptics) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      });
    },
    [currentExercise, completeSet, startRest]
  );

  const handleEndWorkout = useCallback(async () => {
    try {
      await useWorkoutStore.getState().endWorkout();
      useWorkoutStore.getState().clearWorkout();
      import('expo-haptics').then((Haptics) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      });
      router.back();
    } catch (error) {
      console.error('Failed to end workout:', error);
    }
  }, [router]);

  if (!activeWorkout) {
    const template: WorkoutTemplate = {
      name: params.template ?? 'Custom Workout',
      exercises: [
        { exerciseId: 'bench-press', name: 'Bench Press', muscleGroup: 'chest' },
        { exerciseId: 'dumbbell-bench', name: 'Dumbbell Bench Press', muscleGroup: 'chest' },
        { exerciseId: 'incline-bench', name: 'Incline Bench Press', muscleGroup: 'chest' },
      ],
    };
    useWorkoutStore.getState().startWorkout(template);
    return null;
  }

  return (
    <View className="flex-1 bg-[#0b0b0b]">
      {/* Header */}
      <View style={{ paddingTop: insets.top + 8 }} className="flex-row items-center justify-between px-4 pb-3">
        <TouchableOpacity onPress={handleEndWorkout}>
          <Text className="text-[#f36458] text-body-sm font-medium">End</Text>
        </TouchableOpacity>
        <View className="items-center">
          <Text className="text-white text-heading-md font-medium">{activeWorkout.name}</Text>
          <Text className="text-mute text-mono-eyebrow">{formatDurationFull(elapsedSeconds)}</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(tabs)/workout/exercise-picker')}>
          <Ionicons name="add-circle-outline" size={24} color="#b9b9b9" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {isResting && (
          <RestTimerCard
            secondsLeft={restSecondsLeft}
            progress={progress}
            onSkip={skipRest}
          />
        )}

        {/* Exercise selector tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <View className="flex-row space-x-2">
            {exercises.map((ex, idx) => (
              <TouchableOpacity
                key={ex.exerciseId}
                onPress={() => setCurrentExerciseIndex(idx)}
                className={`px-3 py-2 rounded-full ${
                  idx === currentExerciseIndex ? 'bg-[#f36458]' : 'bg-[#212121]'
                }`}
              >
                <Text
                  className={`text-caption-tight ${
                    idx === currentExerciseIndex ? 'text-[#0b0b0b]' : 'text-ash'
                  }`}
                >
                  {ex.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Current exercise sets */}
        {currentExercise && (
          <Card>
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-white text-heading-md font-medium">{currentExercise.name}</Text>
            </View>

            {/* Set headers */}
            <View className="flex-row items-center pb-2 border-b border-[#353535] mb-1">
              <View className="w-6 mr-3" />
              <Text className="text-mute text-caption w-8 text-center">SET</Text>
              <View className="flex-1 flex-row ml-3">
                <Text className="text-mute text-caption flex-1 text-center">WEIGHT</Text>
                <Text className="text-mute text-caption flex-1 text-center">REPS</Text>
              </View>
            </View>

            {currentExercise.sets?.map((set, idx) => (
              <SetRow
                key={idx}
                setNumber={set.setNumber}
                weightKg={set.weightKg}
                reps={set.reps}
                isWarmup={set.isWarmup}
                isCompleted={set.completedAt !== null}
                onWeightChange={(w) => {
                  updateSet(currentExercise.exerciseId, idx, { weightKg: w });
                }}
                onRepsChange={(r) => {
                  updateSet(currentExercise.exerciseId, idx, { reps: r });
                }}
                onToggleWarmup={() => {
                  updateSet(currentExercise.exerciseId, idx, { isWarmup: !set.isWarmup });
                }}
                onComplete={() => handleCompleteSet(idx)}
              />
            ))}

            <TouchableOpacity
              onPress={handleAddSet}
              className="flex-row items-center justify-center py-3 mt-2 border border-dashed border-[#353535] rounded-lg"
            >
              <Ionicons name="add" size={18} color="#797979" />
              <Text className="text-mute text-caption ml-2">Add Set</Text>
            </TouchableOpacity>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}
