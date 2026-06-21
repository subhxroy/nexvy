import { useEffect, useCallback } from 'react';
import {
  useSharedValue,
  withTiming,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { useWorkoutStore } from '../stores/useWorkoutStore';

export function useRestTimer() {
  const { isResting, restSecondsLeft, restDuration, skipRest, tickRest } = useWorkoutStore();
  const progress = useSharedValue(0);

  useEffect(() => {
    if (isResting) {
      progress.value = 1;
      progress.value = withTiming(0, {
        duration: restDuration * 1000,
        easing: Easing.linear,
      });
    } else {
      progress.value = 0;
    }
  }, [isResting, restDuration]);

  const handleSkipRest = useCallback(() => {
    cancelAnimation(progress);
    progress.value = 0;
    skipRest();
  }, [skipRest, progress]);

  return {
    isResting,
    restSecondsLeft,
    restDuration,
    progress,
    skipRest: handleSkipRest,
    tickRest,
  };
}
