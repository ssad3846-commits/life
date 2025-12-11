# Smart Gym Member App

React Native mobile application for gym members built with Expo.

## Features

- Member login (ID Number + Phone)
- Dashboard with active subscription info
- View all subscriptions (current and history)
- View payment history and download invoices
- View check-in history
- Profile management
- Bilingual support (Arabic/English) with RTL
- Session-based authentication (using cookies)

## Tech Stack

- **Expo** - React Native framework
- **React Navigation** - Navigation
- **i18next** - Internationalization
- **Axios** - API requests
- **AsyncStorage** - Local storage
- **TypeScript** - Type safety

## Setup

1. Install dependencies:
```bash
cd mobile-app
npm install
```

2. Update API URL:
   - Open `src/services/api.ts`
   - Update `API_BASE_URL` with your backend URL
   - For development, use your computer's local IP (e.g., `http://192.168.1.100:5000`)
   - **Important**: Do NOT use `localhost` - use your computer's IP address
   - Find your IP: 
     - macOS/Linux: `ifconfig | grep "inet "`
     - Windows: `ipconfig`

3. Start the app:
```bash
npm start
```

4. Run on device:
   - Install Expo Go app on your phone
   - Scan the QR code from the terminal
   - Or press `a` for Android emulator, `i` for iOS simulator

## Project Structure

```
mobile-app/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts (Auth)
│   ├── i18n/          # Translations (EN/AR)
│   ├── navigation/    # Navigation setup
│   ├── screens/       # App screens
│   ├── services/      # API service
│   └── types/         # TypeScript types
├── App.tsx            # App entry point
├── app.json           # Expo configuration
└── package.json       # Dependencies
```

## Screens

1. **Login** - Authenticate with ID number and phone
2. **Home** - Dashboard with member info and active subscription
3. **Subscriptions** - List of all subscriptions
4. **Payments** - Payment history with invoice download
5. **Check-ins** - Check-in history
6. **Profile** - Member profile and settings

## Building for Production

### Prerequisites

1. **Update API URL** (CRITICAL):
   ```typescript
   // In src/services/api.ts
   const API_BASE_URL = 'https://your-app.replit.app'; // Your published backend
   ```

2. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

3. **Login to Expo**:
   ```bash
   eas login
   ```

4. **Configure project**:
   ```bash
   eas build:configure
   ```

### Build APK (Android)

**For testing** (APK file you can share):
```bash
eas build --platform android --profile preview
```

**For Play Store** (AAB bundle):
```bash
eas build --platform android --profile production
```

### Build IPA (iOS)

**For testing** (TestFlight):
```bash
eas build --platform ios --profile preview
```

**For App Store**:
```bash
eas build --platform ios --profile production
```

### Submit to Stores

**Google Play**:
```bash
eas submit --platform android
```

**App Store**:
```bash
eas submit --platform ios
```

For detailed guides:
- [Google Play](https://docs.expo.dev/submit/android/)
- [App Store](https://docs.expo.dev/submit/ios/)

### Update App Version

Before each release, update in `app.json`:
```json
{
  "version": "1.0.1",          // User-facing version
  "android": {
    "versionCode": 2           // Auto-increment for each build
  },
  "ios": {
    "buildNumber": "2"         // Auto-increment for each build
  }
}
```

## Configuration

- Update app name, icon, and splash screen in `app.json`
- Configure colors and styles in component files
- Add new translations in `src/i18n/locales/`

## Authentication

The app uses **session-based authentication with cookies**:
- Login sends credentials to `/api/member/login`
- Backend sets a session cookie automatically
- All subsequent requests include the cookie via `withCredentials: true`
- No manual token management needed
- Logout clears the session cookie

## 📱 رفع التطبيق على App Store

### ⚠️ بدون Mac؟ لا مشكلة!

استخدم **EAS Build** لبناء التطبيق على السحابة:

```bash
eas login                                          # تسجيل الدخول لـ Expo
eas credentials                                    # إعداد شهادات Apple
eas build --platform ios --profile production     # البناء السحابي
eas submit --platform ios                         # الرفع للـ App Store
```

**أدلة تفصيلية:**
- 📖 [دليل خطوة بخطوة للمبتدئين](./STEP_BY_STEP_GUIDE.md) - **ابدأ من هنا!**
- 📚 [دليل مفصل شامل](./DETAILED_SETUP.md) - شرح كل خطوة بالتفصيل
- 🚀 [دليل الرفع التقليدي](./DEPLOYMENT.md) - للمختبرين والمحترفين

**الوقت:** 15-20 دقيقة للبناء + 1-3 أيام للمراجعة من Apple

---

## Development Tips

- **API URL**: Must use your computer's IP address, NOT `localhost`
  - ❌ Wrong: `http://localhost:5000`
  - ✅ Correct: `http://192.168.1.100:5000`
- Test on both Android and iOS
- Test both RTL (Arabic) and LTR (English) layouts
- Use Expo Go for quick testing during development
- Check backend is running and accessible from your network

---

## 🎯 سريع جداً (للخبراء فقط)

```bash
cd mobile-app
npm install -g eas-cli        # بناء EAS CLI مرة واحدة
eas login                      # تسجيل الدخول
eas credentials                # إعداد Apple
eas build --platform ios       # البناء
eas submit --platform ios      # الرفع
```

**📍 ملاحظة:** إذا كنت مبتدئ، استخدم الأدلة التفصيلية أعلاه!

