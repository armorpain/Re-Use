import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { maxWidth } from '../theme/layout';
import useBreakpoint from '../hooks/useBreakpoint';


export function PageHeader({ title, subtitle, onBack, right, max = 'content' }) {
  const { gutter, isPhone } = useBreakpoint();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top + (isPhone ? 16 : 32), paddingBottom: 20 }}>
      <View style={[styles.headerInner, { maxWidth: maxWidth[max], paddingHorizontal: gutter }]}>
        {onBack ? (
          <Pressable onPress={onBack} style={styles.back} accessibilityRole="button" accessibilityLabel="Voltar" hitSlop={8}>
            <Feather name="arrow-left" size={22} color={colors.ink} />
          </Pressable>
        ) : null}
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, !isPhone && { fontSize: 32 }]} numberOfLines={1} accessibilityRole="header">{title}</Text>
          {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
        </View>
        {right}
      </View>
    </View>
  );
}

export default function Screen({ title, subtitle, onBack, right, max = 'content', children, footer, scrollRef }) {
  const { gutter } = useBreakpoint();
  return (
    <View style={{ flex: 1 }}>
      {title ? <PageHeader title={title} subtitle={subtitle} onBack={onBack} right={right} max={max} /> : null}
      <ScrollView ref={scrollRef} contentContainerStyle={{ alignItems: 'center', paddingBottom: 48 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={{ width: '100%', maxWidth: maxWidth[max], paddingHorizontal: gutter }}>{children}</View>
      </ScrollView>
      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  headerInner: { width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center' },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginLeft: -12, marginRight: 4 },
  title: { fontFamily: fonts.displayBold, fontSize: 28, color: colors.ink, letterSpacing: -0.4 },
  subtitle: { fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1, color: colors.inkSoft, marginTop: 4 },
});
