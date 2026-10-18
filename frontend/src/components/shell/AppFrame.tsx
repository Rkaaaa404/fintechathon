'use client';

import React from 'react';
import { BottomNav } from './BottomNav';
import { AppRoute, Locale } from '@/types';

interface AppFrameProps {
  children: React.ReactNode;
  currentRoute: AppRoute;
  onRouteChange: (route: AppRoute) => void;
  locale: Locale;
}

export const AppFrame: React.FC<AppFrameProps> = ({
  children,
  currentRoute,
  onRouteChange,
  locale,
}) => {
  return (
    <div className="webapp-card-frame" id="app-frame" role="region" aria-label="AegisPath Web Application">
      {/* Scrollable Screen Viewport Area */}
      <div className="screen-viewport" id="screen-viewport">
        <div id="screen-container" className="screen-container">
          {children}
        </div>
      </div>

      {/* Persistent Bottom Navigation Area (visible automatically on mobile / <900px) */}
      <div id="bottom-nav-mount">
        <BottomNav
          currentRoute={currentRoute}
          onRouteChange={onRouteChange}
          locale={locale}
        />
      </div>
    </div>
  );
};
