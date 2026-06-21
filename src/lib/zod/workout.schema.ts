import { z } from 'zod';

export const setEntrySchema = z.object({
  setNumber: z.number().int().positive(),
  weightKg: z.number().min(0),
  reps: z.number().int().min(0),
  rpe: z.number().min(1).max(10).nullable(),
  isWarmup: z.boolean(),
  completedAt: z.any().nullable().optional(),
});

export const exerciseEntrySchema = z.object({
  exerciseId: z.string(),
  name: z.string().min(1),
  muscleGroup: z.string(),
  sets: z.array(setEntrySchema),
});

export const workoutNameSchema = z.object({
  name: z.string().min(1, 'Workout name is required').max(100),
});

export type SetEntryForm = z.infer<typeof setEntrySchema>;
export type ExerciseEntryForm = z.infer<typeof exerciseEntrySchema>;
export type WorkoutNameForm = z.infer<typeof workoutNameSchema>;
