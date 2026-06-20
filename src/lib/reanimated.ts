import { withSpring, withTiming, withSequence, withDelay, Easing, WithSpringConfig, WithTimingConfig } from 'react-native-reanimated';

export const springScreenEntry: WithSpringConfig = {
  damping: 20,
  stiffness: 180,
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

export const springCardPress: WithSpringConfig = {
  damping: 15,
  stiffness: 300,
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

export const springBottomSheet: WithSpringConfig = {
  damping: 30,
  stiffness: 200,
  mass: 1,
  overshootClamping: true,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

export const springToast: WithSpringConfig = {
  damping: 22,
  stiffness: 220,
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

export const timingProgressBar: WithTimingConfig = {
  duration: 600,
  easing: Easing.out(Easing.cubic),
};

export const timingMacroRing: WithTimingConfig = {
  duration: 800,
  easing: Easing.out(Easing.cubic),
};

export const timingRestBar: WithTimingConfig = {
  duration: 0,
  easing: Easing.linear,
};

export function animatedScreenEntry() {
  return {
    opacity: withSpring(1, springScreenEntry),
    transform: [{ translateY: withSpring(0, springScreenEntry) }],
  };
}

export function animatedCardPress(isPressed: boolean) {
  'worklet';
  if (isPressed) {
    return withSpring(0.97, springCardPress);
  }
  return withSpring(1, springCardPress);
}

export function animatedButtonPress(isPressed: boolean) {
  'worklet';
  if (isPressed) {
    return withTiming(0.96, { duration: 80 });
  }
  return withTiming(1, { duration: 80 });
}

export function animatedToastEntry() {
  return {
    opacity: withSpring(1, springToast),
    transform: [{ translateY: withSpring(0, springToast) }],
  };
}

export function staggeredDelay(index: number, baseDelay: number = 100) {
  return baseDelay * index;
}
