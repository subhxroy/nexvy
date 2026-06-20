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

export default function GoalsSetupScreen() {
  const router = useRouter();
  const { setOnboardingTemp } = useProfileStore();
  const [selected, setSelected] = useState<FitnessGoal | null>(null);

  const handleContinue = () => {
    if (selected) {
      setOnboardingTemp({ fitnessGoal: selected });
      router.push('/(setup)/activity-level');
    }
  };

  return (
    <View className="flex-1 bg-[#0b0b0b] px-6 pt-16">
      <MonoLabel text="STEP 2 OF 3" className="mb-2" />
      <Text className="text-white text-display-md font-semibold mb-2">
        Your Fitness Goal
      </Text>
      <Text className="text-ash text-body-sm mb-8">
        What brings you to Nexvy?
      </Text>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="space-y-3">
          {goals.map((goal) => {
            const isSelected = selected === goal.key;
            return (
              <TouchableOpacity
                key={goal.key}
                onPress={() => setSelected(goal.key)}
                className={`flex-row items-center p-4 rounded-card ${
                  isSelected ? 'bg-[#f36458]/20 border border-[#f36458]' : 'bg-[#212121]'
                }`}
              >
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
                    isSelected ? 'bg-[#f36458]' : 'bg-[#353535]'
                  }`}
                >
                  <Ionicons
                    name={goal.icon as any}
                    size={20}
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
                  <Ionicons name="checkmark-circle" size={22} color="#f36458" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View className="py-6">
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!selected}
          variant="primary"
        />
      </View>
    </View>
  );
}
