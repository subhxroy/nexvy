import { useEffect, useCallback, useRef } from 'react';
import * as Location from 'expo-location';
import { useActivityStore } from '../stores/useActivityStore';
import { useAuthStore } from '../stores/useAuthStore';
import { GPSPoint, ActivityType } from '../types/activity.types';
import { calculateTotalDistance, calculateCurrentPace, calculateElevationGain } from '../utils/distanceCalc';
import { addToCollection } from '../services/firebase/firestore';
import { Timestamp } from 'firebase/firestore';

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
  } = useActivityStore();

  const { user } = useAuthStore();

  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
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

      import('expo-haptics').then((Haptics) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      });

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5,
          timeInterval: 3000,
        },
        (locationData) => {
          const point: GPSPoint = {
            lat: locationData.coords.latitude,
            lng: locationData.coords.longitude,
            timestamp: locationData.timestamp,
            alt: locationData.coords.altitude ?? 0,
          };
          addGPSPoint(point);
        }
      );
    },
    [startTracking, addGPSPoint]
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
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    import('expo-haptics').then((Haptics) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    });

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
  }, [stopTracking, user, elapsedSeconds]);

  const handlePauseTracking = useCallback(() => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
    pauseTracking();
  }, [pauseTracking]);

  const handleResumeTracking = useCallback(
    async (type: ActivityType) => {
      resumeTracking();
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5,
          timeInterval: 3000,
        },
        (locationData) => {
          const point: GPSPoint = {
            lat: locationData.coords.latitude,
            lng: locationData.coords.longitude,
            timestamp: locationData.timestamp,
            alt: locationData.coords.altitude ?? 0,
          };
          addGPSPoint(point);
        }
      );
    },
    [resumeTracking, addGPSPoint]
  );

  return {
    isTracking,
    currentActivity,
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
