import { Timestamp } from 'firebase/firestore';

export type BiologicalSex = 'male' | 'female' | 'other';
export type FitnessGoal = 'build_muscle' | 'lose_fat' | 'recomposition' | 'endurance' | 'maintain';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active';
export type WeightUnit = 'kg' | 'lbs';

export interface MacroTargets {
  protein: number;
  carbs: number;
  fat: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  username: string;
  bio: string;
  photoURL: string;
  dateOfBirth: Timestamp;
  biologicalSex: BiologicalSex;
  heightCm: number;
  currentWeightKg: number;
  goalWeightKg: number;
  fitnessGoal: FitnessGoal;
  activityLevel: ActivityLevel;
  dailyCalorieTarget: number;
  macroTargets: MacroTargets;
  notificationsEnabled: boolean;
  healthKitEnabled: boolean;
  weightUnit: WeightUnit;
  isOnboarded: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface BodyweightEntry {
  date: string;
  weightKg: number;
  loggedAt: Timestamp;
}
