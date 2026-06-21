import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { MonoLabel } from '../ui/MonoLabel';
import { ScalePressable } from '../ui/ScalePressable';

interface WaterWidgetProps {
  waterCups: number;
  onUpdateWaterCups: (cups: number) => void;
}

export function WaterWidget({ waterCups, onUpdateWaterCups }: WaterWidgetProps) {
  const handleDropPress = (index: number) => {
    // If tapping the currently selected drop, toggle it down by 1 (or toggle off if it's 1)
    const targetCups = waterCups === index + 1 ? index : index + 1;
    onUpdateWaterCups(targetCups);
  };

  return (
    <Card className="mb-6">
      <View className="flex-row justify-between items-center mb-3">
        <MonoLabel text="WATER INTAKE" />
        <Text className="text-white text-body-sm font-medium">
          {waterCups} <Text className="text-mute text-caption">/ 8 cups</Text>
        </Text>
      </View>

      <View className="flex-row justify-between items-center py-2 px-1">
        {Array.from({ length: 8 }).map((_, idx) => {
          const isActive = idx < waterCups;
          return (
            <ScalePressable
              key={idx}
              onPress={() => handleDropPress(idx)}
              hapticType="impactLight"
              scaleTo={0.85}
              className="items-center justify-center p-1"
            >
              <Ionicons
                name={isActive ? 'water' : 'water-outline'}
                size={28}
                color={isActive ? '#38bdf8' : '#797979'}
              />
            </ScalePressable>
          );
        })}
      </View>
      
      <Text className="text-mute text-caption-tight mt-2 text-center">
        {waterCups >= 8 ? 'Hydration goal met! Great job! 💧' : 'Stay hydrated! Tap drops to log water.'}
      </Text>
    </Card>
  );
}

