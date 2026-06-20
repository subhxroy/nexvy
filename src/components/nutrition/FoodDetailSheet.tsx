import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FoodDetailSheetProps {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingGrams: number;
  onServingChange: (grams: number) => void;
  onAdd: () => void;
  onClose: () => void;
}

export function FoodDetailSheet({
  name,
  calories,
  protein,
  carbs,
  fat,
  servingGrams,
  onServingChange,
  onAdd,
  onClose,
}: FoodDetailSheetProps) {
  return (
    <View className="flex-1 pt-4">
      <View className="flex-row items-center justify-between mb-6">
        <TouchableOpacity onPress={onClose}>
          <Text className="text-mute text-body-sm">Cancel</Text>
        </TouchableOpacity>
        <Text className="text-white text-heading-md font-medium">{name}</Text>
        <View style={{ width: 50 }} />
      </View>

      <View className="flex-row justify-around mb-6">
        <View className="items-center">
          <Text className="text-white text-heading-lg font-medium">{Math.round(calories)}</Text>
          <Text className="text-mute text-caption">calories</Text>
        </View>
        <View className="items-center">
          <Text className="text-white text-heading-lg font-medium">{Math.round(protein)}g</Text>
          <Text className="text-mute text-caption">protein</Text>
        </View>
        <View className="items-center">
          <Text className="text-white text-heading-lg font-medium">{Math.round(carbs)}g</Text>
          <Text className="text-mute text-caption">carbs</Text>
        </View>
        <View className="items-center">
          <Text className="text-white text-heading-lg font-medium">{Math.round(fat)}g</Text>
          <Text className="text-mute text-caption">fat</Text>
        </View>
      </View>

      <View className="flex-row items-center justify-center mb-8">
        <Text className="text-ash text-body-sm mr-3">Serving: {Math.round(servingGrams)}g</Text>
        <TouchableOpacity
          onPress={() => onServingChange(Math.max(10, servingGrams - 10))}
          className="bg-[#212121] rounded-full w-8 h-8 items-center justify-center"
        >
          <Ionicons name="remove" size={18} color="#b9b9b9" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onServingChange(servingGrams + 10)}
          className="bg-[#212121] rounded-full w-8 h-8 items-center justify-center ml-2"
        >
          <Ionicons name="add" size={18} color="#b9b9b9" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={onAdd}
        className="bg-[#f36458] h-[52px] rounded-full items-center justify-center"
      >
        <Text className="text-[#0b0b0b] text-button font-medium">Add Food</Text>
      </TouchableOpacity>
    </View>
  );
}
