'use client';

import React from 'react';
import { AppRoute, Locale } from '@/types';

interface DesktopHeaderProps {
  currentRoute: AppRoute;
  onRouteChange: (route: AppRoute) => void;
  locale: Locale;
  onLocaleToggle: () => void;
  isPaused: boolean;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  currentRoute,
  onRouteChange,
  locale,
  onLocaleToggle,
  isPaused,
}) => {
  return (
    <header className="web-desktop-header" id="web-desktop-header">
      <div className="web-header-inner">
        {/* Brand Logo & Name */}
        <div className="web-header-left">
          <div
            className="web-brand-cluster cursor-pointer"
            onClick={() => onRouteChange('/')}
            role="button"
            tabIndex={0}
          >
            <div className="web-logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className="web-brand-text">
              <span className="web-brand-name">AegisPath</span>
              <span className="web-brand-tag">AI Agent Digital Wallet</span>
            </div>
          </div>
          <span className="pill-testnet">Testnet 测试网</span>
        </div>

        {/* 6 Core Functional Navigation Items (No /art) */}
        <nav className="web-header-nav" aria-label="Desktop Navigation">
          <button
            className={`web-nav-btn ${currentRoute === '/' ? 'active' : ''}`}
            onClick={() => onRouteChange('/')}
            aria-current={currentRoute === '/' ? 'page' : undefined}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
            <span className="web-nav-label">{locale === 'zh' ? '首页' : 'Home'}</span>
            <span className="web-nav-sub">{locale === 'zh' ? 'Home' : '首页'}</span>
          </button>

          <button
            className={`web-nav-btn ${currentRoute === '/tuition' ? 'active' : ''}`}
            onClick={() => onRouteChange('/tuition')}
            aria-current={currentRoute === '/tuition' ? 'page' : undefined}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            <span className="web-nav-label">{locale === 'zh' ? '缴纳学费' : 'Pay Tuition'}</span>
            <span className="web-nav-sub">{locale === 'zh' ? 'Tuition' : '学费'}</span>
          </button>

          <button
            className={`web-nav-btn ${currentRoute === '/chat' ? 'active' : ''}`}
            onClick={() => onRouteChange('/chat')}
            aria-current={currentRoute === '/chat' ? 'page' : undefined}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="web-nav-label">{locale === 'zh' ? '智能体' : 'Ask Chop'}</span>
            <span className="web-nav-sub">{locale === 'zh' ? 'Ask Chop' : '问智能体'}</span>
          </button>

          <button
            className={`web-nav-btn ${currentRoute === '/evidence' ? 'active' : ''}`}
            onClick={() => onRouteChange('/evidence')}
            aria-current={currentRoute === '/evidence' ? 'page' : undefined}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            </svg>
            <span className="web-nav-label">{locale === 'zh' ? '财力证明' : 'Evidence'}</span>
            <span className="web-nav-sub">{locale === 'zh' ? 'Evidence' : '证明包'}</span>
          </button>

          <button
            className={`web-nav-btn ${currentRoute === '/safety' ? 'active' : ''}`}
            onClick={() => onRouteChange('/safety')}
            aria-current={currentRoute === '/safety' ? 'page' : undefined}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="web-nav-label">{locale === 'zh' ? '安全防护' : 'Safety'}</span>
            <span className="web-nav-sub">{locale === 'zh' ? 'Safety' : '三环防护'}</span>
          </button>

          <button
            className={`web-nav-btn ${currentRoute === '/planner' ? 'active' : ''}`}
            onClick={() => onRouteChange('/planner')}
            aria-current={currentRoute === '/planner' ? 'page' : undefined}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <span className="web-nav-label">{locale === 'zh' ? '现金流规划' : 'Planner'}</span>
            <span className="web-nav-sub">{locale === 'zh' ? 'Planner' : '资金线'}</span>
          </button>
        </nav>

        {/* User Status, Notification Bell, User Badge, Language Switcher */}
        <div className="web-header-right">
          <div className="agent-status-indicator" title={isPaused ? 'Agent Paused' : 'Agent Ready'}>
            <span className={`status-dot ${isPaused ? 'paused' : 'active'}`} />
            <span className="status-label">
              {isPaused
                ? locale === 'zh'
                  ? '已暂停'
                  : 'Paused'
                : locale === 'zh'
                ? '在线就绪'
                : 'Active'}
            </span>
          </div>

          <button
            className="bell-btn"
            id="web-header-bell-btn"
            aria-label="Notifications"
            title="Notifications / 通知"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="bell-badge">2</span>
          </button>

          {/* User Profile Badge */}
          <div className="web-user-profile-badge" title="Authenticated Student Account">
            <div className="web-user-avatar">AY</div>
            <div className="web-user-info">
              <span className="web-user-name">Ayu</span>
              <span className="web-user-role">Student</span>
            </div>
          </div>

          <button
            className="lang-toggle-btn"
            id="lang-toggle-desktop"
            onClick={onLocaleToggle}
            title="Toggle Language / 切换语言"
          >
            <span className={locale === 'en' ? 'active' : ''}>EN</span>
            <span className="lang-sep">/</span>
            <span className={locale === 'zh' ? 'active' : ''}>中文</span>
          </button>
        </div>
      </div>
    </header>
  );
};
