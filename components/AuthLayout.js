import React from 'react';
import { View, Text, ScrollView, Pressable, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import useBreakpoint from '../hooks/useBreakpoint';
import Header from './Header';
import StampBadge from './StampBadge';

const BENEFITS = [
  { icon: 'gift', text: 'Doe o que você não usa mais' },
  { icon: 'repeat', text: 'Troque por algo de que precisa' },
  { icon: 'tag', text: 'Compre e venda por preços acessíveis' },
];


export default function AuthLayout({ title, subtitle, children, onBack }) {
  const { width, height, gutter } = useBreakpoint();
  const insets = useSafeAreaInsets();
  const split = width >= 900;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, flexDirection: split ? 'row' : 'column', minHeight: height }}>
          {split ? (
            <View style={[styles.brand, { paddingTop: insets.top + 56 }]}>
              <Header light subtitle="PLATAFORMA DE RE-USO" />
              <Text style={styles.brandTitle}>Uma segunda vida para cada objeto.</Text>
              <View style={{ gap: 20, marginTop: 40 }}>
                {BENEFITS.map((b) => (
                  <View key={b.icon} style={styles.benefit}>
                    <View style={styles.benefitIcon}><Feather name={b.icon} size={20} color={colors.paper} /></View>
                    <Text style={styles.benefitText}>{b.text}</Text>
                  </View>
                ))}
              </View>
              <View style={{ flex: 1 }} />
              <StampBadge size={96} variant="paper" icon="check-circle" caption="VERIFICADO" rotation="-8deg" />
            </View>
          ) : null}

          <View style={{ flex: 1, alignItems: 'center', justifyContent: split ? 'center' : 'flex-start', paddingHorizontal: split ? 48 : gutter + 8, paddingTop: insets.top + (split ? 48 : 24), paddingBottom: insets.bottom + 48 }}>
            <View style={{ width: '100%', maxWidth: 440 }}>
              {onBack ? (
                <Pressable onPress={onBack} style={styles.back} accessibilityRole="button" accessibilityLabel="Voltar" hitSlop={8}>
                  <Feather name="arrow-left" size={22} color={colors.ink} />
                </Pressable>
              ) : null}
              {!split ? <Header /> : null}
              <Text style={[styles.title, { marginTop: split ? 0 : 32 }]} accessibilityRole="header">{title}</Text>
              <Text style={styles.sub}>{subtitle}</Text>
              {children}
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  brand: { flex: 1, backgroundColor: colors.moss, paddingHorizontal: 56, paddingBottom: 56 },
  brandTitle: { fontFamily: fonts.displayBold, fontSize: 44, lineHeight: 52, color: colors.paper, marginTop: 56, letterSpacing: -0.8, maxWidth: 460 },
  benefit: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  benefitIcon: { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.paper, alignItems: 'center', justifyContent: 'center' },
  benefitText: { fontFamily: fonts.bodyMedium, fontSize: 16, color: colors.paper },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginLeft: -12, marginBottom: 8 },
  title: { fontFamily: fonts.displayBold, fontSize: 32, lineHeight: 38, color: colors.ink, letterSpacing: -0.5 },
  sub: { fontFamily: fonts.body, fontSize: 15, lineHeight: 23, color: colors.inkSoft, marginTop: 10, marginBottom: 32 },
});
