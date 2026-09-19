import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';


export default function HeartButton({ active, onPress, size = 20, box = 40, style }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      accessibilityLabel={active ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
      style={({ pressed }) => [styles.btn, { width: box, height: box, borderRadius: box / 2 }, pressed && { transform: [{ scale: 0.92 }] }, style]}
    >
      <Ionicons name={active ? 'heart' : 'heart-outline'} size={size} color={active ? colors.clay : colors.ink} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { backgroundColor: 'rgba(248,246,236,0.95)', alignItems: 'center', justifyContent: 'center' },
});
