import { View, Text } from 'react-native';
import { muscleGroupColors, muscleGroupLabels } from '../../constants/muscleGroups';

interface MuscleGroupBarProps {
  distributions: Array<{ group: string; percentage: number }>;
}

export function MuscleGroupBar({ distributions }: MuscleGroupBarProps) {
  const total = distributions.reduce((sum, d) => sum + d.percentage, 0);

  return (
    <View className="space-y-2">
      {distributions.map((d) => {
        const widthPercent = total > 0 ? (d.percentage / total) * 100 : 0;
        const color = muscleGroupColors[d.group] ?? '#353535';
        const label = muscleGroupLabels[d.group] ?? d.group;

        return (
          <View key={d.group} className="flex-row items-center">
            <Text className="text-mute text-caption w-20">{label}</Text>
            <View className="flex-1 h-3 bg-[#212121] rounded-full overflow-hidden">
              <View
                style={{
                  width: `${widthPercent}%`,
                  backgroundColor: color,
                  height: '100%',
                  borderRadius: 999,
                }}
              />
            </View>
            <Text className="text-mute text-caption ml-2 w-8 text-right">
              {Math.round(widthPercent)}%
            </Text>
          </View>
        );
      })}
    </View>
  );
}
