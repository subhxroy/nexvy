import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { useActivityStore } from '../stores/useActivityStore';
import { GPSPoint } from '../types/activity.types';

export const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.error('[BackgroundLocationTask] Error:', error);
    return;
  }
  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    if (locations && locations.length > 0) {
      const store = useActivityStore.getState();
      // Only process and add points if tracking is active
      if (store.isTracking) {
        locations.forEach((loc) => {
          const point: GPSPoint = {
            lat: loc.coords.latitude,
            lng: loc.coords.longitude,
            timestamp: loc.timestamp,
            alt: loc.coords.altitude ?? 0,
          };
          
          // Check if this point is already added (avoid duplicates from fast updates)
          const lastPoint = store.gpsPoints[store.gpsPoints.length - 1];
          if (!lastPoint || lastPoint.timestamp !== point.timestamp) {
            store.addGPSPoint(point);
          }
        });
      }
    }
  }
});
