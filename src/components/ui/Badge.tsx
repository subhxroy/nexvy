import { View, Text } from 'react-native';

type BadgeVariant = 'neutral' | 'filled' | 'brand' | 'success';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ label, variant = 'neutral', className = '' }: BadgeProps) {
  const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
    neutral: {
      bg: 'bg-surface',
      text: 'text-text-secondary',
    },
    filled: {
      bg: 'bg-graphite',
      text: 'text-text-primary',
    },
    brand: {
      bg: 'bg-brand',
      text: 'text-white',
    },
    success: {
      bg: 'bg-success',
      text: 'text-white',
    },
  };

  const style = variantStyles[variant];

  return (
    <View
      className={`
        h-6 px-2 rounded items-center justify-center
        ${style.bg} ${className}
      `}
    >
      <Text className={`font-mono text-mono-eyebrow uppercase ${style.text}`}>
        {label}
      </Text>
    </View>
  );
}
