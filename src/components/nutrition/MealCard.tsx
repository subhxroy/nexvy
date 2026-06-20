import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { MonoLabel } from '../ui/MonoLabel';
import { FoodItem, MealType } from '../../types/nutrition.types';

interface MealCardProps {
  mealType: MealType;
  items: FoodItem[];
  calorieCount: number;
  onPress: () => void;
}

const mealIcons: Record<MealType, keyof typeof Ionicons.glyphMap> = {
  breakfast: 'sunny-outline',
  lunch: 'partly-sunny-outline',
  dinner: 'moon-outline',
  snacks: 'pizza-outline',
};

export function MealCard({ mealType, items, calorieCount, onPress }: MealCardProps) {
  const label = mealType.charAt(0).toUpperCase() + mealType.slice(1);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card className="mb-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-[#353535] items-center justify-center mr-3">
              <Ionicons name={mealIcons[mealType]} size={16} color="#b9b9b9" />
            </View>
            <View>
              <Text className="text-white text-body-sm font-medium">{label}</Text>
              {items.length > 0 && (
                <Text className="text-mute text-caption">
                  {items.length} item{items.length !== 1 ? 's' : ''}
                </Text>
              )}
            </View>
          </View>
          <View className="items-end">
            <Text className="text-white text-body-sm font-medium">
              {Math.round(calorieCount)}
            </Text>
            <Text className="text-mute text-caption">cal</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#797979" className="ml-2" />
        </View>
        {items.length === 0 && (
          <Text className="text-mute text-caption mt-2 ml-11">No items logged</Text>
        )}
      </Card>
    </TouchableOpacity>
  );
}
