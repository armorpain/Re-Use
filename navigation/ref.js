import { createNavigationContainerRef } from '@react-navigation/native';

export const navRef = createNavigationContainerRef();

// Troca de seção principal (Início, Favoritos...) limpando a pilha, sem empilhar telas
export function goTop(name) {
  if (navRef.isReady()) navRef.reset({ index: 0, routes: [{ name }] });
}

// Voltar; se não houver histórico (ex: página aberta direto pela URL), vai para o fallback
export function goBackOr(navigation, fallback = 'Home') {
  if (navigation.canGoBack()) navigation.goBack();
  else navigation.reset({ index: 0, routes: [{ name: fallback }] });
}
