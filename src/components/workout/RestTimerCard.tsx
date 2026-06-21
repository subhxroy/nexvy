import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, SharedValue } from 'react-native-reanimated';
import { Card } from '../ui/Card';
import { formatDurationFull } from '../../utils/formatters';

interface RestTimerCardProps {
  secondsLeft: number;
  progress: SharedValue<number>;
  onSkip: () => void;
}

export function RestTimerCard({ secondsLeft, progress, onSkip }: RestTimerCardProps) {
  const barStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <Card className="mb-4">
      <View className="flex-row items-center justify-between mb-2">
        <View>
          <Text className="text-mute text-mono-eyebrow uppercase">REST</Text>
          <Text className="text-white text-display-lg font-medium">
            {formatDurationFull(secondsLeft)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onSkip}
          className="bg-[#353535] rounded-full px-4 py-2"
        >
          <Text className="text-ash text-button-sm">Skip</Text>
        </TouchableOpacity>
      </View>
      <View className="h-1 bg-[#353535] rounded-full overflow-hidden">
        <Animated.View className="h-full bg-[#f36458] rounded-full" style={barStyle} />
      </View>
    </Card>
  );
}
