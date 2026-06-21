import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput as RNTextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, SignUpForm } from '../../src/lib/zod/auth.schema';
import { TextInput } from '../../src/components/ui/TextInput';
import { Button } from '../../src/components/ui/Button';
import { signUp, signInWithGoogleWeb } from '../../src/services/firebase/auth';
import { strings } from '../../src/constants/strings';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

function getPasswordStrength(password: string): 'none' | 'weak' | 'medium' | 'strong' {
  if (!password) return 'none';
  if (password.length < 6) return 'weak';

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return 'weak';
  if (score === 2 || score === 3) return 'medium';
  return 'strong';
}

export default function SignUpScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordRef = useRef<RNTextInput>(null);
  const confirmPasswordRef = useRef<RNTextInput>(null);

  const { control, handleSubmit, watch } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
    mode: 'all',
  });

  const password = watch('password') || '';
  const strength = getPasswordStrength(password);

  const strengthConfig = {
    none: { count: 0, color: 'bg-graphite' },
    weak: { count: 1, color: 'bg-error' },
    medium: { count: 2, color: 'bg-brand' },
    strong: { count: 3, color: 'bg-success' },
  }[strength];

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

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogleWeb();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google Sign-In failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-8">
          <View className="mb-8">
            <Text className="text-mute text-mono-eyebrow uppercase tracking-widest mb-2">
              GET STARTED
            </Text>
            <Text className="text-text-primary text-display-hero font-semibold">
              Create your{'\n'}account.
            </Text>
          </View>

          {error && (
            <View className="bg-error/10 rounded-lg p-3 mb-4">
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
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              blurOnSubmit={false}
            />
            <View>
              <TextInput
                ref={passwordRef}
                name="password"
                control={control}
                placeholder="Password"
                secureTextEntry
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                blurOnSubmit={false}
              />
              {password.length > 0 && (
                <View className="flex-row gap-1.5 mt-2 h-1.5 px-1">
                  <View className={`flex-1 rounded-full ${strengthConfig.count >= 1 ? strengthConfig.color : 'bg-graphite'}`} />
                  <View className={`flex-1 rounded-full ${strengthConfig.count >= 2 ? strengthConfig.color : 'bg-graphite'}`} />
                  <View className={`flex-1 rounded-full ${strengthConfig.count >= 3 ? strengthConfig.color : 'bg-graphite'}`} />
                </View>
              )}
            </View>
            <TextInput
              ref={confirmPasswordRef}
              name="confirmPassword"
              control={control}
              placeholder="Confirm Password"
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleSubmit(onSubmit)}
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

          <View className="flex-row items-center my-6">
            <View className="flex-1 h-[1px] bg-graphite" />
            <Text className="text-mute text-caption mx-4 uppercase tracking-wider">or</Text>
            <View className="flex-1 h-[1px] bg-graphite" />
          </View>

          <TouchableOpacity
            onPress={handleGoogleSignIn}
            className="h-[52px] rounded-card bg-white flex-row items-center justify-center px-6 active:opacity-90"
          >
            <Ionicons name="logo-google" size={20} color="#111827" style={{ marginRight: 10 }} />
            <Text className="font-semibold text-[#111827] text-body-sm">
              Continue with Google
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-8">
            <Text className="text-text-secondary text-body-sm">
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
              <Text className="text-text-primary text-body-sm font-medium">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
