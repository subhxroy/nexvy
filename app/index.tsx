import { View, ActivityIndicator } from 'react-native';

export default function IndexScreen() {
  return (
    <View className="flex-1 bg-canvas items-center justify-center">
      <ActivityIndicator size="large" color="#FF5722" />
    </View>
  );
}
