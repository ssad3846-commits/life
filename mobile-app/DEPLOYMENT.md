# نشر التطبيق الجوال - دليل كامل

## الخطوات الأساسية قبل النشر

### 1. تحديث رابط API

⚠️ **الأهم**: قبل البناء، حدّث الرابط في `src/services/api.ts`:

```typescript
// للبيئة الإنتاجية - استخدم رابط Replit المنشور
const API_BASE_URL = 'https://your-app-name.replit.app';

// أو نطاقك الخاص
const API_BASE_URL = 'https://api.yourdomain.com';
```

### 2. تحديث معلومات التطبيق في `app.json`

```json
{
  "name": "اسم النادي الرياضي",
  "version": "1.0.0",
  "android": {
    "package": "com.yourgym.member",
    "versionCode": 1
  },
  "ios": {
    "bundleIdentifier": "com.yourgym.member",
    "buildNumber": "1"
  }
}
```

## نشر على Android

### الطريقة 1: بناء APK للتوزيع المباشر

```bash
# تثبيت EAS CLI
npm install -g eas-cli

# تسجيل الدخول
eas login

# بناء APK
eas build --platform android --profile preview
```

بعد انتهاء البناء (5-10 دقائق):
- ستحصل على رابط تحميل APK
- شارك الملف مع المستخدمين للتجربة
- أو ارفعه على Google Play للنشر الرسمي

### الطريقة 2: النشر على Google Play مباشرة

```bash
# بناء AAB (مطلوب للـ Play Store)
eas build --platform android --profile production

# رفع للـ Play Store
eas submit --platform android
```

**متطلبات Google Play:**
- حساب Google Play Developer (99$ لمرة واحدة)
- ملء معلومات التطبيق (الوصف، الصور، سياسة الخصوصية)
- مراجعة Google (1-3 أيام)

## نشر على iOS

### متطلبات Apple

- حساب Apple Developer (99$/سنوياً)
- Mac للبناء (أو استخدام EAS Build)

### خطوات النشر

```bash
# بناء IPA
eas build --platform ios --profile production

# رفع للـ App Store
eas submit --platform ios
```

**مراحل النشر:**
1. البناء (15-20 دقيقة)
2. TestFlight للاختبار (اختياري)
3. مراجعة Apple (1-3 أيام)
4. النشر

## تحديث التطبيق

### قبل كل تحديث:

1. **زيادة رقم النسخة** في `app.json`:
```json
{
  "version": "1.0.1",  // النسخة المرئية للمستخدمين
  "android": {
    "versionCode": 2    // زد الرقم بواحد
  },
  "ios": {
    "buildNumber": "2"  // زد الرقم بواحد
  }
}
```

2. **بناء النسخة الجديدة**:
```bash
eas build --platform android
eas build --platform ios
```

3. **رفع للمتاجر**:
```bash
eas submit --platform android
eas submit --platform ios
```

## اختبار قبل النشر

### 1. اختبار محلي
```bash
npm start
# امسح QR code من تطبيق Expo Go
```

### 2. اختبار APK
```bash
eas build --platform android --profile preview
# ثبت APK على جهاز حقيقي
```

### 3. TestFlight (iOS)
```bash
eas build --platform ios --profile preview
eas submit --platform ios
# اختبر عبر TestFlight
```

## قائمة الفحص قبل النشر

- [ ] تحديث `API_BASE_URL` للسيرفر الإنتاجي
- [ ] اختبار تسجيل الدخول
- [ ] اختبار جميع الشاشات
- [ ] اختبار تحميل الفواتير
- [ ] اختبار اللغة العربية والـ RTL
- [ ] اختبار اللغة الإنجليزية
- [ ] إضافة أيقونة وشاشة بداية مناسبة
- [ ] تحديث رقم النسخة
- [ ] كتابة وصف التطبيق
- [ ] تحضير صور للمتجر (screenshots)

## الأيقونات والصور المطلوبة

### للتطبيق:
- `icon.png` - 1024x1024 px
- `adaptive-icon.png` - 1024x1024 px (Android)
- `splash.png` - 1242x2436 px

### للمتاجر:
- Screenshots: 5-8 صور بأحجام مختلفة
- Feature graphic (Android): 1024x500 px
- App Store screenshots (iOS): متعددة الأحجام

## روابط مفيدة

- [دليل Expo الرسمي](https://docs.expo.dev/distribution/introduction/)
- [Google Play Console](https://play.google.com/console)
- [App Store Connect](https://appstoreconnect.apple.com)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)

## الدعم

إذا واجهت مشاكل:
1. راجع سجلات البناء: `eas build:list`
2. تحقق من الـ logs: `eas build:view [build-id]`
3. استشر [منتدى Expo](https://forums.expo.dev/)
