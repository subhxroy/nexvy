import { Stack } from 'expo-router';

export default function ActivityLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="live-run" />
      <Stack.Screen name="summary" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
