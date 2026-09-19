/**
 * Regras de layout responsivo (Sprint 2).
 *  phone   (menos de 600): 1 coluna de conteudo, barra de abas embaixo
 *  tablet  (600 a 1023): grade de 3 colunas, navegacao lateral compacta (rail)
 *  desktop (1024 ou mais): grade de 4+ colunas, menu lateral completo, telas em 2 colunas
 */
export const breakpoints = { tablet: 600, desktop: 1024 };

export const gutter = { phone: 16, tablet: 24, desktop: 32 };

export const navWidth = { phone: 0, tablet: 88, desktop: 248 };

// larguras máximas do conteúdo, para o texto nunca esticar de ponta a ponta
export const maxWidth = { narrow: 560, content: 960, wide: 1200 };
