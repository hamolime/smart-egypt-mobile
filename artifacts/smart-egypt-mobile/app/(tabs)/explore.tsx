import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/contexts/LanguageContext';
import { destinations } from '@/constants/destinations';

export default function ExploreScreen() {
  const colors = useColors();
  const { t, language, isRTL } = useLanguage();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return destinations;
    const q = search.toLowerCase();
    return destinations.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.nameAr.includes(q) ||
        d.tag.toLowerCase().includes(q)
    );
  }, [search]);

  const topPadding = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topPadding + 16,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>
          {t('destinations')}
        </Text>
        <View style={[styles.searchRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="search" size={18} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={t('searchPlaceholder')}
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push(`/destination/${item.id}` as any)}
            activeOpacity={0.85}
          >
            <Image source={{ uri: item.img }} style={styles.cardImg} />
            <View style={styles.cardBody}>
              <View style={[styles.tag, { backgroundColor: colors.primary + '22' }]}>
                <Text style={[styles.tagText, { color: colors.primary }]}>
                  {language === 'ar' ? item.tagAr : item.tag}
                </Text>
              </View>
              <Text style={[styles.cardName, { color: colors.foreground }]} numberOfLines={1}>
                {language === 'ar' ? item.nameAr : item.name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
  },
  listContent: {
    padding: 12,
    paddingBottom: 100,
  },
  row: {
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardImg: {
    width: '100%',
    height: 130,
  },
  cardBody: {
    padding: 10,
    gap: 6,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
  },
  cardName: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
});
