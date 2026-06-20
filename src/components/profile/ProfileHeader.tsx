import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../ui/Avatar';

interface ProfileHeaderProps {
  displayName: string;
  username?: string;
  bio?: string;
  photoURL?: string | null;
  streakDays: number;
  totalWorkouts: number;
  onEditPress: () => void;
}

export function ProfileHeader({
  displayName,
  username,
  bio,
  photoURL,
  streakDays,
  totalWorkouts,
  onEditPress,
}: ProfileHeaderProps) {
  return (
    <View className="items-center py-6">
      <Avatar name={displayName} photoURL={photoURL} size={80} showRing />
      <TouchableOpacity
        onPress={onEditPress}
        className="absolute top-6 right-0 w-8 h-8 rounded-full bg-[#212121] items-center justify-center"
      >
        <Ionicons name="pencil" size={14} color="#b9b9b9" />
      </TouchableOpacity>

      <Text className="text-white text-heading-lg font-medium mt-4">{displayName}</Text>
      {username && (
        <Text className="text-mute text-caption">@{username}</Text>
      )}
      {bio && <Text className="text-ash text-body-sm mt-2 text-center px-8">{bio}</Text>}

      <View className="flex-row mt-6 space-x-8">
        <View className="items-center">
          <Text className="text-white text-heading-lg font-medium">{streakDays}</Text>
          <Text className="text-mute text-mono-eyebrow uppercase">STREAK</Text>
        </View>
        <View className="items-center">
          <Text className="text-white text-heading-lg font-medium">{totalWorkouts}</Text>
          <Text className="text-mute text-mono-eyebrow uppercase">WORKOUTS</Text>
        </View>
      </View>
    </View>
  );
}
