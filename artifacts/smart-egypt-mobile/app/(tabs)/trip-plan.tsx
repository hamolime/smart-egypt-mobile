import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/contexts/LanguageContext';
import { AppHeader } from '@/components/AppHeader';

interface DayPlan {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  tip: string;
}

const API_BASE = `https://${process.env.EXPO_PUBLIC_DOMAIN}`;

const BUDGETS = ['budgetLow', 'budgetMid', 'budgetLux'] as const;
const INTEREST_KEYS = [
  'interestHistory',
  'interestBeaches',
  'interestCulture',
  'interestFood',
  'interestAdventure',
  'interestRelaxation',
] as const;

export default function TripPlanScreen() {
  const colors = useColors();
  const { t, language, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();

  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(5);
  const [budget, setBudget] = useState<string>('budgetMid');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<DayPlan[] | null>(null);
  const [error, setError] = useState('');

  const toggleInterest = (key: string) => {
    setSelectedInterests((prev) =>
      prev.includes(key) ? prev.filter((i) => i !== key) : [...prev, key]
    );
  };

  const generatePlan = async () => {
    if (!destination.trim()) {
      setError(t('enterDestination'));
      return;
    }
    setError('');
    setLoading(true);
    setItinerary(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const res = await fetch(`${API_BASE}/api/trip-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          days,
          budget: t(budget),
          interests: selectedInterests.map((k) => t(k)),
          language,
        }),
      });

      const data = await res.json();
      if (data.itinerary && Array.isArray(data.itinerary)) {
        setItinerary(data.itinerary);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        setError(t('errorOccurred'));
      }
    } catch {
      setError(t('errorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  const bottomPadding = Platform.OS === 'web' ? 84 : insets.bottom + 49;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader />
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.pageTitle, { color: colors.foreground }]}>
          {t('tripPlanTitle')}
        </Text>

        {/* Destination */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.foreground }]}>{t('destination')}</Text>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: colors.card,
                borderColor: error && !destination.trim() ? colors.destructive : colors.border,
                color: colors.foreground,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}
            placeholder={t('destinationPlaceholder')}
            placeholderTextColor={colors.mutedForeground}
            value={destination}
            onChangeText={(v) => { setDestination(v); setError(''); }}
          />
        </View>

        {/* Days */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.foreground }]}>
            {t('numberOfDays')}: <Text style={{ color: colors.primary }}>{days}</Text>
          </Text>
          <View style={styles.daysRow}>
            {[1, 2, 3, 5, 7, 10, 14].map((n) => (
              <TouchableOpacity
                key={n}
                style={[
                  styles.dayChip,
                  {
                    backgroundColor: days === n ? colors.primary : colors.card,
                    borderColor: days === n ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setDays(n)}
              >
                <Text style={[styles.dayChipText, { color: days === n ? '#fff' : colors.foreground }]}>
                  {n}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Budget */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.foreground }]}>{t('budget')}</Text>
          <View style={styles.budgetRow}>
            {BUDGETS.map((b) => (
              <TouchableOpacity
                key={b}
                style={[
                  styles.budgetChip,
                  {
                    backgroundColor: budget === b ? colors.primary : colors.card,
                    borderColor: budget === b ? colors.primary : colors.border,
                    flex: 1,
                  },
                ]}
                onPress={() => setBudget(b)}
              >
                <Text style={[styles.chipText, { color: budget === b ? '#fff' : colors.foreground }]}>
                  {t(b)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Interests */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.foreground }]}>{t('interests')}</Text>
          <View style={styles.interestWrap}>
            {INTEREST_KEYS.map((key) => {
              const selected = selectedInterests.includes(key);
              return (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.interestChip,
                    {
                      backgroundColor: selected ? colors.primary + '22' : colors.card,
                      borderColor: selected ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => toggleInterest(key)}
                >
                  <Text style={[styles.chipText, { color: selected ? colors.primary : colors.foreground }]}>
                    {t(key)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {error ? (
          <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
        ) : null}

        {/* Generate Button */}
        <TouchableOpacity
          style={[styles.generateBtn, { backgroundColor: loading ? colors.muted : colors.primary }]}
          onPress={generatePlan}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={colors.primary} />
              <Text style={[styles.generateBtnText, { color: colors.mutedForeground }]}>
                {t('generating')}
              </Text>
            </View>
          ) : (
            <View style={styles.loadingRow}>
              <Feather name="zap" size={18} color="#fff" />
              <Text style={[styles.generateBtnText, { color: '#fff' }]}>
                {t('generatePlan')}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Itinerary Results */}
        {itinerary && itinerary.length > 0 && (
          <View style={styles.itinerarySection}>
            <Text style={[styles.itineraryTitle, { color: colors.foreground }]}>
              {t('yourItinerary')}
            </Text>
            {itinerary.map((day) => (
              <View
                key={day.day}
                style={[styles.dayCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={[styles.dayBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.dayBadgeText}>
                    {t('day')} {day.day}
                  </Text>
                </View>
                <Text style={[styles.dayTitle, { color: colors.foreground }]}>{day.title}</Text>

                {[
                  { icon: 'sun', label: t('morning'), text: day.morning },
                  { icon: 'coffee', label: t('afternoon'), text: day.afternoon },
                  { icon: 'moon', label: t('evening'), text: day.evening },
                ].map((item) => (
                  <View key={item.label} style={styles.dayRow}>
                    <View style={[styles.dayIcon, { backgroundColor: colors.secondary }]}>
                      <Feather name={item.icon as any} size={14} color={colors.primary} />
                    </View>
                    <View style={styles.dayRowContent}>
                      <Text style={[styles.dayRowLabel, { color: colors.mutedForeground }]}>
                        {item.label}
                      </Text>
                      <Text style={[styles.dayRowText, { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' }]}>
                        {item.text}
                      </Text>
                    </View>
                  </View>
                ))}

                <View style={[styles.tipBox, { backgroundColor: colors.accent + '18' }]}>
                  <Feather name="info" size={14} color={colors.accent} />
                  <Text style={[styles.tipText, { color: colors.accent, textAlign: isRTL ? 'right' : 'left' }]}>
                    <Text style={{ fontFamily: 'Inter_600SemiBold' }}>{t('localTip')}: </Text>
                    {day.tip}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: Platform.OS === 'web' ? 34 : insets.bottom + 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
  },
  pageTitle: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 10,
  },
  textInput: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
  },
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayChip: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayChipText: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
  budgetRow: {
    flexDirection: 'row',
    gap: 8,
  },
  budgetChip: {
    borderRadius: 10,
    borderWidth: 1.5,
    paddingVertical: 10,
    alignItems: 'center',
  },
  interestWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  chipText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  errorText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    marginBottom: 12,
  },
  generateBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  generateBtnText: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  itinerarySection: {
    gap: 16,
    marginBottom: 24,
  },
  itineraryTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  dayCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  dayBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  dayBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
  },
  dayTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  dayRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  dayIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  dayRowContent: {
    flex: 1,
    gap: 2,
  },
  dayRowLabel: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dayRowText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
  tipBox: {
    flexDirection: 'row',
    gap: 8,
    padding: 10,
    borderRadius: 10,
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
  },
});
