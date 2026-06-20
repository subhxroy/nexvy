import { generateContent } from './client';
import { aiNutritionResultSchema } from '../../lib/zod/nutrition.schema';
import { AINutritionResult } from '../../types/nutrition.types';

const SYSTEM_PROMPT = `You are a nutrition analysis AI. Parse this meal description and return ONLY a valid JSON object with no markdown, no code fences, no explanation. Schema:
{
  "name": string,
  "servingGrams": number,
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "confidence": "high"|"medium"|"low"
}

Estimate portion sizes based on standard servings. Be accurate with nutritional values.`;

export async function parseMealText(description: string): Promise<AINutritionResult> {
  const prompt = `Meal description: "${description}"\n\nReturn the nutritional analysis as JSON.`;
  const rawResponse = await generateContent(prompt);

  let cleanedResponse = rawResponse.trim();
  if (cleanedResponse.startsWith('```json')) {
    cleanedResponse = cleanedResponse.slice(7);
  }
  if (cleanedResponse.startsWith('```')) {
    cleanedResponse = cleanedResponse.slice(3);
  }
  if (cleanedResponse.endsWith('```')) {
    cleanedResponse = cleanedResponse.slice(0, -3);
  }
  cleanedResponse = cleanedResponse.trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleanedResponse);
  } catch {
    throw new Error('Failed to parse AI response as JSON');
  }

  const result = aiNutritionResultSchema.parse(parsed);

  return {
    name: result.name,
    servingGrams: result.servingGrams,
    calories: result.calories,
    protein: result.protein,
    carbs: result.carbs,
    fat: result.fat,
    confidence: result.confidence,
  };
}
