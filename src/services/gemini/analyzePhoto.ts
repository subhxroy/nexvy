import { generateContent } from './client';
import { aiNutritionResultSchema } from '../../lib/zod/nutrition.schema';
import { AINutritionResult } from '../../types/nutrition.types';

const SYSTEM_PROMPT = `You are a nutrition analysis AI. Analyse this food image and return ONLY a valid JSON object with no markdown, no code fences, no explanation. Schema:
{
  "name": string,
  "servingGrams": number,
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "confidence": "high"|"medium"|"low"
}`;

export async function analyzePhoto(base64Image: string, foodNameHint?: string): Promise<AINutritionResult> {
  let prompt = SYSTEM_PROMPT;
  if (foodNameHint) {
    prompt += `\n\nThe image is a photo of "${foodNameHint}". Please analyze its nutritional composition accordingly.`;
  }

  const rawResponse = await generateContent(prompt, base64Image);

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
