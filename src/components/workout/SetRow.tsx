import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScalePressable } from '../ui/ScalePressable';

interface SetRowProps {
  setNumber: number;
  weightKg: number;
  reps: number;
  isWarmup: boolean;
  isCompleted: boolean;
  onWeightPress: () => void;
  onRepsPress: () => void;
  onToggleWarmup: () => void;
  onComplete: () => void;
}

export function SetRow({
  setNumber,
  weightKg,
  reps,
  isWarmup,
  isCompleted,
  onWeightPress,
  onRepsPress,
  onToggleWarmup,
  onComplete,
}: SetRowProps) {
  return (
    <View className="flex-row items-center py-2 border-b border-[#353535]">
      <ScalePressable onPress={onComplete} hapticType="impactMedium" scaleTo={0.88} className="mr-3">
        <View
          className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
            isCompleted ? 'bg-[#37cd84] border-[#37cd84]' : 'border-[#797979]'
          }`}
        >
          {isCompleted && <Ionicons name="checkmark" size={14} color="#0b0b0b" />}
        </View>
      </ScalePressable>

      <ScalePressable onPress={onToggleWarmup} hapticType="selection" className="w-8">
        <Text
          className={`text-body-sm text-center font-medium ${
            isWarmup ? 'text-[#f36458]' : 'text-ash'
          }`}
        >
          {isWarmup ? 'W' : setNumber}
        </Text>
      </ScalePressable>

      <View className="flex-1 flex-row items-center ml-3">
        <ScalePressable
          onPress={onWeightPress}
          hapticType="selection"
          scaleTo={0.93}
          className="bg-[#212121] justify-center items-center w-16 h-9 rounded-lg border border-[#353535]/30"
        >
          <Text className="text-white text-body-sm text-center">
            {weightKg > 0 ? String(weightKg) : '0'}
          </Text>
        </ScalePressable>
        <Text className="text-mute text-caption ml-1.5 mr-3">kg</Text>

        <ScalePressable
          onPress={onRepsPress}
          hapticType="selection"
          scaleTo={0.93}
          className="bg-[#212121] justify-center items-center w-14 h-9 rounded-lg border border-[#353535]/30"
        >
          <Text className="text-white text-body-sm text-center">
            {reps > 0 ? String(reps) : '0'}
          </Text>
        </ScalePressable>
        <Text className="text-mute text-caption ml-1.5">reps</Text>
      </View>
    </View>
  );
}


