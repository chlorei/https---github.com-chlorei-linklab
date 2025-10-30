"use client";
import { useEffect, useState } from 'react';

export function useAdaptiveFont() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setIsMobile(width <= 480 && height <= 926);
      setIsTablet(width > 480 && width <= 768);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const getFontSize = (size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl') => {
    if (isMobile) {
      const mobileSizes = {
        xs: '0.625rem', sm: '0.75rem', base: '0.875rem', lg: '1rem',
        xl: '1.125rem', '2xl': '1.25rem', '3xl': '1.5rem', '4xl': '1.875rem',
        '5xl': '2.25rem', '6xl': '3rem'
      };
      return mobileSizes[size];
    }
    
    if (isTablet) {
      const tabletSizes = {
        xs: '0.7rem', sm: '0.8rem', base: '0.95rem', lg: '1.05rem',
        xl: '1.15rem', '2xl': '1.35rem', '3xl': '1.7rem', '4xl': '2rem',
        '5xl': '2.7rem', '6xl': '3.4rem'
      };
      return tabletSizes[size];
    }

    const desktopSizes = {
      xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem',
      xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem',
      '5xl': '3rem', '6xl': '3.75rem'
    };
    return desktopSizes[size];
  };

  return { isMobile, isTablet, getFontSize };
}