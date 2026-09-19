import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { radius } from '../theme/spacing';


export default function Segmented({ options, value, onChange }) {
  return (
    <View style={styles.wrap} accessibilityRole="tablist">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable key={o.value} onPress={() => onChange(o.value)} style={[styles.btn, active && styles.active]} accessibilityRole="tab" accessibilityState={{ selected: active }} accessibilityLabel={o.label}>
            {o.icon ? <Feather name={o.icon} size={16} color={active ? colors.white : colors.moss} /> : null}
            <Text style={[styles.text, active && { color: colors.white }]} numberOfLines={1}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', backgroundColor: colors.paper, borderWidth: 1.5, borderColor: colors.line, borderRadius: radius.sm, padding: 4, gap: 4 },
  btn: { flex: 1, minHeight: 46, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 9, paddingHorizontal: 6 },
  active: { backgroundColor: colors.moss },
  text: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.moss },
});
