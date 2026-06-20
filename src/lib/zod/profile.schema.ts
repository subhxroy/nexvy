import { z } from 'zod';

export const personalDetailsSchema = z.object({
  age: z.number().min(13, 'Must be at least 13 years old').max(120, 'Please enter a valid age'),
  weightKg: z.number().min(20, 'Please enter a valid weight').max(400, 'Please enter a valid weight'),
  heightCm: z.number().min(50, 'Please enter a valid height').max(250, 'Please enter a valid height'),
  biologicalSex: z.enum(['male', 'female', 'other']),
});

export const fitnessGoalSchema = z.object({
  fitnessGoal: z.enum(['build_muscle', 'lose_fat', 'recomposition', 'endurance', 'maintain']),
});

export const activityLevelSchema = z.object({
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'very_active']),
  notificationsEnabled: z.boolean(),
});

export type PersonalDetailsForm = z.infer<typeof personalDetailsSchema>;
export type FitnessGoalForm = z.infer<typeof fitnessGoalSchema>;
export type ActivityLevelForm = z.infer<typeof activityLevelSchema>;
