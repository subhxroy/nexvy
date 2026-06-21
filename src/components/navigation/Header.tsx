import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightAction?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  };
}

export function Header({
  title,
  subtitle,
  showBack = false,
  onBackPress,
  rightAction,
}: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-canvas px-4"
      style={{ paddingTop: insets.top + 8, paddingBottom: 8 }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          {showBack && (
            <TouchableOpacity onPress={onBackPress} className="mr-3">
              <Ionicons name="chevron-back" size={24} color="#808080" />
            </TouchableOpacity>
          )}
          <View>
            {subtitle && (
              <Text className="text-mute text-mono-eyebrow uppercase tracking-widest">
                {subtitle}
              </Text>
            )}
            <Text className="text-text-primary text-heading-lg font-medium">{title}</Text>
          </View>
        </View>
        {rightAction && (
          <TouchableOpacity onPress={rightAction.onPress} className="p-2">
            <Ionicons name={rightAction.icon} size={22} color="#808080" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
