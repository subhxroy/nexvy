import { useCallback, useMemo } from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { colors } from '../../constants/tokens';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'brand';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
}: ButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.96, { duration: 80 });
    opacity.value = withTiming(0.85, { duration: 80 });
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: 80 });
    opacity.value = withTiming(1, { duration: 80 });
  }, []);

  const styleConfig = useMemo(() => {
    switch (variant) {
      case 'primary':
        return {
          bg: 'bg-brand',
          text: 'text-white',
          disabledBg: 'bg-graphite',
          disabledText: 'text-mute',
        };
      case 'brand':
        return {
          bg: 'bg-brand',
          text: 'text-white',
          disabledBg: 'bg-graphite',
          disabledText: 'text-mute',
        };
      case 'secondary':
        return {
          bg: 'bg-surface border border-border/80',
          text: 'text-text-primary',
          disabledBg: 'bg-surface border border-border/80',
          disabledText: 'text-mute',
        };
      case 'ghost':
        return {
          bg: 'bg-transparent',
          text: 'text-text-secondary',
          disabledBg: 'bg-transparent',
          disabledText: 'text-mute',
        };
    }
  }, [variant]);

  const handlePress = useCallback(() => {
    if (Platform.OS !== 'web' && (variant === 'primary' || variant === 'brand')) {
      import('expo-haptics').then((Haptics) => {
        Haptics.selectionAsync();
      }).catch(() => {});
    }
    onPress();
  }, [onPress, variant]);

  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={1}
      className={`
        h-[52px] rounded-card items-center justify-center flex-row px-6
        ${disabled ? styleConfig.disabledBg : styleConfig.bg}
        ${className}
      `}
      style={animatedStyle}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={disabled ? colors.mute : colors.onPrimary}
          className="mr-2"
        />
      )}
      <Text
        className={`
          font-button text-button
          ${disabled ? styleConfig.disabledText : styleConfig.text}
        `}
      >
        {title}
      </Text>
    </AnimatedTouchable>
  );
}
