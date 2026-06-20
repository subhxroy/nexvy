import { useState, useEffect, useCallback } from 'react';
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
  const [subscription, setSubscription] = useState<ReturnType<typeof Pedometer.watchStepCount> | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function checkAvailability() {
      const isAvailable = await Pedometer.isAvailableAsync();
      if (isMounted) {
        setIsPedometerAvailable(isAvailable);
      }
    }

    checkAvailability();

    return () => {
      isMounted = false;
    };
  }, []);

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
            setSteps(result.steps);
          }
        });
        if (isMounted) {
          setSubscription(sub);
        }
      }
    }

    startWatching();

    return () => {
      isMounted = false;
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  const resetSteps = useCallback(() => {
    setSteps(0);
  }, []);

  return {
    steps,
    isAvailable: isPedometerAvailable,
    isPedometerAvailable,
    resetSteps,
  };
}
