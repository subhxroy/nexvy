import { View, Text } from 'react-native';
import { Card } from '../ui/Card';
import { MonoLabel } from '../ui/MonoLabel';

interface BentoStatGridProps {
  totalVolumeKg: number;
  totalDurationSeconds: number;
  totalDistanceKm: number;
  monthlyWorkouts: number;
}

export function BentoStatGrid({
  totalVolumeKg,
  totalDurationSeconds,
  totalDistanceKm,
  monthlyWorkouts,
}: BentoStatGridProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    return `${hours}h`;
  };

  return (
    <View className="flex-row flex-wrap mx-2">
      <View className="w-1/2 p-1">
        <Card>
          <Text className="text-white text-heading-lg font-medium">
            {totalVolumeKg > 1000 ? `${(totalVolumeKg / 1000).toFixed(1)}t` : `${Math.round(totalVolumeKg)} kg`}
          </Text>
          <MonoLabel text="TOTAL VOLUME" className="mt-1" />
        </Card>
      </View>
      <View className="w-1/2 p-1">
        <Card>
          <Text className="text-white text-heading-lg font-medium">{formatDuration(totalDurationSeconds)}</Text>
          <MonoLabel text="TRAINING TIME" className="mt-1" />
        </Card>
      </View>
      <View className="w-1/2 p-1">
        <Card>
          <Text className="text-white text-heading-lg font-medium">{totalDistanceKm.toFixed(1)} km</Text>
          <MonoLabel text="DISTANCE" className="mt-1" />
        </Card>
      </View>
      <View className="w-1/2 p-1">
        <Card>
          <Text className="text-white text-heading-lg font-medium">{monthlyWorkouts}</Text>
          <MonoLabel text="THIS MONTH" className="mt-1" />
        </Card>
      </View>
    </View>
  );
}
