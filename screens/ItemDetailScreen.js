import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { radius } from '../theme/spacing';
import { maxWidth } from '../theme/layout';
import { MODES, categoryById, conditionOf, conditionKey } from '../data/catalog';
import { formatBRL, formatMoneyInput } from '../utils/format';
import { shareText } from '../utils/share';
import PrimaryButton from '../components/PrimaryButton';
import Chip from '../components/Chip';
import TagCard from '../components/TagCard';
import StampBadge from '../components/StampBadge';
import PhotoGallery from '../components/PhotoGallery';
import PriceTag from '../components/PriceTag';
import HeartButton from '../components/HeartButton';
import Input from '../components/Input';
import Sheet from '../components/Sheet';
import useBreakpoint from '../hooks/useBreakpoint';
import { useApp } from '../context/AppContext';
import { useDialog } from '../context/DialogContext';
import { goBackOr } from '../navigation/ref';

export default function ItemDetailScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { isPhone, gutter } = useBreakpoint();
  const { items, favorites, toggleFavorite, requestItem, removeItem, completeItem, haptic } = useApp();
  const { confirm, toast } = useDialog();
  const [offerOpen, setOfferOpen] = useState(false);
  const [offer, setOffer] = useState(0);
  const [offerError, setOfferError] = useState('');
  const item = items.find((i) => i.id === route.params.id);

  if (!item) {
    return (
      <View style={styles.missing}>
        <Feather name="package" size={36} color={colors.inkSoft} />
        <Text style={styles.missingText}>Esse anúncio não está mais disponível.</Text>
        <PrimaryButton label="Voltar ao início" onPress={() => goBackOr(navigation)} style={{ marginTop: 20, alignSelf: 'stretch', maxWidth: 320 }} />
      </View>
    );
  }

  const mode = MODES[item.mode];
  const cat = categoryById(item.category);
  const cond = conditionOf(item.condition);
  const fav = favorites.includes(item.id);
  const sold = item.status === 'concluido';
  const sale = item.mode === 'vender';

  const goChat = (opts) => {
    const id = requestItem(item, opts);
    haptic('success');
    navigation.navigate('Chat', { id });
  };

  const openOffer = () => {
    setOffer(Math.round(item.priceCents * 0.9 / 100) * 100);
    setOfferError('');
    setOfferOpen(true);
  };

  const sendOffer = () => {
    if (!offer) { setOfferError('Digite o valor da sua oferta.'); return; }
    if (offer > item.priceCents) { setOfferError(`A oferta não pode passar do preço anunciado (${formatBRL(item.priceCents)}).`); return; }
    setOfferOpen(false);
    goChat({ offerCents: offer });
  };

  const onRemove = async () => {
    const ok = await confirm({ title: 'Remover anúncio?', message: 'O item some do feed e dos favoritos. Essa ação não pode ser desfeita.', confirmLabel: 'Remover', danger: true });
    if (ok) { removeItem(item.id); goBackOr(navigation); }
  };

  const onComplete = async () => {
    const ok = await confirm({ title: `Marcar como ${mode.doneVerb}?`, message: 'O anúncio recebe o carimbo e sai do feed. As conversas continuam salvas.', confirmLabel: `Marcar como ${mode.doneVerb}` });
    if (ok) { completeItem(item.id); haptic('success'); toast(`Anúncio marcado como ${mode.doneVerb}`); }
  };

  // ---- Bloco de ações (fica fixo embaixo no celular e na coluna lateral no tablet e desktop) ----
  const actions = item.mine ? (
    <View style={{ gap: 12 }}>
      {!sold ? <PrimaryButton label={`Marcar como ${mode.doneVerb}`} icon="check-circle" onPress={onComplete} /> : null}
      <PrimaryButton label="Remover anúncio" variant="secondary" danger icon="trash-2" onPress={onRemove} />
    </View>
  ) : sold ? (
    <View style={styles.soldBar}><Feather name="lock" size={16} color={colors.inkSoft} /><Text style={styles.soldText}>Este item já foi {mode.doneVerb}.</Text></View>
  ) : (
    <View style={{ gap: 12 }}>
      <PrimaryButton label={sale ? `${mode.cta} · ${formatBRL(item.priceCents)}` : mode.cta} icon="message-circle" onPress={() => goChat()} />
      {sale && item.negotiable ? <PrimaryButton label="Fazer uma oferta" variant="secondary" icon="tag" onPress={openOffer} /> : null}
    </View>
  );

  const info = (
    <View>
      <View style={styles.codeRow}>
        <Text style={styles.code}>{item.code}</Text>
        <View style={styles.modePill}><Feather name={mode.icon} size={12} color={colors.moss} /><Text style={styles.modeText}>{mode.label}</Text></View>
      </View>
      <Text style={[styles.title, !isPhone && { fontSize: 34, lineHeight: 40 }]}>{item.title}</Text>
      <View style={{ marginTop: 16 }}><PriceTag item={item} size="lg" /></View>
      {sale && item.negotiable ? <Text style={styles.negotiable}>Aceita ofertas</Text> : null}

      <View style={styles.chips}>
        <Chip label={cond.long} variant={conditionKey(item.condition)} />
        <View style={styles.catChip}><Feather name={cat.icon} size={12} color={colors.inkSoft} /><Text style={styles.catText}>{cat.label}</Text></View>
      </View>

      {!isPhone ? <View style={{ marginTop: 28 }}>{actions}</View> : null}

      <TagCard style={{ marginTop: 28 }}>
        <Text style={styles.sectionLabel}>Sobre o item</Text>
        <Text style={styles.desc}>{item.description || 'O dono ainda não escreveu uma descrição.'}</Text>
      </TagCard>

      <TagCard style={{ marginTop: 16 }}>
        <View style={styles.ownerRow}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{item.owner.charAt(0)}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.ownerName}>{item.mine ? 'Você' : item.owner}</Text>
            <View style={styles.locRow}><Feather name="map-pin" size={13} color={colors.inkSoft} /><Text style={styles.loc}>{item.location}</Text></View>
          </View>
        </View>
      </TagCard>

      {sale ? (
        <TagCard highlight style={{ marginTop: 16 }}>
          <View style={styles.tipRow}>
            <Feather name="shield" size={18} color={colors.moss} style={{ marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionLabel}>Compra segura</Text>
              <Text style={styles.desc}>Combine a retirada em local público e só pague ao receber o item. O pagamento é acertado direto com quem vende.</Text>
            </View>
          </View>
        </TagCard>
      ) : null}
    </View>
  );

  const topBar = (
    <View style={[styles.topBar, { paddingTop: insets.top + (isPhone ? 12 : 28) }]}>
      <View style={[styles.topInner, { maxWidth: maxWidth.content, paddingHorizontal: gutter }]}>
        <Pressable onPress={() => goBackOr(navigation)} style={styles.roundBtn} accessibilityRole="button" accessibilityLabel="Voltar"><Feather name="arrow-left" size={22} color={colors.ink} /></Pressable>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Pressable onPress={() => shareText(`${item.title} (${item.code}) no ReUse · ${item.location}`, toast)} style={styles.roundBtn} accessibilityRole="button" accessibilityLabel="Compartilhar"><Feather name="share-2" size={20} color={colors.ink} /></Pressable>
          <HeartButton active={fav} onPress={() => toggleFavorite(item.id)} size={22} box={44} style={styles.heartBtn} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {topBar}
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: isPhone ? 160 + insets.bottom : 64 }} showsVerticalScrollIndicator={false}>
        <View style={{ width: '100%', maxWidth: maxWidth.content, paddingHorizontal: gutter, flexDirection: isPhone ? 'column' : 'row', gap: isPhone ? 24 : 48, alignItems: 'flex-start' }}>
          <View style={{ width: isPhone ? '100%' : '46%' }}>
            <PhotoGallery item={item} />
            {sold ? (
              <View style={styles.stampOver}><StampBadge size={96} variant="clay" label="OK" caption={mode.doneStamp} rotation="-10deg" /></View>
            ) : null}
          </View>
          <View style={{ flex: isPhone ? undefined : 1, width: isPhone ? '100%' : undefined }}>{info}</View>
        </View>
      </ScrollView>

      {isPhone ? (
        <View style={[styles.cta, { paddingBottom: insets.bottom + 16 }]}>
          {actions}
        </View>
      ) : null}

      <Sheet visible={offerOpen} onClose={() => setOfferOpen(false)} title="Faça sua oferta">
        <Text style={styles.offerText}>Preço anunciado: {formatBRL(item.priceCents)}. Ofertas justas costumam ser aceitas mais rápido.</Text>
        <View style={{ height: 20 }} />
        <Input
          label="Sua oferta"
          prefix="R$"
          keyboardType="numeric"
          value={formatMoneyInput(offer)}
          onChangeText={(t) => { setOffer(Math.min(99999999, parseInt(t.replace(/\D/g, '') || '0', 10))); setOfferError(''); }}
          error={offerError}
        />
        <PrimaryButton label="Enviar oferta" icon="send" onPress={sendOffer} />
        <PrimaryButton label="Cancelar" variant="secondary" onPress={() => setOfferOpen(false)} style={{ marginTop: 12 }} />
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 14 },
  missingText: { fontFamily: fonts.bodyMedium, fontSize: 16, color: colors.ink, textAlign: 'center' },
  topBar: { paddingBottom: 16 },
  topInner: { width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  roundBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  heartBtn: { backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line },
  stampOver: { position: 'absolute', top: 16, right: 16 },
  codeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  code: { fontFamily: fonts.mono, fontSize: 12, color: colors.inkSoft, letterSpacing: 1 },
  modePill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 999, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.moss, paddingHorizontal: 12, paddingVertical: 5 },
  modeText: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 0.5, color: colors.moss, textTransform: 'uppercase' },
  title: { fontFamily: fonts.displayBold, fontSize: 28, lineHeight: 34, color: colors.ink, marginTop: 14, letterSpacing: -0.5 },
  negotiable: { fontFamily: fonts.mono, fontSize: 11, color: colors.moss, marginTop: 8, letterSpacing: 0.5 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginTop: 20 },
  catChip: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 999, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.inkSoft, paddingHorizontal: 12, paddingVertical: 5 },
  catText: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 0.5, color: colors.inkSoft, textTransform: 'uppercase' },
  sectionLabel: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.moss, marginBottom: 8 },
  desc: { fontFamily: fonts.body, fontSize: 15, lineHeight: 24, color: colors.ink },
  ownerRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.moss, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.displayBold, fontSize: 18, color: colors.white },
  ownerName: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: colors.ink },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  loc: { fontFamily: fonts.body, fontSize: 13, color: colors.inkSoft },
  tipRow: { flexDirection: 'row', gap: 14 },
  cta: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 16, paddingTop: 16, backgroundColor: colors.paper, borderTopWidth: 1, borderTopColor: colors.line },
  soldBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.paper2, borderRadius: radius.sm, padding: 16 },
  soldText: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.inkSoft },
  offerText: { fontFamily: fonts.body, fontSize: 15, lineHeight: 23, color: colors.inkSoft },
});
