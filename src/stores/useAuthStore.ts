import { create } from 'zustand';
import { FirebaseUser } from '../types/firebase.types';
import { UserProfile } from '../types/user.types';
import { signOutUser } from '../services/firebase/auth';

interface AuthStore {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isOnboarded: boolean;
  setUser: (user: FirebaseUser | null) => void;
  setProfile: (profile: UserProfile) => void;
  setOnboarded: (value: boolean) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  profile: null,
  isLoading: true,
  isOnboarded: false,

  setUser: (user) => set({ user, isLoading: false }),

  setProfile: (profile) =>
    set({
      profile,
      isOnboarded: profile.isOnboarded,
    }),

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
}));
