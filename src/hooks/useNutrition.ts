import { useCallback } from 'react';
import { useNutritionStore } from '../stores/useNutritionStore';
import { useAuthStore } from '../stores/useAuthStore';
import { MealType, FoodItem } from '../types/nutrition.types';
import { Timestamp } from 'firebase/firestore';
import { updateDocument } from '../services/firebase/firestore';
import { getDateString } from '../utils/dateHelpers';

export function useNutrition() {
  const { todayLog, isLoading, selectedMealType, fetchTodayLog, addFoodItem, removeFoodItem, setSelectedMealType, clearTodayLog } = useNutritionStore();
  const { user } = useAuthStore();

  const handleFetchTodayLog = useCallback(async () => {
    if (!user) return;
    await fetchTodayLog(user.uid);
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
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      });

      try {
        const dateStr = getDateString();
        await updateDocument(
          'users',
          {
            meals: todayLog.meals.map((meal) =>
              meal.mealType === mealType
                ? { ...meal, items: [...meal.items, foodItem] }
                : meal
            ),
            totalCalories: todayLog.totalCalories + item.calories,
            macros: {
              protein: todayLog.macros.protein + item.macros.protein,
              carbs: todayLog.macros.carbs + item.macros.carbs,
              fat: todayLog.macros.fat + item.macros.fat,
            },
          },
          user.uid,
          'nutritionLogs',
          dateStr
        );
      } catch (error) {
        console.error('Failed to sync nutrition log:', error);
      }
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

      try {
        const dateStr = getDateString();
        const updatedMeals = todayLog.meals.map((meal) =>
          meal.mealType === mealType
            ? { ...meal, items: meal.items.filter((_, i) => i !== itemIndex) }
            : meal
        );

        const newTotalCals = updatedMeals.reduce(
          (sum, m) => sum + m.items.reduce((s, i) => s + i.calories, 0),
          0
        );

        await updateDocument(
          'users',
          {
            meals: updatedMeals,
            totalCalories: newTotalCals,
          },
          user.uid,
          'nutritionLogs',
          dateStr
        );
      } catch (error) {
        console.error('Failed to sync nutrition log:', error);
      }
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
  };
}
