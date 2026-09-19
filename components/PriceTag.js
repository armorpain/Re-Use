import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { formatBRL, discountPct } from '../utils/format';


export default function PriceTag({ item, size = 'sm' }) {
  const big = size === 'lg';
  if (item.mode === 'vender') {
    const pct = discountPct(item.priceCents, item.originalPriceCents);
    return (
      <View style={styles.row}>
        <Text style={[styles.price, big && styles.priceLg]}>{formatBRL(item.priceCents)}</Text>
        {item.originalPriceCents > item.priceCents ? (
          <Text style={[styles.original, big && { fontSize: 14 }]}>{formatBRL(item.originalPriceCents)}</Text>
        ) : null}
        {pct >= 10 ? (
          <View style={styles.pct}><Text style={[styles.pctText, big && { fontSize: 11 }]}>-{pct}%</Text></View>
        ) : null}
      </View>
    );
  }
  return <Text style={[styles.free, big && styles.priceLg]}>{item.mode === 'doar' ? 'Grátis' : 'Aceita troca'}</Text>;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  price: { fontFamily: fonts.displayBold, fontSize: 19, color: colors.ink, letterSpacing: -0.2 },
  priceLg: { fontSize: 30, letterSpacing: -0.4 },
  original: { fontFamily: fonts.body, fontSize: 12, color: colors.inkSoft, textDecorationLine: 'line-through' },
  pct: { backgroundColor: colors.highlightBg, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1, borderColor: colors.highlightBorder },
  pctText: { fontFamily: fonts.monoSemiBold, fontSize: 10, color: colors.moss },
  free: { fontFamily: fonts.displayBold, fontSize: 19, color: colors.moss },
});
