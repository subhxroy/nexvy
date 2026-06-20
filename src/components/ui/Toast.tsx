import { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import { colors } from '../../constants/tokens';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

const TOAST_CONFIG = {
  damping: 22,
  stiffness: 220,
};

export function Toast({
  message,
  type = 'info',
  visible,
  onHide,
  duration = 3000,
}: ToastProps) {
  const translateY = useSharedValue(40);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!visible) return;

    translateY.value = withSpring(0, TOAST_CONFIG);
    opacity.value = withSpring(1, TOAST_CONFIG);

    const timer = setTimeout(() => {
      translateY.value = withSpring(40, TOAST_CONFIG);
      opacity.value = withTiming(0, { duration: 200 }, () => {
        runOnJS(onHide)();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const bgColor =
    type === 'success'
      ? 'bg-[#37cd84]'
      : type === 'error'
        ? 'bg-[#dd0000]'
        : 'bg-[#212121]';

  const textColor =
    type === 'success' || type === 'error'
      ? 'text-[#0b0b0b]'
      : 'text-white';

  if (!visible) return null;

  return (
    <Animated.View
      className={`
        absolute bottom-24 left-4 right-4 z-50
        h-12 rounded-xl items-center justify-center
        ${bgColor}
      `}
      style={animatedStyle}
    >
      <Text className={`text-body-sm font-medium ${textColor}`}>{message}</Text>
    </Animated.View>
  );
}
