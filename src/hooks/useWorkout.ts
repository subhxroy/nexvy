import { useEffect, useRef, useCallback } from 'react';
import { useWorkoutStore } from '../stores/useWorkoutStore';
import { useAuthStore } from '../stores/useAuthStore';
import { WorkoutTemplate, ExerciseEntry, ActiveWorkout } from '../types/workout.types';
import { addToCollection } from '../services/firebase/firestore';
import { Timestamp } from 'firebase/firestore';

export function useWorkout() {
  const {
    activeWorkout,
    elapsedSeconds,
    isResting,
    restSecondsLeft,
    startWorkout,
    addSet,
    completeSet,
    updateSet,
    startRest,
    skipRest,
    tick,
    tickRest,
    endWorkout,
    clearWorkout,
    toggleSuperset,
    updateNotes,
    removeSet,
    removeExercise,
  } = useWorkoutStore();

  const { user } = useAuthStore();

  const isRestingRef = useRef(isResting);
  const restSecondsLeftRef = useRef(restSecondsLeft);
  isRestingRef.current = isResting;
  restSecondsLeftRef.current = restSecondsLeft;

  useEffect(() => {
    if (!activeWorkout) return;

    const timer = setInterval(() => {
      tick();
      if (isRestingRef.current) {
        if (restSecondsLeftRef.current === 1) {
          import('expo-haptics').then((Haptics) => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          }).catch(() => {});
        }
        tickRest();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeWorkout, tick, tickRest]);

  const handleStartWorkout = useCallback(
    (template: WorkoutTemplate) => {
      startWorkout(template);
    },
    [startWorkout]
  );

  const handleEndWorkout = useCallback(async () => {
    const workout = endWorkout();
    if (!workout || !user) return;

    try {
      const totalVolumeKg = workout.exercises.reduce((total, ex) => {
        return (
          total +
          ex.sets.reduce((setTotal, set) => {
            return setTotal + set.weightKg * set.reps;
          }, 0)
        );
      }, 0);

      const now = new Date();
      const workoutData = {
        name: workout.name,
        startedAt: Timestamp.fromDate(new Date(workout.startedAt)),
        completedAt: Timestamp.fromDate(now),
        durationSeconds: elapsedSeconds,
        totalVolumeKg,
        notes: workout.notes ?? '',
        exercises: workout.exercises.map((ex) => ({
          exerciseId: ex.exerciseId,
          name: ex.name,
          muscleGroup: ex.muscleGroup,
          sets: ex.sets.map((s) => ({
            setNumber: s.setNumber,
            weightKg: s.weightKg,
            reps: s.reps,
            rpe: s.rpe,
            isWarmup: s.isWarmup,
            completedAt: s.completedAt ?? Timestamp.fromDate(now),
          })),
        })),
      };

      await addToCollection('users', workoutData, user.uid, 'workouts');
      clearWorkout();
    } catch (error) {
      throw error;
    }
  }, [endWorkout, user, elapsedSeconds, clearWorkout]);

  return {
    activeWorkout,
    elapsedSeconds,
    isResting,
    restSecondsLeft,
    startWorkout: handleStartWorkout,
    addSet,
    completeSet,
    updateSet,
    startRest,
    skipRest,
    endWorkout: handleEndWorkout,
    toggleSuperset,
    updateNotes,
    removeSet,
    removeExercise,
  };
}
