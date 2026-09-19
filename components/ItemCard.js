import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { radius } from '../theme/spacing';
import { MODES, conditionOf, conditionKey } from '../data/catalog';
import Chip from './Chip';
import ItemPhoto from './ItemPhoto';
import HeartButton from './HeartButton';
import PriceTag from './PriceTag';



export default function ItemCard({ item, width, favorite, onPress, onToggleFavorite }) {
  const mode = MODES[item.mode];
  const cond = conditionOf(item.condition);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${mode.label}, ${item.location}`}
      style={({ pressed }) => [styles.card, { width }, pressed && { opacity: 0.93, transform: [{ scale: 0.99 }] }]}
    >
      <View>
        <ItemPhoto item={item} style={{ width: '100%', height: Math.round(width * 0.82) }} />
        <View style={styles.modePill}>
          <Feather name={mode.icon} size={11} color={colors.moss} />
          <Text style={styles.modeText}>{mode.label}</Text>
        </View>
        <HeartButton active={favorite} onPress={onToggleFavorite} style={styles.heart} />
      </View>
      <View style={styles.body}>
        <Text style={styles.code}>{item.code}</Text>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <View style={{ marginTop: 10 }}><PriceTag item={item} /></View>
        <View style={{ marginTop: 12 }}><Chip label={cond.label} variant={conditionKey(item.condition)} /></View>
        <View style={styles.locRow}>
          <Feather name="map-pin" size={12} color={colors.inkSoft} />
          <Text style={styles.loc} numberOfLines={1}>{item.location}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.paper, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, overflow: 'hidden' },
  modePill: { position: 'absolute', left: 10, top: 10, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(248,246,236,0.95)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  modeText: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 0.5, color: colors.moss, textTransform: 'uppercase' },
  heart: { position: 'absolute', right: 8, top: 8 },
  body: { padding: 14 },
  code: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkSoft, letterSpacing: 0.5 },
  title: { fontFamily: fonts.bodySemiBold, fontSize: 15, lineHeight: 20, color: colors.ink, marginTop: 6, minHeight: 40 },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14 },
  loc: { flex: 1, fontFamily: fonts.body, fontSize: 12, color: colors.inkSoft },
});
