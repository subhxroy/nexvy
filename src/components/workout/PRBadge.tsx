import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PRBadgeProps {
  label?: string;
}

export function PRBadge({ label = 'PR' }: PRBadgeProps) {
  return (
    <View className="flex-row items-center bg-[#f36458]/20 rounded-full px-2 py-0.5">
      <Ionicons name="flame" size={10} color="#f36458" />
      <Text className="text-[#f36458] text-mono-eyebrow ml-1 uppercase">{label}</Text>
    </View>
  );
}
