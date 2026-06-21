import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../src/lib/queryClient';
import { useAuth } from '../src/hooks/useAuth';
import { View } from 'react-native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ErrorBoundary } from '../src/components/ui/ErrorBoundary';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toast } from '../src/components/ui/Toast';
import { useToastStore } from '../src/stores/useToastStore';
import '../src/tasks/backgroundLocationTask';
import '../src/global.css';

SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const { isAuthenticated, isOnboarded, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';
    const inSetupGroup = segments[0] === '(setup)';

    if (!isAuthenticated && !inAuthGroup && !inOnboardingGroup) {
      router.replace('/(onboarding)/welcome');
    } else if (isAuthenticated && !isOnboarded && !inSetupGroup) {
      router.replace('/(setup)/personal');
    } else if (isAuthenticated && isOnboarded && (inAuthGroup || inOnboardingGroup || inSetupGroup)) {
      router.replace('/(tabs)/home');
    }

    SplashScreen.hideAsync();
  }, [isAuthenticated, isOnboarded, isLoading]);

  return (
    <View className="flex-1 bg-canvas">
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(setup)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </View>
  );
}

function ToastRenderer() {
  const { visible, message, type, hideToast } = useToastStore();
  return <Toast visible={visible} message={message} type={type} onHide={hideToast} />;
}

export default function AppLayout() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <BottomSheetModalProvider>
              <RootLayout />
              <ToastRenderer />
            </BottomSheetModalProvider>
          </SafeAreaProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

