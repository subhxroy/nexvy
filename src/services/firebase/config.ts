import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { initializeFirestore, Firestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]!;
}

// Use the meatdae-last Firestore database
const FIRESTORE_DATABASE_ID = 'meatdae-last';

let db: Firestore;

try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  }, FIRESTORE_DATABASE_ID);
} catch (error) {
  console.warn('Failed to initialize Firestore with persistent local cache, falling back:', error);
  try {
    db = initializeFirestore(app, {}, FIRESTORE_DATABASE_ID);
  } catch {
    const { getFirestore } = require('firebase/firestore');
    db = getFirestore(app, FIRESTORE_DATABASE_ID);
  }
}

export { app, db };
