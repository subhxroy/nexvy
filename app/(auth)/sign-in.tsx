import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput as RNTextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, SignInForm } from '../../src/lib/zod/auth.schema';
import { TextInput } from '../../src/components/ui/TextInput';
import { Button } from '../../src/components/ui/Button';
import { signIn, signInWithGoogleWeb } from '../../src/services/firebase/auth';
import { strings } from '../../src/constants/strings';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function SignInScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordRef = useRef<RNTextInput>(null);

  const { control, handleSubmit } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
    mode: 'all',
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
              WELCOME BACK
            </Text>
            <Text className="text-text-primary text-display-hero font-semibold">
              Sign in to{'\n'}Nexvy.
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
            <TextInput
              ref={passwordRef}
              name="password"
              control={control}
              placeholder="Password"
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleSubmit(onSubmit)}
            />
          </View>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/forgot-password')}
            className="self-end mt-2 mb-6"
          >
            <Text className="text-brand text-caption">Forgot Password?</Text>
          </TouchableOpacity>

          <Button
            title="Sign In"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            variant="primary"
          />

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
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
              <Text className="text-text-primary text-body-sm font-medium">Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
