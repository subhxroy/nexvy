import { View, Text } from 'react-native';

interface AchievementBadgeProps {
  title: string;
  icon: string;
  isUnlocked: boolean;
  description?: string;
}

export function AchievementBadge({
  title,
  icon,
  isUnlocked,
  description,
}: AchievementBadgeProps) {
  return (
    <View
      className={`w-20 items-center py-3 rounded-card ${
        isUnlocked ? 'bg-[#212121]' : 'bg-[#212121]/50'
      }`}
    >
      <View
        className={`w-10 h-10 rounded-full items-center justify-center mb-1 ${
          isUnlocked ? 'bg-[#353535]' : 'bg-[#212121]'
        }`}
      >
        <Text className="text-xl">{icon}</Text>
      </View>
      <Text
        className={`text-caption-tight text-center ${
          isUnlocked ? 'text-white' : 'text-mute'
        }`}
      >
        {title}
      </Text>
      {description && (
        <Text className="text-mute text-meta text-center mt-0.5">{description}</Text>
      )}
    </View>
  );
}
