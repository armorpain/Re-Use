import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

const VARIANT_COLORS = {
  moss: colors.moss,
  mustard: colors.mustardText,
  clay: colors.clay,
  paper: colors.paper, 
};


export default function StampBadge({ label, icon, caption, variant = 'moss', rotation = '-4deg', size = 84, children, style }) {
  const tint = VARIANT_COLORS[variant] || colors.moss;
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.badge,
        { width: size, height: size, borderRadius: size / 2, borderColor: tint, transform: [{ rotate: rotation }] },
        style,
      ]}
    >
      {children}
      {!children && icon ? <Feather name={icon} size={size * 0.3} color={tint} /> : null}
      {!children && !icon && label ? (
        <Text style={[styles.label, { color: tint, fontSize: size * 0.19 }]}>{label}</Text>
      ) : null}
      {!children && caption ? (
        <Text style={[styles.caption, { color: tint, fontSize: Math.max(7, size * 0.085) }]}>{caption}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  label: { fontFamily: fonts.displayBold },
  caption: {
    fontFamily: fonts.mono,
    letterSpacing: 0.5,
    marginTop: 3,
    textAlign: 'center',
  },
});
