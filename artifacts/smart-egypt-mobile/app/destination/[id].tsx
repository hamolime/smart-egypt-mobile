import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/contexts/LanguageContext';
import { destinations } from '@/constants/destinations';

export default function DestinationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const { language, t, isRTL } = useLanguage();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const dest = destinations.find((d) => d.id === id);

  if (!dest) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.foreground }}>Destination not found</Text>
      </View>
    );
  }

  const name = language === 'ar' ? dest.nameAr : dest.name;
  const tag = language === 'ar' ? dest.tagAr : dest.tag;
  const desc = language === 'ar' ? dest.descAr : dest.desc;
  const highlights = language === 'ar' ? dest.highlightsAr : dest.highlights;

  const topPadding = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: dest.img }} style={styles.heroImage} resizeMode="cover" />
          {/* Gradient overlay simulation */}
          <View style={styles.heroGradient} />

          {/* Back button */}
          <TouchableOpacity
            style={[styles.backBtn, { top: topPadding + 12, backgroundColor: 'rgba(0,0,0,0.5)' }]}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>

          {/* Title overlay */}
          <View style={[styles.heroOverlay, { left: isRTL ? undefined : 20, right: isRTL ? 20 : undefined }]}>
            <View style={[styles.heroBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.heroBadgeText}>{tag}</Text>
            </View>
            <Text style={[styles.heroName, { textAlign: isRTL ? 'right' : 'left' }]}>
              {name}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Description */}
          <Text style={[styles.desc, { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' }]}>
            {desc}
          </Text>

          {/* Highlights */}
          <View style={styles.highlightsSection}>
            <Text style={[styles.highlightsTitle, { color: colors.foreground }]}>
              {t('highlights')}
            </Text>
            {highlights.map((h, i) => (
              <View key={i} style={styles.highlightRow}>
                <View style={[styles.highlightDot, { backgroundColor: colors.primary }]} />
                <Text style={[styles.highlightText, { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' }]}>
                  {h}
                </Text>
              </View>
            ))}
          </View>

          {/* Chat CTA */}
          <TouchableOpacity
            style={[styles.chatCta, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/(tabs)/chatbot' as any)}
          >
            <Feather name="message-circle" size={18} color="#fff" />
            <Text style={styles.chatCtaText}>
              {language === 'ar' ? `اسأل عن ${name}` : `Ask AI about ${name}`}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingBottom: 80 },
  heroContainer: {
    position: 'relative',
    height: 320,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backBtn: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 20,
    gap: 8,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  heroBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  heroName: {
    color: '#fff',
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    textShadow: '0px 2px 4px rgba(0,0,0,0.5)',
  },
  content: {
    padding: 20,
    gap: 20,
  },
  desc: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    lineHeight: 26,
  },
  highlightsSection: { gap: 10 },
  highlightsTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  highlightDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  highlightText: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
  },
  chatCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: 14,
  },
  chatCtaText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
});
