import { useState, useCallback } from 'react';
import { parseMealText } from '../services/gemini/parseMealText';
import { AINutritionResult } from '../types/nutrition.types';

interface UseGeminiTextReturn {
  isParsing: boolean;
  error: string | null;
  result: AINutritionResult | null;
  parse: (description: string) => Promise<AINutritionResult | null>;
  reset: () => void;
}

export function useGeminiText(): UseGeminiTextReturn {
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AINutritionResult | null>(null);

  const parse = useCallback(async (description: string): Promise<AINutritionResult | null> => {
    setIsParsing(true);
    setError(null);
    setResult(null);

    try {
      const data = await parseMealText(description);
      setResult(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Text analysis failed';
      setError(message);
      return null;
    } finally {
      setIsParsing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsParsing(false);
    setError(null);
    setResult(null);
  }, []);

  return { isParsing, error, result, parse, reset };
}
