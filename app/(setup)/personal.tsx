import { useState, useRef } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TextInput as RNTextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalDetailsSchema, PersonalDetailsForm } from '../../src/lib/zod/profile.schema';
import { TextInput } from '../../src/components/ui/TextInput';
import { Button } from '../../src/components/ui/Button';
import { MonoLabel } from '../../src/components/ui/MonoLabel';
import { TouchableOpacity } from 'react-native';
import { useProfileStore } from '../../src/stores/useProfileStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PersonalSetupScreen() {
  const router = useRouter();
  const { onboardingTemp, setOnboardingTemp } = useProfileStore();
  const [sex, setSex] = useState<'male' | 'female' | 'other'>(onboardingTemp.biologicalSex);

  const weightRef = useRef<RNTextInput>(null);
  const heightRef = useRef<RNTextInput>(null);

  const { control, handleSubmit, setValue, formState } = useForm<PersonalDetailsForm>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      age: onboardingTemp.age || undefined,
      weightKg: onboardingTemp.weightKg || undefined,
      heightCm: onboardingTemp.heightCm || undefined,
      biologicalSex: onboardingTemp.biologicalSex,
    },
    mode: 'all',
  });

  const onSubmit = (data: PersonalDetailsForm) => {
    setOnboardingTemp(data);
    router.push('/(setup)/goals');
  };

  const selectSex = (value: 'male' | 'female' | 'other') => {
    setSex(value);
    setValue('biologicalSex', value, { shouldValidate: true });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0b0b0b]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6 pt-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <MonoLabel text="STEP 1 OF 3" className="mb-1" />
          <Text className="text-white text-display-md font-semibold mb-4">
            Tell us about yourself
          </Text>

          <View className="space-y-3">
            <TextInput
              name="age"
              control={control}
              label="Age"
              placeholder="25"
              keyboardType="number-pad"
              returnKeyType="next"
              onSubmitEditing={() => weightRef.current?.focus()}
              blurOnSubmit={false}
            />
            <TextInput
              ref={weightRef}
              name="weightKg"
              control={control}
              label="Weight (kg)"
              placeholder="75"
              keyboardType="numeric"
              returnKeyType="next"
              onSubmitEditing={() => heightRef.current?.focus()}
              blurOnSubmit={false}
            />
            <TextInput
              ref={heightRef}
              name="heightCm"
              control={control}
              label="Height (cm)"
              placeholder="175"
              keyboardType="numeric"
              returnKeyType="done"
              onSubmitEditing={handleSubmit(onSubmit)}
            />

            <View>
              <Text className="text-ash text-body-sm mb-2">Biological Sex</Text>
              <View className="flex-row space-x-3">
                {(['male', 'female', 'other'] as const).map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => selectSex(option)}
                    className={`flex-1 h-11 rounded-xl items-center justify-center ${
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

          <View className="mt-6 mb-6">
            <Button
              title="Continue"
              onPress={handleSubmit(onSubmit)}
              disabled={!formState.isValid}
              variant="primary"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

