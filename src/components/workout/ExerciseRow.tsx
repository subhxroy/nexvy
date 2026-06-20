import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { muscleGroupColors, muscleGroupLabels } from '../../constants/muscleGroups';

interface ExerciseRowProps {
  name: string;
  muscleGroup: string;
  onPress: () => void;
}

export function ExerciseRow({ name, muscleGroup, onPress }: ExerciseRowProps) {
  const color = muscleGroupColors[muscleGroup] ?? '#797979';
  const label = muscleGroupLabels[muscleGroup] ?? muscleGroup;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center py-3 border-b border-[#353535]"
      activeOpacity={0.7}
    >
      <View
        className="w-8 h-8 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: color + '20' }}
      >
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
      </View>
      <View className="flex-1">
        <Text className="text-white text-body-sm font-medium">{name}</Text>
        <Text className="text-mute text-caption">{label}</Text>
      </View>
      <Ionicons name="add-circle-outline" size={22} color="#797979" />
    </TouchableOpacity>
  );
}
