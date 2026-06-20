import { View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '../../../src/components/navigation/Header';

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#0b0b0b]">
      <Header
        title="Workout Detail"
        showBack
        onBackPress={() => router.back()}
      />
      <View className="flex-1 items-center justify-center">
        <Text className="text-mute text-body-sm">Workout ID: {id}</Text>
      </View>
    </View>
  );
}
