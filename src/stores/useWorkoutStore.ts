import { create } from 'zustand';
import { ActiveWorkout, WorkoutTemplate, SetEntry } from '../types/workout.types';

interface WorkoutStore {
  activeWorkout: ActiveWorkout | null;
  elapsedSeconds: number;
  isResting: boolean;
  restSecondsLeft: number;
  restDuration: number;
  startWorkout: (template: WorkoutTemplate) => void;
  addSet: (exerciseId: string, set: SetEntry) => void;
  completeSet: (exerciseId: string, setIndex: number) => void;
  updateSet: (exerciseId: string, setIndex: number, updates: Partial<SetEntry>) => void;
  startRest: (seconds: number) => void;
  skipRest: () => void;
  tick: () => void;
  tickRest: () => void;
  endWorkout: () => ActiveWorkout | null;
  clearWorkout: () => void;
}

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
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
        })),
      },
      elapsedSeconds: 0,
      isResting: false,
      restSecondsLeft: 0,
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
                    i === setIndex ? { ...s, completedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any } : s
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
}));
