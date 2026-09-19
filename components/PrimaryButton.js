import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { radius } from '../theme/spacing';


export default function PrimaryButton({ label, onPress, variant = 'primary', icon, loading, disabled, danger, style }) {
  const isSecondary = variant === 'secondary';
  const tint = danger ? colors.clay : colors.moss;
  const textColor = isSecondary ? tint : colors.white;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!(disabled || loading), busy: !!loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isSecondary ? { borderWidth: 1.5, borderColor: tint } : { backgroundColor: tint },
        (disabled || loading) && { opacity: 0.5 },
        pressed && { opacity: 0.85, transform: [{ scale: 0.985 }] },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon ? <Feather name={icon} size={18} color={textColor} style={styles.icon} /> : null}
          <Text style={[styles.label, { color: textColor }]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  icon: { marginRight: 10 },
  label: { fontFamily: fonts.bodySemiBold, fontSize: 15 },
});
