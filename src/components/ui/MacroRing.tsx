import { View, Text } from 'react-native';
import Animated, {
  useAnimatedProps,
  withTiming,
  Easing,
  useSharedValue,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { useEffect } from 'react';
import { colors } from '../../constants/tokens';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface MacroRingProps {
  current: number;
  target: number;
  color: string;
  label: string;
  unit?: string;
  size?: number;
  strokeWidth?: number;
  delay?: number;
}

export function MacroRing({
  current,
  target,
  color,
  label,
  unit = 'g',
  size = 64,
  strokeWidth = 6,
  delay = 0,
}: MacroRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = target > 0 ? Math.min(current / target, 1) : 0;

  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    setTimeout(() => {
      animatedProgress.value = withTiming(progress, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      });
    }, delay);
  }, [progress, delay]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedProgress.value),
  }));

  return (
    <View className="items-center">
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.graphite}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeLinecap="round"
            animatedProps={animatedProps}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View className="absolute inset-0 items-center justify-center">
          <Text className="text-white text-meta font-medium">
            {Math.round(current)}
          </Text>
        </View>
      </View>
      <Text className="text-mute text-meta mt-1">
        {label} ({unit})
      </Text>
      <Text className="text-mute text-mono-eyebrow">
        {Math.round(progress * 100)}%
      </Text>
    </View>
  );
}
