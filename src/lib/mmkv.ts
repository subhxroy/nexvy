import { Platform } from 'react-native';

interface SimpleStorage {
  set(key: string, value: string | number | boolean): void;
  getString(key: string): string | undefined;
  getNumber(key: string): number | undefined;
  getBoolean(key: string): boolean | undefined;
  delete(key: string): void;
  clearAll(): void;
}

let storage: SimpleStorage;

if (Platform.OS === 'web') {
  const mockStorage = new Map<string, string>();
  storage = {
    set: (key, value) => {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, String(value));
      } else {
        mockStorage.set(key, String(value));
      }
    },
    getString: (key) => {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key) || undefined;
      }
      return mockStorage.get(key);
    },
    getNumber: (key) => {
      const val = typeof window !== 'undefined' && window.localStorage
        ? window.localStorage.getItem(key)
        : mockStorage.get(key);
      return val ? Number(val) : undefined;
    },
    getBoolean: (key) => {
      const val = typeof window !== 'undefined' && window.localStorage
        ? window.localStorage.getItem(key)
        : mockStorage.get(key);
      return val === 'true' ? true : val === 'false' ? false : undefined;
    },
    delete: (key) => {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      } else {
        mockStorage.delete(key);
      }
    },
    clearAll: () => {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      } else {
        mockStorage.clear();
      }
    },
  };
} else {
  const { MMKV } = require('react-native-mmkv');
  storage = new MMKV({
    id: 'nexvy-storage',
  });
}

export const mmkvKeys = {
  NUTRITION_TODAY_CACHE: 'nutrition_today_cache',
  ONBOARDING_SEEN: 'onboarding_seen',
  LAST_SYNC_TIMESTAMP: 'last_sync_timestamp',
  AUTH_REDIRECT_CHECKED: 'auth_redirect_checked',
} as const;

export { storage };

