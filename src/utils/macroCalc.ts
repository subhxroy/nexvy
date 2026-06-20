import { ActivityLevel, FitnessGoal } from '../types/user.types';

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very_active: 1.725,
};

const GOAL_ADJUSTMENTS: Record<FitnessGoal, number> = {
  lose_fat: -400,
  build_muscle: 250,
  maintain: 0,
  recomposition: 0,
  endurance: 0,
};

export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: 'male' | 'female' | 'other'
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (sex === 'female') {
    return base - 161;
  }
  return base + 5;
}

export function calculateTDEE(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: 'male' | 'female' | 'other',
  activityLevel: ActivityLevel
): number {
  const bmr = calculateBMR(weightKg, heightCm, age, sex);
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

export function calculateCalorieTarget(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: 'male' | 'female' | 'other',
  activityLevel: ActivityLevel,
  goal: FitnessGoal
): number {
  const tdee = calculateTDEE(weightKg, heightCm, age, sex, activityLevel);
  const adjustment = GOAL_ADJUSTMENTS[goal];
  return Math.round(tdee + adjustment);
}

export function calculateMacroTargets(
  weightKg: number,
  calorieTarget: number
): { protein: number; carbs: number; fat: number } {
  const protein = Math.round(weightKg * 2.2);
  const fat = Math.round((calorieTarget * 0.25) / 9);
  const remainingCalories = calorieTarget - protein * 4 - fat * 9;
  const carbs = Math.round(remainingCalories / 4);

  return {
    protein: Math.max(protein, 0),
    carbs: Math.max(carbs, 0),
    fat: Math.max(fat, 0),
  };
}

export function calculateAllMacros(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: 'male' | 'female' | 'other',
  activityLevel: ActivityLevel,
  goal: FitnessGoal
): {
  bmr: number;
  tdee: number;
  calorieTarget: number;
  macros: { protein: number; carbs: number; fat: number };
} {
  const bmr = Math.round(calculateBMR(weightKg, heightCm, age, sex));
  const tdee = calculateTDEE(weightKg, heightCm, age, sex, activityLevel);
  const calorieTarget = calculateCalorieTarget(weightKg, heightCm, age, sex, activityLevel, goal);
  const macros = calculateMacroTargets(weightKg, calorieTarget);

  return { bmr, tdee, calorieTarget, macros };
}
