import { useEffect, useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../../src/stores/useAuthStore';
import { useNutrition } from '../../../src/hooks/useNutrition';
import { Header } from '../../../src/components/navigation/Header';
import { Card } from '../../../src/components/ui/Card';
import { CalorieRing } from '../../../src/components/nutrition/CalorieRing';
import { MacroRow } from '../../../src/components/nutrition/MacroRow';
import { MealCard } from '../../../src/components/nutrition/MealCard';
import { ScanActionPills } from '../../../src/components/nutrition/ScanActionPills';
import { MonoLabel } from '../../../src/components/ui/MonoLabel';
import { MealType } from '../../../src/types/nutrition.types';

export default function NutritionDashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useAuthStore();
  const { todayLog, isLoading, fetchTodayLog, setSelectedMealType } = useNutrition();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchTodayLog();
    }
  }, [user]);

  const handleMealPress = useCallback(
    (type: MealType) => {
      setSelectedMealType(type);
      router.push('/(tabs)/nutrition/log');
    },
    [router, setSelectedMealType]
  );

  const calorieTarget = profile?.dailyCalorieTarget ?? 2500;
  const currentCalories = todayLog?.totalCalories ?? 0;
  const macros = todayLog?.macros ?? { protein: 0, carbs: 0, fat: 0 };
  const macroTargets = profile?.macroTargets ?? { protein: 180, carbs: 250, fat: 60 };
  const meals = todayLog?.meals ?? [];

  const getMealCalories = (type: MealType): number => {
    const meal = meals.find((m) => m.mealType === type);
    if (!meal) return 0;
    return meal.items.reduce((sum, item) => sum + item.calories, 0);
  };

  return (
    <View className="flex-1 bg-[#0b0b0b]">
      <Header
        title="Nutrition"
        subtitle="DAILY TRACKER"
        rightAction={{ icon: 'search-outline', onPress: () => router.push('/(tabs)/nutrition/log') }}
      />
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <CalorieRing current={currentCalories} target={calorieTarget} />
        <MacroRow
          protein={{ current: macros.protein, target: macroTargets.protein }}
          carbs={{ current: macros.carbs, target: macroTargets.carbs }}
          fat={{ current: macros.fat, target: macroTargets.fat }}
        />

        <ScanActionPills
          onBarcode={() => router.push('/(tabs)/nutrition/scan')}
          onPhoto={() => router.push('/(tabs)/nutrition/snap')}
          onText={() => {
            setSelectedMealType('breakfast');
            router.push('/(tabs)/nutrition/log');
          }}
        />

        <MonoLabel text="MEALS" className="mb-3" />
        <MealCard
          mealType="breakfast"
          items={meals.find((m) => m.mealType === 'breakfast')?.items ?? []}
          calorieCount={getMealCalories('breakfast')}
          onPress={() => handleMealPress('breakfast')}
        />
        <MealCard
          mealType="lunch"
          items={meals.find((m) => m.mealType === 'lunch')?.items ?? []}
          calorieCount={getMealCalories('lunch')}
          onPress={() => handleMealPress('lunch')}
        />
        <MealCard
          mealType="dinner"
          items={meals.find((m) => m.mealType === 'dinner')?.items ?? []}
          calorieCount={getMealCalories('dinner')}
          onPress={() => handleMealPress('dinner')}
        />
        <MealCard
          mealType="snacks"
          items={meals.find((m) => m.mealType === 'snacks')?.items ?? []}
          calorieCount={getMealCalories('snacks')}
          onPress={() => handleMealPress('snacks')}
        />

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
