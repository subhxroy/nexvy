import { useState, useCallback } from 'react';
import { View } from 'react-native';
import { Stack, useRouter, usePathname } from 'expo-router';
import { TabBar } from '../../src/components/navigation/TabBar';
export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const getActiveTab = useCallback(() => {
    if (pathname.startsWith('/(tabs)/home')) return 'home';
    if (pathname.startsWith('/(tabs)/workout')) return 'workout';
    if (pathname.startsWith('/(tabs)/nutrition')) return 'nutrition';
    if (pathname.startsWith('/(tabs)/activity')) return 'activity';
    if (pathname.startsWith('/(tabs)/profile')) return 'profile';
    return 'home';
  }, [pathname]);

  const handleTabPress = useCallback(
    (tabKey: string) => {
      switch (tabKey) {
        case 'home':
          router.replace('/(tabs)/home');
          break;
        case 'workout':
          router.replace('/(tabs)/workout');
          break;
        case 'nutrition':
          router.replace('/(tabs)/nutrition');
          break;
        case 'activity':
          router.replace('/(tabs)/activity');
          break;
        case 'profile':
          router.replace('/(tabs)/profile');
          break;
      }
    },
    [router]
  );

  return (
    <View className="flex-1 bg-[#0b0b0b]">
      <Stack screenOptions={{ headerShown: false, animation: 'fade', animationDuration: 150 }}>
        <Stack.Screen name="home" />
        <Stack.Screen name="workout/index" />
        <Stack.Screen name="workout/active" />
        <Stack.Screen name="workout/exercise-picker" />
        <Stack.Screen name="workout/history" />
        <Stack.Screen name="workout/[id]" />
        <Stack.Screen name="nutrition/index" />
        <Stack.Screen name="nutrition/log" />
        <Stack.Screen name="nutrition/scan" />
        <Stack.Screen name="nutrition/snap" />
        <Stack.Screen name="nutrition/[foodId]" />
        <Stack.Screen name="activity/index" />
        <Stack.Screen name="activity/live-run" />
        <Stack.Screen name="activity/[id]" />
        <Stack.Screen name="profile/index" />
        <Stack.Screen name="profile/edit" />
        <Stack.Screen name="profile/settings" />
        <Stack.Screen name="profile/progress" />
      </Stack>
      <TabBar activeTab={getActiveTab()} onTabPress={handleTabPress} />
    </View>
  );
}
