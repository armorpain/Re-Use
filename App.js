import React, { useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  useWindowDimensions,
} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Fraunces_600SemiBold,
  Fraunces_700Bold,
  Fraunces_500Medium_Italic,
} from '@expo-google-fonts/fraunces';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  IBMPlexMono_500Medium,
  IBMPlexMono_600SemiBold,
} from '@expo-google-fonts/ibm-plex-mono';

import { colors } from './theme/colors';
import { fonts } from './theme/typography';
import { spacing } from './theme/spacing';

import Header from './components/Header';
import SectionEyebrow from './components/SectionEyebrow';
import TagCard from './components/TagCard';
import StampBadge from './components/StampBadge';
import ItemPreviewCard from './components/ItemPreviewCard';
import PrimaryButton from './components/PrimaryButton';

SplashScreen.preventAutoHideAsync();

const DESKTOP_BREAKPOINT = 720;

/**
 * Tela inicial do ReUse, construída em cima do Sistema de Identidade Visual
 * (ver /docs/design-system.html). Cada bloco da tela usa um componente do
 * design system: Header (carimbo + nome), SectionEyebrow (rótulo tracejado),
 * TagCard (card com furo de picote), StampBadge (selo de confiança) e
 * ItemPreviewCard (aplicação real do sistema a um anúncio de item).
 *
 * Responsivo: em telas largas (navegador no computador), o conteúdo fica
 * centralizado dentro de um cartão com largura máxima, simulando a moldura
 * de um celular em vez de esticar o texto de ponta a ponta da tela.
 */
export default function App() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= DESKTOP_BREAKPOINT;

  const [fontsLoaded] = useFonts({
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    Fraunces_500Medium_Italic,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    IBMPlexMono_500Medium,
    IBMPlexMono_600SemiBold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea} onLayout={onLayoutRootView}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isDesktop && styles.scrollContentDesktop,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.content, isDesktop && styles.contentDesktop]}>
          <Header />

          <Text style={styles.lede}>
            Uma segunda vida para cada objeto, trocar, doar e reaproveitar sem sair de casa.
          </Text>

          <SectionEyebrow label="Conceito" />
          <TagCard highlight>
            <Text style={styles.cardTitle}>Nossa proposta</Text>
            <Text style={styles.cardBody}>
              O ReUse conecta pessoas para reutilizar, trocar e doar produtos, incentivando o
              consumo consciente e reduzindo o desperdício, um item de cada vez.
            </Text>
          </TagCard>

          <SectionEyebrow label="O problema" />
          <TagCard>
            <Text style={styles.cardTitle}>Onde tudo começa</Text>
            <Text style={styles.cardBody}>
              Todos os anos, milhões de itens em bom estado são descartados por falta de um
              destino adequado. O ReUse existe para dar a eles uma segunda vida, conectando
              quem quer se desfazer de algo com quem realmente precisa.
            </Text>
          </TagCard>

          <SectionEyebrow label="Na prática" />
          <ItemPreviewCard
            title="Cadeira de madeira maciça"
            code="RU-0231"
            description="Poucas marcas de uso, estrutura firme. Retirada combinada por chat."
            conditionLabel="Usado · bom estado"
            conditionVariant="usado"
          />

          <SectionEyebrow label="Selo ReUse" />
          <View style={styles.stampRow}>
            <StampBadge label="RE" caption="USO" variant="moss" rotation="-6deg" />
            <StampBadge label="OK" caption="VERIFICADO" variant="mustard" rotation="4deg" />
            <StampBadge label="♻" caption="DOADO" variant="clay" rotation="-3deg" />
          </View>
          <Text style={styles.stampCaption}>
            Cada etapa do processo, do anúncio à retirada, recebe um carimbo. É a forma do
            ReUse dizer "isso aconteceu de verdade".
          </Text>

          <View style={styles.ctaContainer}>
            <PrimaryButton
              label="Começar agora"
              onPress={() => Alert.alert('ReUse', 'Em breve: fluxo de cadastro!')}
            />
            <PrimaryButton
              label="Saiba mais"
              variant="secondary"
              onPress={() => Alert.alert('ReUse', 'Em breve: mais informações sobre a plataforma!')}
            />
          </View>

          <Text style={styles.footerText}>ReUse · Consumo consciente começa aqui</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  scrollContentDesktop: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
  },
  content: {
    width: '100%',
    paddingHorizontal: spacing.lg,
  },
  contentDesktop: {
    maxWidth: 480,
    backgroundColor: colors.paper,
    borderRadius: 28,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    borderWidth: 1,
    borderColor: colors.line,
    shadowColor: colors.ink,
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  lede: {
    fontFamily: fonts.displayItalic,
    fontSize: 19,
    color: colors.inkSoft,
    lineHeight: 27,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: colors.ink,
    marginBottom: 6,
  },
  cardBody: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    color: colors.inkSoft,
  },
  stampRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    marginTop: 8,
  },
  stampCaption: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: colors.inkSoft,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  ctaContainer: {
    marginTop: spacing.xl,
  },
  footerText: {
    fontFamily: fonts.mono,
    textAlign: 'center',
    marginTop: spacing.xl,
    fontSize: 11,
    color: colors.inkSoft,
  },
});
