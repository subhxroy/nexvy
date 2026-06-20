import { View, Text } from 'react-native';
import { formatPace } from '../../utils/formatters';

interface PaceGaugeProps {
  pace: number;
  label?: string;
}

export function PaceGauge({ pace, label = 'CURRENT PACE' }: PaceGaugeProps) {
  return (
    <View className="items-center">
      <Text className="text-white text-display-hero font-medium">
        {pace > 0 ? formatPace(pace) : '--:--'}
      </Text>
      <Text className="text-mute text-mono-eyebrow uppercase">{label}</Text>
    </View>
  );
}
