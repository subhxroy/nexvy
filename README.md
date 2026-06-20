# Nexvy — Premium Fitness, AI Nutrition & Activity Tracker

Nexvy is a high-performance, premium dark-mode iOS/Android fitness application built with React Native and Expo SDK 51. The app consolidates three core pillars into a unified, high-tech tracking experience:

1. **🏋️ Strength Tracker**: A Hevy/Lyfta-style workout tracker supporting custom routines, live session state logs, haptic workout completion metrics, and history.
2. **🥗 AI Calorie & Nutrition Tracker**: Features dual barcode scanning, localized search, and Gemini AI-powered meal analysis (Vision photo parsing + natural language text descriptions) with full offline SQLite caching.
3. **🏃 Activity & Movement Tracker**: A Strava-style run tracker integrating background GPS location services, sensor-driven step counts, dynamic route maps, and real-time statistics.

---

## 📱 Features & Highlights

- **Dark-Theme Architecture**: Sleek premium design tokens including a custom charcoal glassmorphic UI (`#0b0b0b` deep canvas and `#f36458` brand orange).
- **Zustand & React Query State**: Bulletproof local and asynchronous state stores including hydration-safe MMCV offline caches.
- **Gemini AI Integrations**: Dynamic meal scanning, description parsing, and weekly progress coaching reports.
- **Offline Support**: Google Firestore data synchronization utilizing `persistentLocalCache` for seamless offline-first usability.
- **Fully Type-Safe**: Strict-mode TypeScript interface structure.

---

## 🛠️ Tech Stack

- **Framework**: React Native (Expo SDK 51 managed workflow)
- **Navigation**: Expo Router v3 (file-based routing)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS / NativeWind v4
- **Database & Sync**: Firebase (Auth, Firestore, Offline Local Cache)
- **AI Processing**: Gemini API via Google Generative AI

---

## 🚀 Getting Started

### 1. Installation
Install project dependencies using the standard `--legacy-peer-deps` flag:
```bash
npm install --legacy-peer-deps
```

### 2. Configure Environment Variables
Create a `.env` file at the root of the project (copying variables from `.env.example`):
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
EXPO_PUBLIC_APP_ENV=development
```

### 3. Run the Development Server
Start Metro bundler clearing cache to ensure clean Babel compilations:
```bash
npx expo start -c
```

- Press **`w`** to launch the web client in Chrome.
- Scan the Metro QR code using your mobile device's **Expo Go** application to test on iOS/Android.

---

## 🧪 Testing the AI Calorie Tracker Locally

To allow frictionless local testing in simulator/web environments without requiring real cameras or physical image uploads, we have added **Test Presets** directly to the user interfaces:

1. **AI Meal Photo Scanner (`/(tabs)/nutrition/snap`)**:
   - Tap **AI Meal Scanner** from the nutrition dashboard.
   - Select any of the **Test Presets** at the bottom (e.g. *Avocado Toast with Egg*, *Grilled Salmon*).
   - This loads a high-resolution sample meal photo and sends it to the Gemini Vision parser with mock base64 data to get instant, accurate macro estimations!
2. **AI Text Description Logger (`/(tabs)/nutrition/log`)**:
   - Navigate to the **Gemini AI Describe** tab.
   - Tap any preset text prompt (e.g. *"Double scoop protein shake"*), which immediately fills the input and triggers Gemini parsing.

---

## 📋 Project Structure

```
├── app/                  # Expo Router file-based route screens
│   ├── (auth)/           # Authentication (Sign In, Sign Up, Forgot Password)
│   ├── (onboarding)/     # Initial walkthrough carousel screens
│   ├── (setup)/          # Setup forms (Personal stats, Activity level, Goals)
│   └── (tabs)/           # Core application tabs (Home, Strength, Nutrition, Activity, Profile)
├── src/
│   ├── components/       # Premium UI components (Buttons, Glassmorphic Cards, Progress Rings)
│   ├── constants/        # Aesthetic layout tokens and string keys
│   ├── hooks/            # Decoupled business logic (useAuth, useActiveWorkout, useLocation)
│   ├── lib/              # Library configurations (Firebase setup, MMKV storage)
│   ├── services/         # Third-party integrations (Gemini client, Barcode lookup)
│   └── stores/           # Zustand global state stores
```
