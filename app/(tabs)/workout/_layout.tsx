import { Stack } from 'expo-router';

export default function WorkoutLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="active" />
      <Stack.Screen name="exercise-picker" />
      <Stack.Screen name="history" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
