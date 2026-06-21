import { Timestamp } from 'firebase/firestore';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';
export type FoodSource = 'barcode' | 'photo_ai' | 'text_ai' | 'manual';
export type AIConfidence = 'high' | 'medium' | 'low';

export interface FoodMacros {
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodItem {
  foodId: string;
  name: string;
  brandName: string;
  servingGrams: number;
  calories: number;
  macros: FoodMacros;
  loggedAt: Timestamp;
  source: FoodSource;
}

export interface MealEntry {
  mealType: MealType;
  items: FoodItem[];
}

export interface NutritionLog {
  date: string;
  totalCalories: number;
  macros: FoodMacros;
  meals: MealEntry[];
  waterCups?: number;
}

export interface AINutritionResult {
  name: string;
  servingGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: AIConfidence;
}
