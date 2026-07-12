# 🇪🇬 Smart Egypt — Mobile Application

> تطبيق موبايل ذكي للسياحة في مصر مبني بـ Expo React Native مع دعم الذكاء الاصطناعي

<p align="center">
  <img src="artifacts/smart-egypt-mobile/assets/images/icon.png" width="120" alt="Smart Egypt Logo" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Groq_AI-FF6B35?style=for-the-badge&logo=ai&logoColor=white" />
</p>

---

## ✨ المميزات

| الميزة | الوصف |
|--------|-------|
| 🏛️ **12 وجهة سياحية** | اكتشف أجمل المناطق في مصر بتفاصيل كاملة |
| 🤖 **شات AI** | تحدث مع مساعد ذكي متخصص في السياحة المصرية |
| 🗓️ **مخطط الرحلات** | احصل على خطة رحلة مخصصة بالذكاء الاصطناعي |
| 🌍 **7 لغات** | العربية، الإنجليزية، الفرنسية، الألمانية، الإسبانية، الإيطالية، الصينية |
| 🌙 **Dark / Light Mode** | ثيم داكن وفاتح مع دعم النظام |
| ⚡ **Groq AI Backend** | استجابات سريعة مدعومة بنموذج `llama-3.1-8b-instant` |

---

## 📱 شاشات التطبيق

```
├── 🏠 Home        — هيرو + بطاقات AI + وجهات مشهورة
├── 🧭 Explore     — بحث وتصفح 12 وجهة سياحية
├── 💬 AI Chat     — شات مع الذكاء الاصطناعي
├── 🗺️ Trip Plan   — مولّد خطة رحلة ذكية
└── ⚙️ Settings    — اللغة والثيم
```

---

## 🗺️ الوجهات السياحية

| | الوجهة | التصنيف |
|-|--------|---------|
| 🏙️ | القاهرة | العاصمة |
| 🔺 | الجيزة | عجيبة الدنيا |
| 🏛️ | الأقصر | متحف مفتوح |
| ⛵ | أسوان | بوابة النوبة |
| 🤿 | الغردقة | جنة البحر الأحمر |
| 🏖️ | شرم الشيخ | عاصمة الغوص |
| 🌊 | الإسكندرية | جوهرة المتوسط |
| ⛰️ | سيناء | الجبال المقدسة |
| 🌴 | واحة سيوة | واحة الصحراء |
| 🐟 | دهب | ملاذ الغواصين |
| 🌿 | الفيوم | الوادي الخلاب |
| 🏜️ | الصحراء البيضاء | مناظر خيالية |

---

## 🏗️ هيكل المشروع

```
smart-egypt-mobile/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # الرئيسية
│   │   ├── explore.tsx        # استكشف
│   │   ├── chatbot.tsx        # الشات
│   │   ├── trip-plan.tsx      # مخطط الرحلة
│   │   └── settings.tsx       # الإعدادات
│   ├── destination/[id].tsx   # تفاصيل الوجهة
│   └── _layout.tsx
├── artifacts/api-server/      # Express + Groq AI backend
│   └── src/routes/
│       ├── chat.ts            # POST /api/chat
│       └── trip-plan.ts       # POST /api/trip-plan
├── constants/
│   ├── colors.ts              # لوح الألوان (Egyptian Gold + Nile Blue)
│   └── destinations.ts        # بيانات الوجهات الـ 12
├── contexts/
│   ├── ThemeContext.tsx        # إدارة الثيم
│   └── LanguageContext.tsx     # إدارة اللغة + الترجمات
└── hooks/
    └── useColors.ts            # hook للألوان
```

---

## 🚀 تشغيل المشروع

### المتطلبات
- Node.js 18+
- pnpm
- حساب Expo Go على الموبايل

### خطوات التشغيل

```bash
# تثبيت الحزم
pnpm install

# تشغيل الـ API server
pnpm --filter @workspace/api-server run dev

# تشغيل تطبيق Expo
pnpm --filter @workspace/smart-egypt-mobile run dev
```

### متغيرات البيئة
```env
GROQ_KEY=your_groq_api_key
SESSION_SECRET=your_session_secret
```

---

## 🎨 نظام الألوان

| اللون | Light | Dark |
|-------|-------|------|
| **Primary** (الذهب المصري) | `#C8973A` | `#D4A574` |
| **Background** | `#FDFAF5` | `#0D1117` |
| **Card** | `#FFFFFF` | `#161B22` |
| **Foreground** | `#1A1008` | `#E8DCC8` |

---

## 🤖 الـ AI Backend

يعتمد التطبيق على **Groq AI** بنموذج `llama-3.1-8b-instant` لتوفير:

- **شات سياحي** — يرد بنفس لغة المستخدم
- **مخطط رحلة مخصص** — بناءً على الوجهة / الأيام / الميزانية / الاهتمامات

---

## 🛠️ التقنيات المستخدمة

- **[Expo](https://expo.dev)** — إطار React Native
- **[Expo Router](https://expo.github.io/router)** — التنقل بين الشاشات
- **[Groq SDK](https://groq.com)** — نماذج الذكاء الاصطناعي
- **[Express](https://expressjs.com)** — الـ API server
- **[AsyncStorage](https://react-native-async-storage.github.io)** — تخزين الإعدادات
- **[pnpm workspaces](https://pnpm.io/workspaces)** — إدارة الـ monorepo

---

## 📄 الترخيص

MIT License — حر الاستخدام للأغراض التعليمية والتجارية.

---

<p align="center">صُنع بـ ❤️ لمصر الجميلة 🇪🇬</p>
