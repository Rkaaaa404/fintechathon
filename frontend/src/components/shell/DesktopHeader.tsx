'use client';

import React from 'react';
import { AppRoute, Locale } from '@/types';
import {
  AegisShieldIcon,
  HomeVaultIcon,
  TuitionGradCapIcon,
  AskChopBotIcon,
  EvidenceDocIcon,
  SafetyRingsIcon,
  PlannerRunwayIcon,
} from '@/components/icons/AegisIcons';

export interface HeaderAuthUser {
  name: string;
  email: string;
  university?: string;
  avatarLetter: string;
  provider: 'google' | 'aegispath' | 'guest';
  isAuthenticated: boolean;
}

interface DesktopHeaderProps {
  currentRoute: AppRoute;
  onRouteChange: (route: AppRoute) => void;
  locale: Locale;
  onLocaleToggle: () => void;
  isPaused: boolean;
  authUser?: HeaderAuthUser | null;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  currentRoute,
  onRouteChange,
  locale,
  onLocaleToggle,
  isPaused,
  authUser,
}) => {
  const navItems = [
    {
      route: '/' as AppRoute,
      labelEn: 'Home',
      labelZh: '首页',
      Icon: HomeVaultIcon,
    },
    {
      route: '/tuition' as AppRoute,
      labelEn: 'Pay Tuition',
      labelZh: '缴纳学费',
      Icon: TuitionGradCapIcon,
    },
    {
      route: '/chat' as AppRoute,
      labelEn: 'Ask Chop',
      labelZh: '问智能体',
      Icon: AskChopBotIcon,
    },
    {
      route: '/evidence' as AppRoute,
      labelEn: 'Evidence',
      labelZh: '财力证明',
      Icon: EvidenceDocIcon,
    },
    {
      route: '/safety' as AppRoute,
      labelEn: 'Safety',
      labelZh: '安全防护',
      Icon: SafetyRingsIcon,
    },
    {
      route: '/planner' as AppRoute,
      labelEn: 'Planner',
      labelZh: '资金规划',
      Icon: PlannerRunwayIcon,
    },
  ];

  return (
    <header className="web-desktop-header" id="web-desktop-header">
      <div className="web-header-inner flex items-center justify-between w-full min-w-0 gap-3">
        {/* Brand Logo & Name (Left) */}
        <div className="web-header-left flex items-center gap-2.5 shrink-0">
          <div
            className="web-brand-cluster cursor-pointer flex items-center gap-2.5 group"
            onClick={() => onRouteChange('/')}
            role="button"
            tabIndex={0}
            title={locale === 'zh' ? 'AegisPath - 跨境学生数字钱包' : 'AegisPath - Cross-Border Student Wallet'}
          >
            <div className="web-logo-icon w-8 h-8 rounded-[8px] overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 shadow-sm">
              <img
                src="/brand/aegis-logo.png"
                alt="AegisPath Shield Logo"
                className="w-full h-full object-contain"
                width={32}
                height={32}
              />
            </div>
            <div className="web-brand-text flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="web-brand-name font-bold text-[16px] text-[#14213D] tracking-tight leading-tight">
                  AegisPath
                </span>
                <span className="pill-testnet text-[10px] font-bold bg-[#EEF4FF] text-[#1F3FA8] px-1.5 py-0.5 rounded-full border border-[#3D6BEA]/20">
                  {locale === 'zh' ? '测试网' : 'Testnet'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Core Functional Navigation Items with Bespoke Icons (Center) */}
        <nav
          className="web-header-nav flex items-center gap-1 min-w-0"
          aria-label="Desktop Navigation"
        >
          {navItems.map((item) => {
            const isActive = currentRoute === item.route;
            const Icon = item.Icon;
            const label = locale === 'zh' ? item.labelZh : item.labelEn;
            return (
              <button
                key={item.route}
                className={`web-nav-btn flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12.5px] font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'active bg-[#EEF4FF] text-[#1C3EAA] shadow-xs'
                    : 'text-[#475569] hover:text-[#1C3EAA] hover:bg-[#F4F7FE]'
                }`}
                onClick={() => onRouteChange(item.route)}
                aria-current={isActive ? 'page' : undefined}
                title={label}
              >
                <Icon size={16} color="currentColor" />
                <span className="web-nav-label">
                  {label}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1C3EAA] ml-0.5" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Status, Notification Bell, User Badge, Language Switcher (Right) */}
        <div className="web-header-right flex items-center gap-2 shrink-0 ml-auto">
          {/* AI Agent Realtime Guard Status */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-semibold border transition-all ${
              isPaused
                ? 'bg-[#FEF2F2] border-[#B91C1C]/25 text-[#B91C1C]'
                : 'bg-[#EBF7EE] border-[#0E6E43]/25 text-[#0E6E43]'
            }`}
            title={isPaused ? 'AI Agent Paused' : 'AI Agent Actively Guarding (3/3 Layers Locked)'}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isPaused ? 'bg-[#B91C1C]' : 'bg-[#0E6E43]'
              }`}
            />
            <span>
              {isPaused
                ? locale === 'zh'
                  ? '已暂停'
                  : 'Paused'
                : locale === 'zh'
                ? '智能体守护中'
                : 'Guarding'}
            </span>
          </div>

          {/* Visible Bell Notification Button */}
          <button
            className="p-1.5 rounded-full border border-[#E6ECF8] bg-[#F8FAFE] text-[#14213D] hover:bg-[#EEF4FF] transition-all relative flex items-center justify-center cursor-pointer"
            id="web-header-bell-btn"
            aria-label="Notifications"
            title={locale === 'zh' ? '通知' : 'Notifications'}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-[#D97706] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              2
            </span>
          </button>

          {/* User Profile Badge or Sign In Button */}
          {authUser?.isAuthenticated !== false ? (
            <button
              onClick={() => onRouteChange('/login')}
              className="web-user-profile-badge flex items-center gap-1.5 pl-1 pr-2 py-0.5 rounded-full bg-[#F8FAFE] border border-[#E6ECF8] hover:border-[#1C3EAA]/40 transition-all cursor-pointer shadow-2xs"
              title={
                locale === 'zh'
                  ? `已认证学生账户: ${authUser?.name || 'Ayu'} (点击管理账户)`
                  : `Authenticated Student: ${authUser?.name || 'Ayu'} (Click to manage)`
              }
            >
              <div className="web-user-avatar w-6 h-6 rounded-full bg-gradient-to-br from-[#1C3EAA] to-[#2554D7] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {authUser?.avatarLetter || 'AY'}
              </div>
              <span className="web-user-name text-[12px] font-bold text-[#14213D] leading-none">
                {authUser?.name || 'Ayu'}
              </span>
            </button>
          ) : (
            <button
              onClick={() => onRouteChange('/login')}
              className="px-3 py-1 rounded-full bg-[#1C3EAA] text-white text-[12px] font-semibold hover:bg-[#153285] transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <span>{locale === 'zh' ? '登录' : 'Sign In'}</span>
            </button>
          )}

          {/* Language Switcher */}
          <button
            className="lang-toggle-btn px-2 py-1 rounded-full border border-[#E6ECF8] bg-[#F8FAFE] text-[11px] font-semibold text-[#334155] hover:bg-[#EEF4FF] transition-all flex items-center gap-1 cursor-pointer"
            id="lang-toggle-desktop"
            onClick={onLocaleToggle}
            title={locale === 'zh' ? '切换语言' : 'Toggle Language'}
          >
            <span className={locale === 'en' ? 'text-[#1C3EAA] font-bold' : 'text-[#64748B]'}>
              EN
            </span>
            <span className="text-[#CBD5E1]">/</span>
            <span className={locale === 'zh' ? 'text-[#1C3EAA] font-bold' : 'text-[#64748B]'}>
              中文
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
