import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { NutritionLog, MealType, FoodItem } from '../types/nutrition.types';
import { getDocument, setDocument, updateDocument } from '../services/firebase/firestore';
import { getDateString } from '../utils/dateHelpers';
import { storage, mmkvKeys, zustandStorage } from '../lib/mmkv';

interface NutritionStore {
  todayLog: NutritionLog | null;
  selectedMealType: MealType;
  isLoading: boolean;
  uid: string | null;
  fetchTodayLog: (uid: string) => Promise<void>;
  addFoodItem: (mealType: MealType, item: FoodItem) => Promise<void>;
  removeFoodItem: (mealType: MealType, itemIndex: number) => Promise<void>;
  setSelectedMealType: (type: MealType) => void;
  setUid: (uid: string) => void;
  clearTodayLog: () => void;
  setWaterCups: (cups: number) => Promise<void>;
}

function createEmptyLog(date: string): NutritionLog {
  return {
    date,
    totalCalories: 0,
    macros: { protein: 0, carbs: 0, fat: 0 },
    meals: [
      { mealType: 'breakfast', items: [] },
      { mealType: 'lunch', items: [] },
      { mealType: 'dinner', items: [] },
      { mealType: 'snacks', items: [] },
    ],
    waterCups: 0,
  };
}

function recalculateTotals(log: NutritionLog): NutritionLog {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  for (const meal of log.meals) {
    for (const item of meal.items) {
      totalCalories += item.calories;
      totalProtein += item.macros.protein;
      totalCarbs += item.macros.carbs;
      totalFat += item.macros.fat;
    }
  }

  return {
    ...log,
    totalCalories: Math.round(totalCalories),
    macros: {
      protein: Math.round(totalProtein),
      carbs: Math.round(totalCarbs),
      fat: Math.round(totalFat),
    },
  };
}

export const useNutritionStore = create<NutritionStore>()(
  persist(
    (set, get) => ({
      todayLog: null,
      selectedMealType: 'breakfast',
      isLoading: false,
      uid: null,

      fetchTodayLog: async (uid) => {
        set({ isLoading: true, uid });
        try {
          const dateStr = getDateString();
          const log = await getDocument<NutritionLog>('users', uid, 'nutritionLogs', dateStr);

          if (log) {
            set({ todayLog: log, isLoading: false });
            storage.set(mmkvKeys.NUTRITION_TODAY_CACHE, JSON.stringify(log));
          } else {
            const emptyLog = createEmptyLog(dateStr);
            set({ todayLog: emptyLog, isLoading: false });
            await setDocument('users', emptyLog, uid, 'nutritionLogs', dateStr);
          }
        } catch (error) {
          const cached = storage.getString(mmkvKeys.NUTRITION_TODAY_CACHE);
          if (cached) {
            try {
              const parsed = JSON.parse(cached) as NutritionLog;
              set({ todayLog: parsed, isLoading: false });
              return;
            } catch {}
          }
          set({ isLoading: false });
        }
      },

      addFoodItem: async (mealType, item) => {
        const { todayLog, uid } = get();
        if (!todayLog || !uid) return;

        const updatedLog = recalculateTotals({
          ...todayLog,
          meals: todayLog.meals.map((meal) =>
            meal.mealType === mealType
              ? { ...meal, items: [...meal.items, item] }
              : meal
          ),
        });

        set({ todayLog: updatedLog });
        storage.set(mmkvKeys.NUTRITION_TODAY_CACHE, JSON.stringify(updatedLog));

        const dateStr = getDateString();
        await updateDocument('users', updatedLog, uid, 'nutritionLogs', dateStr);
      },

      removeFoodItem: async (mealType, itemIndex) => {
        const { todayLog, uid } = get();
        if (!todayLog || !uid) return;

        const updatedLog = recalculateTotals({
          ...todayLog,
          meals: todayLog.meals.map((meal) =>
            meal.mealType === mealType
              ? { ...meal, items: meal.items.filter((_, i) => i !== itemIndex) }
              : meal
          ),
        });

        set({ todayLog: updatedLog });
        storage.set(mmkvKeys.NUTRITION_TODAY_CACHE, JSON.stringify(updatedLog));

        const dateStr = getDateString();
        await updateDocument('users', updatedLog, uid, 'nutritionLogs', dateStr);
      },

      setSelectedMealType: (type) => set({ selectedMealType: type }),

      setUid: (uid) => set({ uid }),

      clearTodayLog: () => set({ todayLog: null }),

      setWaterCups: async (cups) => {
        const { todayLog, uid } = get();
        if (!todayLog || !uid) return;

        const updatedLog = {
          ...todayLog,
          waterCups: cups,
        };

        set({ todayLog: updatedLog });
        storage.set(mmkvKeys.NUTRITION_TODAY_CACHE, JSON.stringify(updatedLog));

        const dateStr = getDateString();
        await updateDocument('users', updatedLog, uid, 'nutritionLogs', dateStr);
      },
    }),
    {
      name: 'nutrition-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        todayLog: state.todayLog,
        uid: state.uid,
      }),
    }
  )
);

