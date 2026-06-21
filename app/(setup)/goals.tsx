import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../src/components/ui/Button';
import { MonoLabel } from '../../src/components/ui/MonoLabel';
import { Ionicons } from '@expo/vector-icons';
import { FitnessGoal } from '../../src/types/user.types';

const goals: { key: FitnessGoal; label: string; description: string; icon: string }[] = [
  { key: 'build_muscle', label: 'Build Muscle', description: 'Increase strength and size', icon: 'barbell' },
  { key: 'lose_fat', label: 'Lose Fat', description: 'Drop body fat percentage', icon: 'flame' },
  { key: 'recomposition', label: 'Recomposition', description: 'Build muscle while losing fat', icon: 'repeat' },
  { key: 'endurance', label: 'Endurance', description: 'Improve cardiovascular fitness', icon: 'heart' },
  { key: 'maintain', label: 'Maintain', description: 'Keep current physique', icon: 'checkmark-circle' },
];

import { useProfileStore } from '../../src/stores/useProfileStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GoalsSetupScreen() {
  const router = useRouter();
  const { onboardingTemp, setOnboardingTemp } = useProfileStore();
  
  const initialGoals = Array.isArray(onboardingTemp.fitnessGoal)
    ? onboardingTemp.fitnessGoal
    : onboardingTemp.fitnessGoal
      ? [onboardingTemp.fitnessGoal]
      : [];
  const [selected, setSelected] = useState<FitnessGoal[]>(initialGoals);

  const toggleSelection = (key: FitnessGoal) => {
    setSelected((prev) =>
      prev.includes(key)
        ? prev.filter((item) => item !== key)
        : [...prev, key]
    );
  };

  const handleContinue = () => {
    if (selected.length > 0) {
      setOnboardingTemp({ fitnessGoal: selected });
      router.push('/(setup)/activity-level');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0b0b0b]">
      <View className="flex-1 px-6 pt-4">
        <MonoLabel text="STEP 2 OF 3" className="mb-1" />
        <Text className="text-white text-display-md font-semibold mb-1">
          Your Fitness Goal
        </Text>
        <Text className="text-ash text-body-sm mb-4">
          What brings you to Nexvy?
        </Text>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="space-y-2">
            {goals.map((goal) => {
              const isSelected = selected.includes(goal.key);
              return (
                <TouchableOpacity
                  key={goal.key}
                  onPress={() => toggleSelection(goal.key)}
                  className={`flex-row items-center p-2.5 rounded-card ${
                    isSelected ? 'bg-[#f36458]/20 border border-[#f36458]' : 'bg-[#212121]'
                  }`}
                >
                  <View
                    className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
                      isSelected ? 'bg-[#f36458]' : 'bg-[#353535]'
                    }`}
                  >
                    <Ionicons
                      name={goal.icon as any}
                      size={16}
                      color={isSelected ? '#0b0b0b' : '#b9b9b9'}
                    />
                  </View>
                  <View className="flex-1">
                    <Text
                      className={`text-body font-medium ${
                        isSelected ? 'text-[#f36458]' : 'text-white'
                      }`}
                    >
                      {goal.label}
                    </Text>
                    <Text className="text-mute text-caption">{goal.description}</Text>
                  </View>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={20} color="#f36458" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View className="py-4">
          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={selected.length === 0}
            variant="primary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
