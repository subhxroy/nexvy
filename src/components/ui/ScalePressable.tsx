import { useCallback } from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface ScalePressableProps extends TouchableOpacityProps {
  onPress: () => void;
  scaleTo?: number;
  hapticType?: 'selection' | 'impactLight' | 'impactMedium' | 'impactHeavy' | 'none';
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function ScalePressable({
  children,
  onPress,
  scaleTo = 0.97,
  hapticType = 'selection',
  style,
  ...props
}: ScalePressableProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(scaleTo, { duration: 80 });
    opacity.value = withTiming(0.9, { duration: 80 });
  }, [scaleTo, scale, opacity]);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: 80 });
    opacity.value = withTiming(1, { duration: 80 });
  }, [scale, opacity]);

  const handlePress = useCallback(() => {
    if (hapticType !== 'none') {
      try {
        switch (hapticType) {
          case 'selection':
            Haptics.selectionAsync();
            break;
          case 'impactLight':
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            break;
          case 'impactMedium':
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            break;
          case 'impactHeavy':
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            break;
        }
      } catch (err) {
        console.warn('Haptics not supported', err);
      }
    }
    onPress();
  }, [onPress, hapticType]);

  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={[animatedStyle, style]}
      {...props}
    >
      {children}
    </AnimatedTouchable>
  );
}
