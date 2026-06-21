import { useCallback } from 'react';
import { useNutritionStore } from '../stores/useNutritionStore';
import { useAuthStore } from '../stores/useAuthStore';
import { MealType, FoodItem } from '../types/nutrition.types';
import { Timestamp } from 'firebase/firestore';

export function useNutrition() {
  const { todayLog, isLoading, selectedMealType, fetchTodayLog, addFoodItem, removeFoodItem, setSelectedMealType, clearTodayLog, setWaterCups } = useNutritionStore();
  const { user } = useAuthStore();

  const handleFetchTodayLog = useCallback(async () => {
    if (!user) return;
    await fetchTodayLog(user.uid);
    useNutritionStore.getState().setUid(user.uid);
  }, [user, fetchTodayLog]);

  const handleAddFoodItem = useCallback(
    async (mealType: MealType, item: Omit<FoodItem, 'loggedAt'>) => {
      if (!user || !todayLog) return;

      const foodItem: FoodItem = {
        ...item,
        loggedAt: Timestamp.fromDate(new Date()),
      };

      await addFoodItem(mealType, foodItem);

      import('expo-haptics').then((Haptics) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }).catch(() => {});
    },
    [user, todayLog, addFoodItem]
  );

  const handleRemoveFoodItem = useCallback(
    async (mealType: MealType, itemIndex: number) => {
      if (!user || !todayLog) return;

      const meal = todayLog.meals.find((m) => m.mealType === mealType);
      const item = meal?.items[itemIndex];
      if (!item) return;

      await removeFoodItem(mealType, itemIndex);
    },
    [user, todayLog, removeFoodItem]
  );

  return {
    todayLog,
    isLoading,
    selectedMealType,
    fetchTodayLog: handleFetchTodayLog,
    addFoodItem: handleAddFoodItem,
    removeFoodItem: handleRemoveFoodItem,
    setSelectedMealType,
    clearTodayLog,
    setWaterCups,
  };
}
