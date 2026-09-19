import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import ConversationList from './ConversationList';
import ChatPanel from './ChatPanel';
import EmptyState from './EmptyState';
import { useApp } from '../context/AppContext';
import { goTop } from '../navigation/ref';


export default function ConversationsSplit({ navigation, initialId }) {
  const insets = useSafeAreaInsets();
  const { requests } = useApp();
  const data = [...requests].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const [selected, setSelected] = useState(initialId || null);
  const current = data.find((r) => r.id === selected) || data[0];

  if (!current) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <EmptyState icon="message-circle" variant="mustard" title="Nenhuma conversa ainda" text="Quando você pedir ou receber um item, a conversa aparece aqui." actionLabel="Explorar itens" onAction={() => goTop('Home')} />
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.left}>
        <View style={{ paddingTop: insets.top + 32, paddingHorizontal: 20, paddingBottom: 20 }}>
          <Text style={styles.title} accessibilityRole="header">Conversas</Text>
          <Text style={styles.sub}>SOLICITAÇÕES DE DOAÇÃO, TROCA E VENDA</Text>
        </View>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
          <ConversationList data={data} selectedId={current.id} onSelect={setSelected} />
        </ScrollView>
      </View>
      <View style={styles.right}>
        <ChatPanel key={current.id} req={current} embedded onOpenItem={() => navigation.navigate('ItemDetail', { id: current.itemId })} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, flexDirection: 'row' },
  left: { width: 360, borderRightWidth: 1, borderRightColor: colors.line },
  right: { flex: 1, backgroundColor: colors.bg },
  title: { fontFamily: fonts.displayBold, fontSize: 30, color: colors.ink, letterSpacing: -0.4 },
  sub: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1, color: colors.inkSoft, marginTop: 6 },
});
