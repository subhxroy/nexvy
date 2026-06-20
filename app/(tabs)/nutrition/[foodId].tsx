import { View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Header } from '../../../src/components/navigation/Header';

export default function FoodDetailScreen() {
  const { foodId } = useLocalSearchParams<{ foodId: string }>();
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#0b0b0b]">
      <Header title="Food Detail" showBack onBackPress={() => router.back()} />
      <View className="flex-1 items-center justify-center">
        <Text className="text-mute text-body-sm">Food ID: {foodId}</Text>
      </View>
    </View>
  );
}
