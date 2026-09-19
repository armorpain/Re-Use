import React from 'react';
import Screen from '../components/Page';
import ConversationList from '../components/ConversationList';
import ConversationsSplit from '../components/ConversationsSplit';
import EmptyState from '../components/EmptyState';
import useBreakpoint from '../hooks/useBreakpoint';
import { useApp } from '../context/AppContext';
import { goTop } from '../navigation/ref';

export default function RequestsScreen({ navigation }) {
  const { isPhone } = useBreakpoint();
  const { requests } = useApp();

  if (!isPhone) return <ConversationsSplit navigation={navigation} />;

  const data = [...requests].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  return (
    <Screen title="Conversas" subtitle="DOAÇÃO, TROCA E VENDA" max="narrow">
      {data.length === 0 ? (
        <EmptyState icon="message-circle" variant="mustard" title="Nenhuma conversa ainda" text="Quando você pedir ou receber um item, a conversa aparece aqui." actionLabel="Explorar itens" onAction={() => goTop('Home')} />
      ) : (
        <ConversationList data={data} onSelect={(id) => navigation.navigate('Chat', { id })} />
      )}
    </Screen>
  );
}
