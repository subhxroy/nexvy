import { z } from 'zod';

const preprocessNumber = (val: unknown) => {
  if (val === '' || val === undefined || val === null) return undefined;
  const n = Number(val);
  return Number.isNaN(n) ? undefined : n;
};

export const personalDetailsSchema = z.object({
  age: z.preprocess(preprocessNumber, z.number({ invalid_type_error: 'Age must be a number', required_error: 'Age is required' }).min(13, 'Must be at least 13 years old').max(120, 'Please enter a valid age')),
  weightKg: z.preprocess(preprocessNumber, z.number({ invalid_type_error: 'Weight must be a number', required_error: 'Weight is required' }).min(20, 'Please enter a valid weight').max(400, 'Please enter a valid weight')),
  heightCm: z.preprocess(preprocessNumber, z.number({ invalid_type_error: 'Height must be a number', required_error: 'Height is required' }).min(50, 'Please enter a valid height').max(250, 'Please enter a valid height')),
  biologicalSex: z.enum(['male', 'female', 'other']),
});

export const fitnessGoalSchema = z.object({
  fitnessGoal: z.union([
    z.enum(['build_muscle', 'lose_fat', 'recomposition', 'endurance', 'maintain']),
    z.array(z.enum(['build_muscle', 'lose_fat', 'recomposition', 'endurance', 'maintain']))
  ]),
});

export const activityLevelSchema = z.object({
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'very_active']),
  notificationsEnabled: z.boolean(),
});

export type PersonalDetailsForm = z.infer<typeof personalDetailsSchema>;
export type FitnessGoalForm = z.infer<typeof fitnessGoalSchema>;
export type ActivityLevelForm = z.infer<typeof activityLevelSchema>;
