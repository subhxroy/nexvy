import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordForm } from '../../src/lib/zod/auth.schema';
import { TextInput } from '../../src/components/ui/TextInput';
import { Button } from '../../src/components/ui/Button';
import { sendPasswordReset } from '../../src/services/firebase/auth';
import { strings } from '../../src/constants/strings';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    setError(null);
    try {
      await sendPasswordReset(data.email);
      setSent(true);
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
            RESET PASSWORD
          </Text>
          <Text className="text-white text-display-hero font-semibold">
            Forgot{'\n'}password?
          </Text>
        </View>

        {sent ? (
          <View>
            <View className="bg-[#37cd84]/10 rounded-lg p-4 mb-6">
              <Text className="text-success text-body-sm">
                Reset link sent! Check your email.
              </Text>
            </View>
            <Button
              title="Back to Sign In"
              onPress={() => router.push('/(auth)/sign-in')}
              variant="primary"
            />
          </View>
        ) : (
          <>
            {error && (
              <View className="bg-[#dd0000]/10 rounded-lg p-3 mb-4">
                <Text className="text-error text-body-sm">{error}</Text>
              </View>
            )}

            <Text className="text-ash text-body-sm mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </Text>

            <TextInput
              name="email"
              control={control}
              placeholder="Email Address"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View className="mt-6 space-y-3">
              <Button
                title="Send Reset Link"
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                variant="primary"
              />
              <Button
                title="Back to Sign In"
                onPress={() => router.push('/(auth)/sign-in')}
                variant="ghost"
              />
            </View>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
