import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';

interface HealthKitData {
  steps: number;
  activeEnergyBurned: number;
  distanceWalkingRunning: number;
}

interface UseHealthKitReturn {
  isAvailable: boolean;
  data: HealthKitData | null;
  requestPermissions: () => Promise<boolean>;
  syncWorkout: (workout: { type: string; duration: number; energyBurned: number; distance: number }) => Promise<boolean>;
}

export function useHealthKit(): UseHealthKitReturn {
  const [isAvailable, setIsAvailable] = useState(false);
  const [data, setData] = useState<HealthKitData | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      setIsAvailable(false);
      return;
    }

    async function checkAvailability() {
      try {
        const healthModule = require('expo-health');
        const isSupported = await healthModule.isHealthDataAvailable();
        setIsAvailable(isSupported);
      } catch {
        setIsAvailable(false);
      }
    }

    checkAvailability();
  }, []);

  const requestPermissions = useCallback(async (): Promise<boolean> => {
    if (Platform.OS !== 'ios' || !isAvailable) return false;

    try {
      const healthModule = require('expo-health');
      const granted = await healthModule.requestHealthPermissions([
        'workout',
        'activeEnergyBurned',
        'steps',
        'distanceWalkingRunning',
        'heartRate',
      ]);
      return granted;
    } catch {
      return false;
    }
  }, [isAvailable]);

  const syncWorkout = useCallback(
    async (workout: { type: string; duration: number; energyBurned: number; distance: number }): Promise<boolean> => {
      if (Platform.OS !== 'ios' || !isAvailable) return false;

      try {
        const healthModule = require('expo-health');
        await healthModule.saveWorkout({
          type: workout.type,
          startDate: new Date(),
          endDate: new Date(Date.now() + workout.duration * 1000),
          energyBurned: workout.energyBurned,
          distance: workout.distance,
        });
        return true;
      } catch {
        return false;
      }
    },
    [isAvailable]
  );

  return {
    isAvailable,
    data,
    requestPermissions,
    syncWorkout,
  };
}
