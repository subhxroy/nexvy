import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SettingsRowProps {
  label: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  rightContent?: React.ReactNode;
  showChevron?: boolean;
}

export function SettingsRow({
  label,
  subtitle,
  icon,
  onPress,
  rightContent,
  showChevron = true,
}: SettingsRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center py-3.5 border-b border-[#353535]"
      activeOpacity={0.7}
    >
      <View className="w-8 h-8 rounded-full bg-[#212121] items-center justify-center mr-3">
        <Ionicons name={icon} size={16} color="#b9b9b9" />
      </View>
      <View className="flex-1">
        <Text className="text-white text-body-sm">{label}</Text>
        {subtitle && <Text className="text-mute text-caption">{subtitle}</Text>}
      </View>
      {rightContent ?? (showChevron && <Ionicons name="chevron-forward" size={16} color="#797979" />)}
    </TouchableOpacity>
  );
}
