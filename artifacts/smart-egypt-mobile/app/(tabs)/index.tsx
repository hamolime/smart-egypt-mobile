import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/contexts/LanguageContext';
import { destinations } from '@/constants/destinations';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const colors = useColors();
  const { t, language, isRTL } = useLanguage();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const topPadding = Platform.OS === 'web' ? 67 : insets.top;
  const featuredDests = destinations.slice(0, 6);

  const quickActions = [
    {
      id: 'chatbot',
      icon: 'message-circle' as const,
      titleKey: 'chatWithAI',
      descKey: 'chatDesc',
      route: '/(tabs)/chatbot',
      color: '#1B5E7B',
    },
    {
      id: 'trip-plan',
      icon: 'map' as const,
      titleKey: 'planTrip',
      descKey: 'planDesc',
      route: '/(tabs)/trip-plan',
      color: '#7B3A1B',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Platform.OS === 'web' ? 34 : insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={[styles.hero, { paddingTop: topPadding }]}>
          <Image
            source={require('@/assets/images/hero.jpg')}
            style={styles.heroImg}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={[styles.heroBadge, { backgroundColor: colors.primary + 'CC' }]}>
              <Text style={styles.heroBadgeText}>🇪🇬 Smart Egypt</Text>
            </View>
            <Text style={[styles.heroTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('discoverEgypt')}
            </Text>
            <Text style={[styles.heroSub, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('aiTravelGuide')}
            </Text>
            <TouchableOpacity
              style={[styles.heroBtn, { backgroundColor: colors.primary }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/(tabs)/explore' as any);
              }}
            >
              <Feather name="compass" size={16} color="#fff" />
              <Text style={styles.heroBtnText}>{t('exploreNow')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Features */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            {t('aiFeatures')}
          </Text>
          <View style={styles.aiRow}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.aiCard, { backgroundColor: action.color, flex: 1 }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(action.route as any);
                }}
                activeOpacity={0.85}
              >
                <View style={styles.aiIconBox}>
                  <Feather name={action.icon} size={22} color="#fff" />
                </View>
                <Text style={styles.aiCardTitle}>{t(action.titleKey)}</Text>
                <Text style={styles.aiCardDesc}>{t(action.descKey)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Destinations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              {t('popularDestinations')}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/explore' as any)}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>
                {t('exploreNow')} →
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.destScroll}
          >
            {featuredDests.map((dest) => (
              <TouchableOpacity
                key={dest.id}
                style={[styles.destCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(`/destination/${dest.id}` as any);
                }}
                activeOpacity={0.85}
              >
                <Image source={{ uri: dest.img }} style={styles.destImg} />
                <View style={styles.destCardBody}>
                  <View style={[styles.destTag, { backgroundColor: colors.primary + '22' }]}>
                    <Text style={[styles.destTagText, { color: colors.primary }]}>
                      {language === 'ar' ? dest.tagAr : dest.tag}
                    </Text>
                  </View>
                  <Text style={[styles.destName, { color: colors.foreground }]} numberOfLines={1}>
                    {language === 'ar' ? dest.nameAr : dest.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {},
  hero: {
    position: 'relative',
    height: 340,
    justifyContent: 'flex-end',
  },
  heroImg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  heroContent: {
    padding: 20,
    gap: 10,
    paddingBottom: 28,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  heroBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  heroTitle: {
    color: '#fff',
    fontSize: 34,
    fontFamily: 'Inter_700Bold',
    lineHeight: 40,
  },
  heroSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 25,
    marginTop: 4,
  },
  heroBtnText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
  section: {
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    marginBottom: 14,
  },
  seeAll: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  aiRow: {
    flexDirection: 'row',
    gap: 12,
  },
  aiCard: {
    borderRadius: 16,
    padding: 16,
    gap: 8,
    minHeight: 120,
  },
  aiIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiCardTitle: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  aiCardDesc: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  destScroll: {
    gap: 12,
    paddingBottom: 4,
  },
  destCard: {
    width: 160,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  destImg: {
    width: '100%',
    height: 110,
  },
  destCardBody: {
    padding: 10,
    gap: 6,
  },
  destTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  destTagText: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
  },
  destName: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
  },
});
