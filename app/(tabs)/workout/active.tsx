import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWorkoutStore } from '../../../src/stores/useWorkoutStore';
import { useWorkout } from '../../../src/hooks/useWorkout';
import { useRestTimer } from '../../../src/hooks/useRestTimer';
import { useAuthStore } from '../../../src/stores/useAuthStore';
import { Card } from '../../../src/components/ui/Card';
import { SetRow } from '../../../src/components/workout/SetRow';
import { RestTimerCard } from '../../../src/components/workout/RestTimerCard';
import { PRCelebration } from '../../../src/components/workout/PRCelebration';
import { formatDurationFull, calculateEpley1RM } from '../../../src/utils/formatters';
import { SetEntry, WorkoutTemplate } from '../../../src/types/workout.types';
import { getExercisesByGroup } from '../../../src/constants/exercises';
import { getDocument, setDocument } from '../../../src/services/firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { BottomSheet } from '../../../src/components/ui/BottomSheet';
import { ScrollWheelPicker } from '../../../src/components/ui/ScrollWheelPicker';
import { PlateCalculator } from '../../../src/components/workout/PlateCalculator';
import { ScalePressable } from '../../../src/components/ui/ScalePressable';

const templateGroups: Record<string, string[]> = {
  'push': ['chest', 'shoulders', 'triceps'],
  'pull': ['back', 'biceps'],
  'legs': ['quads', 'hamstrings', 'glutes', 'calves'],
  'lower': ['quads', 'hamstrings', 'glutes', 'calves'],
  'upper': ['chest', 'back', 'shoulders', 'biceps', 'triceps'],
  'full body': ['chest', 'back', 'quads', 'shoulders', 'abs'],
  'chest': ['chest'],
  'back': ['back'],
  'shoulders': ['shoulders'],
  'arms': ['biceps', 'triceps'],
  'core': ['abs'],
};

function getTemplateExercises(templateName: string): { exerciseId: string; name: string; muscleGroup: string }[] {
  const lower = templateName.toLowerCase();
  for (const [key, groups] of Object.entries(templateGroups)) {
    if (lower.includes(key)) {
      const all = groups.flatMap((g) => getExercisesByGroup(g));
      return all.slice(0, 4).map((e) => ({
        exerciseId: e.id,
        name: e.name,
        muscleGroup: e.muscleGroup,
      }));
    }
  }
  return [
    { exerciseId: 'bench-press', name: 'Bench Press', muscleGroup: 'chest' },
    { exerciseId: 'squat', name: 'Squat', muscleGroup: 'quads' },
    { exerciseId: 'deadlift', name: 'Deadlift', muscleGroup: 'back' },
    { exerciseId: 'overhead-press', name: 'Overhead Press', muscleGroup: 'shoulders' },
  ];
}

