import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Timestamp } from 'firebase/firestore';
import { ActiveWorkout, WorkoutTemplate, SetEntry } from '../types/workout.types';
import { zustandStorage } from '../lib/mmkv';

interface WorkoutStore {
  activeWorkout: ActiveWorkout | null;
  elapsedSeconds: number;
  isResting: boolean;
  restSecondsLeft: number;
  restDuration: number;
  startWorkout: (template: WorkoutTemplate) => void;
  addExercise: (exercise: { exerciseId: string; name: string; muscleGroup: string }) => void;
  addSet: (exerciseId: string, set: SetEntry) => void;
  completeSet: (exerciseId: string, setIndex: number) => void;
  updateSet: (exerciseId: string, setIndex: number, updates: Partial<SetEntry>) => void;
  startRest: (seconds: number) => void;
  skipRest: () => void;
  tick: () => void;
  tickRest: () => void;
  endWorkout: () => ActiveWorkout | null;
  clearWorkout: () => void;
  toggleSuperset: (exerciseId: string, supersetId: string | null) => void;
  updateNotes: (notes: string) => void;
  removeSet: (exerciseId: string, setIndex: number) => void;
  removeExercise: (exerciseId: string) => void;
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set, get) => ({
      activeWorkout: null,
      elapsedSeconds: 0,
      isResting: false,
      restSecondsLeft: 0,
      restDuration: 90,

      startWorkout: (template) =>
        set({
          activeWorkout: {
            name: template.name,
            startedAt: Date.now(),
            exercises: template.exercises.map((e) => ({
              exerciseId: e.exerciseId,
              name: e.name,
              muscleGroup: e.muscleGroup,
              sets: [],
              supersetId: null,
            })),
          },
          elapsedSeconds: 0,
          isResting: false,
          restSecondsLeft: 0,
        }),

      addExercise: (exercise) =>
        set((state) => {
          if (!state.activeWorkout) return state;
          return {
            activeWorkout: {
              ...state.activeWorkout,
              exercises: [
                ...state.activeWorkout.exercises,
                { ...exercise, sets: [] },
              ],
            },
          };
        }),

      addSet: (exerciseId, setEntry) =>
        set((state) => {
          if (!state.activeWorkout) return state;
          return {
            activeWorkout: {
              ...state.activeWorkout,
              exercises: state.activeWorkout.exercises.map((ex) =>
                ex.exerciseId === exerciseId
                  ? { ...ex, sets: [...ex.sets, setEntry] }
                  : ex
              ),
            },
          };
        }),

      completeSet: (exerciseId, setIndex) =>
        set((state) => {
          if (!state.activeWorkout) return state;
          return {
            activeWorkout: {
              ...state.activeWorkout,
              exercises: state.activeWorkout.exercises.map((ex) =>
                ex.exerciseId === exerciseId
                  ? {
                      ...ex,
                      sets: ex.sets.map((s, i) =>
                        i === setIndex ? { ...s, completedAt: Timestamp.now() } : s
                      ),
                    }
                  : ex
              ),
            },
          };
        }),

      updateSet: (exerciseId, setIndex, updates) =>
        set((state) => {
          if (!state.activeWorkout) return state;
          return {
            activeWorkout: {
              ...state.activeWorkout,
              exercises: state.activeWorkout.exercises.map((ex) =>
                ex.exerciseId === exerciseId
                  ? {
                      ...ex,
                      sets: ex.sets.map((s, i) => (i === setIndex ? { ...s, ...updates } : s)),
                    }
                  : ex
              ),
            },
          };
        }),

      startRest: (seconds) =>
        set({
          isResting: true,
          restSecondsLeft: seconds,
          restDuration: seconds,
        }),

      skipRest: () =>
        set({
          isResting: false,
          restSecondsLeft: 0,
        }),

      tick: () =>
        set((state) => ({
          elapsedSeconds: state.elapsedSeconds + 1,
        })),

      tickRest: () =>
        set((state) => {
          if (!state.isResting) return state;
          const next = state.restSecondsLeft - 1;
          if (next <= 0) {
            return { isResting: false, restSecondsLeft: 0 };
          }
          return { restSecondsLeft: next };
        }),

      endWorkout: () => {
        const { activeWorkout } = get();
        return activeWorkout;
      },

      clearWorkout: () =>
        set({
          activeWorkout: null,
          elapsedSeconds: 0,
          isResting: false,
          restSecondsLeft: 0,
        }),

      toggleSuperset: (exerciseId, supersetId) =>
        set((state) => {
          if (!state.activeWorkout) return state;
          return {
            activeWorkout: {
              ...state.activeWorkout,
              exercises: state.activeWorkout.exercises.map((ex) =>
                ex.exerciseId === exerciseId ? { ...ex, supersetId } : ex
              ),
            },
          };
        }),

      updateNotes: (notes) =>
        set((state) => {
          if (!state.activeWorkout) return state;
          return {
            activeWorkout: {
              ...state.activeWorkout,
              notes,
            },
          };
        }),

      removeSet: (exerciseId, setIndex) =>
        set((state) => {
          if (!state.activeWorkout) return state;
          return {
            activeWorkout: {
              ...state.activeWorkout,
              exercises: state.activeWorkout.exercises.map((ex) =>
                ex.exerciseId === exerciseId
                  ? {
                      ...ex,
                      sets: ex.sets
                        .filter((_, i) => i !== setIndex)
                        .map((s, idx) => ({ ...s, setNumber: idx + 1 })),
                    }
                  : ex
              ),
            },
          };
        }),

      removeExercise: (exerciseId) =>
        set((state) => {
          if (!state.activeWorkout) return state;
          return {
            activeWorkout: {
              ...state.activeWorkout,
              exercises: state.activeWorkout.exercises.filter(
                (ex) => ex.exerciseId !== exerciseId
              ),
            },
          };
        }),
    }),
    {
      name: 'workout-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        activeWorkout: state.activeWorkout,
        elapsedSeconds: state.elapsedSeconds,
        isResting: state.isResting,
        restSecondsLeft: state.restSecondsLeft,
        restDuration: state.restDuration,
      }),
    }
  )
);

