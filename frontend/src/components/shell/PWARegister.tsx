'use client';

import { useEffect } from 'react';

/**
 * PWARegister component:
 * Registers the AegisPath Service Worker asynchronously after window load
 * to ensure zero degradation to initial paint and Core Web Vitals (LCP/INP).
 */
export const PWARegister: React.FC = () => {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('[PWA] AegisPath Service Worker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.warn('[PWA] Service Worker registration failed:', error);
          });
      });
    }
  }, []);

  return null;
};
