import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

/**
 * SectionEyebrow
 * Rótulo curto acima de cada bloco de conteúdo, com o ícone de tesoura (✂)
 * que remete ao "destacável" de uma etiqueta, mesma linguagem do guia visual.
 * Reutilizável: usado antes de cada seção da tela.
 */
export default function SectionEyebrow({ label }) {
  return (
    <View style={styles.row}>
      <Text style={styles.icon}>✂</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 28,
    marginBottom: 10,
  },
  icon: { fontSize: 12, color: colors.clay },
  label: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.clay,
  },
});
