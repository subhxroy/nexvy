import { Timestamp } from 'firebase/firestore';

export interface SetEntry {
  setNumber: number;
  weightKg: number;
  reps: number;
  rpe: number | null;
  isWarmup: boolean;
  completedAt: Timestamp | null;
}

export interface ExerciseEntry {
  exerciseId: string;
  name: string;
  muscleGroup: string;
  sets: SetEntry[];
}

export interface Workout {
  id: string;
  name: string;
  startedAt: Timestamp;
  completedAt: Timestamp | null;
  durationSeconds: number;
  totalVolumeKg: number;
  notes: string;
  exercises: ExerciseEntry[];
}

export interface ActiveWorkout {
  name: string;
  startedAt: number;
  exercises: ExerciseEntry[];
}

export interface WorkoutTemplate {
  name: string;
  exercises: Array<{
    exerciseId: string;
    name: string;
    muscleGroup: string;
  }>;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  isCustom: boolean;
  createdAt: Timestamp | null;
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  weightKg: number;
  reps: number;
  date: Timestamp;
  workoutId: string;
}
