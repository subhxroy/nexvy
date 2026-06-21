import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';

interface SkeletonShapeProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  className?: string;
  style?: any;
}

export function SkeletonShape({
  width = '100%',
  height = 20,
  borderRadius = 8,
  className = '',
  style,
}: SkeletonShapeProps) {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      shimmer.value,
      [0, 0.5, 1],
      ['#212121', '#353535', '#212121']
    );
    return { backgroundColor };
  });

  return (
    <Animated.View
      style={[
        { width, height, borderRadius },
        style,
        animatedStyle,
      ]}
      className={className}
    />
  );
}

export function SkeletonHomeCard() {
  return (
    <View className="bg-[#212121] rounded-card p-5 mb-4 border border-[#353535]">
      <View className="flex-row items-center justify-between mb-4">
        <SkeletonShape width={120} height={14} />
        <SkeletonShape width={80} height={14} />
      </View>
      <View className="flex-row justify-between">
        <View className="items-center flex-1 space-y-2">
          <SkeletonShape width={60} height={28} />
          <SkeletonShape width={40} height={12} />
        </View>
        <View className="items-center flex-1 space-y-2">
          <SkeletonShape width={60} height={28} />
          <SkeletonShape width={40} height={12} />
        </View>
        <View className="items-center flex-1 space-y-2">
          <SkeletonShape width={60} height={28} />
          <SkeletonShape width={40} height={12} />
        </View>
      </View>
    </View>
  );
}

export function SkeletonWorkoutRow() {
  return (
    <View className="flex-row items-center justify-between py-3 border-b border-[#353535]/50">
      <View className="flex-row items-center flex-1">
        <SkeletonShape width={32} height={32} borderRadius={16} className="mr-3" />
        <View className="flex-1 space-y-1.5">
          <SkeletonShape width="60%" height={16} />
          <SkeletonShape width="40%" height={12} />
        </View>
      </View>
      <SkeletonShape width={24} height={24} borderRadius={12} />
    </View>
  );
}

export function SkeletonFoodRow() {
  return (
    <View className="flex-row items-center justify-between py-3 border-b border-[#353535]">
      <View className="flex-1 space-y-1.5">
        <SkeletonShape width="50%" height={16} />
        <SkeletonShape width="30%" height={12} />
      </View>
      <SkeletonShape width={48} height={18} borderRadius={9} />
    </View>
  );
}

export function SkeletonActivityCard() {
  return (
    <View className="bg-[#212121] rounded-card p-4 mb-4 border border-[#353535]">
      <View className="flex-row items-center mb-3">
        <SkeletonShape width={40} height={40} borderRadius={20} className="mr-3" />
        <View className="space-y-1.5 flex-1">
          <SkeletonShape width="40%" height={14} />
          <SkeletonShape width="20%" height={10} />
        </View>
      </View>
      <SkeletonShape width="100%" height={100} borderRadius={12} className="mb-3" />
      <View className="flex-row justify-between">
        <SkeletonShape width={80} height={14} />
        <SkeletonShape width={60} height={14} />
      </View>
    </View>
  );
}

export function SkeletonStatBlock() {
  return (
    <View className="items-center space-y-2">
      <SkeletonShape width={70} height={24} />
      <SkeletonShape width={50} height={12} />
    </View>
  );
}

export function SkeletonMacroRing() {
  return (
    <View className="flex-row justify-around py-4">
      <View className="items-center space-y-2">
        <SkeletonShape width={72} height={72} borderRadius={36} />
        <SkeletonShape width={40} height={12} />
      </View>
      <View className="items-center space-y-2">
        <SkeletonShape width={72} height={72} borderRadius={36} />
        <SkeletonShape width={40} height={12} />
      </View>
      <View className="items-center space-y-2">
        <SkeletonShape width={72} height={72} borderRadius={36} />
        <SkeletonShape width={40} height={12} />
      </View>
    </View>
  );
}
