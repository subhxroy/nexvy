import { Stack } from 'expo-router';

export default function SetupLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="personal" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="activity-level" />
    </Stack>
  );
}
