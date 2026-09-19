/**
 * Escala de espaçamento (base 4px) e raios, conforme docs/design-system.html
 *
 * Ritmo vertical usado no app (Sprint 2):
 *   4  · ajuste fino entre ícone e texto
 *   8  · rotulo para campo, chip ao lado de chip
 *   12 · itens dentro de um grupo
 *   16 · entre campos / cards vizinhos
 *   24 · entre grupos de uma mesma seção
 *   32 · entre seções
 *   48 · respiro de topo/rodapé de página
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 12,   // botões, campos, chips pequenos
  md: 16,   // cards ("tag card")
  lg: 24,   // sheets e painéis
  pill: 999, // chips de status
};
