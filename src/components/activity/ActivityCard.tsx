import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { MonoLabel } from '../ui/MonoLabel';
import { formatDistance, formatDuration, formatPace } from '../../utils/formatters';
import { ActivityType } from '../../types/activity.types';

const activityIcons: Record<ActivityType, keyof typeof Ionicons.glyphMap> = {
  run: 'walk-outline',
  walk: 'walk-outline',
  cycle: 'bicycle-outline',
  hike: 'trail-sign-outline',
  other: 'fitness-outline',
};

interface ActivityCardProps {
  type: ActivityType;
  name: string;
  distanceMeters: number;
  durationSeconds: number;
  averagePaceSecondsPerKm: number;
  date: string;
  onPress: () => void;
}

export function ActivityCard({
  type,
  name,
  distanceMeters,
  durationSeconds,
  averagePaceSecondsPerKm,
  date,
  onPress,
}: ActivityCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card className="mb-3">
        <View className="flex-row items-center mb-3">
          <View className="w-8 h-8 rounded-full bg-[#353535] items-center justify-center mr-3">
            <Ionicons name={activityIcons[type]} size={16} color="#b9b9b9" />
          </View>
          <View className="flex-1">
            <Text className="text-white text-body-sm font-medium">{name}</Text>
            <Text className="text-mute text-caption">{date}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#797979" />
        </View>
        <View className="flex-row justify-between">
          <View className="items-center flex-1">
            <Text className="text-white text-body-sm font-medium">
              {formatDistance(distanceMeters)}
            </Text>
            <MonoLabel text="DISTANCE" />
          </View>
          <View className="items-center flex-1">
            <Text className="text-white text-body-sm font-medium">
              {formatDuration(durationSeconds)}
            </Text>
            <MonoLabel text="TIME" />
          </View>
          <View className="items-center flex-1">
            <Text className="text-white text-body-sm font-medium">
              {formatPace(averagePaceSecondsPerKm)}
            </Text>
            <MonoLabel text="PACE" />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
