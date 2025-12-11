# ⚡ البدء السريع جداً (5 دقائق)

## ✅ المتطلبات

- حساب Expo: https://expo.dev/signup
- حساب Apple Developer: $99/سنة
- App-Specific Password من Apple: https://appleid.apple.com

---

## 🚀 الخطوات (انسخ والصق فقط)

### 1️⃣ تثبيت EAS (مرة واحدة فقط)

```bash
npm install -g eas-cli
```

### 2️⃣ الدخول للمجلد

```bash
cd mobile-app
```

### 3️⃣ تسجيل الدخول

```bash
eas login
```

سيفتح متصفح → اضغط Authorize

### 4️⃣ إعداد Apple

```bash
eas credentials
```

**الأسئلة والإجابات:**

```
? Platform? → iOS (↓ then Enter)
? Credentials source? → App Store Connect API key (↓ then Enter)
? Apple ID? → your@icloud.com (Enter)
? Password? → [الكلمة من Apple] (Enter)
```

### 5️⃣ البناء

```bash
eas build --platform ios --profile production
```

⏳ انتظر 10-15 دقيقة...

### 6️⃣ الرفع

```bash
eas submit --platform ios
```

---

## ✨ النتيجة

```
✅ Submitted to App Store!
🎉 Waiting for Apple review (1-3 days)
```

---

## ❌ إذا حصلت مشكلة

| الخطأ | الحل |
|------|-----|
| npm not found | ركب Node.js من nodejs.org |
| credentials error | تأكد من Apple ID صحيح |
| build failed | شوف السجل: `eas build:view [build-id]` |

---

## 📱 نسخة Android (اختياري)

```bash
eas build --platform android --profile production
eas submit --platform android
```

---

**🎊 خلاص! تم!**

انتظر إيميل من Apple بـ Approved أو Rejected
