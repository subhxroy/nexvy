import { TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { useEffect, useCallback } from 'react';

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export function Toggle({ value, onValueChange, disabled = false }: ToggleProps) {
  const translateX = useSharedValue(value ? 20 : 0);

  useEffect(() => {
    translateX.value = withSpring(value ? 20 : 0, { damping: 15, stiffness: 180 });
  }, [value]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handlePress = useCallback(() => {
    if (disabled) return;
    import('expo-haptics').then((Haptics) => {
      Haptics.selectionAsync();
    }).catch(() => {});
    onValueChange(!value);
  }, [value, onValueChange, disabled]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
      className={`
        w-12 h-7 rounded-full justify-center px-0.5
        ${value ? 'bg-[#37cd84]' : 'bg-[#353535]'}
        ${disabled ? 'opacity-50' : ''}
      `}
    >
      <Animated.View
        className="w-6 h-6 rounded-full bg-white"
        style={thumbStyle}
      />
    </TouchableOpacity>
  );
}

