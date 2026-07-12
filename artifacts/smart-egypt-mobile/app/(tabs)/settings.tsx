import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { AppHeader } from '@/components/AppHeader';

type ThemeMode = 'system' | 'light' | 'dark';

const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'ar', label: 'Arabic', native: 'العربية' },
  { code: 'fr', label: 'French', native: 'Français' },
  { code: 'de', label: 'German', native: 'Deutsch' },
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'it', label: 'Italian', native: 'Italiano' },
  { code: 'zh', label: 'Chinese', native: '中文' },
];

const THEMES: { mode: ThemeMode; iconName: string; key: string }[] = [
  { mode: 'system', iconName: 'monitor', key: 'systemDefault' },
  { mode: 'light', iconName: 'sun', key: 'light' },
  { mode: 'dark', iconName: 'moon', key: 'dark' },
];

export default function SettingsScreen() {
  const colors = useColors();
  const { t, language, setLanguage } = useLanguage();
  const { themeMode, setThemeMode } = useTheme();
  const insets = useSafeAreaInsets();

  const bottomPadding = Platform.OS === 'web' ? 84 : insets.bottom + 49;

  const handleTheme = (mode: ThemeMode) => {
    Haptics.selectionAsync();
    setThemeMode(mode);
  };

  const handleLanguage = (lang: Language) => {
    Haptics.selectionAsync();
    setLanguage(lang);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.pageTitle, { color: colors.foreground }]}>
          {t('settingsTitle')}
        </Text>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
            {t('appearance').toUpperCase()}
          </Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {THEMES.map((item, idx) => {
              const active = themeMode === item.mode;
              return (
                <React.Fragment key={item.mode}>
                  <TouchableOpacity
                    style={styles.settingRow}
                    onPress={() => handleTheme(item.mode)}
                  >
                    <View style={[styles.iconBox, { backgroundColor: active ? colors.primary + '22' : colors.secondary }]}>
                      <Feather name={item.iconName as any} size={16} color={active ? colors.primary : colors.mutedForeground} />
                    </View>
                    <Text style={[styles.settingLabel, { color: colors.foreground }]}>
                      {t(item.key)}
                    </Text>
                    {active && (
                      <Feather name="check-circle" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                  {idx < THEMES.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                  )}
                </React.Fragment>
              );
            })}
          </View>
        </View>

        {/* Language */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
            {t('language').toUpperCase()}
          </Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {LANGUAGES.map((lang, idx) => {
              const active = language === lang.code;
              return (
                <React.Fragment key={lang.code}>
                  <TouchableOpacity
                    style={styles.settingRow}
                    onPress={() => handleLanguage(lang.code)}
                  >
                    <View style={[styles.langFlag, { backgroundColor: active ? colors.primary + '22' : colors.secondary }]}>
                      <Text style={styles.flagText}>
                        {lang.code === 'en' ? '🇬🇧' : lang.code === 'ar' ? '🇪🇬' : lang.code === 'fr' ? '🇫🇷' : lang.code === 'de' ? '🇩🇪' : lang.code === 'es' ? '🇪🇸' : lang.code === 'it' ? '🇮🇹' : '🇨🇳'}
                      </Text>
                    </View>
                    <View style={styles.langTexts}>
                      <Text style={[styles.settingLabel, { color: colors.foreground }]}>
                        {lang.native}
                      </Text>
                      <Text style={[styles.langSub, { color: colors.mutedForeground }]}>
                        {lang.label}
                      </Text>
                    </View>
                    {active && (
                      <Feather name="check-circle" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                  {idx < LANGUAGES.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                  )}
                </React.Fragment>
              );
            })}
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
            {t('about').toUpperCase()}
          </Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.settingRow}>
              <View style={[styles.iconBox, { backgroundColor: colors.secondary }]}>
                <Feather name="info" size={16} color={colors.mutedForeground} />
              </View>
              <Text style={[styles.settingLabel, { color: colors.foreground }]}>
                Smart Egypt
              </Text>
              <Text style={[styles.versionText, { color: colors.mutedForeground }]}>v1.0.0</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.settingRow}>
              <View style={[styles.iconBox, { backgroundColor: colors.secondary }]}>
                <Feather name="cpu" size={16} color={colors.mutedForeground} />
              </View>
              <Text style={[styles.settingLabel, { color: colors.foreground }]}>
                AI Model
              </Text>
              <Text style={[styles.versionText, { color: colors.mutedForeground }]}>Groq llama-3.1</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16 },
  pageTitle: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    marginBottom: 24,
  },
  section: { marginBottom: 24 },
  sectionLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
  },
  divider: { height: 1, marginHorizontal: 16 },
  langFlag: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagText: { fontSize: 18 },
  langTexts: { flex: 1 },
  langSub: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  versionText: { fontSize: 13, fontFamily: 'Inter_400Regular' },
});
