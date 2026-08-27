import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { radius } from '../theme/spacing';

const VARIANT_COLORS = {
  novo: colors.moss,
  usado: colors.mustardText,
  pecas: colors.clay,
};

/**
 * Chip
 * Etiqueta de condição do item (Como novo / Usado / Para peças).
 * Fonte mono, borda tracejada, sem preenchimento, igual ao guia visual.
 * Reutilizável em qualquer lugar que precise sinalizar o estado de um item.
 */
export default function Chip({ label, variant = 'novo' }) {
  const tint = VARIANT_COLORS[variant] || colors.moss;
  return <Text style={[styles.chip, { borderColor: tint, color: tint }]}>{label}</Text>;
}

const styles = StyleSheet.create({
  chip: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
});
