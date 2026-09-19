import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { radius } from '../theme/spacing';
import { formatDayOrTime } from '../utils/format';
import NotificationBadge from './NotificationBadge';


export default function ConversationList({ data, selectedId, onSelect }) {
  return (
    <View style={{ gap: 10 }}>
      {data.map((r) => {
        const last = r.messages[r.messages.length - 1];
        const agreed = r.status === 'combinado';
        const selected = r.id === selectedId;
        const unread = r.unread || 0;
        return (
          <Pressable
            key={r.id}
            onPress={() => onSelect(r.id)}
            accessibilityRole="button"
            accessibilityLabel={`Conversa com ${r.with} sobre ${r.itemTitle}${unread ? `, ${unread} mensagens novas` : ''}`}
            style={({ hovered }) => [styles.row, selected && { borderColor: colors.moss, backgroundColor: colors.highlightBg }, hovered && !selected && { backgroundColor: colors.paper2 }]}
          >
            <View style={styles.avatar}><Text style={styles.avatarText}>{r.with.charAt(0)}</Text></View>
            <View style={{ flex: 1 }}>
              <View style={styles.top}>
                <Text style={[styles.name, unread > 0 && { fontFamily: fonts.bodyBold }]} numberOfLines={1}>{r.with}</Text>
                <Text style={styles.time}>{formatDayOrTime(r.updatedAt)}</Text>
              </View>
              <Text style={styles.itemLine} numberOfLines={1}>{r.itemCode} · {r.itemTitle}</Text>
              <Text style={[styles.preview, unread > 0 && { color: colors.ink, fontFamily: fonts.bodySemiBold }]} numberOfLines={1}>{last.from === 'me' ? 'Você: ' : ''}{last.text}</Text>
            </View>
            <View style={styles.side}>
              <NotificationBadge count={unread} style={{ borderColor: 'transparent' }} />
              <View style={[styles.status, { borderColor: agreed ? colors.moss : colors.mustard }]}>
                <Text style={[styles.statusText, { color: agreed ? colors.moss : colors.mustardText }]}>{agreed ? 'COMBINADO' : 'PENDENTE'}</Text>
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: 16 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.moss, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.displayBold, fontSize: 18, color: colors.white },
  top: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  name: { flex: 1, fontFamily: fonts.bodySemiBold, fontSize: 15, color: colors.ink },
  time: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkSoft },
  itemLine: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkSoft, marginTop: 3 },
  preview: { fontFamily: fonts.body, fontSize: 13, color: colors.inkSoft, marginTop: 6 },
  side: { alignItems: 'flex-end', gap: 8 },
  status: { borderWidth: 1, borderStyle: 'dashed', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontFamily: fonts.mono, fontSize: 9, letterSpacing: 0.5 },
});
