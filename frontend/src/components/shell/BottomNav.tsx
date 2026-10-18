'use client';

import React from 'react';
import { AppRoute, Locale } from '@/types';

interface BottomNavProps {
  currentRoute: AppRoute;
  onRouteChange: (route: AppRoute) => void;
  locale: Locale;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentRoute,
  onRouteChange,
  locale,
}) => {
  return (
    <nav className="bottom-nav-bar" id="bottom-nav" aria-label="Mobile Navigation">
      <button
        className={`nav-item ${currentRoute === '/' ? 'active' : ''}`}
        onClick={() => onRouteChange('/')}
        aria-current={currentRoute === '/' ? 'page' : undefined}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
        <span>
          <span className="label-primary">Home</span>
          <span className="label-sub">首页</span>
        </span>
      </button>

      <button
        className={`nav-item ${currentRoute === '/tuition' ? 'active' : ''}`}
        onClick={() => onRouteChange('/tuition')}
        aria-current={currentRoute === '/tuition' ? 'page' : undefined}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
        <span>
          <span className="label-primary">Tuition</span>
          <span className="label-sub">学费</span>
        </span>
      </button>

      <button
        className={`nav-item ${currentRoute === '/chat' ? 'active' : ''}`}
        onClick={() => onRouteChange('/chat')}
        aria-current={currentRoute === '/chat' ? 'page' : undefined}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span>
          <span className="label-primary">Ask Chop</span>
          <span className="label-sub">智能体</span>
        </span>
      </button>

      <button
        className={`nav-item ${currentRoute === '/evidence' ? 'active' : ''}`}
        onClick={() => onRouteChange('/evidence')}
        aria-current={currentRoute === '/evidence' ? 'page' : undefined}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <span>
          <span className="label-primary">Evidence</span>
          <span className="label-sub">证明</span>
        </span>
      </button>

      <button
        className={`nav-item ${currentRoute === '/safety' ? 'active' : ''}`}
        onClick={() => onRouteChange('/safety')}
        aria-current={currentRoute === '/safety' ? 'page' : undefined}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span>
          <span className="label-primary">Safety</span>
          <span className="label-sub">安全</span>
        </span>
      </button>
    </nav>
  );
};
