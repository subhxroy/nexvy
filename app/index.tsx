import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export default function IndexScreen() {
  return (
    <View className="flex-1 bg-[#0b0b0b] items-center justify-center">
      <ActivityIndicator size="large" color="#f36458" />
    </View>
  );
}
