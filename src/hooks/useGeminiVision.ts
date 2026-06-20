import { useState, useCallback } from 'react';
import { analyzePhoto } from '../services/gemini/analyzePhoto';
import { AINutritionResult } from '../types/nutrition.types';

interface UseGeminiVisionReturn {
  isAnalyzing: boolean;
  error: string | null;
  result: AINutritionResult | null;
  analyze: (base64Image: string, foodNameHint?: string) => Promise<AINutritionResult | null>;
  reset: () => void;
}

export function useGeminiVision(): UseGeminiVisionReturn {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AINutritionResult | null>(null);

  const analyze = useCallback(async (base64Image: string, foodNameHint?: string): Promise<AINutritionResult | null> => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzePhoto(base64Image, foodNameHint);
      setResult(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Photo analysis failed';
      setError(message);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsAnalyzing(false);
    setError(null);
    setResult(null);
  }, []);

  return { isAnalyzing, error, result, analyze, reset };
}
