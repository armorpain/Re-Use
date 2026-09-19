import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';


export default function SectionEyebrow({ label, first = false }) {
  return (
    <View style={[styles.row, first && { marginTop: 0 }]}>
      <Feather name="scissors" size={13} color={colors.clay} />
      <Text style={styles.label} accessibilityRole="header">{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 40,
    marginBottom: 14,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.clay,
  },
});
