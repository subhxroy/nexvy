import { View, Text, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '../../../src/components/navigation/Header';
import { EmptyState } from '../../../src/components/ui/EmptyState';

export default function WorkoutHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#0b0b0b]">
      <Header
        title="History"
        subtitle="WORKOUTS"
        showBack
        onBackPress={() => router.back()}
      />
      <EmptyState
        icon="📋"
        title="No workouts yet"
        subtitle="Complete your first workout to see history here"
        ctaTitle="Start Workout"
        onCtaPress={() => router.push('/(tabs)/workout')}
      />
    </View>
  );
}
