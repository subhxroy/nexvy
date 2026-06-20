import { ReactNode } from 'react';
import { View } from 'react-native';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <View
      className={`
        bg-[#212121] rounded-card p-4
        ${className}
      `}
    >
      {children}
    </View>
  );
}
