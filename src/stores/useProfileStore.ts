import { create } from 'zustand';
import { UserProfile, BodyweightEntry, FitnessGoal, ActivityLevel, WeightUnit } from '../types/user.types';

interface ProfileStore {
  profile: UserProfile | null;
  bodyweightHistory: BodyweightEntry[];
  isLoading: boolean;
  onboardingTemp: {
    age: number;
    weightKg: number;
    heightCm: number;
    biologicalSex: 'male' | 'female' | 'other';
    fitnessGoal: FitnessGoal;
  };
  setOnboardingTemp: (updates: Partial<ProfileStore['onboardingTemp']>) => void;
  setProfile: (profile: UserProfile) => void;
  setBodyweightHistory: (history: BodyweightEntry[]) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateGoal: (goal: FitnessGoal) => void;
  updateActivityLevel: (level: ActivityLevel) => void;
  updateWeightUnit: (unit: WeightUnit) => void;
  updateNotifications: (enabled: boolean) => void;
  updateHealthKit: (enabled: boolean) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  bodyweightHistory: [],
  isLoading: false,
  onboardingTemp: {
    age: 25,
    weightKg: 75,
    heightCm: 175,
    biologicalSex: 'male',
    fitnessGoal: 'build_muscle',
  },

  setOnboardingTemp: (updates) =>
    set((state) => ({
      onboardingTemp: { ...state.onboardingTemp, ...updates },
    })),

  setProfile: (profile) => set({ profile }),

  setBodyweightHistory: (history) => set({ bodyweightHistory: history }),

  updateProfile: (updates) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates } : null,
    })),

  updateGoal: (goal) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, fitnessGoal: goal } : null,
    })),

  updateActivityLevel: (level) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, activityLevel: level } : null,
    })),

  updateWeightUnit: (unit) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, weightUnit: unit } : null,
    })),

  updateNotifications: (enabled) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, notificationsEnabled: enabled } : null,
    })),

  updateHealthKit: (enabled) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, healthKitEnabled: enabled } : null,
    })),

  setIsLoading: (loading) => set({ isLoading: loading }),
}));
