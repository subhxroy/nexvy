import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { FirebaseUser } from '../types/firebase.types';
import { UserProfile } from '../types/user.types';
import { signOutUser } from '../services/firebase/auth';
import { zustandStorage } from '../lib/mmkv';

interface AuthStore {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isOnboarded: boolean;
  setUser: (user: FirebaseUser | null) => void;
  setProfile: (profile: UserProfile) => void;
  setOnboarded: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      isLoading: true,
      isOnboarded: false,

      setUser: (user) => set({ user, isLoading: false }),

      setProfile: (profile) =>
        set({
          profile,
          isOnboarded: profile.isOnboarded ?? false,
        }),

      setIsLoading: (isLoading) => set({ isLoading }),

      setOnboarded: (value) =>
        set({ isOnboarded: value }),

      signOut: async () => {
        try {
          await signOutUser();
          set({ user: null, profile: null, isOnboarded: false });
        } catch (error) {
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        user: state.user
          ? ({
              uid: state.user.uid,
              email: state.user.email,
              displayName: state.user.displayName,
            } as FirebaseUser)
          : null,
        profile: state.profile,
        isOnboarded: state.isOnboarded,
      }),
    }
  )
);

