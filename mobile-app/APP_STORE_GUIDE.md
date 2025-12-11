# دليل رفع التطبيق على App Store

## المتطلبات الأساسية

### 1. حساب Apple Developer
- **التكلفة**: $99 سنوياً
- **التسجيل**: https://developer.apple.com/programs/enroll/
- **الوقت**: 24-48 ساعة للموافقة

### 2. جهاز Mac
- مطلوب لبناء تطبيقات iOS (أو استخدام EAS Build السحابي)

### 3. Expo Account
- سجّل في: https://expo.dev

---

## خطوات الرفع

### الخطوة 1: تثبيت EAS CLI
```bash
npm install -g eas-cli
```

### الخطوة 2: تسجيل الدخول لـ Expo
```bash
cd mobile-app
eas login
```

### الخطوة 3: تحديث معلومات التطبيق

عدّل ملف `app.json`:

```json
{
  "expo": {
    "name": "اسم النادي",
    "slug": "your-gym-app",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourgym.member",
      "buildNumber": "1"
    }
  }
}
```

**ملاحظات مهمة:**
- `bundleIdentifier`: معرف فريد لتطبيقك (مثل: com.stylegym.member)
- `version`: رقم الإصدار المرئي للمستخدمين
- `buildNumber`: رقم البناء (يجب زيادته مع كل رفعة جديدة)

### الخطوة 4: إعداد رابط الخادم

عدّل ملف `src/services/api.ts`:

```typescript
const API_URL = 'https://your-published-app.replit.app';
```

استبدل الرابط برابط موقعك المنشور.

### الخطوة 5: تحديث الأيقونات والصور

استبدل الملفات في مجلد `assets/`:
- `icon.png` - أيقونة التطبيق (1024x1024)
- `splash.png` - شاشة البداية (1284x2778)
- `adaptive-icon.png` - أيقونة Android (1024x1024)

### الخطوة 6: بناء التطبيق للإنتاج

```bash
cd mobile-app
eas build --platform ios --profile production
```

**ما سيحدث:**
1. EAS سيطلب ربط حساب Apple Developer
2. سيُنشئ الشهادات تلقائياً
3. سيبني التطبيق في السحابة
4. سيعطيك رابط لتحميل ملف `.ipa`

### الخطوة 7: رفع التطبيق على App Store Connect

**الطريقة 1: عبر EAS Submit (الأسهل)**
```bash
eas submit --platform ios
```

**الطريقة 2: عبر Transporter (يدوياً)**
1. حمّل تطبيق Transporter من Mac App Store
2. افتح ملف `.ipa` في Transporter
3. ارفعه لـ App Store Connect

### الخطوة 8: إعداد App Store Connect

1. اذهب إلى: https://appstoreconnect.apple.com
2. أنشئ تطبيق جديد
3. أضف:
   - اسم التطبيق (عربي وإنجليزي)
   - وصف التطبيق
   - لقطات شاشة (Screenshots)
   - سياسة الخصوصية (Privacy Policy URL)
   - الفئة: Health & Fitness
4. اختر البناء المرفوع
5. أرسل للمراجعة

---

## لقطات الشاشة المطلوبة

### iPhone 6.7" (iPhone 14 Pro Max)
- **الحجم**: 1290 x 2796 pixels
- **العدد**: 3-10 صور

### iPhone 6.5" (iPhone 11 Pro Max)
- **الحجم**: 1284 x 2778 pixels
- **العدد**: 3-10 صور

### iPhone 5.5" (iPhone 8 Plus)
- **الحجم**: 1242 x 2208 pixels
- **العدد**: 3-10 صور

**نصيحة**: استخدم محاكي iOS لأخذ لقطات الشاشة

---

## معلومات مطلوبة لـ App Store

### الوصف القصير
```
تطبيق عضوية النادي الرياضي - تتبع اشتراكك ودفعاتك وزياراتك
```

### الوصف الكامل
```
تطبيق بوابة الأعضاء للنادي الرياضي

المميزات:
• عرض تفاصيل الاشتراك وتاريخ الانتهاء
• تتبع المدفوعات والفواتير
• سجل الحضور والزيارات
• العروض والخصومات الحصرية
• دعم اللغة العربية والإنجليزية
• إشعارات فورية

انضم الآن واستمتع بتجربة رياضية مميزة!
```

### الكلمات المفتاحية
```
نادي, رياضة, عضوية, اشتراك, جيم, لياقة, gym, fitness, membership
```

### رابط سياسة الخصوصية
يجب توفير رابط صفحة سياسة الخصوصية على موقعك

### رابط الدعم
رابط للتواصل مع الدعم الفني

---

## الأوامر السريعة

```bash
# تثبيت المكتبات
cd mobile-app
npm install

# بناء للاختبار (iOS Simulator)
eas build --platform ios --profile development

# بناء للإنتاج
eas build --platform ios --profile production

# رفع لـ App Store
eas submit --platform ios

# تحديث OTA (بدون إعادة رفع)
eas update --branch production
```

---

## نصائح للموافقة السريعة

1. **اختبر التطبيق جيداً** قبل الرفع
2. **أضف سياسة خصوصية واضحة** لأن التطبيق يجمع بيانات
3. **لقطات شاشة واقعية** بدون صور وهمية
4. **وصف دقيق** للميزات
5. **رد سريع** على استفسارات فريق المراجعة

---

## المشاكل الشائعة وحلولها

### خطأ: Missing Compliance
أضف في `app.json`:
```json
"infoPlist": {
  "ITSAppUsesNonExemptEncryption": false
}
```

### خطأ: Missing Push Notification Entitlement
تأكد من تفعيل Push Notifications في Apple Developer Portal

### خطأ: Invalid Bundle ID
تأكد أن Bundle ID متطابق في:
- app.json
- Apple Developer Portal
- App Store Connect

---

## الدعم

للمساعدة في أي خطوة، تواصل مع فريق الدعم.
