import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

const LANG_FLAGS: Record<string, string> = {
  en: '🇬🇧',
  ar: '🇪🇬',
  fr: '🇫🇷',
  de: '🇩🇪',
  es: '🇪🇸',
  it: '🇮🇹',
  zh: '🇨🇳',
};

const THEME_ICONS = {
  light: 'sun',
  dark: 'moon',
  system: 'monitor',
} as const;

interface AppHeaderProps {
  /** شفاف فوق صورة الهيرو */
  transparent?: boolean;
}

export function AppHeader({ transparent = false }: AppHeaderProps) {
  const colors = useColors();
  const { language } = useLanguage();
  const { themeMode, setThemeMode } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const topPadding = Platform.OS === 'web' ? 16 : insets.top;

  const cycleTheme = () => {
    const next = { light: 'dark', dark: 'system', system: 'light' } as const;
    setThemeMode(next[themeMode]);
  };

  const fg = transparent ? '#fff' : colors.foreground;
  const bg = transparent ? 'transparent' : colors.background;
  const btnBg = transparent ? 'rgba(255,255,255,0.22)' : colors.card;
  const borderColor = transparent ? 'transparent' : colors.border;

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop: topPadding + 10,
          backgroundColor: bg,
          borderBottomColor: borderColor,
          borderBottomWidth: transparent ? 0 : 1,
        },
      ]}
    >
      {/* يسار: لوجو + اسم */}
      <View style={styles.left}>
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.logo}
          resizeMode="cover"
        />
        <Text style={[styles.appName, { color: fg }]}>Smart Egypt</Text>
      </View>

      {/* يمين: لغة + ثيم */}
      <View style={styles.right}>
        {/* زر اللغة → بيروح على الإعدادات */}
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: btnBg }]}
          onPress={() => router.push('/(tabs)/settings' as any)}
          activeOpacity={0.75}
        >
          <Text style={styles.flag}>{LANG_FLAGS[language] ?? '🌐'}</Text>
        </TouchableOpacity>

        {/* زر الثيم → بيدور بين light / dark / system */}
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: btnBg }]}
          onPress={cycleTheme}
          activeOpacity={0.75}
        >
          <Feather name={THEME_ICONS[themeMode]} size={16} color={fg} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  logo: {
    width: 34,
    height: 34,
    borderRadius: 9,
  },
  appName: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flag: {
    fontSize: 19,
  },
});
