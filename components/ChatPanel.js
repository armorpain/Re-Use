import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { radius } from '../theme/spacing';
import { formatBRL, formatTime } from '../utils/format';
import StampBadge from './StampBadge';
import { useApp } from '../context/AppContext';


export default function ChatPanel({ req, onBack, onOpenItem, embedded }) {
  const insets = useSafeAreaInsets();
  const focused = useIsFocused();
  const { sendMessage, haptic, markRead, setActiveChat } = useApp();
  const [text, setText] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    if (!focused) { setActiveChat(null); return undefined; }
    setActiveChat(req.id);
    markRead(req.id);
    return () => setActiveChat(null);
  }, [req.id, focused, setActiveChat, markRead]);

  const send = () => {
    const t = text.trim();
    if (!t) return;
    sendMessage(req.id, t);
    haptic('light');
    setText('');
  };

  const onKeyPress = (e) => {
    if (Platform.OS === 'web' && e.nativeEvent.key === 'Enter' && !e.nativeEvent.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const agreed = req.status === 'combinado';
  const sale = req.mode === 'vender';

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { paddingTop: embedded ? 24 : insets.top + 12 }]}>
        {onBack ? (
          <Pressable onPress={onBack} style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="Voltar" hitSlop={8}>
            <Feather name="arrow-left" size={22} color={colors.ink} />
          </Pressable>
        ) : null}
        <View style={styles.avatar}><Text style={styles.avatarText}>{req.with.charAt(0)}</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name} numberOfLines={1}>{req.with}</Text>
          <Text style={styles.sub} numberOfLines={1}>{req.itemCode} · {req.itemTitle}{sale && req.priceCents ? ` · ${formatBRL(req.priceCents)}` : ''}</Text>
        </View>
        <Pressable onPress={onOpenItem} style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="Ver anúncio" hitSlop={8}>
          <Feather name="tag" size={20} color={colors.moss} />
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        data={req.messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
        onContentSizeChange={() => listRef.current && listRef.current.scrollToEnd({ animated: true })}
        ListHeaderComponent={
          <View style={{ alignItems: 'center', marginBottom: 20, gap: 14 }}>
            {agreed ? <StampBadge size={88} variant="moss" rotation="-8deg" label="OK" caption="COMBINADO" /> : null}
            <View style={styles.tip}>
              <Feather name="shield" size={15} color={colors.moss} />
              <Text style={styles.tipText}>{sale ? 'Combine a retirada em local público e só pague ao receber o item.' : 'Combine a retirada com calma e em local público.'}</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const mine = item.from === 'me';
          return (
            <View style={[styles.bubbleWrap, { alignItems: mine ? 'flex-end' : 'flex-start' }]}>
              <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
                <Text style={[styles.msg, mine && { color: colors.white }]}>{item.text}</Text>
              </View>
              <Text style={styles.time}>{formatTime(item.at)}</Text>
            </View>
          );
        }}
      />

      <View style={[styles.composer, { paddingBottom: embedded ? 16 : insets.bottom + 12 }]}>
        <TextInput
          style={[styles.input, Platform.OS === 'web' && { outlineStyle: 'none' }]}
          placeholder="Escreva uma mensagem"
          placeholderTextColor={colors.placeholder}
          value={text}
          onChangeText={setText}
          onKeyPress={onKeyPress}
          multiline
          accessibilityLabel="Mensagem"
        />
        <Pressable onPress={send} disabled={!text.trim()} style={[styles.send, !text.trim() && { opacity: 0.4 }]} accessibilityRole="button" accessibilityLabel="Enviar mensagem">
          <Feather name="send" size={19} color={colors.white} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: colors.line, backgroundColor: colors.paper },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.moss, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.displayBold, fontSize: 17, color: colors.white },
  name: { fontFamily: fonts.bodySemiBold, fontSize: 16, color: colors.ink },
  sub: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkSoft, marginTop: 3 },
  tip: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.highlightBg, borderRadius: radius.sm, paddingHorizontal: 14, paddingVertical: 10, maxWidth: 440 },
  tipText: { flex: 1, fontFamily: fonts.body, fontSize: 12, lineHeight: 17, color: colors.moss },
  bubbleWrap: { marginBottom: 14 },
  bubble: { maxWidth: '82%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 18 },
  mine: { backgroundColor: colors.moss, borderBottomRightRadius: 4 },
  theirs: { backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, borderBottomLeftRadius: 4 },
  msg: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: colors.ink },
  time: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkSoft, marginTop: 5 },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, paddingHorizontal: 16, paddingTop: 12, backgroundColor: colors.paper, borderTopWidth: 1, borderTopColor: colors.line },
  input: { flex: 1, maxHeight: 120, minHeight: 48, backgroundColor: colors.bg, borderRadius: radius.sm, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 14, fontFamily: fonts.body, fontSize: 15, color: colors.ink },
  send: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.moss, alignItems: 'center', justifyContent: 'center' },
});
