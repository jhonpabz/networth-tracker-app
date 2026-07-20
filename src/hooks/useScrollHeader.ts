import { useEffect, useRef, useState } from 'react';

const SCROLL_THRESHOLD = 8;

export function useScrollHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 0) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current + SCROLL_THRESHOLD) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current - SCROLL_THRESHOLD) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isVisible;
}
