import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TabConfig {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
}

const TABS: TabConfig[] = [
  { key: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { key: 'workout', label: 'Workout', icon: 'barbell-outline', activeIcon: 'barbell' },
  { key: 'nutrition', label: 'Nutrition', icon: 'nutrition-outline', activeIcon: 'nutrition' },
  { key: 'activity', label: 'Activity', icon: 'fitness-outline', activeIcon: 'fitness' },
  { key: 'profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
];

interface TabBarProps {
  activeTab: string;
  onTabPress: (tabKey: string) => void;
}

export function TabBar({ activeTab, onTabPress }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-canvas border-t border-border/80"
      style={{ paddingBottom: insets.bottom }}
    >
      <View className="flex-row items-center justify-around h-14">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => onTabPress(tab.key)}
              activeOpacity={0.7}
              className="items-center justify-center flex-1 h-full"
            >
              <Ionicons
                name={isActive ? tab.activeIcon : tab.icon}
                size={22}
                color={isActive ? '#FF5722' : '#525252'}
              />
              <Text
                className={`text-meta mt-0.5 ${
                  isActive ? 'text-brand' : 'text-mute'
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
