import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { NAV_ITEMS } from '../navigation/sections';
import { goTop } from '../navigation/ref';
import { useApp } from '../context/AppContext';
import NotificationBadge from './NotificationBadge';


export default function BottomBar({ active }) {
  const insets = useSafeAreaInsets();
  const { totalUnread } = useApp();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]} accessibilityRole="tablist">
      {NAV_ITEMS.map((it) => {
        const on = active === it.key;
        if (it.primary) {
          return (
            <Pressable key={it.key} onPress={() => goTop(it.key)} style={styles.item} accessibilityRole="tab" accessibilityLabel="Anunciar item" accessibilityState={{ selected: on }}>
              <View style={styles.fab}><Feather name="plus" size={26} color={colors.white} /></View>
              <Text style={[styles.label, { color: on ? colors.moss : colors.inkSoft, marginTop: 2 }]}>{it.label}</Text>
            </Pressable>
          );
        }
        return (
          <Pressable key={it.key} onPress={() => goTop(it.key)} style={styles.item} accessibilityRole="tab" accessibilityLabel={it.label} accessibilityState={{ selected: on }}>
            <View>
              <Feather name={it.icon} size={23} color={on ? colors.moss : colors.inkSoft} />
              {it.key === 'Conversas' ? <NotificationBadge count={totalUnread} style={styles.badge} /> : null}
            </View>
            <Text style={[styles.label, { color: on ? colors.moss : colors.inkSoft }, on && { fontFamily: fonts.bodySemiBold }]}>{it.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', backgroundColor: colors.paper, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 8 },
  item: { flex: 1, minHeight: 56, alignItems: 'center', justifyContent: 'center', gap: 4 },
  label: { fontFamily: fonts.bodyMedium, fontSize: 11 },
  fab: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.moss, alignItems: 'center', justifyContent: 'center', marginTop: -22, borderWidth: 4, borderColor: colors.paper },
  badge: { position: 'absolute', top: -7, right: -12 },
});
