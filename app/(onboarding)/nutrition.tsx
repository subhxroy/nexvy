import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { MonoLabel } from '../../src/components/ui/MonoLabel';
import { MacroRing } from '../../src/components/ui/MacroRing';
import { colors } from '../../src/constants/tokens';

export default function NutritionOnboardingScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#0b0b0b] px-6 justify-center">
      <Animated.View entering={FadeInUp.duration(600).springify()} className="mb-8">
        <MonoLabel text="AI NUTRITION" />
        <Text className="text-white text-display-md font-semibold mt-2">
          AI Nutrition Tracking
        </Text>
        <Text className="text-ash text-body mt-3 leading-6">
          Snap a photo or scan a barcode. Our AI logs your macros instantly.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(200).duration(600).springify()} className="mb-6">
        <Card>
          <View className="items-center mb-4">
            <Text className="text-white text-heading-lg mb-1">2,184</Text>
            <MonoLabel text="CALORIES REMAINING" />
          </View>
          <View className="flex-row justify-around">
            <MacroRing current={32} target={180} color={colors.brand} label="Protein" size={56} />
            <MacroRing current={45} target={250} color={colors.linkBlue} label="Carbs" size={56} />
            <MacroRing current={12} target={60} color={colors.success} label="Fat" size={56} />
          </View>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(400).duration(600).springify()} className="mb-6">
        <Card className="flex-row items-center">
          <View className="flex-1">
            <Text className="text-white text-heading-md">Snap a photo</Text>
            <Text className="text-ash text-body-sm mt-1">AI analyses your meal</Text>
          </View>
          <View className="bg-[#f36458] rounded-full w-12 h-12 items-center justify-center">
            <Text className="text-2xl">📸</Text>
          </View>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(600).duration(600).springify()} className="mt-auto mb-12">
        <Button
          title="Continue"
          onPress={() => router.push('/(onboarding)/activity')}
          variant="primary"
        />
      </Animated.View>
    </View>
  );
}
