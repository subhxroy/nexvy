import { View, Text, TouchableOpacity, TextInput as RNTextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SetRowProps {
  setNumber: number;
  weightKg: number;
  reps: number;
  isWarmup: boolean;
  isCompleted: boolean;
  onWeightChange: (value: number) => void;
  onRepsChange: (value: number) => void;
  onToggleWarmup: () => void;
  onComplete: () => void;
}

export function SetRow({
  setNumber,
  weightKg,
  reps,
  isWarmup,
  isCompleted,
  onWeightChange,
  onRepsChange,
  onToggleWarmup,
  onComplete,
}: SetRowProps) {
  return (
    <View className="flex-row items-center py-2 border-b border-[#353535]">
      <TouchableOpacity onPress={onComplete} className="mr-3">
        <View
          className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
            isCompleted ? 'bg-[#37cd84] border-[#37cd84]' : 'border-[#797979]'
          }`}
        >
          {isCompleted && <Ionicons name="checkmark" size={14} color="#0b0b0b" />}
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={onToggleWarmup} className="w-8">
        <Text
          className={`text-body-sm text-center font-medium ${
            isWarmup ? 'text-[#f36458]' : 'text-ash'
          }`}
        >
          {isWarmup ? 'W' : setNumber}
        </Text>
      </TouchableOpacity>

      <View className="flex-1 flex-row items-center ml-3">
        <RNTextInput
          value={weightKg > 0 ? String(weightKg) : ''}
          onChangeText={(t) => onWeightChange(parseFloat(t) || 0)}
          placeholder="0"
          placeholderTextColor="#797979"
          keyboardType="numeric"
          className="bg-[#212121] text-white text-body-sm text-center w-16 h-9 rounded-lg"
        />
        <Text className="text-mute text-caption ml-1 mr-3">kg</Text>

        <RNTextInput
          value={reps > 0 ? String(reps) : ''}
          onChangeText={(t) => onRepsChange(parseInt(t) || 0)}
          placeholder="0"
          placeholderTextColor="#797979"
          keyboardType="numeric"
          className="bg-[#212121] text-white text-body-sm text-center w-14 h-9 rounded-lg"
        />
        <Text className="text-mute text-caption ml-1">reps</Text>
      </View>
    </View>
  );
}
