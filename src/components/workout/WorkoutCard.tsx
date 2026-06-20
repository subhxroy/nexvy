import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { MonoLabel } from '../ui/MonoLabel';
import { Badge } from '../ui/Badge';
import { formatDuration, formatKg } from '../../utils/formatters';

interface WorkoutCardProps {
  name: string;
  date: string;
  durationSeconds: number;
  totalVolumeKg: number;
  exerciseCount: number;
  onPress: () => void;
}

export function WorkoutCard({
  name,
  date,
  durationSeconds,
  totalVolumeKg,
  exerciseCount,
  onPress,
}: WorkoutCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card className="mb-3">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-white text-heading-md font-medium">{name}</Text>
          <Ionicons name="chevron-forward" size={18} color="#797979" />
        </View>
        <View className="flex-row items-center space-x-3">
          <Badge label={formatDuration(durationSeconds)} variant="neutral" />
          <MonoLabel text={formatKg(totalVolumeKg)} />
          <MonoLabel text={`${exerciseCount} EXERCISES`} />
        </View>
        <MonoLabel text={date} className="mt-2" />
      </Card>
    </TouchableOpacity>
  );
}
