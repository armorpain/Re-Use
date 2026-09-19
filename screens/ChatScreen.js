import React from 'react';
import ChatPanel from '../components/ChatPanel';
import ConversationsSplit from '../components/ConversationsSplit';
import useBreakpoint from '../hooks/useBreakpoint';
import { useApp } from '../context/AppContext';
import { goBackOr } from '../navigation/ref';

export default function ChatScreen({ route, navigation }) {
  const { isPhone } = useBreakpoint();
  const { requests } = useApp();
  const req = requests.find((r) => r.id === route.params.id);

  if (!isPhone) return <ConversationsSplit navigation={navigation} initialId={route.params.id} />;
  if (!req) return null;

  return (
    <ChatPanel
      req={req}
      onBack={() => goBackOr(navigation, 'Conversas')}
      onOpenItem={() => navigation.navigate('ItemDetail', { id: req.itemId })}
    />
  );
}
