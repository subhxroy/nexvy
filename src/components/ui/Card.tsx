import { ReactNode } from 'react';
import { View } from 'react-native';

interface CardProps {
  children: ReactNode;
  className?: string;
  outerClassName?: string;
  noDoubleBezel?: boolean;
}

export function Card({ children, className = '', outerClassName = '', noDoubleBezel = false }: CardProps) {
  if (noDoubleBezel) {
    return (
      <View
        className={`
          bg-surface border border-border/60 rounded-card p-4
          ${className}
        `}
      >
        {children}
      </View>
    );
  }

  return (
    <View
      className={`
        bg-surface border border-border/60 p-1 rounded-card
        ${outerClassName}
      `}
    >
      <View
        className={`
          bg-canvas-soft rounded-[14px] p-4
          ${className}
        `}
      >
        {children}
      </View>
    </View>
  );
}
