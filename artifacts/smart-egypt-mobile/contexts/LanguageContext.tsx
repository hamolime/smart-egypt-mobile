import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';

export type Language = 'en' | 'ar' | 'fr' | 'de' | 'es' | 'it' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANG_KEY = 'se_language';

const translations: Record<string, Record<Language, string>> = {
  discoverEgypt: { en: 'Discover Egypt', ar: 'اكتشف مصر', fr: "Découvrez l'Égypte", de: 'Entdecke Ägypten', es: 'Descubre Egipto', it: "Scopri l'Egitto", zh: '探索埃及' },
  aiTravelGuide: { en: 'AI travel guide for exploring Egypt\'s wonders', ar: 'دليل سفر ذكي لاستكشاف عجائب مصر', fr: "Guide de voyage IA pour les merveilles d'Égypte", de: "KI-Reiseführer für Ägyptens Wunder", es: 'Guía IA para las maravillas de Egipto', it: "Guida IA per le meraviglie dell'Egitto", zh: '探索埃及奇迹的AI旅行指南' },
  exploreNow: { en: 'Explore Now', ar: 'استكشف الآن', fr: 'Explorer Maintenant', de: 'Jetzt Erkunden', es: 'Explorar Ahora', it: 'Esplora Ora', zh: '立即探索' },
  popularDestinations: { en: 'Popular Destinations', ar: 'الوجهات الشهيرة', fr: 'Destinations Populaires', de: 'Beliebte Reiseziele', es: 'Destinos Populares', it: 'Destinazioni Popolari', zh: '热门目的地' },
  aiFeatures: { en: 'AI Features', ar: 'مميزات الذكاء الاصطناعي', fr: 'Fonctionnalités IA', de: 'KI-Funktionen', es: 'Funciones IA', it: 'Funzionalità IA', zh: 'AI功能' },
  chatWithAI: { en: 'Chat with AI', ar: 'تحدث مع الذكاء الاصطناعي', fr: "Chatter avec l'IA", de: 'Mit KI chatten', es: 'Chatear con IA', it: 'Chatta con IA', zh: '与AI聊天' },
  chatDesc: { en: 'Ask anything about Egypt', ar: 'اسأل أي شيء عن مصر', fr: "Posez n'importe quelle question", de: 'Alles über Ägypten fragen', es: 'Pregunta sobre Egipto', it: "Chiedi qualsiasi cosa sull'Egitto", zh: '询问关于埃及的任何问题' },
  planTrip: { en: 'Plan Your Trip', ar: 'خطط لرحلتك', fr: 'Planifier votre Voyage', de: 'Reise planen', es: 'Planifica tu Viaje', it: 'Pianifica il Viaggio', zh: '规划您的旅行' },
  planDesc: { en: 'AI-generated itinerary', ar: 'خطط رحلة بالذكاء الاصطناعي', fr: 'Itinéraire généré par IA', de: 'KI-generierter Reiseplan', es: 'Itinerario generado por IA', it: 'Itinerario generato da IA', zh: 'AI生成行程' },
  destinations: { en: 'Destinations', ar: 'الوجهات', fr: 'Destinations', de: 'Reiseziele', es: 'Destinos', it: 'Destinazioni', zh: '目的地' },
  searchPlaceholder: { en: 'Search destinations...', ar: 'ابحث عن وجهة...', fr: 'Rechercher...', de: 'Suchen...', es: 'Buscar...', it: 'Cerca...', zh: '搜索目的地...' },
  highlights: { en: 'Highlights', ar: 'أبرز المعالم', fr: 'Points forts', de: 'Highlights', es: 'Destacados', it: 'Punti salienti', zh: '亮点' },
  chatbotTitle: { en: 'AI Egypt Guide', ar: 'مرشد مصر الذكي', fr: "Guide IA d'Égypte", de: 'KI-Ägyptenführer', es: 'Guía IA de Egipto', it: "Guida IA dell'Egitto", zh: 'AI埃及向导' },
  chatbotWelcome: { en: "Marhaba! I'm your AI guide for Egypt 🇪🇬. Ask me about history, food, transport, hotels, or attractions anywhere in Egypt!", ar: "مرحباً! أنا مرشدك الذكي لمصر 🇪🇬. اسألني عن التاريخ والطعام والمواصلات والفنادق أو المعالم في أي مكان بمصر!", fr: "Marhaba! Je suis votre guide IA pour l'Égypte 🇪🇬. Posez vos questions!", de: "Marhaba! Ich bin dein KI-Ägyptenführer 🇪🇬. Frag mich alles!", es: "¡Marhaba! Soy tu guía IA de Egipto 🇪🇬. ¡Pregúntame lo que quieras!", it: "Marhaba! Sono la tua guida IA per l'Egitto 🇪🇬. Chiedimi qualsiasi cosa!", zh: "你好！我是您的埃及AI向导 🇪🇬。有任何问题都可以问我！" },
  typeMessage: { en: 'Ask about Egypt...', ar: 'اسأل عن مصر...', fr: "Posez une question...", de: 'Frage über Ägypten...', es: 'Pregunta sobre Egipto...', it: "Chiedi sull'Egitto...", zh: '询问关于埃及...' },
  tripPlanTitle: { en: 'AI Trip Planner', ar: 'مخطط الرحلة الذكي', fr: 'Planificateur IA', de: 'KI-Reiseplaner', es: 'Planificador IA', it: 'Pianificatore IA', zh: 'AI行程规划' },
  destination: { en: 'Destination', ar: 'الوجهة', fr: 'Destination', de: 'Reiseziel', es: 'Destino', it: 'Destinazione', zh: '目的地' },
  destinationPlaceholder: { en: 'e.g. Cairo, Luxor, Aswan...', ar: 'مثل: القاهرة، الأقصر، أسوان...', fr: 'ex. Le Caire, Louxor...', de: 'z.B. Kairo, Luxor...', es: 'ej. El Cairo, Luxor...', it: 'es. Cairo, Luxor...', zh: '如：开罗、卢克索...' },
  numberOfDays: { en: 'Number of Days', ar: 'عدد الأيام', fr: 'Nombre de Jours', de: 'Anzahl der Tage', es: 'Número de Días', it: 'Numero di Giorni', zh: '天数' },
  budget: { en: 'Budget', ar: 'الميزانية', fr: 'Budget', de: 'Budget', es: 'Presupuesto', it: 'Budget', zh: '预算' },
  budgetLow: { en: 'Budget', ar: 'اقتصادي', fr: 'Économique', de: 'Budget', es: 'Económico', it: 'Economico', zh: '经济' },
  budgetMid: { en: 'Mid-range', ar: 'متوسط', fr: 'Milieu de gamme', de: 'Mittelklasse', es: 'Gama media', it: 'Fascia media', zh: '中档' },
  budgetLux: { en: 'Luxury', ar: 'فاخر', fr: 'Luxe', de: 'Luxus', es: 'Lujo', it: 'Lusso', zh: '奢华' },
  interests: { en: 'Interests', ar: 'الاهتمامات', fr: 'Intérêts', de: 'Interessen', es: 'Intereses', it: 'Interessi', zh: '兴趣' },
  interestHistory: { en: 'History', ar: 'التاريخ', fr: 'Histoire', de: 'Geschichte', es: 'Historia', it: 'Storia', zh: '历史' },
  interestBeaches: { en: 'Beaches', ar: 'الشواطئ', fr: 'Plages', de: 'Strände', es: 'Playas', it: 'Spiagge', zh: '海滩' },
  interestCulture: { en: 'Culture', ar: 'الثقافة', fr: 'Culture', de: 'Kultur', es: 'Cultura', it: 'Cultura', zh: '文化' },
  interestFood: { en: 'Food', ar: 'الطعام', fr: 'Cuisine', de: 'Essen', es: 'Gastronomía', it: 'Cucina', zh: '美食' },
  interestAdventure: { en: 'Adventure', ar: 'المغامرة', fr: 'Aventure', de: 'Abenteuer', es: 'Aventura', it: 'Avventura', zh: '冒险' },
  interestRelaxation: { en: 'Relaxation', ar: 'الاسترخاء', fr: 'Détente', de: 'Entspannung', es: 'Relax', it: 'Relax', zh: '休闲' },
  generatePlan: { en: 'Generate Plan', ar: 'إنشاء الخطة', fr: 'Générer le Plan', de: 'Plan erstellen', es: 'Generar Plan', it: 'Genera Piano', zh: '生成计划' },
  generating: { en: 'Generating...', ar: 'جاري الإنشاء...', fr: 'Génération...', de: 'Wird erstellt...', es: 'Generando...', it: 'Generazione...', zh: '生成中...' },
  yourItinerary: { en: 'Your Itinerary', ar: 'جدولك الزمني', fr: 'Votre Itinéraire', de: 'Ihr Reiseplan', es: 'Su Itinerario', it: 'Il Tuo Itinerario', zh: '您的行程' },
  morning: { en: 'Morning', ar: 'الصباح', fr: 'Matin', de: 'Morgen', es: 'Mañana', it: 'Mattina', zh: '早晨' },
  afternoon: { en: 'Afternoon', ar: 'الظهيرة', fr: 'Après-midi', de: 'Nachmittag', es: 'Tarde', it: 'Pomeriggio', zh: '下午' },
  evening: { en: 'Evening', ar: 'المساء', fr: 'Soir', de: 'Abend', es: 'Noche', it: 'Sera', zh: '晚上' },
  localTip: { en: 'Local Tip', ar: 'نصيحة محلية', fr: 'Conseil Local', de: 'Lokaler Tipp', es: 'Consejo Local', it: 'Consiglio Locale', zh: '本地小贴士' },
  day: { en: 'Day', ar: 'اليوم', fr: 'Jour', de: 'Tag', es: 'Día', it: 'Giorno', zh: '第' },
  settingsTitle: { en: 'Settings', ar: 'الإعدادات', fr: 'Paramètres', de: 'Einstellungen', es: 'Configuración', it: 'Impostazioni', zh: '设置' },
  appearance: { en: 'Appearance', ar: 'المظهر', fr: 'Apparence', de: 'Erscheinungsbild', es: 'Apariencia', it: 'Aspetto', zh: '外观' },
  systemDefault: { en: 'System Default', ar: 'افتراضي النظام', fr: 'Système', de: 'System', es: 'Sistema', it: 'Sistema', zh: '系统默认' },
  light: { en: 'Light', ar: 'فاتح', fr: 'Clair', de: 'Hell', es: 'Claro', it: 'Chiaro', zh: '浅色' },
  dark: { en: 'Dark', ar: 'داكن', fr: 'Sombre', de: 'Dunkel', es: 'Oscuro', it: 'Scuro', zh: '深色' },
  language: { en: 'Language', ar: 'اللغة', fr: 'Langue', de: 'Sprache', es: 'Idioma', it: 'Lingua', zh: '语言' },
  about: { en: 'About', ar: 'حول', fr: 'À propos', de: 'Über', es: 'Acerca de', it: 'Informazioni', zh: '关于' },
  version: { en: 'Version', ar: 'الإصدار', fr: 'Version', de: 'Version', es: 'Versión', it: 'Versione', zh: '版本' },
  enterDestination: { en: 'Please enter a destination', ar: 'من فضلك أدخل الوجهة', fr: 'Veuillez entrer une destination', de: 'Bitte Reiseziel eingeben', es: 'Por favor ingresa un destino', it: 'Inserisci una destinazione', zh: '请输入目的地' },
  tryAgain: { en: 'Try Again', ar: 'حاول مجدداً', fr: 'Réessayer', de: 'Erneut versuchen', es: 'Intentar de nuevo', it: 'Riprova', zh: '重试' },
  errorOccurred: { en: 'An error occurred. Please try again.', ar: 'حدث خطأ. حاول مجدداً.', fr: 'Une erreur est survenue.', de: 'Ein Fehler ist aufgetreten.', es: 'Ocurrió un error.', it: "Si è verificato un errore.", zh: '发生错误，请重试。' },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    AsyncStorage.getItem(LANG_KEY).then((val) => {
      if (val) setLanguageState(val as Language);
    });
  }, []);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    await AsyncStorage.setItem(LANG_KEY, lang);
  };

  const isRTL = language === 'ar';

  const t = (key: string): string => {
    return translations[key]?.[language] ?? translations[key]?.['en'] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
