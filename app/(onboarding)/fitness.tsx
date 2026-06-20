import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { MonoLabel } from '../../src/components/ui/MonoLabel';
import { strings } from '../../src/constants/strings';

export default function FitnessOnboardingScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#0b0b0b] px-6 justify-center">
      <Animated.View entering={FadeInUp.duration(600).springify()} className="mb-8">
        <MonoLabel text="STRENGTH TRACKER" />
        <Text className="text-white text-display-md font-semibold mt-2">
          {strings.onboarding.slide1Title}
        </Text>
        <Text className="text-ash text-body mt-3 leading-6">
          {strings.onboarding.slide1Subtitle}
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(200).duration(600).springify()} className="mb-6">
        <Card>
          <Text className="text-white text-heading-lg">Bench Press</Text>
          <View className="flex-row justify-between mt-4">
            <View className="items-center">
              <Text className="text-white text-heading-md">3</Text>
              <MonoLabel text="SETS" />
            </View>
            <View className="items-center">
              <Text className="text-white text-heading-md">10</Text>
              <MonoLabel text="REPS" />
            </View>
            <View className="items-center">
              <Text className="text-white text-heading-md">80kg</Text>
              <MonoLabel text="WEIGHT" />
            </View>
          </View>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(400).duration(600).springify()}>
        <Card>
          <Text className="text-white text-heading-lg">Squat</Text>
          <View className="flex-row justify-between mt-4">
            <View className="items-center">
              <Text className="text-white text-heading-md">3</Text>
              <MonoLabel text="SETS" />
            </View>
            <View className="items-center">
              <Text className="text-white text-heading-md">8</Text>
              <MonoLabel text="REPS" />
            </View>
            <View className="items-center">
              <Text className="text-white text-heading-md">120kg</Text>
              <MonoLabel text="WEIGHT" />
            </View>
          </View>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(600).duration(600).springify()} className="mt-auto mb-12">
        <Button
          title="Continue"
          onPress={() => router.push('/(onboarding)/nutrition')}
          variant="primary"
        />
      </Animated.View>
    </View>
  );
}
