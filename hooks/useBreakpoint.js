import { useWindowDimensions } from 'react-native';
import { breakpoints, gutter, navWidth } from '../theme/layout';

export default function useBreakpoint() {
  const { width, height } = useWindowDimensions();
  const bp = width >= breakpoints.desktop ? 'desktop' : width >= breakpoints.tablet ? 'tablet' : 'phone';
  return {
    width,
    height,
    bp,
    isPhone: bp === 'phone',
    isTablet: bp === 'tablet',
    isDesktop: bp === 'desktop',
    isWide: bp !== 'phone',
    gutter: gutter[bp],
    navWidth: navWidth[bp],
  };
}
