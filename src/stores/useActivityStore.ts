import { create } from 'zustand';
import { ActivityType, GPSPoint, LiveActivity } from '../types/activity.types';

interface ActivityStore {
  isTracking: boolean;
  currentActivity: LiveActivity | null;
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

export const useActivityStore = create<ActivityStore>((set, get) => ({
  isTracking: false,
  currentActivity: null,
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
    const { currentActivity } = get();
    set({
      isTracking: false,
      currentActivity: null,
      elapsedSeconds: 0,
      distanceMeters: 0,
      gpsPoints: [],
      currentPace: 0,
    });
    return currentActivity;
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
}));
