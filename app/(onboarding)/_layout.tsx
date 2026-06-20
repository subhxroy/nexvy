import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="fitness" />
      <Stack.Screen name="nutrition" />
      <Stack.Screen name="activity" />
    </Stack>
  );
}
