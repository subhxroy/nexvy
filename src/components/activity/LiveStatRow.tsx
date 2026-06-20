import { View, Text } from 'react-native';
import { formatDistance, formatDurationFull, formatPace } from '../../utils/formatters';

interface LiveStatRowProps {
  distanceMeters: number;
  elapsedSeconds: number;
  currentPace: number;
}

export function LiveStatRow({ distanceMeters, elapsedSeconds, currentPace }: LiveStatRowProps) {
  return (
    <View className="flex-row justify-between bg-[#212121] rounded-card p-4 mb-4">
      <View className="items-center flex-1">
        <Text className="text-white text-heading-lg font-medium">
          {formatDistance(distanceMeters)}
        </Text>
        <Text className="text-mute text-mono-eyebrow uppercase">DISTANCE</Text>
      </View>
      <View className="items-center flex-1">
        <Text className="text-white text-heading-lg font-medium">
          {formatDurationFull(elapsedSeconds)}
        </Text>
        <Text className="text-mute text-mono-eyebrow uppercase">TIME</Text>
      </View>
      <View className="items-center flex-1">
        <Text className="text-white text-heading-lg font-medium">
          {currentPace > 0 ? formatPace(currentPace) : '--:--'}
        </Text>
        <Text className="text-mute text-mono-eyebrow uppercase">PACE</Text>
      </View>
    </View>
  );
}
