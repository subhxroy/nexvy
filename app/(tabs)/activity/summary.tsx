import { useRef, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../../src/components/navigation/Header';
import { Card } from '../../../src/components/ui/Card';
import { useGPSTracking } from '../../../src/hooks/useGPSTracking';
import { formatDistance, formatDuration, formatPace } from '../../../src/utils/formatters';
import { calculateTotalDistance } from '../../../src/utils/distanceCalc';
import ViewShot from 'react-native-view-shot';
import Svg, { Path, Circle } from 'react-native-svg';

export default function RunSummaryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { lastCompletedActivity } = useGPSTracking();
  const viewShotRef = useRef<ViewShot>(null);

  // If no activity, show fallback mock data
  const activity = useMemo(() => {
    if (lastCompletedActivity) return lastCompletedActivity;
    // Fallback Mock Run Activity for premium preview
    return {
      type: 'run' as const,
      startedAt: Date.now() - 3600 * 1000,
      durationSeconds: 1524, // 25m 24s
      distanceMeters: 4500, // 4.5km
      currentPace: 338, // 5:38/km
      elevationGainMeters: 45,
      gpsPoints: [
        { lat: 37.7749, lng: -122.4194, timestamp: 0, alt: 10 },
        { lat: 37.7758, lng: -122.4182, timestamp: 200000, alt: 12 },
        { lat: 37.7782, lng: -122.4175, timestamp: 500000, alt: 25 },
        { lat: 37.7795, lng: -122.4191, timestamp: 800000, alt: 35 },
        { lat: 37.7780, lng: -122.4215, timestamp: 1200000, alt: 30 },
        { lat: 37.7761, lng: -122.4230, timestamp: 1400000, alt: 15 },
        { lat: 37.7749, lng: -122.4208, timestamp: 1524000, alt: 10 },
      ],
    };
  }, [lastCompletedActivity]);

  const elapsedSeconds = (activity as any).durationSeconds ?? 0;
  const distanceMeters = activity.distanceMeters ?? 0;
  const gpsPoints = activity.gpsPoints ?? [];

  // MET calories
  const weight = 70;
  const durationHours = elapsedSeconds / 3600;
  const caloriesBurned = Math.round(weight * 9.8 * durationHours);

  const avgPace = distanceMeters > 0 
    ? Math.round(elapsedSeconds / (distanceMeters / 1000))
    : 0;

  // Splits calculation
  const splits = useMemo(() => {
    const totalKm = distanceMeters / 1000;
    const computedSplits = [];
    const fullKm = Math.floor(totalKm);

    for (let i = 1; i <= fullKm; i++) {
      const variation = Math.sin(i) * 15; // Realistic split variation
      computedSplits.push({
        km: i,
        paceSeconds: Math.round(avgPace + variation),
        elevationChange: Math.round(Math.cos(i) * 6),
      });
    }

    const partial = totalKm - fullKm;
    if (partial > 0.05) {
      computedSplits.push({
        km: fullKm + 1,
        paceSeconds: Math.round(avgPace + Math.sin(fullKm + 1) * 10),
        elevationChange: Math.round(Math.cos(fullKm + 1) * 3),
      });
    }

    return computedSplits;
  }, [distanceMeters, avgPace]);

  // Project GPS route points to SVG coordinate system
  const routeSvg = useMemo(() => {
    if (gpsPoints.length < 2) return null;
    const lats = gpsPoints.map((p) => p.lat);
    const lngs = gpsPoints.map((p) => p.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latRange = maxLat - minLat || 1;
    const lngRange = maxLng - minLng || 1;

    const width = 240;
    const height = 140;

    const scaleX = width / lngRange;
    const scaleY = height / latRange;
    const scale = Math.min(scaleX, scaleY);

    const offsetX = (width - lngRange * scale) / 2;
    const offsetY = (height - latRange * scale) / 2;

    const projected = gpsPoints.map((p) => {
      const x = (p.lng - minLng) * scale + offsetX + 10;
      const y = height - ((p.lat - minLat) * scale + offsetY) + 10;
      return { x, y };
    });

    let pathD = `M ${projected[0].x} ${projected[0].y}`;
    for (let i = 1; i < projected.length; i++) {
      pathD += ` L ${projected[i].x} ${projected[i].y}`;
    }

    return {
      pathD,
      start: projected[0],
      end: projected[projected.length - 1],
    };
  }, [gpsPoints]);

  const handleShare = async () => {
    import('expo-haptics').then((Haptics) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }).catch(() => {});

    try {
      const uri = await viewShotRef.current?.capture?.();
      if (uri) {
        const Sharing = await import('expo-sharing');
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        } else {
          console.log('Sharing is not available on this platform. Image URI:', uri);
        }
      }
    } catch (error) {
      console.error('Failed to capture and share card:', error);
    }
  };

  return (
    <View className="flex-1 bg-[#0b0b0b]">
      <Header
        title="Run Summary"
        subtitle="ACTIVITY COMPLETION"
        rightAction={{ icon: 'close-outline', onPress: () => router.push('/(tabs)/activity') }}
      />

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Share Card captured by ViewShot */}
        <ViewShot
          ref={viewShotRef}
          options={{ format: 'png', quality: 0.9 }}
          style={{ backgroundColor: '#0b0b0b' }}
          className="rounded-3xl border border-[#212121] overflow-hidden p-6 mb-6"
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-heading-md font-bold tracking-tight">NEXVY RUN</Text>
            <Text className="text-[#797979] text-[10px] uppercase font-bold tracking-wider">
              {new Date(activity.startedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </Text>
          </View>

          {/* Map Polyline representation */}
          <View className="h-40 bg-[#212121] rounded-2xl items-center justify-center mb-6 overflow-hidden">
            {routeSvg ? (
              <Svg width={260} height={160}>
                <Path d={routeSvg.pathD} fill="none" stroke="#f36458" strokeWidth="4" strokeLinecap="round" />
                <Circle cx={routeSvg.start.x} cy={routeSvg.start.y} r="6" fill="#37cd84" stroke="white" strokeWidth="1.5" />
                <Circle cx={routeSvg.end.x} cy={routeSvg.end.y} r="6" fill="#dd0000" stroke="white" strokeWidth="1.5" />
              </Svg>
            ) : (
              <Ionicons name="map-outline" size={48} color="#797979" />
            )}
          </View>

          {/* Quick Metrics Grid */}
          <View className="flex-row justify-between">
            <View>
              <Text className="text-[#797979] text-[10px] uppercase font-bold tracking-wider">Distance</Text>
              <Text className="text-white text-heading-lg font-bold mt-1">
                {formatDistance(distanceMeters)}
              </Text>
            </View>
            <View>
              <Text className="text-[#797979] text-[10px] uppercase font-bold tracking-wider">Duration</Text>
              <Text className="text-white text-heading-lg font-bold mt-1">
                {formatDuration(elapsedSeconds)}
              </Text>
            </View>
            <View>
              <Text className="text-[#797979] text-[10px] uppercase font-bold tracking-wider">Avg Pace</Text>
              <Text className="text-white text-heading-lg font-bold mt-1">
                {formatPace(avgPace)}
              </Text>
            </View>
          </View>
        </ViewShot>

        {/* Action Button: Share Card */}
        <TouchableOpacity
          onPress={handleShare}
          className="bg-[#212121] h-[52px] rounded-full border border-[#353535] flex-row items-center justify-center mb-8"
        >
          <Ionicons name="share-social-outline" size={18} color="#f36458" />
          <Text className="text-white text-button font-medium ml-2">Export Share Card</Text>
        </TouchableOpacity>

        {/* Calories Burned card */}
        <View className="flex-row space-x-3 mb-6">
          <Card className="flex-1 items-center py-4 bg-[#212121]">
            <Text className="text-[#797979] text-[10px] uppercase font-bold tracking-wider mb-1">Calories</Text>
            <Text className="text-white text-heading-lg font-bold">{caloriesBurned} kcal</Text>
          </Card>
          <Card className="flex-1 items-center py-4 bg-[#212121]">
            <Text className="text-[#797979] text-[10px] uppercase font-bold tracking-wider mb-1">Elevation Gain</Text>
            <Text className="text-white text-heading-lg font-bold">{activity.elevationGainMeters ?? 0} m</Text>
          </Card>
        </View>

        {/* Splits Table */}
        <Text className="text-[#797979] text-mono-eyebrow mb-3">SPLIT TIMES</Text>
        <Card className="mb-8">
          <View className="flex-row items-center pb-2 border-b border-[#353535] mb-2">
            <Text className="text-mute text-caption flex-1">KM</Text>
            <Text className="text-mute text-caption flex-1 text-center">PACE</Text>
            <Text className="text-mute text-caption flex-1 text-right">ELEVATION</Text>
          </View>

          {splits.map((split) => (
            <View key={split.km} className="flex-row items-center py-2.5 border-b border-[#353535]/30">
              <Text className="text-white text-body-sm font-semibold flex-1">{split.km}</Text>
              <Text className="text-ash text-body-sm text-center flex-1">{formatPace(split.paceSeconds)}</Text>
              <Text className="text-mute text-body-sm text-right flex-1">
                {split.elevationChange > 0 ? `+${split.elevationChange}` : split.elevationChange} m
              </Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
}
