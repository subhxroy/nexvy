import { FoodItem } from '../types/nutrition.types';
import { queryClient } from '../lib/queryClient';
import { Timestamp } from 'firebase/firestore';

interface OpenFoodFactsProduct {
  product_name?: string;
  brands?: string;
  nutriments?: {
    'energy-kcal_100g'?: number;
    'proteins_100g'?: number;
    'carbohydrates_100g'?: number;
    'fat_100g'?: number;
  };
}

interface OpenFoodFactsResponse {
  status: number;
  product?: OpenFoodFactsProduct;
  code?: string;
}

async function fetchBarcodeFromNetwork(barcode: string): Promise<FoodItem> {
  const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Open Food Facts API error: ${response.status}`);
  }

  const data: OpenFoodFactsResponse = await response.json();

  if (data.status !== 1 || !data.product) {
    throw new Error('Product not found. Try entering manually.');
  }

  const product = data.product;
  const nutriments = product.nutriments ?? {};

  return {
    foodId: data.code ?? barcode,
    name: product.product_name ?? 'Unknown Product',
    brandName: product.brands ?? '',
    servingGrams: 100,
    calories: nutriments['energy-kcal_100g'] ?? 0,
    macros: {
      protein: nutriments['proteins_100g'] ?? 0,
      carbs: nutriments['carbohydrates_100g'] ?? 0,
      fat: nutriments['fat_100g'] ?? 0,
    },
    loggedAt: Timestamp.fromDate(new Date()),
    source: 'barcode',
  };
}

export async function lookupBarcode(barcode: string): Promise<FoodItem> {
  return queryClient.fetchQuery({
    queryKey: ['barcode', barcode],
    queryFn: () => fetchBarcodeFromNetwork(barcode),
    staleTime: 86400000,
  });
}

export function useBarcodeLookup(barcode: string | null) {
  return {
    queryKey: ['barcode', barcode],
    queryFn: () => (barcode ? lookupBarcode(barcode) : null),
    enabled: !!barcode,
    staleTime: 86400000,
    retry: 1,
  };
}