export default function ActiveWorkoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ template?: string }>();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const {
    activeWorkout,
    elapsedSeconds,
    addSet,
    completeSet,
    updateSet,
    startRest,
    endWorkout,
    toggleSuperset,
    updateNotes,
    removeSet,
    removeExercise,
  } = useWorkout();
  const { isResting, restSecondsLeft, progress, skipRest } = useRestTimer();

  const exercises = activeWorkout?.exercises ?? [];

  // PR celebratory overlay state
  const [showPRCelebration, setShowPRCelebration] = useState(false);
  const [celebratedPR, setCelebratedPR] = useState<{ exerciseName: string; weightKg: number; reps: number } | null>(null);

  // Snapping numeric picker values
  const weightValues = useMemo(() => Array.from({ length: 161 }, (_, i) => i * 2.5), []); // 0 to 400kg
  const repsValues = useMemo(() => Array.from({ length: 101 }, (_, i) => i), []); // 0 to 100 reps

  const pickerSheetRef = useRef<BottomSheetModal>(null);
  const [editingSet, setEditingSet] = useState<{
    exerciseId: string;
    setIndex: number;
    type: 'weight' | 'reps';
    currentValue: number;
  } | null>(null);

  const handleWeightPress = useCallback((exerciseId: string, setIndex: number, currentWeight: number) => {
    setEditingSet({ exerciseId, setIndex, type: 'weight', currentValue: currentWeight });
    pickerSheetRef.current?.present();
  }, []);

  const handleRepsPress = useCallback((exerciseId: string, setIndex: number, currentReps: number) => {
    setEditingSet({ exerciseId, setIndex, type: 'reps', currentValue: currentReps });
    pickerSheetRef.current?.present();
  }, []);

  const handlePickerChange = useCallback((value: number) => {
    if (!editingSet) return;
    updateSet(editingSet.exerciseId, editingSet.setIndex, {
      [editingSet.type === 'weight' ? 'weightKg' : 'reps']: value,
    });
    setEditingSet((prev) => (prev ? { ...prev, currentValue: value } : null));
  }, [editingSet, updateSet]);

  const handleAddSet = useCallback((exerciseId: string, setLength: number) => {
    const newSet: SetEntry = {
      setNumber: setLength + 1,
      weightKg: 0,
      reps: 0,
      rpe: null,
      isWarmup: false,
      completedAt: null,
    };
    addSet(exerciseId, newSet);
  }, [addSet]);

  const handleCompleteSet = useCallback(
    async (exerciseId: string, name: string, sets: SetEntry[], setIndex: number) => {
      const set = sets[setIndex];
      const isCompleting = set.completedAt === null;

      completeSet(exerciseId, setIndex);

      if (isCompleting) {
        // Trigger haptics on set complete
        import('expo-haptics').then((Haptics) => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }).catch(() => {});

        // Start rest timer
        startRest(90);

        // Verify PR against DB
        if (user && set.weightKg > 0 && set.reps > 0) {
          try {
            const pb = await getDocument<{ weightKg: number; reps: number; estimated1RM: number }>(
              `users/${user.uid}/personal_records`,
              exerciseId
            );
            const new1RM = calculateEpley1RM(set.weightKg, set.reps);
            let isPR = false;

            if (!pb) {
              isPR = true;
            } else if (new1RM > (pb.estimated1RM ?? 0) || set.weightKg > pb.weightKg) {
              isPR = true;
            }

            if (isPR) {
              // Update/Save PR record in Firestore
              await setDocument(`users/${user.uid}/personal_records`, {
                exerciseId,
                exerciseName: name,
                weightKg: set.weightKg,
                reps: set.reps,
                estimated1RM: new1RM,
                date: Timestamp.now(),
              }, exerciseId);

              // Set PR Overlay state
              setCelebratedPR({
                exerciseName: name,
                weightKg: set.weightKg,
                reps: set.reps,
              });
              setShowPRCelebration(true);
            }
          } catch (err) {
            console.error('Failed to verify personal record:', err);
          }
        }
      }
    },
    [completeSet, startRest, user]
  );

  const handleEndWorkout = useCallback(async () => {
    try {
      await endWorkout();
      import('expo-haptics').then((Haptics) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }).catch(() => {});
      router.back();
    } catch (error) {
      console.error('Failed to end workout:', error);
    }
  }, [endWorkout, router]);

  const cycleSuperset = useCallback((exerciseId: string, currentSupersetId?: string | null) => {
    let nextId: string | null = null;
    if (!currentSupersetId) {
      nextId = 'A';
    } else if (currentSupersetId === 'A') {
      nextId = 'B';
    } else {
      nextId = null;
    }
    toggleSuperset(exerciseId, nextId);
    import('expo-haptics').then((Haptics) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }).catch(() => {});
  }, [toggleSuperset]);

  if (!activeWorkout) {
    const templateName = params.template ?? 'Custom Workout';
    const template: WorkoutTemplate = {
      name: templateName,
      exercises: getTemplateExercises(templateName),
    };
    useWorkoutStore.getState().startWorkout(template);
    return null;
  }

  return (
    <View className="flex-1 bg-[#0b0b0b]">
      {/* PR Celebration Fullscreen Overlay */}
      {celebratedPR && (
        <PRCelebration
          visible={showPRCelebration}
          exerciseName={celebratedPR.exerciseName}
          weightKg={celebratedPR.weightKg}
          reps={celebratedPR.reps}
          onDismiss={() => {
            setShowPRCelebration(false);
            setCelebratedPR(null);
          }}
        />
      )}

      {/* Header */}
      <View style={{ paddingTop: insets.top + 8 }} className="flex-row items-center justify-between px-4 pb-3">
        <ScalePressable onPress={handleEndWorkout} hapticType="impactMedium">
          <Text className="text-[#f36458] text-body-sm font-medium">End</Text>
        </ScalePressable>
        <View className="items-center">
          <Text className="text-white text-heading-md font-medium">{activeWorkout.name}</Text>
          <Text className="text-mute text-mono-eyebrow">{formatDurationFull(elapsedSeconds)}</Text>
        </View>
        <ScalePressable onPress={() => router.push('/(tabs)/workout/exercise-picker')} hapticType="selection">
          <Ionicons name="add-circle-outline" size={24} color="#b9b9b9" />
        </ScalePressable>
      </View>


      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Rest Timer Banner */}
        {isResting && (
          <RestTimerCard
            secondsLeft={restSecondsLeft}
            progress={progress}
            onSkip={skipRest}
          />
        )}

        {/* Notes Input Field */}
        <View className="mb-4">
          <TextInput
            value={activeWorkout.notes ?? ''}
            onChangeText={updateNotes}
            placeholder="Workout notes (e.g. Focus on control, felt great today)"
            placeholderTextColor="#797979"
            multiline
            className="bg-[#212121] text-white text-body-sm p-4 rounded-xl border border-[#353535] min-h-[60px]"
          />
        </View>

        {/* Exercises List (Vertical Layout) */}
        {exercises.length === 0 ? (
          <Card className="py-8 items-center justify-center">
            <Text className="text-ash text-body-sm mb-4">No exercises added yet</Text>
            <ScalePressable
              onPress={() => router.push('/(tabs)/workout/exercise-picker')}
              className="bg-[#212121] px-6 py-2.5 rounded-full border border-[#353535]"
            >
              <Text className="text-white text-caption font-medium">Add Exercise</Text>
            </ScalePressable>
          </Card>

        ) : (
          exercises.map((ex) => {
            const hasSuperset = !!ex.supersetId;
            return (
              <Card
                key={ex.exerciseId}
                className="mb-4 relative overflow-hidden"
              >
                {/* Superset visual border left */}
                {hasSuperset && (
                  <View 
                    style={{ backgroundColor: ex.supersetId === 'A' ? '#f36458' : '#797979' }}
                    className="absolute left-0 top-0 bottom-0 w-[4px]" 
                  />
                )}

                {/* Exercise Header */}
                <View className="flex-row items-center justify-between mb-3 pl-1">
                  <ScalePressable
                    onPress={() => router.push(`/(tabs)/workout/${ex.exerciseId}`)}
                    className="flex-1 mr-2"
                  >
                    <View className="flex-row items-center">
                      <Text className="text-white text-heading-md font-semibold mr-2">{ex.name}</Text>
                      {hasSuperset && (
                        <View className="bg-[#353535]/80 px-2 py-0.5 rounded-full border border-[#f36458]/30">
                          <Text className="text-ash text-[10px] uppercase font-bold tracking-wider">
                            SS {ex.supersetId}
                          </Text>
                        </View>
                      )}
                    </View>
                  </ScalePressable>

                  <View className="flex-row items-center space-x-2">
                    {/* Superset Link Action */}
                    <ScalePressable
                      onPress={() => cycleSuperset(ex.exerciseId, ex.supersetId)}
                      hapticType="impactLight"
                      className="p-1.5 rounded-lg bg-[#212121] border border-[#353535] flex-row items-center"
                    >
                      <Ionicons name="link-outline" size={14} color={hasSuperset ? '#f36458' : '#797979'} />
                      <Text className="text-[10px] font-semibold ml-1 text-ash">
                        {ex.supersetId ? `SS ${ex.supersetId}` : 'Link'}
                      </Text>
                    </ScalePressable>

                    {/* Delete Exercise */}
                    <ScalePressable
                      onPress={() => {
                        removeExercise(ex.exerciseId);
                        import('expo-haptics').then((Haptics) => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }).catch(() => {});
                      }}
                      hapticType="impactLight"
                      className="p-1.5 rounded-lg bg-[#212121] border border-[#353535]"
                    >
                      <Ionicons name="trash-outline" size={14} color="#dd0000" />
                    </ScalePressable>
                  </View>
                </View>


                {/* Set table headers */}
                <View className="flex-row items-center pb-2 border-b border-[#353535] mb-1 pl-1">
                  <View className="w-6 mr-3" />
                  <Text className="text-mute text-caption w-8 text-center">SET</Text>
                  <View className="flex-1 flex-row ml-3">
                    <Text className="text-mute text-caption flex-1 text-center">WEIGHT</Text>
                    <Text className="text-mute text-caption flex-1 text-center">REPS</Text>
                  </View>
                  <View className="w-8 ml-3" />
                </View>

                {/* Set list rows */}
                {ex.sets?.map((set, idx) => (
                  <View key={idx} className="flex-row items-center">
                    <View className="flex-1">
                      <SetRow
                        setNumber={set.setNumber}
                        weightKg={set.weightKg}
                        reps={set.reps}
                        isWarmup={set.isWarmup}
                        isCompleted={set.completedAt !== null}
                        onWeightPress={() => handleWeightPress(ex.exerciseId, idx, set.weightKg)}
                        onRepsPress={() => handleRepsPress(ex.exerciseId, idx, set.reps)}
                        onToggleWarmup={() => {
                          updateSet(ex.exerciseId, idx, { isWarmup: !set.isWarmup });
                        }}
                        onComplete={() => handleCompleteSet(ex.exerciseId, ex.name, ex.sets, idx)}
                      />
                    </View>
                    
                    {/* Delete set button */}
                    <ScalePressable
                      onPress={() => {
                        removeSet(ex.exerciseId, idx);
                        import('expo-haptics').then((Haptics) => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }).catch(() => {});
                      }}
                      hapticType="impactLight"
                      className="w-8 items-center justify-center h-9 ml-2"
                    >
                      <Ionicons name="close-circle-outline" size={18} color="#797979" />
                    </ScalePressable>
                  </View>
                ))}

                {/* Add Set Button */}
                <ScalePressable
                  onPress={() => handleAddSet(ex.exerciseId, ex.sets?.length ?? 0)}
                  hapticType="selection"
                  className="flex-row items-center justify-center py-3 mt-2 border border-dashed border-[#353535] rounded-lg"
                >
                  <Ionicons name="add" size={18} color="#797979" />
                  <Text className="text-mute text-caption ml-2">Add Set</Text>
                </ScalePressable>

              </Card>
            );
          })
        )}

        {/* Add Exercise button at the bottom of the list */}
        {exercises.length > 0 && (
          <ScalePressable
            onPress={() => router.push('/(tabs)/workout/exercise-picker')}
            className="flex-row items-center justify-center py-4 bg-[#212121] border border-[#353535] rounded-xl mb-8"
          >
            <Ionicons name="add-circle" size={20} color="#f36458" />
            <Text className="text-white text-body-sm font-semibold ml-2">Add Exercise</Text>
          </ScalePressable>
        )}
      </ScrollView>

      {/* Dynamic Weight / Reps bottom sheet picker */}
      <BottomSheet
        sheetRef={pickerSheetRef}
        snapPoints={editingSet?.type === 'weight' ? ['65%'] : ['40%']}
      >
        {editingSet && (
          <View className="flex-1 justify-between pb-6">
            <View className="items-center mb-4">
              <Text className="text-white text-heading-md font-medium mb-1">
                {editingSet.type === 'weight' ? 'Adjust Weight' : 'Adjust Repetitions'}
              </Text>
              <Text className="text-mute text-caption">
                {editingSet.type === 'weight' ? 'Select target weight in kg' : 'Select completed reps'}
              </Text>
            </View>

            {editingSet.type === 'weight' && (
              <View className="mb-4">
                <PlateCalculator targetWeight={editingSet.currentValue} />
              </View>
            )}

            <View className="flex-1 justify-center">
              <ScrollWheelPicker
                values={editingSet.type === 'weight' ? weightValues : repsValues}
                selectedValue={editingSet.currentValue}
                onValueChange={handlePickerChange}
                formatValue={(v) => (editingSet.type === 'weight' ? `${v} kg` : `${v} reps`)}
              />
            </View>

            <ScalePressable
              onPress={() => pickerSheetRef.current?.dismiss()}
              hapticType="impactLight"
              className="bg-[#f36458] h-12 rounded-full items-center justify-center mt-4 mx-4"
            >
              <Text className="text-[#0b0b0b] text-button font-semibold">Done</Text>
            </ScalePressable>
          </View>
        )}

      </BottomSheet>
    </View>
  );
}
