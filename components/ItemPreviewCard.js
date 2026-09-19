import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import TagCard from './TagCard';
import Chip from './Chip';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';


export default function ItemPreviewCard({ title, code, description, conditionLabel, conditionVariant, priceLabel, style }) {
  return (
    <TagCard style={style}>
      <View style={styles.header}>
        <View style={styles.thumb}>
          <Feather name="repeat" size={22} color={colors.moss} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.code}>COD. {code}</Text>
        </View>
        {priceLabel ? <Text style={styles.price}>{priceLabel}</Text> : null}
      </View>
      <Text style={styles.description}>{description}</Text>
      <Chip label={conditionLabel} variant={conditionVariant} />
    </TagCard>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.paper2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1, justifyContent: 'center' },
  title: { fontFamily: fonts.bodySemiBold, fontSize: 16, color: colors.ink },
  code: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkSoft, marginTop: 4 },
  price: { fontFamily: fonts.displayBold, fontSize: 20, color: colors.moss },
  description: { fontFamily: fonts.body, fontSize: 14, color: colors.inkSoft, lineHeight: 21, marginBottom: 14 },
});
