# إعداد Codemagic لرفع التطبيق على App Store

## الخطوة 1: إنشاء حساب Codemagic

1. اذهب إلى: https://codemagic.io
2. سجّل بحساب GitHub أو GitLab أو Bitbucket
3. اختر خطة مجانية (500 دقيقة بناء شهرياً)

---

## الخطوة 2: ربط المشروع

### الطريقة 1: من Git Repository
1. ارفع مجلد `mobile-app` إلى GitHub
2. في Codemagic، اضغط "Add application"
3. اختر repository الخاص بك

### الطريقة 2: رفع مباشر
1. ضغط مجلد `mobile-app` كملف ZIP
2. رفعه مباشرة في Codemagic

---

## الخطوة 3: ربط App Store Connect

1. في Codemagic، اذهب إلى **Teams** > **Integrations**
2. اختر **App Store Connect**
3. أنشئ **API Key** من App Store Connect:
   - اذهب: https://appstoreconnect.apple.com/access/api
   - اضغط "+" لإنشاء مفتاح جديد
   - اختر Role: "App Manager"
   - حمّل ملف `.p8`
4. أدخل في Codemagic:
   - Issuer ID
   - Key ID
   - ملف API Key (.p8)

---

## الخطوة 4: إعداد Code Signing

### إنشاء الشهادات تلقائياً (الأسهل):
1. في إعدادات المشروع، اختر **iOS code signing**
2. اختر **Automatic**
3. Codemagic سينشئ الشهادات تلقائياً

### أو يدوياً:
1. من Apple Developer Portal، أنشئ:
   - Distribution Certificate (.p12)
   - App Store Provisioning Profile
2. ارفعهم في Codemagic

---

## الخطوة 5: إعداد المتغيرات

في **Environment variables**، أضف:

| المتغير | القيمة |
|---------|--------|
| `BUNDLE_ID` | com.smartgym.member |
| `APP_ID` | معرف التطبيق من App Store Connect |
| `EXPO_TOKEN` | (اختياري) من expo.dev |

---

## الخطوة 6: بدء البناء

1. اذهب للمشروع في Codemagic
2. اختر **expo-ios-workflow**
3. اضغط **Start new build**
4. انتظر (15-30 دقيقة)

---

## الخطوة 7: الرفع التلقائي

بعد نجاح البناء:
- التطبيق يُرفع تلقائياً لـ TestFlight
- ستصلك رسالة على الإيميل
- يمكنك اختبار التطبيق من TestFlight

---

## إعدادات App Store Connect

### 1. إنشاء التطبيق
1. اذهب: https://appstoreconnect.apple.com
2. اضغط "+" > "New App"
3. أدخل:
   - Platform: iOS
   - Name: Smart Gym (أو اسم ناديك)
   - Primary Language: Arabic
   - Bundle ID: com.smartgym.member
   - SKU: smartgym-member-001

### 2. معلومات التطبيق
- **Category**: Health & Fitness
- **Age Rating**: 4+
- **Price**: Free

### 3. الوصف
```
تطبيق بوابة الأعضاء للنادي الرياضي

المميزات:
• عرض تفاصيل الاشتراك
• تتبع المدفوعات والفواتير
• سجل الحضور والزيارات
• العروض الحصرية
• دعم العربية والإنجليزية
```

### 4. لقطات الشاشة
- iPhone 6.7": 1290 x 2796 px
- iPhone 6.5": 1284 x 2778 px
- iPhone 5.5": 1242 x 2208 px

### 5. سياسة الخصوصية
أضف رابط صفحة الخصوصية على موقعك

---

## استكشاف الأخطاء

### خطأ: Code signing failed
- تأكد من صحة Bundle ID
- تأكد من تفعيل App Store Connect integration

### خطأ: Build failed
- تحقق من logs البناء
- تأكد من توافق الإصدارات

### خطأ: Upload failed
- تأكد من وجود التطبيق في App Store Connect
- تأكد من صحة API Key

---

## روابط مفيدة

- Codemagic Docs: https://docs.codemagic.io
- App Store Connect: https://appstoreconnect.apple.com
- Apple Developer: https://developer.apple.com

---

## الدعم

للمساعدة، تواصل مع فريق الدعم أو راجع وثائق Codemagic.
