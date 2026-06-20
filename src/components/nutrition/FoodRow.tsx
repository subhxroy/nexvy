import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FoodRowProps {
  name: string;
  brandName?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingGrams: number;
  onPress: () => void;
}

export function FoodRow({
  name,
  brandName,
  calories,
  protein,
  carbs,
  fat,
  servingGrams,
  onPress,
}: FoodRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center py-3 border-b border-[#353535]"
      activeOpacity={0.7}
    >
      <View className="flex-1">
        <Text className="text-white text-body-sm font-medium">{name}</Text>
        {brandName ? (
          <Text className="text-mute text-caption">{brandName}</Text>
        ) : null}
        <View className="flex-row mt-1 space-x-3">
          <Text className="text-mute text-meta">{Math.round(calories)} cal</Text>
          <Text className="text-mute text-meta">P: {Math.round(protein)}g</Text>
          <Text className="text-mute text-meta">C: {Math.round(carbs)}g</Text>
          <Text className="text-mute text-meta">F: {Math.round(fat)}g</Text>
        </View>
      </View>
      <Text className="text-mute text-caption mr-2">{Math.round(servingGrams)}g</Text>
      <Ionicons name="add-circle" size={22} color="#f36458" />
    </TouchableOpacity>
  );
}
