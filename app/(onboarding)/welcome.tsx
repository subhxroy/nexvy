import { useCallback, useRef } from 'react';
import { View, Text, FlatList, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Button } from '../../src/components/ui/Button';

const { width, height } = Dimensions.get('window');

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
}

const slides: Slide[] = [
  {
    id: 'strength',
    title: 'Track Your Strength',
    subtitle: 'Log workouts, track sets, and beat your personal records with Hevy-style precision.',
    icon: '💪',
  },
  {
    id: 'nutrition',
    title: 'AI Nutrition Tracking',
    subtitle: 'Snap a photo or scan a barcode. Our AI logs your macros instantly.',
    icon: '🥗',
  },
  {
    id: 'movement',
    title: 'Movement & Activity',
    subtitle: 'Map your runs, monitor your steps, and own every mile.',
    icon: '🏃',
  },
  {
    id: 'nexvy',
    title: 'Welcome to Nexvy',
    subtitle: 'Your all-in-one fitness companion. Let\'s get started.',
    icon: '🔥',
  },
];

function OnboardingSlide({ slide, index, currentIndex }: { slide: Slide; index: number; currentIndex: Animated.SharedValue<number> }) {
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      currentIndex.value,
      [index - 1, index, index + 1],
      [0.8, 1, 0.8],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      currentIndex.value,
      [index - 1, index, index + 1],
      [0.3, 1, 0.3],
      Extrapolation.CLAMP
    );
    return { transform: [{ scale }], opacity };
  });

  return (
    <View style={{ width }} className="flex-1 items-center justify-center px-8">
      <Animated.View style={animatedStyle} className="items-center">
        <Text className="text-6xl mb-4">{slide.icon}</Text>
        <Text className="text-white text-display-md text-center font-semibold mb-2">
          {slide.title}
        </Text>
        <Text className="text-ash text-body text-center leading-6">
          {slide.subtitle}
        </Text>
      </Animated.View>
    </View>
  );
}

import { SafeAreaView } from 'react-native-safe-area-context';

function OnboardingDot({ index, currentIndex }: { index: number; currentIndex: Animated.SharedValue<number> }) {
  const dotStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      currentIndex.value,
      [index - 1, index, index + 1],
      [1, 1.5, 1],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      currentIndex.value,
      [index - 1, index, index + 1],
      [0.3, 1, 0.3],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View
      style={dotStyle}
      className="w-2 h-2 rounded-full bg-white mx-1"
    />
  );
}

export default function WelcomeScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const currentIndex = useSharedValue(0);
  const currentPage = useRef(0);
  const lastPageRef = useRef(0);

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = event.nativeEvent.contentOffset.x / width;
    currentIndex.value = page;
    const roundedPage = Math.round(page);
    currentPage.current = roundedPage;

    if (roundedPage !== lastPageRef.current && roundedPage >= 0 && roundedPage < slides.length) {
      lastPageRef.current = roundedPage;
      import('expo-haptics').then((Haptics) => {
        Haptics.selectionAsync();
      }).catch(() => {});
    }
  }, []);

  const goToFitness = useCallback(() => {
    router.replace('/(onboarding)/fitness');
  }, [router]);

  const goToSlide = useCallback((index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
  }, []);

  const DotIndicator = () => {
    return (
      <View className="flex-row justify-center mb-8 space-x-2">
        {slides.map((_, index) => (
          <OnboardingDot key={index} index={index} currentIndex={currentIndex} />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0b0b0b]">
      <View className="flex-1">
        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={({ item, index }) => (
            <OnboardingSlide slide={item} index={index} currentIndex={currentIndex} />
          )}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          bounces={false}
        />
      </View>

      <View className="px-8 pb-6">
        <DotIndicator />
        <Button
          title="Get Started"
          onPress={goToFitness}
          variant="primary"
        />
      </View>
    </SafeAreaView>
  );
}
