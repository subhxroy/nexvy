import { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../../src/stores/useAuthStore';
import { SettingsRow } from '../../../src/components/profile/SettingsRow';
import { Toggle } from '../../../src/components/ui/Toggle';
import { MonoLabel } from '../../../src/components/ui/MonoLabel';
import { Divider } from '../../../src/components/ui/Divider';
import { updateDocument } from '../../../src/services/firebase/firestore';
import { useProfileStore } from '../../../src/stores/useProfileStore';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuthStore();
  const { profile, updateNotifications, updateHealthKit, updateWeightUnit } = useProfileStore();

  const [notifications, setNotifications] = useState(profile?.notificationsEnabled ?? true);
  const [healthKit, setHealthKit] = useState(profile?.healthKitEnabled ?? false);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(profile?.weightUnit ?? 'kg');

  const handleToggleNotifications = useCallback(
    async (value: boolean) => {
      setNotifications(value);
      updateNotifications(value);
      if (user) {
        await updateDocument('users', { notificationsEnabled: value }, user.uid);
      }
    },
    [user, updateNotifications]
  );

  const handleToggleHealthKit = useCallback(
    async (value: boolean) => {
      setHealthKit(value);
      updateHealthKit(value);
      if (user) {
        await updateDocument('users', { healthKitEnabled: value }, user.uid);
      }
    },
    [user, updateHealthKit]
  );

  const handleToggleWeightUnit = useCallback(async () => {
    const newUnit = weightUnit === 'kg' ? 'lbs' : 'kg';
    setWeightUnit(newUnit);
    updateWeightUnit(newUnit);
    if (user) {
      await updateDocument('users', { weightUnit: newUnit }, user.uid);
    }
  }, [weightUnit, user, updateWeightUnit]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }, [signOut]);

  return (
    <View className="flex-1 bg-[#0b0b0b]">
      <View style={{ paddingTop: insets.top + 8 }} className="flex-row items-center px-4 pb-4">
        <Text className="text-white text-heading-md font-medium">Settings</Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <MonoLabel text="PREFERENCES" className="mb-3" />
        <View className="bg-[#212121] rounded-card p-4">
          <SettingsRow
            label="Notifications"
            subtitle="Workout and meal reminders"
            icon="notifications"
            rightContent={
              <Toggle value={notifications} onValueChange={handleToggleNotifications} />
            }
            showChevron={false}
          />
          <SettingsRow
            label="HealthKit Sync"
            subtitle="Sync workouts to Apple Health"
            icon="heart"
            rightContent={
              <Toggle value={healthKit} onValueChange={handleToggleHealthKit} />
            }
            showChevron={false}
          />
          <SettingsRow
            label="Weight Unit"
            subtitle={`Current: ${weightUnit}`}
            icon="scale"
            onPress={handleToggleWeightUnit}
          />
        </View>

        <MonoLabel text="APP" className="mt-6 mb-3" />
        <View className="bg-[#212121] rounded-card p-4">
          <SettingsRow label="About Nexvy" subtitle="Version 1.0.0" icon="information-circle" showChevron={false} />
        </View>

        <Divider className="my-6" />

        <TouchableOpacity
          onPress={handleSignOut}
          className="bg-[#212121] rounded-card p-4 items-center"
        >
          <Text className="text-[#dd0000] text-body font-medium">Sign Out</Text>
        </TouchableOpacity>

        <View className="h-12" />
      </ScrollView>
    </View>
  );
}
