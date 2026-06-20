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
      bg: 'bg-[#212121]',
      text: 'text-ash',
    },
    filled: {
      bg: 'bg-[#353535]',
      text: 'text-white',
    },
    brand: {
      bg: 'bg-[#f36458]',
      text: 'text-[#0b0b0b]',
    },
    success: {
      bg: 'bg-[#37cd84]',
      text: 'text-[#0b0b0b]',
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
