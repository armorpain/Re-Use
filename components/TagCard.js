import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { radius } from '../theme/spacing';

/**
 * TagCard
 * Evolução do antigo SectionCard: card com um "furo de picote" no canto
 * esquerdo, referência ao destacável de uma etiqueta física.
 * Reutilizável: usado para blocos de conteúdo e para o preview de item.
 *
 * Props:
 * - highlight: boolean, aplica o destaque "musgo claro" (proposta principal)
 * - children: conteúdo livre (título + texto, ou qualquer composição)
 */
export default function TagCard({ children, highlight = false }) {
  return (
    <View style={[styles.card, highlight && styles.cardHighlight]}>
      <View style={styles.hole} />
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
    marginTop: 4,
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
