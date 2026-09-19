import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import StampBadge from './StampBadge';
import PrimaryButton from './PrimaryButton';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';


export default function EmptyState({ title, text, actionLabel, onAction, icon = 'inbox', variant = 'moss' }) {
  const tint = variant === 'clay' ? colors.clay : variant === 'mustard' ? colors.mustardText : colors.moss;
  return (
    <View style={styles.wrap}>
      <StampBadge size={104} variant={variant} rotation="-6deg">
        <Feather name={icon} size={34} color={tint} />
      </StampBadge>
      <Text style={styles.title}>{title}</Text>
      {text ? <Text style={styles.text}>{text}</Text> : null}
      {actionLabel ? <PrimaryButton label={actionLabel} onPress={onAction} style={{ marginTop: 24, alignSelf: 'stretch', maxWidth: 320 }} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingHorizontal: 32, paddingVertical: 56 },
  title: { fontFamily: fonts.displaySemiBold, fontSize: 22, color: colors.ink, marginTop: 28, textAlign: 'center' },
  text: { fontFamily: fonts.body, fontSize: 15, color: colors.inkSoft, marginTop: 10, textAlign: 'center', lineHeight: 23, maxWidth: 360 },
});
