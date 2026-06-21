import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

interface PRCelebrationProps {
  visible: boolean;
  exerciseName: string;
  weightKg: number;
  reps: number;
  onDismiss: () => void;
}

export function PRCelebration({ visible, exerciseName, weightKg, reps, onDismiss }: PRCelebrationProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Scale up with spring, hold, fade out
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSequence(
        withSpring(1, { damping: 12, stiffness: 120 }),
        withDelay(
          1200,
          withTiming(0, { duration: 250 }, (finished) => {
            if (finished) {
              runOnJS(onDismiss)();
            }
          })
        )
      );
      opacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withDelay(1200, withTiming(0, { duration: 250 }))
      );
    } else {
      scale.value = 0;
      opacity.value = 0;
    }
  }, [visible, onDismiss]);

  if (!visible) return null;

  return (
    <Animated.View 
      style={[styles.container, { opacity }]} 
      className="absolute inset-0 z-50 bg-[#0b0b0b]/90 items-center justify-center px-6"
    >
      <Animated.View 
        style={{ transform: [{ scale }] }} 
        className="items-center bg-[#212121] rounded-3xl p-8 border border-[#353535] shadow-2xl w-full max-w-[300px]"
      >
        <Text className="text-5xl mb-4">🏆</Text>
        <Text className="text-[#f36458] text-mono-eyebrow mb-2 text-center tracking-widest font-semibold">
          NEW PERSONAL RECORD
        </Text>
        <Text className="text-white text-heading-lg font-bold text-center mb-4">
          {exerciseName}
        </Text>
        <View className="bg-[#0b0b0b] rounded-2xl px-6 py-4 items-center w-full">
          <Text className="text-white text-display-md font-bold">
            {weightKg} <Text className="text-[#f36458] text-body-lg">kg</Text>
          </Text>
          <Text className="text-ash text-caption mt-1">
            For {reps} {reps === 1 ? 'rep' : 'reps'}
          </Text>
        </View>
        <Text className="text-mute text-caption-tight text-center mt-4 italic">
          Keep pushing your limits! ✨
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});
