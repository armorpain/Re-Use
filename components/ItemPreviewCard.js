import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TagCard from './TagCard';
import Chip from './Chip';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

/**
 * ItemPreviewCard
 * Mostra o design system aplicado a um caso real do produto: um anúncio
 * de item, com miniatura, código no estilo etiqueta e chip de condição.
 * Composição de TagCard + Chip, evidencia como os componentes se combinam.
 */
export default function ItemPreviewCard({ title, code, description, conditionLabel, conditionVariant }) {
  return (
    <TagCard>
      <View style={styles.header}>
        <View style={styles.thumb}>
          <Text style={styles.thumbIcon}>♻</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.code}>COD. {code}</Text>
        </View>
      </View>
      <Text style={styles.description}>{description}</Text>
      <Chip label={conditionLabel} variant={conditionVariant} />
    </TagCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.paper2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbIcon: { fontSize: 20, color: colors.moss },
  headerText: { flex: 1, justifyContent: 'center' },
  title: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: colors.ink,
  },
  code: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.inkSoft,
    marginTop: 2,
  },
  description: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkSoft,
    lineHeight: 19,
    marginBottom: 12,
  },
});
