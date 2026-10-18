'use client';

import { useSyncExternalStore } from 'react';

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mediaQuery = window.matchMedia('(min-width: 900px)');
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

function getSnapshot() {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(min-width: 900px)').matches;
}

function getServerSnapshot() {
  return true;
}

export function useIsDesktop(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
