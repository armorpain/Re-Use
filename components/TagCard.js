import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { radius } from '../theme/spacing';


export default function TagCard({ children, highlight = false, punch = true, style }) {
  return (
    <View style={[styles.card, highlight && styles.cardHighlight, style]}>
      {punch ? <View style={styles.hole} /> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: 20,
  },
  cardHighlight: {
    backgroundColor: colors.highlightBg,
    borderColor: colors.highlightBorder,
  },
  hole: {
    position: 'absolute',
    top: 16,
    left: -6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.line,
  },
});
