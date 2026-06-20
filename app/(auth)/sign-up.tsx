import { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, SignUpForm } from '../../src/lib/zod/auth.schema';
import { TextInput } from '../../src/components/ui/TextInput';
import { Button } from '../../src/components/ui/Button';
import { signUp } from '../../src/services/firebase/auth';
import { strings } from '../../src/constants/strings';

export default function SignUpScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: SignUpForm) => {
    setIsLoading(true);
    setError(null);
    try {
      await signUp(data.email, data.password);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : strings.errors.authFailed;
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#0b0b0b]"
    >
      <View className="flex-1 justify-center px-8">
        <View className="mb-8">
          <Text className="text-mute text-mono-eyebrow uppercase tracking-widest mb-2">
            GET STARTED
          </Text>
          <Text className="text-white text-display-hero font-semibold">
            Create your{'\n'}account.
          </Text>
        </View>

        {error && (
          <View className="bg-[#dd0000]/10 rounded-lg p-3 mb-4">
            <Text className="text-error text-body-sm">{error}</Text>
          </View>
        )}

        <View className="space-y-4">
          <TextInput
            name="email"
            control={control}
            placeholder="Email Address"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            name="password"
            control={control}
            placeholder="Password"
            secureTextEntry
          />
          <TextInput
            name="confirmPassword"
            control={control}
            placeholder="Confirm Password"
            secureTextEntry
          />
        </View>

        <View className="mt-6">
          <Button
            title="Sign Up"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            variant="primary"
          />
        </View>

        <View className="flex-row justify-center mt-8">
          <Text className="text-ash text-body-sm">
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
            <Text className="text-white text-body-sm font-medium">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
