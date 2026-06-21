import { GPSPoint } from '../types/activity.types';

const EARTH_RADIUS_METERS = 6371000;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_METERS * c;
}

export function calculateTotalDistance(points: GPSPoint[]): number {
  if (points.length < 2) return 0;

  let totalDistance = 0;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]!;
    const curr = points[i]!;
    totalDistance += haversineDistance(prev.lat, prev.lng, curr.lat, curr.lng);
  }

  return totalDistance;
}

export function calculateCurrentPace(points: GPSPoint[], recentDistanceMeters: number = 500): number | null {
  if (points.length < 2) return null;

  const now = points[points.length - 1]!.timestamp;
  let accumulatedDistance = 0;
  let startTime = now;

  for (let i = points.length - 1; i >= 1; i--) {
    const curr = points[i]!;
    const prev = points[i - 1]!;
    accumulatedDistance += haversineDistance(prev.lat, prev.lng, curr.lat, curr.lng);
    if (accumulatedDistance >= recentDistanceMeters) {
      startTime = prev.timestamp;
      break;
    }
  }

  const elapsedSeconds = (now - startTime) / 1000;
  if (elapsedSeconds <= 0) return null;

  if (accumulatedDistance < 10) return null;

  const paceSecondsPerKm = (elapsedSeconds / accumulatedDistance) * 1000;
  return paceSecondsPerKm;
}

export function calculateElevationGain(points: GPSPoint[]): number {
  if (points.length < 2) return 0;

  let gain = 0;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]!;
    const curr = points[i]!;
    const diff = curr.alt - prev.alt;
    if (diff > 0) {
      gain += diff;
    }
  }

  return gain;
}
