import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';


export default function Header({ title = 'ReUse', subtitle = 'PLATAFORMA DE RE-USO', light = false }) {
  const tint = light ? colors.paper : colors.moss;
  return (
    <View style={styles.container}>
      <View style={[styles.stamp, { borderColor: tint }]}>
        <Text style={[styles.stampLetter, { color: tint }]}>R</Text>
      </View>
      <View style={styles.textBlock}>
        <Text style={[styles.title, { color: light ? colors.paper : colors.ink }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: light ? colors.paper : colors.inkSoft }]}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  stamp: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-6deg' }],
  },
  stampLetter: { fontFamily: fonts.displayBold, fontSize: 22 },
  textBlock: { flex: 1 },
  title: { fontFamily: fonts.displayBold, fontSize: 30, letterSpacing: -0.3 },
  subtitle: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1.2, marginTop: 4 },
});
