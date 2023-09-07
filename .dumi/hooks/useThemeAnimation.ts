import { useEffect, useRef } from 'react';
import { updateCSS } from 'rc-util/lib/Dom/dynamicCSS';

import theme from '../../components/theme';

const viewTransitionStyle = `
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

.dark::view-transition-old(root) {
  z-index: 1;
}

.dark::view-transition-new(root) {
  z-index: 999;
}

::view-transition-old(root) {
  z-index: 999;
}

::view-transition-new(root) {
  z-index: 1;
}
`;

const useThemeAnimation = () => {
  const {
    token: { colorBgElevated },
  } = theme.useToken();
  const animateRef = useRef<{
    isDark: boolean;
    event: MouseEvent | null;
  }>({
    isDark: false,
    event: null,
  });
  // @ts-ignore
  const isApiAvailable = typeof document.startViewTransition === 'function';

  const startAnimationTheme = () => {
    const { isDark, event } = animateRef.current;
    if (!(event && isApiAvailable)) return;
    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    document
      // @ts-ignore
      .startViewTransition(() => {
        const root = document.documentElement;
        root.classList.remove(isDark ? 'dark' : 'light');
        root.classList.add(isDark ? 'light' : 'dark');
      })
      .ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ];
        document.documentElement.animate(
          {
            clipPath: isDark ? [...clipPath].reverse() : clipPath,
          },
          {
            duration: 500,
            easing: 'ease-in',
            pseudoElement: isDark ? '::view-transition-old(root)' : '::view-transition-new(root)',
          },
        );
      });
  };

  const toggleAnimationTheme = (event: MouseEvent, isDark?: boolean) => {
    animateRef.current.isDark = isDark;
    animateRef.current.event = event;
  };

  // inject transition style
  useEffect(() => {
    if (isApiAvailable) {
      updateCSS(viewTransitionStyle, 'view-transition-style');
    }
  }, []);

  // start animation by light/dark change
  useEffect(() => {
    startAnimationTheme();
  }, [colorBgElevated]);

  return toggleAnimationTheme;
};

export default useThemeAnimation;
