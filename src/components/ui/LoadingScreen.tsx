import { View, Text, ActivityIndicator } from 'react-native';
import { colors } from '../../constants/tokens';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <View className="flex-1 bg-[#0b0b0b] items-center justify-center">
      <Text className="text-white text-display-lg font-medium mb-8">Nexvy</Text>
      <ActivityIndicator size="large" color={colors.brand} />
      <Text className="text-ash text-body-sm mt-4">{message}</Text>
    </View>
  );
}
