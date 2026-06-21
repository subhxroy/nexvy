import { Platform } from 'react-native';
import { StateStorage } from 'zustand/middleware';

interface SimpleStorage {
  set(key: string, value: string | number | boolean): void;
  getString(key: string): string | undefined;
  getNumber(key: string): number | undefined;
  getBoolean(key: string): boolean | undefined;
  delete(key: string): void;
  clearAll(): void;
}

function createSyncStorage(): SimpleStorage {
  const store = new Map<string, string>();

  return {
    set: (key, value) => store.set(key, String(value)),
    getString: (key) => store.get(key),
    getNumber: (key) => {
      const val = store.get(key);
      return val !== undefined ? Number(val) : undefined;
    },
    getBoolean: (key) => {
      const val = store.get(key);
      return val === 'true' ? true : val === 'false' ? false : undefined;
    },
    delete: (key) => store.delete(key),
    clearAll: () => store.clear(),
  };
}

function createWebStorage(): SimpleStorage {
  return {
    set: (key, value) => {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, String(value));
      }
    },
    getString: (key) => {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key) || undefined;
      }
      return undefined;
    },
    getNumber: (key) => {
      const val = typeof window !== 'undefined' && window.localStorage
        ? window.localStorage.getItem(key)
        : undefined;
      return val ? Number(val) : undefined;
    },
    getBoolean: (key) => {
      const val = typeof window !== 'undefined' && window.localStorage
        ? window.localStorage.getItem(key)
        : undefined;
      return val === 'true' ? true : val === 'false' ? false : undefined;
    },
    delete: (key) => {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    },
    clearAll: () => {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
    },
  };
}

const storage: SimpleStorage = Platform.OS === 'web'
  ? createWebStorage()
  : createSyncStorage();

export const zustandStorage: StateStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: (name) => storage.getString(name) ?? null,
  removeItem: (name) => storage.delete(name),
};

export const mmkvKeys = {
  NUTRITION_TODAY_CACHE: 'nutrition_today_cache',
  ONBOARDING_SEEN: 'onboarding_seen',
  LAST_SYNC_TIMESTAMP: 'last_sync_timestamp',
  AUTH_REDIRECT_CHECKED: 'auth_redirect_checked',
} as const;

export { storage };
