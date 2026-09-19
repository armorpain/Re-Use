import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Image, Pressable, Animated, Platform, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { radius } from '../theme/spacing';
import { CONDITIONS, CATEGORIES, MODES, SUGGEST_RATIO } from '../data/catalog';
import { formatBRL, formatMoneyInput } from '../utils/format';
import { pickFromGallery } from '../utils/media';
import Screen from '../components/Page';
import Input from '../components/Input';
import FilterChip from '../components/FilterChip';
import Segmented from '../components/Segmented';
import PrimaryButton from '../components/PrimaryButton';
import StampBadge from '../components/StampBadge';
import TagCard from '../components/TagCard';
import Sheet from '../components/Sheet';
import useBreakpoint from '../hooks/useBreakpoint';
import { useApp } from '../context/AppContext';
import { useDialog } from '../context/DialogContext';

const MAX_PHOTOS = 3;
const MODE_OPTIONS = Object.entries(MODES).map(([value, m]) => ({ value, label: m.verb, icon: m.icon }));

function Label({ children, style }) {
  return <Text style={[styles.label, style]}>{children}</Text>;
}

export default function AddItemScreen({ navigation }) {
  const { isPhone } = useBreakpoint();
  const { draft, updateDraft, clearDraft, addItem, haptic, settings } = useApp();
  const { choose, confirm } = useDialog();
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone] = useState(null);
  const stampScale = useRef(new Animated.Value(1.9)).current;
  const stampOpacity = useRef(new Animated.Value(0)).current;

  const sale = draft.mode === 'vender';
  const suggestion = draft.originalPriceCents > 0 && draft.condition
    ? Math.round((draft.originalPriceCents * SUGGEST_RATIO[draft.condition]) / 100) * 100
    : 0;

  const errors = {};
  if (draft.photos.length === 0) errors.photos = 'Adicione ao menos uma foto do item.';
  if (draft.title.trim().length < 3) errors.title = 'Dê um nome ao item (mínimo de 3 letras).';
  if (!draft.category) errors.category = 'Escolha uma categoria.';
  if (!draft.condition) errors.condition = 'Informe a condição do item.';
  if (sale && draft.priceCents <= 0) errors.price = 'Informe um preço. Itens mais baratos saem mais rápido.';
  const show = (k) => (submitted ? errors[k] : undefined);

  const hasContent = draft.title || draft.description || draft.category || draft.condition || draft.location || draft.photos.length > 0 || draft.priceCents > 0;

  useEffect(() => {
    if (!done) return;
    stampScale.setValue(1.9);
    stampOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(stampScale, { toValue: 1, friction: 5, tension: 120, useNativeDriver: true }),
      Animated.timing(stampOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [done, stampScale, stampOpacity]);

  const addPhoto = async () => {
    if (draft.photos.length >= MAX_PHOTOS) {
      await confirm({ title: 'Limite de fotos', message: `Você pode adicionar até ${MAX_PHOTOS} fotos por anúncio.`, confirmLabel: 'Entendi', cancelLabel: 'Fechar' });
      return;
    }
    const choice = await choose({
      title: 'Adicionar foto',
      options: [
        { value: 'camera', label: 'Tirar foto', icon: 'camera' },
        { value: 'gallery', label: Platform.OS === 'web' ? 'Escolher arquivo' : 'Escolher da galeria', icon: 'image' },
      ],
    });
    if (choice === 'camera') navigation.navigate('Camera', { target: 'draft' });
    if (choice === 'gallery') {
      const uris = await pickFromGallery({ limit: MAX_PHOTOS - draft.photos.length });
      if (uris.length) updateDraft((d) => ({ photos: [...d.photos, ...uris].slice(0, MAX_PHOTOS) }));
    }
  };

  const removePhoto = (uri) => updateDraft((d) => ({ photos: d.photos.filter((p) => p !== uri) }));

  const discard = async () => {
    const ok = await confirm({ title: 'Descartar rascunho?', message: 'Vamos apagar o que você já preencheu.', confirmLabel: 'Descartar', danger: true, cancelLabel: 'Continuar editando' });
    if (ok) { clearDraft(); setSubmitted(false); }
  };

  const publish = () => {
    setSubmitted(true);
    if (Object.keys(errors).length) { haptic('light'); return; }
    const item = addItem({
      title: draft.title.trim(),
      description: draft.description.trim(),
      category: draft.category,
      condition: draft.condition,
      mode: draft.mode,
      location: draft.location.trim() || 'Perto de você',
      photos: draft.photos,
      priceCents: sale ? draft.priceCents : 0,
      originalPriceCents: sale ? draft.originalPriceCents : 0,
      negotiable: sale ? draft.negotiable : false,
    });
    clearDraft();
    setSubmitted(false);
    haptic('success');
    setDone(item);
  };

  // ---------- blocos do formulário ----------
  const draftBar = settings.autoDraft && hasContent ? (
    <View style={styles.draftBar}>
      <Feather name="save" size={15} color={colors.moss} />
      <Text style={styles.draftText}>Rascunho salvo automaticamente</Text>
      <Pressable onPress={discard} hitSlop={10} accessibilityRole="button" accessibilityLabel="Descartar rascunho"><Text style={styles.draftLink}>Descartar</Text></Pressable>
    </View>
  ) : null;

  const photosBlock = (
    <View>
      <Label>Fotos</Label>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8, paddingRight: 8, gap: 12 }}>
        {draft.photos.map((uri, i) => (
          <View key={uri}>
            <Image source={{ uri }} style={styles.thumb} accessibilityLabel={`Foto ${i + 1}`} />
            {i === 0 ? <View style={styles.coverTag}><Text style={styles.coverText}>CAPA</Text></View> : null}
            <Pressable onPress={() => removePhoto(uri)} style={styles.remove} hitSlop={8} accessibilityRole="button" accessibilityLabel={`Remover foto ${i + 1}`}><Feather name="x" size={14} color={colors.white} /></Pressable>
          </View>
        ))}
        {draft.photos.length < MAX_PHOTOS ? (
          <Pressable onPress={addPhoto} style={styles.addTile} accessibilityRole="button" accessibilityLabel="Adicionar foto">
            <Feather name="camera" size={28} color={colors.moss} />
            <Text style={styles.addText}>Adicionar</Text>
            <Text style={styles.addCount}>{draft.photos.length}/{MAX_PHOTOS}</Text>
          </Pressable>
        ) : null}
      </ScrollView>
      {show('photos') ? <Text style={styles.error}>{errors.photos}</Text> : <Text style={styles.help}>A primeira foto vira a capa do anúncio.</Text>}
    </View>
  );

  const modeBlock = (
    <View>
      <Label>O que você quer fazer?</Label>
      <Segmented options={MODE_OPTIONS} value={draft.mode} onChange={(mode) => updateDraft({ mode })} />
    </View>
  );

  const priceBlock = sale ? (
    <TagCard style={{ marginBottom: 28 }}>
      <Text style={styles.cardTitle}>Preço acessível vende mais rápido</Text>
      <View style={{ height: 16 }} />
      <Input label="Quanto custa novo? (opcional)" prefix="R$" keyboardType="numeric" placeholder="0,00" value={draft.originalPriceCents ? formatMoneyInput(draft.originalPriceCents) : ''} onChangeText={(t) => updateDraft({ originalPriceCents: Math.min(99999999, parseInt(t.replace(/\D/g, '') || '0', 10)) })} hint="Mostramos a economia ao comprador." />
      <Input label="Seu preço" prefix="R$" keyboardType="numeric" placeholder="0,00" value={draft.priceCents ? formatMoneyInput(draft.priceCents) : ''} onChangeText={(t) => updateDraft({ priceCents: Math.min(99999999, parseInt(t.replace(/\D/g, '') || '0', 10)) })} error={show('price')} style={{ marginBottom: suggestion ? 12 : 20 }} />
      {suggestion ? (
        <View style={styles.suggest}>
          <Feather name={draft.priceCents > suggestion ? 'trending-down' : 'check-circle'} size={16} color={draft.priceCents > suggestion ? colors.mustardText : colors.moss} />
          <Text style={[styles.suggestText, draft.priceCents > suggestion && { color: colors.mustardText }]}>
            {draft.priceCents > suggestion
              ? `Está acima do sugerido (${formatBRL(suggestion)}). Preços menores vendem mais rápido.`
              : `Ótimo preço. Sugerimos até ${formatBRL(suggestion)} para este item.`}
          </Text>
        </View>
      ) : null}
      <Pressable onPress={() => updateDraft({ negotiable: !draft.negotiable })} style={styles.checkRow} accessibilityRole="checkbox" accessibilityState={{ checked: draft.negotiable }} accessibilityLabel="Aceito ofertas">
        <View style={[styles.checkbox, draft.negotiable && { backgroundColor: colors.moss, borderColor: colors.moss }]}>
          {draft.negotiable ? <Feather name="check" size={14} color={colors.white} /> : null}
        </View>
        <Text style={styles.checkText}>Aceito ofertas de compradores</Text>
      </Pressable>
    </TagCard>
  ) : null;

  const fields = (
    <View>
      <Input label="Nome do item" icon="tag" placeholder="Ex.: Jaqueta jeans tamanho M" value={draft.title} onChangeText={(t) => updateDraft({ title: t })} error={show('title')} maxLength={60} />

      <View style={{ marginBottom: 28 }}>
        <Label>Categoria</Label>
        <View style={styles.wrapRow}>
          {CATEGORIES.map((c) => (
            <FilterChip key={c.id} label={c.label} icon={c.icon} selected={draft.category === c.id} onPress={() => updateDraft({ category: c.id })} />
          ))}
        </View>
        {show('category') ? <Text style={styles.error}>{errors.category}</Text> : null}
      </View>

      <View style={{ marginBottom: 28 }}>
        <Label>Condição</Label>
        <View style={styles.wrapRow}>
          {Object.entries(CONDITIONS).map(([k, v]) => (
            <FilterChip key={k} label={v.label} selected={draft.condition === k} onPress={() => updateDraft({ condition: k })} />
          ))}
        </View>
        {show('condition') ? <Text style={styles.error}>{errors.condition}</Text> : null}
      </View>

      {priceBlock}

      <Input label="Descrição (opcional)" placeholder="Tamanho, tempo de uso, detalhes de desgaste" multiline value={draft.description} onChangeText={(t) => updateDraft({ description: t })} maxLength={300} />
      <Input label="Bairro ou cidade" icon="map-pin" placeholder="Onde o item pode ser retirado?" value={draft.location} onChangeText={(t) => updateDraft({ location: t })} />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Screen title="Anunciar item" subtitle="DOE, TROQUE OU VENDA EM POUCOS TOQUES">
        {draftBar}
        {isPhone ? (
          <View>
            {photosBlock}
            <View style={{ height: 28 }} />
            {modeBlock}
            <View style={{ height: 28 }} />
            {fields}
            <PrimaryButton label={MODES[draft.mode].publish} icon="check" onPress={publish} />
          </View>
        ) : (
          <View style={styles.cols}>
            <View style={{ flex: 1 }}>
              {photosBlock}
              <View style={{ height: 32 }} />
              {modeBlock}
            </View>
            <View style={{ flex: 1.25 }}>
              {fields}
              <PrimaryButton label={MODES[draft.mode].publish} icon="check" onPress={publish} />
            </View>
          </View>
        )}
      </Screen>

      {/* Confirmação com carimbo */}
      <Sheet visible={!!done} onClose={() => setDone(null)}>
        <View style={{ alignItems: 'center', paddingTop: 8 }}>
          <Animated.View style={{ opacity: stampOpacity, transform: [{ scale: stampScale }] }}>
            <StampBadge size={132} variant="moss" rotation="-8deg" label="OK" caption="ANUNCIADO" />
          </Animated.View>
          <Text style={styles.doneTitle}>Anúncio publicado</Text>
          <Text style={styles.doneText}>{done ? `${done.title} (${done.code}) já aparece para a vizinhança.` : ''}</Text>
        </View>
        <PrimaryButton label="Ver meus anúncios" onPress={() => { setDone(null); navigation.navigate('MyItems'); }} style={{ marginTop: 24 }} />
        <PrimaryButton label="Anunciar outro item" variant="secondary" onPress={() => setDone(null)} style={{ marginTop: 12 }} />
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  cols: { flexDirection: 'row', gap: 56, alignItems: 'flex-start' },
  label: { fontFamily: fonts.bodySemiBold, fontSize: 13, color: colors.ink, marginBottom: 10 },
  help: { fontFamily: fonts.body, fontSize: 12, color: colors.inkSoft, marginTop: 6 },
  error: { fontFamily: fonts.body, fontSize: 12, color: colors.clay, marginTop: 8 },
  wrapRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  draftBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.highlightBg, borderRadius: radius.sm, paddingHorizontal: 16, minHeight: 46, marginBottom: 28 },
  draftText: { flex: 1, fontFamily: fonts.mono, fontSize: 11, color: colors.moss },
  draftLink: { fontFamily: fonts.bodySemiBold, fontSize: 13, color: colors.clay },
  thumb: { width: 104, height: 104, borderRadius: radius.sm, backgroundColor: colors.paper2 },
  coverTag: { position: 'absolute', left: 8, bottom: 8, backgroundColor: 'rgba(32,43,28,0.78)', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  coverText: { fontFamily: fonts.mono, fontSize: 9, color: colors.paper, letterSpacing: 1 },
  remove: { position: 'absolute', top: -6, right: -6, width: 26, height: 26, borderRadius: 13, backgroundColor: colors.clay, alignItems: 'center', justifyContent: 'center' },
  addTile: { width: 104, height: 104, borderRadius: radius.sm, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.moss, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.paper, gap: 2 },
  addText: { fontFamily: fonts.bodySemiBold, fontSize: 12, color: colors.moss, marginTop: 4 },
  addCount: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkSoft },
  cardTitle: { fontFamily: fonts.bodySemiBold, fontSize: 16, color: colors.ink },
  suggest: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 20 },
  suggestText: { flex: 1, fontFamily: fonts.body, fontSize: 13, lineHeight: 19, color: colors.moss },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 44 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: colors.inkSoft, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.paper },
  checkText: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.ink },
  doneTitle: { fontFamily: fonts.displayBold, fontSize: 26, color: colors.ink, marginTop: 24 },
  doneText: { fontFamily: fonts.body, fontSize: 14, color: colors.inkSoft, textAlign: 'center', marginTop: 8, lineHeight: 21 },
});
