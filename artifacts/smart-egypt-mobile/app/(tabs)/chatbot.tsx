import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/contexts/LanguageContext';
import { AppHeader } from '@/components/AppHeader';

interface Message {
  id: string;
  isBot: boolean;
  text: string;
}

const API_BASE = `https://${process.env.EXPO_PUBLIC_DOMAIN}`;
const TAB_BAR_HEIGHT = Platform.OS === 'web' ? 84 : 49;

export default function ChatbotScreen() {
  const colors = useColors();
  const { t, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<Message[]>([
    { id: '0', isBot: true, text: t('chatbotWelcome') },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const buildHistory = (msgs: Message[]) =>
    msgs
      .filter((m) => m.id !== '0')
      .map((m) => ({ role: m.isBot ? 'assistant' : 'user', content: m.text }));

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMsg: Message = { id: Date.now().toString(), isBot: false, text };
    const currentMessages = messages;
    setMessages((prev) => [userMsg, ...prev]);
    setInput('');
    setIsLoading(true);

    try {
      const history = buildHistory([...currentMessages, userMsg]);
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      setMessages((prev) => [
        { id: (Date.now() + 1).toString(), isBot: true, text: data.reply ?? t('errorOccurred') },
        ...prev,
      ]);
    } catch {
      setMessages((prev) => [
        { id: (Date.now() + 1).toString(), isBot: true, text: t('errorOccurred') },
        ...prev,
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, t]);

  // الـ bottom padding = safe area + ارتفاع الـ tab bar
  const bottomPadding = insets.bottom + TAB_BAR_HEIGHT;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* هيدر الـ app */}
      <AppHeader />

      {/* فاصل */}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* الرسائل — inverted FlatList */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        inverted
        contentContainerStyle={[styles.listContent, { paddingBottom: 12 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          isLoading ? (
            <View style={[styles.bubble, styles.botBubble, { backgroundColor: colors.card }]}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={[styles.messageRow, item.isBot ? styles.botRow : styles.userRow]}>
            {item.isBot && (
              <View style={[styles.miniAvatar, { backgroundColor: colors.primary }]}>
                <Feather name="cpu" size={12} color="#fff" />
              </View>
            )}
            <View
              style={[
                styles.bubble,
                item.isBot
                  ? [styles.botBubble, { backgroundColor: colors.card }]
                  : [styles.userBubble, { backgroundColor: colors.primary }],
              ]}
            >
              <Text
                style={[
                  styles.bubbleText,
                  {
                    color: item.isBot ? colors.foreground : colors.primaryForeground,
                    textAlign: isRTL ? 'right' : 'left',
                  },
                ]}
              >
                {item.text}
              </Text>
            </View>
          </View>
        )}
      />

      {/* حقل الكتابة — فوق الـ tab bar مباشرةً */}
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={TAB_BAR_HEIGHT}>
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
              paddingBottom: bottomPadding,
            },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.foreground,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}
            placeholder={t('typeMessage')}
            placeholderTextColor={colors.mutedForeground}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            style={[
              styles.sendBtn,
              { backgroundColor: input.trim() && !isLoading ? colors.primary : colors.muted },
            ]}
            onPress={sendMessage}
            disabled={!input.trim() || isLoading}
          >
            <Feather
              name="send"
              size={18}
              color={input.trim() && !isLoading ? '#fff' : colors.mutedForeground}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  divider: { height: 1 },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-end',
    gap: 8,
  },
  botRow: { justifyContent: 'flex-start' },
  userRow: { justifyContent: 'flex-end' },
  miniAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  botBubble: { borderBottomLeftRadius: 4 },
  userBubble: { borderBottomRightRadius: 4 },
  bubbleText: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 10,
  },
  input: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    maxHeight: 100,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
