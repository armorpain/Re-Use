import { colors } from '../theme/colors';

// Condicao do item. A chave "reparo" substitui a antiga "pecas" (ver LEGACY).
export const CONDITIONS = {
  novo: { label: 'Como novo', long: 'Como novo', tint: colors.moss },
  usado: { label: 'Usado', long: 'Usado · bom estado', tint: colors.mustardText },
  reparo: { label: 'Para reparo', long: 'Pede um reparo', tint: colors.clay },
};
const LEGACY = { pecas: 'reparo' };
export const conditionKey = (k) => (CONDITIONS[k] ? k : LEGACY[k] || 'usado');
export const conditionOf = (k) => CONDITIONS[conditionKey(k)];

// Tres jeitos de dar segunda vida a um item
export const MODES = {
  doar: { label: 'Doação', verb: 'Doar', icon: 'gift', cta: 'Pedir este item', publish: 'Publicar doação', doneStamp: 'DOADO', doneVerb: 'doado' },
  trocar: { label: 'Troca', verb: 'Trocar', icon: 'repeat', cta: 'Propor troca', publish: 'Publicar troca', doneStamp: 'TROCADO', doneVerb: 'trocado' },
  vender: { label: 'Venda', verb: 'Vender', icon: 'tag', cta: 'Tenho interesse', publish: 'Publicar venda', doneStamp: 'VENDIDO', doneVerb: 'vendido' },
};

export const CATEGORIES = [
  { id: 'roupas', label: 'Roupas', icon: 'shopping-bag' },
  { id: 'moveis', label: 'Móveis', icon: 'home' },
  { id: 'eletronicos', label: 'Eletrônicos', icon: 'smartphone' },
  { id: 'livros', label: 'Livros', icon: 'book' },
  { id: 'casa', label: 'Casa', icon: 'coffee' },
  { id: 'brinquedos', label: 'Brinquedos', icon: 'smile' },
  { id: 'esportes', label: 'Esportes', icon: 'activity' },
];
export const categoryById = (id) => CATEGORIES.find((c) => c.id === id) || { id: 'outros', label: 'Outros', icon: 'box' };

// Preco sugerido como fracao do valor de loja, para manter os anuncios acessiveis
export const SUGGEST_RATIO = { novo: 0.7, usado: 0.5, reparo: 0.25 };

export const PRICE_STEPS = [50, 100, 200];
