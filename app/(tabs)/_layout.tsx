import { View } from 'react-native';
import { Tabs, useSegments } from 'expo-router';
import { TabBar } from '../../src/components/navigation/TabBar';

export default function TabsLayout() {
  const segments = useSegments();

  return (
    <View className="flex-1 bg-canvas">
      <Tabs
        tabBar={(props) => {
          const { state, navigation } = props;
          const activeRoute = state.routes[state.index];
          const activeTab = activeRoute?.name ?? 'home';

          // Traverse the nested navigation state to get the deepest active route name
          let currentScreen = activeTab;
          let route = activeRoute;
          while (route && route.state) {
            const index = route.state.index ?? 0;
            route = route.state.routes[index];
            currentScreen = route?.name ?? currentScreen;
          }

          // Also check active URL segments as fallback
          const lastSegment = segments[segments.length - 1];

          // Hide tab bar on specific fullscreen screens
          const hideTabs = ['active', 'live-run', 'scan', 'snap', 'summary'].includes(currentScreen) ||
                           ['active', 'live-run', 'scan', 'snap', 'summary'].includes(lastSegment);

          if (hideTabs) return null;

          return (
            <TabBar
              activeTab={activeTab}
              onTabPress={(tabKey) => {
                navigation.navigate(tabKey);
              }}
            />
          );
        }}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="workout" />
        <Tabs.Screen name="nutrition" />
        <Tabs.Screen name="activity" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </View>
  );
}

