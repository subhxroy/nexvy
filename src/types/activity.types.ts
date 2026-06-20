import { Timestamp } from 'firebase/firestore';

export type ActivityType = 'run' | 'walk' | 'cycle' | 'hike' | 'other';

export interface GPSPoint {
  lat: number;
  lng: number;
  timestamp: number;
  alt: number;
}

export interface Activity {
  id: string;
  type: ActivityType;
  name: string;
  startedAt: Timestamp;
  completedAt: Timestamp | null;
  durationSeconds: number;
  distanceMeters: number;
  averagePaceSecondsPerKm: number;
  caloriesBurned: number;
  steps: number;
  gpsRoute: GPSPoint[];
  elevationGainMeters: number;
}

export interface LiveActivity {
  type: ActivityType;
  startedAt: number;
  gpsPoints: GPSPoint[];
  distanceMeters: number;
  currentPace: number;
  elevationGainMeters: number;
}
