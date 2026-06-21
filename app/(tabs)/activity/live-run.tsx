import { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGPSTracking } from '../../../src/hooks/useGPSTracking';
import { LiveStatRow } from '../../../src/components/activity/LiveStatRow';
import { RouteTrace } from '../../../src/components/activity/RouteTrace';
import { Button } from '../../../src/components/ui/Button';
import { CountdownOverlay } from '../../../src/components/activity/CountdownOverlay';

export default function LiveRunScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    isTracking,
    elapsedSeconds,
    distanceMeters,
    gpsPoints,
    currentPace,
    startTracking,
    stopTracking,
    pauseTracking,
    resumeTracking,
  } = useGPSTracking();

  const [hasStarted, setHasStarted] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStart = useCallback(() => {
    setErrorMessage(null);
    setShowCountdown(true);
  }, []);

  const handleCountdownComplete = useCallback(async () => {
    setShowCountdown(false);
    try {
      await startTracking('run');
      setHasStarted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start tracking';
      setErrorMessage(message);
    }
  }, [startTracking]);

  const handleStop = useCallback(async () => {
    await stopTracking();
    setHasStarted(false);
    // Push/navigate to summary screen instead of back
    router.replace('/(tabs)/activity/summary');
  }, [stopTracking, router]);

  if (showCountdown) {
    return <CountdownOverlay onComplete={handleCountdownComplete} />;
  }

  if (!hasStarted) {
    return (
      <View className="flex-1 bg-[#0b0b0b]">
        <View style={{ paddingTop: insets.top + 8 }} className="flex-row items-center justify-between px-4 pb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="#b9b9b9" />
          </TouchableOpacity>
          <Text className="text-white text-heading-md font-medium">Run</Text>
          <View style={{ width: 24 }} />
        </View>
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-32 h-32 rounded-full bg-[#212121] items-center justify-center mb-6">
            <Ionicons name="walk-outline" size={56} color="#f36458" />
          </View>
          <Text className="text-white text-display-md font-medium mb-3">Ready to Run?</Text>
          <Text className="text-ash text-body-sm text-center mb-8">
            GPS tracking will map your route and log your stats
          </Text>
          {errorMessage && (
            <Text className="text-error text-caption text-center mb-4 px-4">
              {errorMessage}
            </Text>
          )}
          <Button title="Start Run" onPress={handleStart} variant="brand" />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#0b0b0b]">
      <View style={{ paddingTop: insets.top + 8 }} className="flex-row items-center justify-between px-4 pb-4">
        <TouchableOpacity onPress={handleStop}>
          <Text className="text-[#f36458] text-body-sm font-medium">Stop</Text>
        </TouchableOpacity>
        <View className="items-center">
          <Text className="text-white text-heading-md font-medium">Run</Text>
          <Text className="text-mute text-mono-eyebrow">LIVE</Text>
        </View>
        <TouchableOpacity onPress={isTracking ? pauseTracking : () => resumeTracking('run')}>
          <Ionicons
            name={isTracking ? 'pause-circle' : 'play-circle'}
            size={28}
            color="#b9b9b9"
          />
        </TouchableOpacity>
      </View>

      <View className="flex-1 px-4">
        <LiveStatRow
          distanceMeters={distanceMeters}
          elapsedSeconds={elapsedSeconds}
          currentPace={currentPace}
        />

        <RouteTrace points={gpsPoints} />

        <View className="flex-1 justify-end pb-8">
          <TouchableOpacity
            onPress={handleStop}
            className="w-16 h-16 rounded-full bg-[#dd0000] items-center justify-center self-center"
          >
            <Ionicons name="stop" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
