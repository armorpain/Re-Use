import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

/**
 * Header
 * Traz o carimbo (elemento de assinatura do sistema) ao lado do nome do app.
 * Reutilizável: title/subtitle podem ser trocados em outras telas (ex: onboarding).
 */
export default function Header({ title = 'ReUse', subtitle = 'PLATAFORMA DE RE-USO' }) {
  return (
    <View style={styles.container}>
      <View style={styles.stamp}>
        <Text style={styles.stampLetter}>R</Text>
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 16,
  },
  stamp: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.moss,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-6deg' }],
  },
  stampLetter: {
    fontFamily: fonts.displayBold,
    fontSize: 22,
    color: colors.moss,
  },
  textBlock: { flex: 1 },
  title: {
    fontFamily: fonts.displayBold,
    fontSize: 30,
    color: colors.ink,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.2,
    color: colors.inkSoft,
    marginTop: 4,
  },
});
