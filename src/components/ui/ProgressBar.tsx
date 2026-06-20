import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../../constants/tokens';

interface ProgressBarProps {
  progress: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  className?: string;
}

export function ProgressBar({
  progress,
  height = 4,
  color = colors.brand,
  backgroundColor = colors.graphite,
  className = '',
}: ProgressBarProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming(`${Math.max(0, Math.min(100, progress * 100))}%`, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    }),
  }));

  return (
    <View
      className={`overflow-hidden rounded-full ${className}`}
      style={{ height, backgroundColor }}
    >
      <Animated.View
        style={[
          { height: '100%', backgroundColor: color, borderRadius: height / 2 },
          animatedStyle,
        ]}
      />
    </View>
  );
}
