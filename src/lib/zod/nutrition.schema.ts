import { z } from 'zod';

export const foodMacrosSchema = z.object({
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fat: z.number().min(0),
});

export const foodItemSchema = z.object({
  foodId: z.string(),
  name: z.string().min(1),
  brandName: z.string(),
  servingGrams: z.number().min(1),
  calories: z.number().min(0),
  macros: foodMacrosSchema,
  source: z.enum(['barcode', 'photo_ai', 'text_ai', 'manual']),
});

export const aiNutritionResultSchema = z.object({
  name: z.string().min(1),
  servingGrams: z.number().min(1),
  calories: z.number().min(0),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fat: z.number().min(0),
  confidence: z.enum(['high', 'medium', 'low']),
});

export type FoodItemForm = z.infer<typeof foodItemSchema>;
export type AINutritionResultForm = z.infer<typeof aiNutritionResultSchema>;
