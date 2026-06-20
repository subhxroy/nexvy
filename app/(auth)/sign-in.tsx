import { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, SignInForm } from '../../src/lib/zod/auth.schema';
import { TextInput } from '../../src/components/ui/TextInput';
import { Button } from '../../src/components/ui/Button';
import { signIn } from '../../src/services/firebase/auth';
import { strings } from '../../src/constants/strings';

export default function SignInScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: SignInForm) => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn(data.email, data.password);
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
            WELCOME BACK
          </Text>
          <Text className="text-white text-display-hero font-semibold">
            Sign in to{'\n'}Nexvy.
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
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(auth)/forgot-password')}
          className="self-end mt-2 mb-6"
        >
          <Text className="text-[#f36458] text-caption">Forgot Password?</Text>
        </TouchableOpacity>

        <Button
          title="Sign In"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          variant="primary"
        />

        <View className="flex-row justify-center mt-8">
          <Text className="text-ash text-body-sm">
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
            <Text className="text-white text-body-sm font-medium">Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
