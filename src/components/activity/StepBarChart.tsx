import { View, Text } from 'react-native';
import { colors } from '../../constants/tokens';

interface StepBarChartProps {
  data: Array<{ day: string; steps: number }>;
  maxSteps?: number;
}

export function StepBarChart({ data, maxSteps }: StepBarChartProps) {
  const max = maxSteps ?? Math.max(...data.map((d) => d.steps), 1);

  return (
    <View className="flex-row items-end justify-between h-24 px-2">
      {data.map((item) => {
        const heightPercent = (item.steps / max) * 100;
        return (
          <View key={item.day} className="items-center flex-1">
            <View
              className="w-full mx-0.5 rounded-t-sm"
              style={{
                height: `${Math.max(heightPercent, 4)}%`,
                backgroundColor: colors.brand,
                opacity: 0.7 + (heightPercent / 100) * 0.3,
              }}
            />
            <Text className="text-mute text-meta mt-1">{item.day}</Text>
          </View>
        );
      })}
    </View>
  );
}
