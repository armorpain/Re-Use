import React from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { radius } from '../theme/spacing';
import { navWidth } from '../theme/layout';
import { NAV_ITEMS } from '../navigation/sections';
import { goTop } from '../navigation/ref';
import { useApp } from '../context/AppContext';
import StampBadge from './StampBadge';
import PrimaryButton from './PrimaryButton';
import NotificationBadge from './NotificationBadge';


export default function Sidebar({ active, compact }) {
  const insets = useSafeAreaInsets();
  const { user, totalUnread } = useApp();
  const items = NAV_ITEMS.filter((i) => !i.primary);

  return (
    <View style={[styles.side, { width: compact ? navWidth.tablet : navWidth.desktop, paddingTop: insets.top + 24, paddingHorizontal: compact ? 10 : 16 }]}>
      <Pressable onPress={() => goTop('Home')} style={[styles.brand, compact && { justifyContent: 'center' }]} accessibilityRole="button" accessibilityLabel="ReUse, ir para o início">
        <StampBadge size={compact ? 46 : 44} label="R" rotation="-6deg" />
        {!compact ? <Text style={styles.brandText}>ReUse</Text> : null}
      </Pressable>

      {compact ? (
        <Pressable onPress={() => goTop('Anunciar')} style={styles.railFab} accessibilityRole="button" accessibilityLabel="Anunciar item">
          <Feather name="plus" size={24} color={colors.white} />
        </Pressable>
      ) : (
        <PrimaryButton label="Anunciar item" icon="plus" onPress={() => goTop('Anunciar')} style={{ marginTop: 28, marginBottom: 8 }} />
      )}

      <View style={{ marginTop: compact ? 20 : 12, gap: 4 }}>
        {items.map((it) => {
          const on = active === it.key;
          return (
            <Pressable
              key={it.key}
              onPress={() => goTop(it.key)}
              accessibilityRole="button"
              accessibilityLabel={it.label}
              accessibilityState={{ selected: on }}
              style={({ hovered }) => [styles.item, compact && styles.itemRail, on && { backgroundColor: colors.highlightBg }, hovered && !on && { backgroundColor: colors.paper2 }]}
            >
              <View>
                <Feather name={it.icon} size={compact ? 22 : 20} color={on ? colors.moss : colors.inkSoft} />
                {it.key === 'Conversas' && compact ? <NotificationBadge count={totalUnread} style={styles.railBadge} /> : null}
              </View>
              <Text style={[styles.itemText, compact && styles.itemTextRail, on && { color: colors.moss, fontFamily: fonts.bodySemiBold }]}>{it.label}</Text>
              {it.key === 'Conversas' && !compact ? <NotificationBadge count={totalUnread} style={{ marginLeft: 'auto' }} /> : null}
            </Pressable>
          );
        })}
      </View>

      <View style={{ flex: 1 }} />

      {user ? (
        <Pressable onPress={() => goTop('Perfil')} style={[styles.user, compact && { justifyContent: 'center', paddingHorizontal: 0 }]} accessibilityRole="button" accessibilityLabel="Abrir perfil">
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: colors.moss, alignItems: 'center', justifyContent: 'center' }]}>
              <Text style={styles.avatarLetter}>{user.name.charAt(0).toUpperCase()}</Text>
            </View>
          )}
          {!compact ? (
            <View style={{ flex: 1 }}>
              <Text style={styles.userName} numberOfLines={1}>{user.name}</Text>
              <Text style={styles.userMail} numberOfLines={1}>{user.email}</Text>
            </View>
          ) : null}
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  side: { backgroundColor: colors.paper, borderRightWidth: 1, borderRightColor: colors.line, paddingBottom: 24 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48 },
  brandText: { fontFamily: fonts.displayBold, fontSize: 26, color: colors.ink, letterSpacing: -0.4 },
  railFab: { alignSelf: 'center', width: 52, height: 52, borderRadius: 26, backgroundColor: colors.moss, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 48, paddingHorizontal: 14, borderRadius: radius.sm },
  itemRail: { flexDirection: 'column', gap: 4, paddingVertical: 10, paddingHorizontal: 0, justifyContent: 'center' },
  itemText: { fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.inkSoft },
  itemTextRail: { fontSize: 11 },
  railBadge: { position: 'absolute', top: -7, right: -12 },
  user: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderRadius: radius.sm, borderTopWidth: 1, borderTopColor: colors.line },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  avatarLetter: { fontFamily: fonts.displayBold, fontSize: 16, color: colors.white },
  userName: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.ink },
  userMail: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkSoft, marginTop: 2 },
});
