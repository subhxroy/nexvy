import { View, Text } from 'react-native';
import { MonoLabel } from './MonoLabel';

interface StatBlockProps {
  value: string;
  label: string;
  className?: string;
}

export function StatBlock({ value, label, className = '' }: StatBlockProps) {
  return (
    <View className={`items-center ${className}`}>
      <Text className="text-white text-heading-md font-medium">{value}</Text>
      <MonoLabel text={label} className="mt-1" />
    </View>
  );
}
