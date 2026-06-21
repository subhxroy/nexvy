import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ActivityType, GPSPoint, LiveActivity } from '../types/activity.types';
import { zustandStorage } from '../lib/mmkv';

interface ActivityStore {
  isTracking: boolean;
  currentActivity: LiveActivity | null;
  lastCompletedActivity: LiveActivity | null;
  elapsedSeconds: number;
  distanceMeters: number;
  gpsPoints: GPSPoint[];
  currentPace: number;
  startTracking: (type: ActivityType) => void;
  stopTracking: () => LiveActivity | null;
  pauseTracking: () => void;
  resumeTracking: () => void;
  addGPSPoint: (point: GPSPoint) => void;
  tick: () => void;
  setDistance: (meters: number) => void;
  setPace: (pace: number) => void;
}

export const useActivityStore = create<ActivityStore>()(
  persist(
    (set, get) => ({
      isTracking: false,
      currentActivity: null,
      lastCompletedActivity: null,
      elapsedSeconds: 0,
      distanceMeters: 0,
      gpsPoints: [],
      currentPace: 0,

      startTracking: (type) =>
        set({
          isTracking: true,
          currentActivity: {
            type,
            startedAt: Date.now(),
            gpsPoints: [],
            distanceMeters: 0,
            currentPace: 0,
            elevationGainMeters: 0,
          },
          elapsedSeconds: 0,
          distanceMeters: 0,
          gpsPoints: [],
          currentPace: 0,
        }),

      stopTracking: () => {
        const { currentActivity, elapsedSeconds } = get();
        // Construct completed state
        const completed = currentActivity
          ? {
              ...currentActivity,
              distanceMeters: get().distanceMeters,
              currentPace: get().currentPace,
              gpsPoints: get().gpsPoints,
              elevationGainMeters: currentActivity.elevationGainMeters,
              durationSeconds: elapsedSeconds, // add duration
            }
          : null;

        set({
          isTracking: false,
          currentActivity: null,
          lastCompletedActivity: completed,
          elapsedSeconds: 0,
          distanceMeters: 0,
          gpsPoints: [],
          currentPace: 0,
        });
        return completed;
      },

      pauseTracking: () => set({ isTracking: false }),

      resumeTracking: () => set({ isTracking: true }),

      addGPSPoint: (point) =>
        set((state) => ({
          gpsPoints: [...state.gpsPoints, point],
        })),

      tick: () =>
        set((state) => ({
          elapsedSeconds: state.elapsedSeconds + 1,
        })),

      setDistance: (meters) => set({ distanceMeters: meters }),

      setPace: (pace) => set({ currentPace: pace }),
    }),
    {
      name: 'activity-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        isTracking: state.isTracking,
        currentActivity: state.currentActivity,
        lastCompletedActivity: state.lastCompletedActivity,
        elapsedSeconds: state.elapsedSeconds,
        distanceMeters: state.distanceMeters,
        gpsPoints: state.gpsPoints,
        currentPace: state.currentPace,
      }),
    }
  )
);

