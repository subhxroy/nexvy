import { useState, useEffect, useCallback, useRef } from 'react';
import { Pedometer } from 'expo-sensors';

interface UseStepCounterReturn {
  steps: number;
  isAvailable: boolean;
  isPedometerAvailable: boolean;
  resetSteps: () => void;
}

export function useStepCounter(): UseStepCounterReturn {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [steps, setSteps] = useState(0);
  const subscriptionRef = useRef<ReturnType<typeof Pedometer.watchStepCount> | null>(null);
  const baselineRef = useRef(0);

  useEffect(() => {
    let isMounted = true;

    async function startWatching() {
      const isAvailable = await Pedometer.isAvailableAsync();
      if (isMounted) {
        setIsPedometerAvailable(isAvailable);
      }

      if (isAvailable) {
        const sub = Pedometer.watchStepCount((result) => {
          if (isMounted) {
            setSteps(result.steps - baselineRef.current);
          }
        });
        if (isMounted) {
          subscriptionRef.current = sub;
        }
      }
    }

    startWatching();

    return () => {
      isMounted = false;
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
      }
    };
  }, []);

  const resetSteps = useCallback(() => {
    baselineRef.current = steps;
    setSteps(0);
  }, [steps]);

  return {
    steps,
    isAvailable: isPedometerAvailable,
    isPedometerAvailable,
    resetSteps,
  };
}
