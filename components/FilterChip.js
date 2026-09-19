import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { radius } from '../theme/spacing';


export default function FilterChip({ label, icon, selected, onPress, tint = colors.moss }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      style={({ pressed }) => [styles.chip, selected && { backgroundColor: tint, borderColor: tint, borderStyle: 'solid' }, pressed && { opacity: 0.8 }]}
    >
      {icon ? <Feather name={icon} size={14} color={selected ? colors.paper : colors.inkSoft} style={{ marginRight: 8 }} /> : null}
      <Text style={[styles.text, selected && { color: colors.paper }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.inkSoft,
  },
  text: { fontFamily: fonts.mono, fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase', color: colors.inkSoft },
});
