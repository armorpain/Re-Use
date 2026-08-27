import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

const VARIANT_COLORS = {
  moss: colors.moss,
  mustard: colors.mustardText,
  clay: colors.clay,
};

/**
 * StampBadge
 * O elemento de assinatura do sistema: um selo circular de borda tracejada,
 * levemente rotacionado, como um carimbo de mão real. Usado em confirmações,
 * divisores de seção e para comunicar confiança/verificação no fluxo.
 *
 * Props:
 * - label: texto curto e grande (ex: "RE", "OK", "♻")
 * - caption: legenda pequena abaixo (ex: "USO", "VERIFICADO")
 * - variant: 'moss' | 'mustard' | 'clay'
 * - rotation: ângulo do selo (string CSS, ex: '-4deg')
 */
export default function StampBadge({ label, caption, variant = 'moss', rotation = '-4deg' }) {
  const tint = VARIANT_COLORS[variant] || colors.moss;
  return (
    <View style={[styles.badge, { borderColor: tint, transform: [{ rotate: rotation }] }]}>
      <Text style={[styles.label, { color: tint }]}>{label}</Text>
      <Text style={[styles.caption, { color: tint }]}>{caption}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  label: {
    fontFamily: fonts.displayBold,
    fontSize: 16,
  },
  caption: {
    fontFamily: fonts.mono,
    fontSize: 7,
    letterSpacing: 0.5,
    marginTop: 2,
    textAlign: 'center',
  },
});
