import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { MonoLabel } from '../../src/components/ui/MonoLabel';
import { StatBlock } from '../../src/components/ui/StatBlock';

export default function ActivityOnboardingScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#0b0b0b] px-6 justify-center">
      <Animated.View entering={FadeInUp.duration(600).springify()} className="mb-8">
        <MonoLabel text="MOVEMENT" />
        <Text className="text-white text-display-md font-semibold mt-2">
          Movement & Activity
        </Text>
        <Text className="text-ash text-body mt-3 leading-6">
          Map your runs, monitor your steps, and own every mile.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(200).duration(600).springify()} className="mb-6">
        <Card>
          <View className="flex-row justify-between">
            <StatBlock value="5.2" label="KM" />
            <StatBlock value="4:30" label="/KM" />
            <StatBlock value="28:14" label="TIME" />
          </View>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(400).duration(600).springify()} className="mb-6">
        <Card className="flex-row items-center">
          <View className="flex-1">
            <Text className="text-white text-heading-md">8,432</Text>
            <Text className="text-ash text-body-sm mt-1">Steps Today</Text>
          </View>
          <View className="bg-[#37cd84] rounded-full w-10 h-10 items-center justify-center">
            <Text className="text-white text-button-sm">85%</Text>
          </View>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(600).duration(600).springify()} className="mt-auto mb-12">
        <Button
          title="Get Started"
          onPress={() => router.replace('/(auth)/sign-in')}
          variant="primary"
        />
      </Animated.View>
    </View>
  );
}
