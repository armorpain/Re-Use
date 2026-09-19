import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, FlatList, ScrollView, TextInput, Pressable, RefreshControl, Platform, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { radius } from '../theme/spacing';
import { MODES, CONDITIONS, CATEGORIES, PRICE_STEPS } from '../data/catalog';
import { applyFilters } from '../utils/filters';
import FilterChip from '../components/FilterChip';
import EmptyState from '../components/EmptyState';
import StampBadge from '../components/StampBadge';
import ItemCard from '../components/ItemCard';
import Sheet from '../components/Sheet';
import PrimaryButton from '../components/PrimaryButton';
import useBreakpoint from '../hooks/useBreakpoint';
import useGrid from '../hooks/useGrid';
import { useApp } from '../context/AppContext';

const MODE_CHIPS = [{ value: 'todos', label: 'Tudo', icon: 'grid' }, ...Object.entries(MODES).map(([value, m]) => ({ value, label: m.label, icon: m.icon }))];

function Group({ label, children }) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={styles.groupLabel}>{label}</Text>
      <View style={styles.wrapRow}>{children}</View>
    </View>
  );
}

// Condição, preço máximo e ordenação: em Sheet no celular, em linha no tablet e desktop
function AdvancedFilters({ filters, setFilters }) {
  return (
    <>
      <Group label="Condição">
        <FilterChip label="Todas" selected={filters.cond === 'todos'} onPress={() => setFilters({ cond: 'todos' })} />
        {Object.entries(CONDITIONS).map(([k, v]) => (
          <FilterChip key={k} label={v.label} selected={filters.cond === k} onPress={() => setFilters({ cond: k })} />
        ))}
      </Group>
      {filters.mode === 'vender' ? (
        <Group label="Preço máximo">
          <FilterChip label="Qualquer" selected={!filters.maxPrice} onPress={() => setFilters({ maxPrice: null })} />
          {PRICE_STEPS.map((p) => (
            <FilterChip key={p} label={`Até R$ ${p}`} selected={filters.maxPrice === p} onPress={() => setFilters({ maxPrice: p })} />
          ))}
        </Group>
      ) : null}
      <Group label="Ordenar por">
        <FilterChip label="Mais recentes" icon="clock" selected={filters.sort === 'recentes'} onPress={() => setFilters({ sort: 'recentes' })} />
        <FilterChip label="Menor preço" icon="trending-down" selected={filters.sort === 'preco'} onPress={() => setFilters({ sort: 'preco' })} />
      </Group>
    </>
  );
}

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { isPhone } = useBreakpoint();
  const { cols, cardW, gap, contentW, gutter } = useGrid();
  const { user, items, favorites, toggleFavorite, filters, setFilters, resetFilters } = useApp();
  const [sheet, setSheet] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const data = useMemo(() => applyFilters(items, filters), [items, filters]);
  const advancedCount = (filters.cond !== 'todos' ? 1 : 0) + (filters.sort !== 'recentes' ? 1 : 0) + (filters.maxPrice ? 1 : 0);
  const hasFilter = !!filters.query || filters.mode !== 'todos' || filters.cat !== 'todas' || advancedCount > 0;
  const firstName = user ? user.name.split(' ')[0] : '';

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  }, []);

  const header = (
    <View style={{ paddingTop: insets.top + (isPhone ? 16 : 40), paddingBottom: 8 }}>
      <View style={styles.hello}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, !isPhone && { fontSize: 34 }]} numberOfLines={1}>Olá, {firstName}</Text>
          <Text style={styles.sub}>O que ganha uma segunda vida hoje?</Text>
        </View>
        {isPhone ? <StampBadge size={52} label="R" rotation="-6deg" /> : null}
      </View>

      <View style={styles.searchRow}>
        <View style={styles.search}>
          <Feather name="search" size={19} color={colors.inkSoft} />
          <TextInput
            style={[styles.searchInput, Platform_outline]}
            placeholder="Buscar por item ou bairro"
            placeholderTextColor={colors.placeholder}
            value={filters.query}
            onChangeText={(t) => setFilters({ query: t })}
            returnKeyType="search"
            accessibilityLabel="Buscar itens"
          />
          {filters.query ? (
            <Pressable onPress={() => setFilters({ query: '' })} hitSlop={12} accessibilityRole="button" accessibilityLabel="Limpar busca">
              <Feather name="x-circle" size={19} color={colors.inkSoft} />
            </Pressable>
          ) : null}
        </View>
        {isPhone ? (
          <Pressable onPress={() => setSheet(true)} style={[styles.filterBtn, advancedCount > 0 && { borderColor: colors.moss, backgroundColor: colors.highlightBg }]} accessibilityRole="button" accessibilityLabel="Mais filtros">
            <Feather name="sliders" size={20} color={colors.moss} />
            {advancedCount > 0 ? <View style={styles.filterDot}><Text style={styles.filterDotText}>{advancedCount}</Text></View> : null}
          </Pressable>
        ) : null}
      </View>

      {/* Tipo de anúncio: doação, troca ou venda */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -gutter, marginBottom: 12 }} contentContainerStyle={[styles.chipsRow, { paddingHorizontal: gutter }]}>
        {MODE_CHIPS.map((m) => (
          <FilterChip key={m.value} label={m.label} icon={m.icon} selected={filters.mode === m.value} onPress={() => setFilters({ mode: m.value, maxPrice: m.value === 'vender' ? filters.maxPrice : null })} />
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -gutter, marginBottom: 12 }} contentContainerStyle={[styles.chipsRow, { paddingHorizontal: gutter }]}>
        <FilterChip label="Todas as categorias" selected={filters.cat === 'todas'} onPress={() => setFilters({ cat: 'todas' })} />
        {CATEGORIES.map((c) => (
          <FilterChip key={c.id} label={c.label} icon={c.icon} selected={filters.cat === c.id} onPress={() => setFilters({ cat: filters.cat === c.id ? 'todas' : c.id })} />
        ))}
      </ScrollView>

      {!isPhone ? (
        <View style={{ marginTop: 20 }}>
          <AdvancedFilters filters={filters} setFilters={setFilters} />
        </View>
      ) : null}

      {/* Atalho para achados baratos */}
      {!hasFilter ? (
        <Pressable onPress={() => setFilters({ mode: 'vender', maxPrice: 50 })} style={styles.promo} accessibilityRole="button" accessibilityLabel="Ver achados até 50 reais">
          <View style={styles.promoIcon}><Feather name="tag" size={18} color={colors.moss} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.promoTitle}>Achados até R$ 50</Text>
            <Text style={styles.promoText}>Itens em ótimo estado por preços que cabem no bolso.</Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.moss} />
        </Pressable>
      ) : null}

      <View style={styles.countRow}>
        <Text style={styles.count}>{data.length} {data.length === 1 ? 'ITEM' : 'ITENS'}{hasFilter ? ' · FILTRADO' : ''}</Text>
        {hasFilter ? (
          <Pressable onPress={resetFilters} hitSlop={10} accessibilityRole="button" accessibilityLabel="Limpar filtros">
            <Text style={styles.clear}>Limpar filtros</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        key={cols}
        data={data}
        keyExtractor={(i) => i.id}
        numColumns={cols}
        columnWrapperStyle={{ gap }}
        ItemSeparatorComponent={() => <View style={{ height: gap }} />}
        contentContainerStyle={{ alignSelf: 'center', width: '100%', maxWidth: contentW + gutter * 2, paddingHorizontal: gutter, paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.moss} colors={[colors.moss]} />}
        ListHeaderComponent={header}
        renderItem={({ item }) => (
          <ItemCard
            item={item}
            width={cardW}
            favorite={favorites.includes(item.id)}
            onToggleFavorite={() => toggleFavorite(item.id)}
            onPress={() => navigation.navigate('ItemDetail', { id: item.id })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="search"
            title="Nada por aqui ainda"
            text={hasFilter ? 'Tente outra busca ou limpe os filtros para ver mais itens.' : 'Que tal anunciar o primeiro item?'}
            actionLabel={hasFilter ? 'Limpar filtros' : 'Anunciar item'}
            onAction={() => (hasFilter ? resetFilters() : navigation.navigate('Anunciar'))}
          />
        }
      />

      <Sheet visible={sheet} onClose={() => setSheet(false)} title="Filtros">
        <View style={{ marginTop: 12 }}>
          <AdvancedFilters filters={filters} setFilters={setFilters} />
        </View>
        <PrimaryButton label={`Ver ${data.length} ${data.length === 1 ? 'item' : 'itens'}`} onPress={() => setSheet(false)} />
        {advancedCount > 0 ? (
          <PrimaryButton label="Limpar filtros" variant="secondary" onPress={() => setFilters({ cond: 'todos', maxPrice: null, sort: 'recentes' })} style={{ marginTop: 12 }} />
        ) : null}
      </Sheet>
    </View>
  );
}

const Platform_outline = Platform.OS === 'web' ? { outlineStyle: 'none' } : null;

const styles = StyleSheet.create({
  hello: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  title: { fontFamily: fonts.displayBold, fontSize: 30, color: colors.ink, letterSpacing: -0.5 },
  sub: { fontFamily: fonts.body, fontSize: 15, color: colors.inkSoft, marginTop: 4 },
  searchRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  search: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.paper, borderWidth: 1.5, borderColor: colors.line, borderRadius: radius.sm, paddingHorizontal: 16, minHeight: 54, gap: 12 },
  searchInput: { flex: 1, fontFamily: fonts.body, fontSize: 16, color: colors.ink, paddingVertical: 12 },
  filterBtn: { width: 54, height: 54, borderRadius: radius.sm, borderWidth: 1.5, borderColor: colors.line, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center' },
  filterDot: { position: 'absolute', top: -6, right: -6, minWidth: 20, height: 20, borderRadius: 10, backgroundColor: colors.moss, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.bg },
  filterDotText: { fontFamily: fonts.monoSemiBold, fontSize: 10, color: colors.white },
  chipsRow: { gap: 8 },
  groupLabel: { fontFamily: fonts.bodySemiBold, fontSize: 13, color: colors.ink, marginBottom: 12 },
  wrapRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  promo: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.highlightBg, borderWidth: 1, borderColor: colors.highlightBorder, borderRadius: radius.md, padding: 16, marginTop: 12 },
  promoIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center' },
  promoTitle: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: colors.ink },
  promoText: { fontFamily: fonts.body, fontSize: 13, color: colors.inkSoft, marginTop: 2, lineHeight: 19 },
  countRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, marginBottom: 16 },
  count: { fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1, color: colors.inkSoft },
  clear: { fontFamily: fonts.bodySemiBold, fontSize: 13, color: colors.moss, textDecorationLine: 'underline' },
});
