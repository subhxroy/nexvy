import { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../../src/stores/useAuthStore';
import { TextInput } from '../../../src/components/ui/TextInput';
import { Button } from '../../../src/components/ui/Button';
import { Avatar } from '../../../src/components/ui/Avatar';
import { updateDocument } from '../../../src/services/firebase/firestore';

export default function EditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, profile, setProfile } = useAuthStore();

  const [displayName, setDisplayName] = useState(profile?.displayName ?? '');
  const [username, setUsername] = useState(profile?.username ?? '');
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateDocument('users', { displayName, username, bio }, user.uid);
      if (profile) {
        setProfile({ ...profile, displayName, username, bio });
      }
      router.back();
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Save Failed', 'Could not update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [user, displayName, username, bio, profile, setProfile, router]);

  return (
    <View className="flex-1 bg-[#0b0b0b]">
      <View style={{ paddingTop: insets.top + 8 }} className="flex-row items-center justify-between px-4 pb-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-ash text-body-sm">Cancel</Text>
        </TouchableOpacity>
        <Text className="text-white text-heading-md font-medium">Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={isSaving}>
          <Text className={`text-[#f36458] text-body-sm font-medium ${isSaving ? 'opacity-50' : ''}`}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4">
        <View className="items-center mb-8">
          <TouchableOpacity className="relative">
            <Avatar name={displayName} photoURL={profile?.photoURL} size={96} />
            <View className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#f36458] items-center justify-center">
              <Ionicons name="camera" size={12} color="#0b0b0b" />
            </View>
          </TouchableOpacity>
        </View>

        <View className="space-y-4">
          <TextInput
            label="Display Name"
            placeholder="Your name"
            value={displayName}
            onChangeText={setDisplayName}
          />
          <TextInput
            label="Username"
            placeholder="username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            label="Bio"
            placeholder="Tell your story..."
            value={bio}
            onChangeText={setBio}
            multiline
          />
        </View>
      </ScrollView>
    </View>
  );
}
