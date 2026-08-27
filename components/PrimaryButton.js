import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { radius } from '../theme/spacing';

/**
 * PrimaryButton
 * Botão com duas variantes (primary/secondary), seguindo a regra do
 * design system: "nunca usar argila em botão de ação comum".
 */
export default function PrimaryButton({ label, onPress, variant = 'primary' }) {
  const isSecondary = variant === 'secondary';

  return (
    <TouchableOpacity
      style={[styles.button, isSecondary && styles.buttonSecondary]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.label, isSecondary && styles.labelSecondary]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.moss,
    paddingVertical: 14,
    borderRadius: radius.sm,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.moss,
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    color: '#FFFFFF',
    fontSize: 15,
  },
  labelSecondary: {
    color: colors.moss,
  },
});
