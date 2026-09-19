import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import EmptyState from '../components/EmptyState';
import ItemCard from '../components/ItemCard';
import useBreakpoint from '../hooks/useBreakpoint';
import useGrid from '../hooks/useGrid';
import { useApp } from '../context/AppContext';
import { goTop } from '../navigation/ref';

export default function FavoritesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { isPhone } = useBreakpoint();
  const { cols, cardW, gap, contentW, gutter } = useGrid();
  const { items, favorites, toggleFavorite } = useApp();
  const data = items.filter((i) => favorites.includes(i.id) && i.status !== 'concluido');

  const header = (
    <View style={{ paddingTop: insets.top + (isPhone ? 16 : 40), paddingBottom: 24 }}>
      <Text style={[styles.title, !isPhone && { fontSize: 34 }]} accessibilityRole="header">Favoritos</Text>
      <Text style={styles.sub}>{data.length} {data.length === 1 ? 'ITEM SALVO' : 'ITENS SALVOS'}</Text>
    </View>
  );

  return (
    <FlatList
      key={cols}
      data={data}
      keyExtractor={(i) => i.id}
      numColumns={cols}
      columnWrapperStyle={{ gap }}
      ItemSeparatorComponent={() => <View style={{ height: gap }} />}
      contentContainerStyle={{ alignSelf: 'center', width: '100%', maxWidth: contentW + gutter * 2, paddingHorizontal: gutter, paddingBottom: 48, flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={header}
      renderItem={({ item }) => (
        <ItemCard item={item} width={cardW} favorite onToggleFavorite={() => toggleFavorite(item.id)} onPress={() => navigation.navigate('ItemDetail', { id: item.id })} />
      )}
      ListEmptyComponent={
        <EmptyState
          icon="heart"
          variant="clay"
          title="Você ainda não salvou nada"
          text="Toque no coração de um item para guardá-lo aqui e não perder de vista."
          actionLabel="Ver itens"
          onAction={() => goTop('Home')}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.displayBold, fontSize: 30, color: colors.ink, letterSpacing: -0.5 },
  sub: { fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1, color: colors.inkSoft, marginTop: 6 },
});
