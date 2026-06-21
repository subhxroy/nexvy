import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ErrorStateProps {
  onRetry: () => void;
  message?: string;
}

export function ErrorState({ onRetry, message = 'Something went wrong' }: ErrorStateProps) {
  return (
    <View className="flex-1 bg-[#0b0b0b] items-center justify-center py-12 px-6">
      <Text className="text-4xl mb-4">⚠️</Text>
      <Text style={{ fontSize: 16 }} className="text-white font-medium text-center mb-3">
        {message}
      </Text>
      <TouchableOpacity onPress={onRetry} activeOpacity={0.7} className="px-4 py-2">
        <Text className="text-[#f36458] text-body-sm font-semibold tracking-wide uppercase">
          Try Again
        </Text>
      </TouchableOpacity>
    </View>
  );
}
