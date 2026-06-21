import { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../../src/stores/useAuthStore';
import { useProgress } from '../../../src/hooks/useProgress';
import { ProfileHeader } from '../../../src/components/profile/ProfileHeader';
import { BentoStatGrid } from '../../../src/components/profile/BentoStatGrid';
import { SettingsRow } from '../../../src/components/profile/SettingsRow';
import { Divider } from '../../../src/components/ui/Divider';
import { strings } from '../../../src/constants/strings';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, signOut } = useAuthStore();
  const { workoutSummary, coachReport } = useProgress();

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }, [signOut]);

  return (
    <View className="flex-1 bg-[#0b0b0b]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <ProfileHeader
          displayName={profile?.displayName ?? 'Athlete'}
          username={profile?.username}
          bio={profile?.bio}
          photoURL={profile?.photoURL}
          streakDays={workoutSummary?.streakDays ?? 0}
          totalWorkouts={workoutSummary?.totalWorkouts ?? 0}
          onEditPress={() => router.push('/(tabs)/profile/edit')}
        />

        <BentoStatGrid
          totalVolumeKg={workoutSummary?.totalVolumeKg ?? 0}
          totalDurationSeconds={workoutSummary?.totalDurationSeconds ?? 0}
          totalDistanceKm={0}
          monthlyWorkouts={workoutSummary?.monthlyWorkouts ?? 0}
        />

        {coachReport && (
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/profile/progress')}
            activeOpacity={0.8}
            className="mx-4 mt-6 p-4 rounded-card bg-[#212121] border border-[#f36458]/20 flex-row items-center"
          >
            <View className="flex-1 mr-3">
              <View className="flex-row items-center mb-1">
                <Ionicons name="sparkles" size={14} color="#f36458" className="mr-1" />
                <Text className="text-[#f36458] text-mono-eyebrow">COACH REPORT</Text>
              </View>
              <Text className="text-white text-body-sm font-medium" numberOfLines={2}>
                {coachReport.summary}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#797979" />
          </TouchableOpacity>
        )}

        <View className="px-4 mt-6">
          <SettingsRow
            label="Progress & Analytics"
            subtitle="Track your trends"
            icon="stats-chart"
            onPress={() => router.push('/(tabs)/profile/progress')}
          />
          <SettingsRow
            label="Settings"
            subtitle="Preferences and account"
            icon="settings"
            onPress={() => router.push('/(tabs)/profile/settings')}
          />
          <SettingsRow
            label="Edit Profile"
            icon="person"
            onPress={() => router.push('/(tabs)/profile/edit')}
          />
        </View>

        <Divider className="my-6 mx-4" />

        <View className="px-4">
          <SettingsRow
            label="Sign Out"
            icon="log-out"
            onPress={handleSignOut}
            showChevron={false}
          />
        </View>

        <View className="h-12" />
      </ScrollView>
    </View>
  );
}
