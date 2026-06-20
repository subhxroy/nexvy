import { View, Text } from 'react-native';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  ctaTitle?: string;
  onCtaPress?: () => void;
  className?: string;
}

export function EmptyState({
  icon = '💪',
  title,
  subtitle,
  ctaTitle,
  onCtaPress,
  className = '',
}: EmptyStateProps) {
  return (
    <View className={`flex-1 items-center justify-center px-8 ${className}`}>
      <Text className="text-5xl mb-4">{icon}</Text>
      <Text className="text-white text-heading-md text-center mb-2">{title}</Text>
      {subtitle && (
        <Text className="text-ash text-body-sm text-center mb-6">{subtitle}</Text>
      )}
      {ctaTitle && onCtaPress && (
        <Button title={ctaTitle} onPress={onCtaPress} variant="primary" />
      )}
    </View>
  );
}
