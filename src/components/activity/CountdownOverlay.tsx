import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

interface CountdownOverlayProps {
  onComplete: () => void;
}

export function CountdownOverlay({ onComplete }: CountdownOverlayProps) {
  const [count, setCount] = useState<number | string>(3);
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  const triggerAnimation = () => {
    scale.value = 0.5;
    opacity.value = 0;
    
    opacity.value = withTiming(1, { duration: 150 });
    scale.value = withSpring(1.5, { damping: 10, stiffness: 120 }, (finished) => {
      if (finished) {
        opacity.value = withDelayValue(300, withTiming(0, { duration: 150 }));
      }
    });
  };

  // Helper because we can't use withDelay easily on a callback inside spring end on React Native threads
  const withDelayValue = (delay: number, animation: any) => {
    return withSequence(withTiming(1, { duration: delay }), animation);
  };

  useEffect(() => {
    let current = 3;
    triggerAnimation();

    const interval = setInterval(() => {
      current -= 1;
      if (current === 0) {
        setCount('GO!');
        triggerAnimation();
        
        import('expo-haptics').then((Haptics) => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }).catch(() => {});
      } else if (current < 0) {
        clearInterval(interval);
        onComplete();
      } else {
        setCount(current);
        triggerAnimation();
        
        import('expo-haptics').then((Haptics) => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }).catch(() => {});
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View className="absolute inset-0 bg-[#0b0b0b] z-50 items-center justify-center">
      <Animated.View style={animatedStyle} className="items-center justify-center">
        <Text className="text-white text-[120px] font-black text-center tracking-tighter">
          {count}
        </Text>
      </Animated.View>
    </View>
  );
}
