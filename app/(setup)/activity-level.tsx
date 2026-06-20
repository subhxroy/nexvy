import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/stores/useAuthStore';
import { Button } from '../../src/components/ui/Button';
import { Toggle } from '../../src/components/ui/Toggle';
import { MonoLabel } from '../../src/components/ui/MonoLabel';
import { ActivityLevel } from '../../src/types/user.types';

import { useProfileStore } from '../../src/stores/useProfileStore';

const levels: { key: ActivityLevel; label: string; description: string }[] = [
  { key: 'sedentary', label: 'Sedentary', description: 'Little or no exercise' },
  { key: 'light', label: 'Lightly Active', description: '1-3 days per week' },
  { key: 'moderate', label: 'Moderately Active', description: '3-5 days per week' },
  { key: 'very_active', label: 'Very Active', description: '6-7 days per week' },
];

export default function ActivityLevelScreen() {
  const router = useRouter();
  const { user, setOnboarded, setProfile } = useAuthStore();
  const { onboardingTemp, setProfile: setProfileStore } = useProfileStore();
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const { createDocument } = await import('../../src/services/firebase/firestore');
      const { calculateAllMacros } = await import('../../src/utils/macroCalc');
      const { Timestamp } = await import('firebase/firestore');

      const { age, weightKg, heightCm, biologicalSex, fitnessGoal } = onboardingTemp;

      const { calorieTarget, macros } = calculateAllMacros(
        weightKg,
        heightCm,
        age,
        biologicalSex,
        activityLevel,
        fitnessGoal
      );

      const profileData = {
        uid: user.uid,
        email: user.email ?? '',
        displayName: user.displayName ?? '',
        username: user.email?.split('@')[0] ?? '',
        bio: '',
        photoURL: user.photoURL ?? '',
        dateOfBirth: Timestamp.fromDate(new Date(Date.now() - age * 365.25 * 24 * 60 * 60 * 1000)),
        biologicalSex,
        heightCm,
        currentWeightKg: weightKg,
        goalWeightKg: weightKg,
        fitnessGoal,
        activityLevel,
        dailyCalorieTarget: calorieTarget,
        macroTargets: macros,
        notificationsEnabled,
        healthKitEnabled: false,
        weightUnit: 'kg' as const,
        isOnboarded: true,
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
      };

      await createDocument('users', profileData, user.uid);
      setProfile(profileData);
      setProfileStore(profileData);
    } catch (error) {
      console.error('Failed to create profile:', error);
    } finally {
      setIsLoading(false);
      setOnboarded(true);
      router.replace('/(tabs)/home');
    }
  };

  return (
    <View className="flex-1 bg-[#0b0b0b] px-6 pt-16">
      <MonoLabel text="STEP 3 OF 3" className="mb-2" />
      <Text className="text-white text-display-md font-semibold mb-2">
        Activity Level
      </Text>
      <Text className="text-ash text-body-sm mb-8">
        How active are you?
      </Text>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="space-y-3 mb-8">
          {levels.map((level) => {
            const isSelected = activityLevel === level.key;
            return (
              <TouchableOpacity
                key={level.key}
                onPress={() => setActivityLevel(level.key)}
                className={`flex-row items-center p-4 rounded-card ${
                  isSelected ? 'bg-[#f36458]/20 border border-[#f36458]' : 'bg-[#212121]'
                }`}
              >
                <View
                  className={`w-6 h-6 rounded-full items-center justify-center mr-4 border-2 ${
                    isSelected ? 'border-[#f36458] bg-[#f36458]' : 'border-[#797979]'
                  }`}
                >
                  {isSelected && <View className="w-3 h-3 rounded-full bg-[#0b0b0b]" />}
                </View>
                <View className="flex-1">
                  <Text
                    className={`text-body font-medium ${
                      isSelected ? 'text-[#f36458]' : 'text-white'
                    }`}
                  >
                    {level.label}
                  </Text>
                  <Text className="text-mute text-caption">{level.description}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View className="flex-row items-center justify-between bg-[#212121] rounded-card p-4">
          <View className="flex-1">
            <Text className="text-white text-body-sm font-medium">Enable Notifications</Text>
            <Text className="text-mute text-caption mt-1">
              Get reminders for workouts and meals
            </Text>
          </View>
          <Toggle value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
        </View>
      </ScrollView>

      <View className="py-6">
        <Button
          title="Complete Setup"
          onPress={handleComplete}
          loading={isLoading}
          variant="primary"
        />
      </View>
    </View>
  );
}
