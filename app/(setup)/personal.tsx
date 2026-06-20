import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalDetailsSchema, PersonalDetailsForm } from '../../src/lib/zod/profile.schema';
import { TextInput } from '../../src/components/ui/TextInput';
import { Button } from '../../src/components/ui/Button';
import { MonoLabel } from '../../src/components/ui/MonoLabel';
import { TouchableOpacity } from 'react-native';
import { useProfileStore } from '../../src/stores/useProfileStore';

export default function PersonalSetupScreen() {
  const router = useRouter();
  const { setOnboardingTemp } = useProfileStore();
  const [sex, setSex] = useState<'male' | 'female' | 'other'>('male');

  const { control, handleSubmit, setValue } = useForm<PersonalDetailsForm>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      age: 25,
      weightKg: 75,
      heightCm: 175,
      biologicalSex: 'male',
    },
  });

  const onSubmit = (data: PersonalDetailsForm) => {
    setOnboardingTemp(data);
    router.push('/(setup)/goals');
  };

  const selectSex = (value: 'male' | 'female' | 'other') => {
    setSex(value);
    setValue('biologicalSex', value);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#0b0b0b]"
    >
      <ScrollView className="flex-1 px-6 pt-16">
        <MonoLabel text="STEP 1 OF 3" className="mb-2" />
        <Text className="text-white text-display-md font-semibold mb-8">
          Tell us about{'\n'}yourself
        </Text>

        <View className="space-y-5">
          <TextInput
            name="age"
            control={control}
            label="Age"
            keyboardType="numeric"
          />
          <TextInput
            name="weightKg"
            control={control}
            label="Weight (kg)"
            keyboardType="numeric"
          />
          <TextInput
            name="heightCm"
            control={control}
            label="Height (cm)"
            keyboardType="numeric"
          />

          <View>
            <Text className="text-ash text-body-sm mb-3">Biological Sex</Text>
            <View className="flex-row space-x-3">
              {(['male', 'female', 'other'] as const).map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => selectSex(option)}
                  className={`flex-1 h-12 rounded-xl items-center justify-center ${
                    sex === option ? 'bg-[#f36458]' : 'bg-[#212121]'
                  }`}
                >
                  <Text
                    className={`text-body-sm font-medium ${
                      sex === option ? 'text-[#0b0b0b]' : 'text-ash'
                    }`}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View className="mt-12 mb-12">
          <Button
            title="Continue"
            onPress={handleSubmit(onSubmit)}
            variant="primary"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
