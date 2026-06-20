import { useEffect } from 'react';
import { onAuthChange } from '../services/firebase/auth';
import { getDocument } from '../services/firebase/firestore';
import { useAuthStore } from '../stores/useAuthStore';
import { UserProfile } from '../types/user.types';

export function useAuth() {
  const { user, profile, isLoading, isOnboarded, setUser, setProfile, setOnboarded } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const userProfile = await getDocument<UserProfile>('users', firebaseUser.uid);
          if (userProfile) {
            setProfile(userProfile);
            setOnboarded(userProfile.isOnboarded ?? false);
          } else {
            setOnboarded(false);
          }
        } catch {
          setOnboarded(false);
        }
      }
    });

    return unsubscribe;
  }, []);

  return {
    user,
    profile,
    isLoading,
    isOnboarded,
    isAuthenticated: !!user,
  };
}
