import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { radius } from '../theme/spacing';
import { MODES, conditionOf, conditionKey } from '../data/catalog';
import Screen from '../components/Page';
import Chip from '../components/Chip';
import EmptyState from '../components/EmptyState';
import ItemPhoto from '../components/ItemPhoto';
import PriceTag from '../components/PriceTag';
import StampBadge from '../components/StampBadge';
import useBreakpoint from '../hooks/useBreakpoint';
import { useApp } from '../context/AppContext';
import { useDialog } from '../context/DialogContext';
import { goBackOr, goTop } from '../navigation/ref';

export default function MyItemsScreen({ navigation }) {
  const { isPhone } = useBreakpoint();
  const { myItems, removeItem, completeItem, haptic } = useApp();
  const { confirm, toast } = useDialog();

  const onRemove = async (item) => {
    const ok = await confirm({ title: 'Remover anúncio?', message: `"${item.title}" some do feed e dos favoritos.`, confirmLabel: 'Remover', danger: true });
    if (ok) removeItem(item.id);
  };

  const onComplete = async (item) => {
    const verb = MODES[item.mode].doneVerb;
    const ok = await confirm({ title: `Marcar como ${verb}?`, message: 'O anúncio recebe o carimbo e sai do feed.', confirmLabel: `Marcar como ${verb}` });
    if (ok) { completeItem(item.id); haptic('success'); toast(`Anúncio marcado como ${verb}`); }
  };

  return (
    <Screen title="Meus anúncios" subtitle={`${myItems.length} ${myItems.length === 1 ? 'ITEM' : 'ITENS'}`} onBack={() => goBackOr(navigation, 'Perfil')}>
      {myItems.length === 0 ? (
        <EmptyState icon="package" title="Você ainda não anunciou nada" text="Tem algo parado em casa? Tire uma foto e dê a ele uma segunda vida." actionLabel="Anunciar primeiro item" onAction={() => goTop('Anunciar')} />
      ) : (
        <View style={[styles.grid, !isPhone && { flexDirection: 'row', flexWrap: 'wrap' }]}>
          {myItems.map((item) => {
            const sold = item.status === 'concluido';
            return (
              <View key={item.id} style={[styles.cell, !isPhone && { width: '48.5%' }]}>
                <Pressable onPress={() => navigation.navigate('ItemDetail', { id: item.id })} style={styles.row} accessibilityRole="button" accessibilityLabel={`${item.title}, abrir anúncio`}>
                  <View>
                    <ItemPhoto item={item} style={styles.thumb} iconSize={28} />
                    {sold ? <View style={styles.stamp}><StampBadge size={64} variant="clay" icon="check" caption={MODES[item.mode].doneStamp} rotation="-10deg" /></View> : null}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.code}>{item.code} · {MODES[item.mode].label}</Text>
                    <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                    <View style={{ marginTop: 8 }}><PriceTag item={item} /></View>
                    <View style={{ marginTop: 10 }}><Chip label={conditionOf(item.condition).label} variant={conditionKey(item.condition)} /></View>
                  </View>
                  <View style={styles.actions}>
                    {!sold ? (
                      <Pressable onPress={() => onComplete(item)} hitSlop={6} style={styles.action} accessibilityRole="button" accessibilityLabel={`Marcar ${item.title} como ${MODES[item.mode].doneVerb}`}>
                        <Feather name="check-circle" size={20} color={colors.moss} />
                      </Pressable>
                    ) : null}
                    <Pressable onPress={() => onRemove(item)} hitSlop={6} style={styles.action} accessibilityRole="button" accessibilityLabel={`Remover ${item.title}`}>
                      <Feather name="trash-2" size={20} color={colors.clay} />
                    </Pressable>
                  </View>
                </Pressable>
              </View>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { gap: 16, justifyContent: 'space-between' },
  cell: { width: '100%' },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 16, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: 14 },
  thumb: { width: 92, height: 92, borderRadius: 12, overflow: 'hidden' },
  stamp: { position: 'absolute', top: 14, left: 14 },
  code: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkSoft, letterSpacing: 0.5 },
  title: { fontFamily: fonts.bodySemiBold, fontSize: 15, lineHeight: 20, color: colors.ink, marginTop: 4 },
  actions: { gap: 4 },
  action: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
