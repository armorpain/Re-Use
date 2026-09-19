// Seções principais do app e a qual delas cada tela pertence (para marcar o item ativo do menu)
export const NAV_ITEMS = [
  { key: 'Home', label: 'Início', icon: 'home' },
  { key: 'Favoritos', label: 'Favoritos', icon: 'heart' },
  { key: 'Anunciar', label: 'Anunciar', icon: 'plus', primary: true },
  { key: 'Conversas', label: 'Conversas', icon: 'message-circle' },
  { key: 'Perfil', label: 'Perfil', icon: 'user' },
];

export const TOP_LEVEL = ['Home', 'Favoritos', 'Anunciar', 'Conversas', 'Perfil'];

export const SECTION_BY_ROUTE = {
  Home: 'Home',
  ItemDetail: 'Home',
  Favoritos: 'Favoritos',
  Anunciar: 'Anunciar',
  Conversas: 'Conversas',
  Chat: 'Conversas',
  Perfil: 'Perfil',
  MyItems: 'Perfil',
  Settings: 'Perfil',
};
