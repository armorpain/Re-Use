import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';


export default function NotificationBadge({ count, style }) {
  if (!count) return null;
  return (
    <View style={[styles.badge, style]} accessibilityLabel={`${count} mensagens novas`}>
      <Text style={styles.text}>{count > 9 ? '9+' : count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    backgroundColor: colors.alert,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.paper,
  },
  text: { fontFamily: fonts.monoSemiBold, fontSize: 9, color: colors.white },
});
