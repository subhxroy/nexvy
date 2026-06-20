import { View } from 'react-native';

interface DividerProps {
  className?: string;
}

export function Divider({ className = '' }: DividerProps) {
  return <View className={`h-px bg-[#353535] ${className}`} />;
}
