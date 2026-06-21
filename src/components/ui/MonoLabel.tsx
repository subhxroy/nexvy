import { Text } from 'react-native';

interface MonoLabelProps {
  text: string;
  className?: string;
}

export function MonoLabel({ text, className = '' }: MonoLabelProps) {
  return (
    <Text
      className={`font-mono text-mono-eyebrow text-text-secondary uppercase tracking-widest ${className}`}
    >
      {text}
    </Text>
  );
}
