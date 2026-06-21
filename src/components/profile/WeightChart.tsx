import { View, Text } from 'react-native';

interface WeightChartProps {
  data: { date: string; weightKg: number }[];
}

export function WeightChart({ data }: WeightChartProps) {
  if (data.length < 2) {
    return (
      <View className="h-32 bg-[#212121] rounded-card items-center justify-center">
        <Text className="text-mute text-caption">Log your weight to see trends</Text>
      </View>
    );
  }

  const weights = data.map((d) => d.weightKg);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const range = maxWeight - minWeight || 1;

  return (
    <View className="h-32 justify-between">
      {data.map((point, idx) => {
        const heightPercent = ((point.weightKg - minWeight) / range) * 100;
        const xPos = (idx / (data.length - 1)) * 100;
        return (
          <View
            key={`${point.date}-${idx}`}
            className="absolute bottom-0"
            style={{ left: `${xPos}%`, height: `${Math.max(heightPercent, 10)}%`, width: 8 }}
          >
            <View className="flex-1 bg-[#f36458] rounded-full" style={{ opacity: 0.6 + (heightPercent / 100) * 0.4 }} />
            <Text className="text-mute text-meta absolute -top-4 -left-4" style={{ width: 40 }}>
              {point.weightKg}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
