import useBreakpoint from './useBreakpoint';
import { maxWidth } from '../theme/layout';

/**
 * Calcula quantas colunas cabem e a largura de cada card.
 * Celular: 2 colunas · tablet: 3 · desktop: 4 a 6, sempre a partir da largura real.
 */
export default function useGrid({ minCard = 164, max = maxWidth.wide } = {}) {
  const { width, navWidth, gutter, isPhone } = useBreakpoint();
  const gap = isPhone ? 12 : 16;
  const contentW = Math.min(width - navWidth, max) - gutter * 2;
  const cols = Math.max(2, Math.floor((contentW + gap) / (minCard + gap)));
  const cardW = Math.floor((contentW - gap * (cols - 1)) / cols);
  return { cols, cardW, gap, contentW, gutter };
}
