import { useCallback, useMemo } from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
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
          bg: 'bg-white',
          text: 'text-[#0b0b0b]',
          disabledBg: 'bg-[#353535]',
          disabledText: 'text-[#797979]',
        };
      case 'brand':
        return {
          bg: 'bg-[#f36458]',
          text: 'text-[#0b0b0b]',
          disabledBg: 'bg-[#353535]',
          disabledText: 'text-[#797979]',
        };
      case 'secondary':
        return {
          bg: 'bg-[#212121] border border-[#353535]',
          text: 'text-[#b9b9b9]',
          disabledBg: 'bg-[#212121] border border-[#353535]',
          disabledText: 'text-[#797979]',
        };
      case 'ghost':
        return {
          bg: 'bg-transparent',
          text: 'text-[#b9b9b9]',
          disabledBg: 'bg-transparent',
          disabledText: 'text-[#797979]',
        };
    }
  }, [variant]);

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={1}
      className={`
        h-[52px] rounded-full items-center justify-center flex-row px-6
        ${disabled ? styleConfig.disabledBg : styleConfig.bg}
        ${className}
      `}
      style={animatedStyle}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={disabled ? colors.mute : variant === 'ghost' ? colors.ash : colors.canvas}
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
