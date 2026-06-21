import { useEffect, useCallback, useRef } from 'react';
import * as Location from 'expo-location';
import { useActivityStore } from '../stores/useActivityStore';
import { useAuthStore } from '../stores/useAuthStore';
import { GPSPoint, ActivityType } from '../types/activity.types';
import { calculateTotalDistance, calculateCurrentPace, calculateElevationGain } from '../utils/distanceCalc';
import { addToCollection } from '../services/firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { LOCATION_TASK_NAME } from '../tasks/backgroundLocationTask';

export function useGPSTracking() {
  const {
    isTracking,
    currentActivity,
    elapsedSeconds,
    distanceMeters,
    gpsPoints,
    currentPace,
    startTracking,
    stopTracking,
    pauseTracking,
    resumeTracking,
    addGPSPoint,
    tick,
    setDistance,
    setPace,
    lastCompletedActivity,
  } = useActivityStore();

  const { user } = useAuthStore();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isTracking) {
      timerRef.current = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isTracking, tick]);

  const startLocationTask = useCallback(async () => {
    const isRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    if (!isRunning) {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 3000,
        distanceInterval: 5,
        foregroundService: {
          notificationTitle: 'Nexvy Live Run',
          notificationBody: 'Tracking your route in the background...',
          notificationColor: '#f36458',
        },
        showsBackgroundLocationIndicator: true,
      });
    }
  }, []);

  const stopLocationTask = useCallback(async () => {
    const isRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    if (isRunning) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    }
  }, []);

  const handleStartTracking = useCallback(
    async (type: ActivityType) => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission is required for GPS tracking.');
      }

      const backgroundStatus = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus.status !== 'granted') {
        console.warn('Background location not granted');
      }

      startTracking(type);

      import('expo-haptics').then((Hapsics) => {
        Hapsics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }).catch(() => {});

      await startLocationTask();
    },
    [startTracking, startLocationTask]
  );

  useEffect(() => {
    if (gpsPoints.length > 0) {
      const dist = calculateTotalDistance(gpsPoints);
      setDistance(dist);

      const pace = calculateCurrentPace(gpsPoints);
      if (pace !== null) {
        setPace(pace);
      }
    }
  }, [gpsPoints, setDistance, setPace]);

  const handleStopTracking = useCallback(async () => {
    await stopLocationTask();

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    import('expo-haptics').then((Haptics) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }).catch(() => {});

    const activity = stopTracking();
    if (activity && user) {
      const avgPace = activity.distanceMeters > 0 
        ? Math.round(elapsedSeconds / (activity.distanceMeters / 1000))
        : 0;

      // MET calculation based on activity type
      const weight = 70; // default fallback weight
      const durationHours = elapsedSeconds / 3600;
      const MET = activity.type === 'run' ? 9.8 : 3.5;
      const caloriesBurned = Math.round(weight * MET * durationHours);

      const dbActivity = {
        type: activity.type,
        name: `${activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}`,
        startedAt: Timestamp.fromMillis(activity.startedAt),
        completedAt: Timestamp.now(),
        durationSeconds: elapsedSeconds,
        distanceMeters: activity.distanceMeters,
        averagePaceSecondsPerKm: avgPace,
        caloriesBurned,
        steps: Math.round(activity.distanceMeters * 1.3),
        gpsRoute: activity.gpsPoints,
        elevationGainMeters: calculateElevationGain(activity.gpsPoints),
      };

      try {
        await addToCollection(`users/${user.uid}/activities`, dbActivity);
      } catch (err) {
        console.error('Failed to save activity to Firestore:', err);
      }
    }

    return activity;
  }, [stopTracking, user, elapsedSeconds, stopLocationTask]);

  const handlePauseTracking = useCallback(async () => {
    await stopLocationTask();
    pauseTracking();
  }, [pauseTracking, stopLocationTask]);

  const handleResumeTracking = useCallback(
    async (type: ActivityType) => {
      resumeTracking();
      await startLocationTask();
    },
    [resumeTracking, startLocationTask]
  );

  return {
    isTracking,
    currentActivity,
    lastCompletedActivity,
    elapsedSeconds,
    distanceMeters,
    gpsPoints,
    currentPace,
    startTracking: handleStartTracking,
    stopTracking: handleStopTracking,
    pauseTracking: handlePauseTracking,
    resumeTracking: handleResumeTracking,
  };
}
