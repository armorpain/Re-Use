import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

import Header from '../components/Header';
import SectionEyebrow from '../components/SectionEyebrow';
import TagCard from '../components/TagCard';
import PrimaryButton from '../components/PrimaryButton';
import useBreakpoint from '../hooks/useBreakpoint';
import { useApp } from '../context/AppContext';
import { goTop } from '../navigation/ref';

const WAYS = [
  { icon: 'gift', title: 'Doar', text: 'Tem algo parado em casa? Ofereça de graça para quem precisa.' },
  { icon: 'repeat', title: 'Trocar', text: 'Troque o que você não usa mais por algo que você quer.' },
  { icon: 'tag', title: 'Vender', text: 'Venda por um preço justo e acessível. Você combina tudo pelo chat.' },
];

const BENEFITS = [
  { icon: 'dollar-sign', title: 'Economize', text: 'Achados em ótimo estado por preços que cabem no bolso.' },
  { icon: 'map-pin', title: 'Perto de você', text: 'Combine a retirada com gente do seu bairro.' },
  { icon: 'shield', title: 'Mais segurança', text: 'Converse pelo app e só pague ao receber o item.' },
  { icon: 'globe', title: 'Bom para o planeta', text: 'Cada item reaproveitado é menos lixo no mundo.' },
];

/**
 * Primeira tela do app.
 * Os botões ficam fixos embaixo: "Começar agora" leva ao cadastro e "Entrar" leva ao login.
 * Celular e tablet: uma coluna. A partir de 900px: apresentação à esquerda e explicações à direita.
 */
export default function WelcomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { width, gutter } = useBreakpoint();
  const { user, completeOnboarding } = useApp();
  const split = width >= 900;

  const start = () => { completeOnboarding(); navigation.navigate('Register'); };
  const signIn = () => { completeOnboarding(); navigation.navigate('Login'); };

  const hero = (
    <View>
      <Header />
      <Text style={styles.lede}>Dê uma segunda vida ao que você não usa mais.</Text>
      <Text style={styles.ledeSub}>Doe, troque ou venda por preços acessíveis, direto com pessoas perto de você.</Text>
    </View>
  );

  const content = (
    <View>
      <SectionEyebrow label="Como funciona" first />
      <View style={styles.ways}>
        {WAYS.map((w) => (
          <TagCard key={w.title} style={styles.way}>
            <View style={styles.wayIcon}><Feather name={w.icon} size={20} color={colors.moss} /></View>
            <Text style={styles.cardTitle}>{w.title}</Text>
            <Text style={styles.cardBody}>{w.text}</Text>
          </TagCard>
        ))}
      </View>

      <SectionEyebrow label="Por que usar o ReUse" />
      <TagCard highlight>
        <View style={{ gap: 20 }}>
          {BENEFITS.map((b) => (
            <View key={b.title} style={styles.benefit}>
              <View style={styles.benefitIcon}><Feather name={b.icon} size={18} color={colors.moss} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{b.title}</Text>
                <Text style={styles.cardBody}>{b.text}</Text>
              </View>
            </View>
          ))}
        </View>
      </TagCard>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.page, { paddingTop: insets.top + (split ? 56 : 32), paddingBottom: 48, paddingHorizontal: split ? 56 : gutter + 8 }]}>
          {split ? (
            <View style={styles.split}>
              <View style={styles.left}>{hero}</View>
              <View style={styles.right}>{content}</View>
            </View>
          ) : (
            <View style={styles.single}>
              {hero}
              <View style={{ height: 8 }} />
              {content}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.footerInner}>
          {user ? (
            <PrimaryButton label="Voltar ao app" onPress={() => goTop('Home')} style={{ flex: 1 }} />
          ) : (
            <>
              <PrimaryButton label="Começar agora" onPress={start} style={{ flex: 1 }} />
              <PrimaryButton label="Entrar" variant="secondary" onPress={signIn} style={{ flex: 1 }} />
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, alignItems: 'center' },
  single: { width: '100%', maxWidth: 560 },
  split: { width: '100%', maxWidth: 1100, flexDirection: 'row', gap: 64, alignItems: 'flex-start' },
  left: { flex: 1, maxWidth: 420, ...(typeof document !== 'undefined' ? { position: 'sticky', top: 56 } : null) },
  right: { flex: 1.15 },
  lede: { fontFamily: fonts.displayBold, fontSize: 32, lineHeight: 40, color: colors.ink, marginTop: 32, letterSpacing: -0.5 },
  ledeSub: { fontFamily: fonts.body, fontSize: 17, lineHeight: 26, color: colors.inkSoft, marginTop: 14 },
  cardTitle: { fontFamily: fonts.bodySemiBold, fontSize: 16, color: colors.ink, marginBottom: 6 },
  cardBody: { fontFamily: fonts.body, fontSize: 14, lineHeight: 22, color: colors.inkSoft },
  ways: { gap: 16 },
  way: { paddingLeft: 24 },
  wayIcon: { width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.moss, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  benefit: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  benefitIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center' },
  footer: { backgroundColor: colors.paper, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 16, paddingHorizontal: 16, alignItems: 'center' },
  footerInner: { width: '100%', maxWidth: 560, flexDirection: 'row', gap: 12 },
});
