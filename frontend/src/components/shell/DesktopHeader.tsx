'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  onLogout?: () => void;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  currentRoute,
  onRouteChange,
  locale,
  onLocaleToggle,
  isPaused,
  authUser,
  onLogout,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      type: 'action',
      titleEn: 'Tuition Payment Plan Ready',
      titleZh: '学费支付计划待审批',
      descEn: 'CNY 18,000 to Campus bursar via Fastest route is awaiting your review.',
      descZh: '通过最快路径向大学财务处支付 CNY 18,000 的计划等待您的审批。',
      timeEn: '10m ago',
      timeZh: '10分钟前',
      route: '/approve' as AppRoute,
      read: false,
    },
    {
      id: 'notif-2',
      type: 'security',
      titleEn: 'Invoice Tampering Blocked',
      titleZh: '发票篡改攻击已拦截',
      descEn: 'Privacy Gateway & Policy Engine dropped prompt injection attempt ($1,200). $0 lost.',
      descZh: '隐私网关与策略引擎成功拦截提示词注入攻击 ($1,200)，损失为 $0。',
      timeEn: '1h ago',
      timeZh: '1小时前',
      route: '/safety' as AppRoute,
      read: false,
    },
    {
      id: 'notif-3',
      type: 'policy',
      titleEn: 'Daily Spending Allowance',
      titleZh: '每日限额监控',
      descEn: 'Used $200 of $1,000 daily cap ($800 remaining). Resets in 6 hours.',
      descZh: '今日已使用 $200 / $1,000 额度（剩余 $800）。6小时后重置。',
      timeEn: 'Today',
      timeZh: '今日',
      route: '/planner' as AppRoute,
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notif: (typeof notifications)[0]) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    setIsNotifOpen(false);
    onRouteChange(notif.route);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    if (isMenuOpen || isNotifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, isNotifOpen]);
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
                <span className="pill-testnet text-[10.5px] font-bold bg-[#EEF4FF] text-[#1F3FA8] px-2 py-0.5 rounded-full border border-[#3D6BEA]/35 shadow-2xs">
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
            const isActive =
              currentRoute === item.route ||
              (item.route === '/evidence' && currentRoute === '/evidence-packs') ||
              (item.route === '/safety' && (currentRoute === '/safety-rules' || currentRoute === '/safety-logs'));
            const Icon = item.Icon;
            const label = locale === 'zh' ? item.labelZh : item.labelEn;
            return (
              <button
                key={item.route}
                className={`web-nav-btn flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12.5px] font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'active bg-[#EEF4FF] text-[#1C3EAA] shadow-xs'
                    : 'text-[#1E293B] hover:text-[#1C3EAA] hover:bg-[#F4F7FE]'
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

          {/* Visible Bell Notification Button & Popover */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-1.5 rounded-full border border-[#CBD5E1] bg-[#F8FAFE] text-[#14213D] hover:bg-[#EEF4FF] hover:border-[#1C3EAA] transition-all relative flex items-center justify-center cursor-pointer shadow-2xs"
              id="web-header-bell-btn"
              aria-label="Notifications"
              aria-expanded={isNotifOpen}
              title={locale === 'zh' ? '系统通知' : 'System Notifications'}
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
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D97706] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Popover Drawer */}
            {isNotifOpen && (
              <div
                id="header-notification-popover"
                className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-xl shadow-xl border border-[#CBD5E1] py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                {/* Popover Header */}
                <div className="px-3.5 py-2 border-b border-[#E2E8F0] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-[#14213D]">
                      {locale === 'zh' ? '系统安全与交易通知' : 'System & Security Alerts'}
                    </span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-bold bg-[#FEF3C7] text-[#92400E] px-1.5 py-0.5 rounded-full">
                        {unreadCount} {locale === 'zh' ? '未读' : 'new'}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      id="btn-mark-all-read"
                      onClick={markAllRead}
                      className="text-[11px] font-semibold text-[#1C3EAA] hover:underline cursor-pointer"
                    >
                      {locale === 'zh' ? '全部标为已读' : 'Mark all read'}
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="divide-y divide-[#F1F5F9] max-h-72 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`px-3.5 py-2.5 hover:bg-[#F8FAFC] transition-colors cursor-pointer flex gap-2.5 items-start ${
                        !notif.read ? 'bg-[#F0FDF4]/40' : ''
                      }`}
                    >
                      {/* Status Icon */}
                      <div className="mt-0.5 shrink-0">
                        {notif.type === 'action' ? (
                          <div className="w-6 h-6 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center font-bold text-[12px]">
                            ⚡
                          </div>
                        ) : notif.type === 'security' ? (
                          <div className="w-6 h-6 rounded-full bg-[#EBF7EE] text-[#0E6E43] flex items-center justify-center font-bold text-[12px]">
                            🛡️
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-[#EFF6FF] text-[#1C3EAA] flex items-center justify-center font-bold text-[12px]">
                            💳
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span
                            className={`text-[12px] truncate ${
                              !notif.read ? 'font-bold text-[#0F172A]' : 'font-semibold text-[#334155]'
                            }`}
                          >
                            {locale === 'zh' ? notif.titleZh : notif.titleEn}
                          </span>
                          <span className="text-[10px] text-[#94A3B8] shrink-0">
                            {locale === 'zh' ? notif.timeZh : notif.timeEn}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#475569] leading-snug line-clamp-2">
                          {locale === 'zh' ? notif.descZh : notif.descEn}
                        </p>
                      </div>

                      {/* Unread dot indicator */}
                      {!notif.read && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#1C3EAA] shrink-0 mt-1.5" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer link */}
                <div className="px-3.5 py-1.5 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center text-[10.5px] text-[#64748B]">
                  <span>{locale === 'zh' ? '由确定性安全内核驱动' : 'Protected by Safety Kernel'}</span>
                  <span className="text-[#0E6E43] font-semibold">● Testnet Live</span>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Badge & Interactive Popover */}
          {authUser?.isAuthenticated !== false ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                id="header-user-menu-btn"
                className="web-user-profile-badge flex items-center gap-1.5 pl-1 pr-2 py-0.5 rounded-full bg-[#F8FAFE] border border-[#CBD5E1] hover:border-[#1C3EAA] transition-all cursor-pointer shadow-2xs"
                title={
                  locale === 'zh'
                    ? `已认证学生账户: ${authUser?.name || 'Ayu'} (点击展开菜单)`
                    : `Authenticated Student: ${authUser?.name || 'Ayu'} (Click for profile menu)`
                }
                aria-expanded={isMenuOpen}
                aria-haspopup="true"
              >
                <div className="web-user-avatar w-6 h-6 rounded-full bg-gradient-to-br from-[#1C3EAA] to-[#2554D7] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {authUser?.avatarLetter || 'AY'}
                </div>
                <span className="web-user-name text-[12px] font-bold text-[#14213D] leading-none">
                  {authUser?.name || 'Ayu'}
                </span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className={`text-[#64748B] transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {/* User Menu Popover */}
              {isMenuOpen && (
                <div
                  id="header-user-popover"
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#CBD5E1] py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  {/* User Info Header */}
                  <div className="px-3.5 py-2.5 border-b border-[#E2E8F0] flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1C3EAA] to-[#2554D7] text-white text-[13px] font-bold flex items-center justify-center shadow-xs shrink-0">
                      {authUser?.avatarLetter || 'AY'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-bold text-[#14213D] truncate">
                        {authUser?.name || (authUser?.provider === 'google' ? 'Google User' : 'Ayu Sutanto')}
                      </div>
                      <div className="text-[11px] text-[#475569] truncate">
                        {authUser?.email || (authUser?.provider === 'google' ? 'user@gmail.com' : 'ayu.sutanto@connect.ust.hk')}
                      </div>
                      {authUser?.provider === 'google' ? (
                        <div className="text-[10px] font-semibold text-[#1A73E8] bg-[#EEF4FF] inline-block px-1.5 py-0.2 rounded mt-0.5">
                          {locale === 'zh' ? '● Google 演示资料 · 合成数据' : '● Google Demo Profile · Synthetic Data'}
                        </div>
                      ) : (
                        <div className="text-[10px] font-semibold text-[#D97706] bg-[#FFFBEB] inline-block px-1.5 py-0.2 rounded mt-0.5">
                          ● Guest Mode · Synthetic Demo Data
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onRouteChange('/login');
                      }}
                      className="w-full text-left px-3.5 py-2 text-[12px] font-medium text-[#334155] hover:bg-[#F1F5F9] flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <span>{locale === 'zh' ? '切换账户 / 登录页' : 'Switch Account / Login'}</span>
                    </button>

                    <button
                      id="header-btn-logout"
                      onClick={() => {
                        setIsMenuOpen(false);
                        if (onLogout) onLogout();
                      }}
                      className="w-full text-left px-3.5 py-2 text-[12px] font-semibold text-[#DC2626] hover:bg-[#FEF2F2] flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      <span>{locale === 'zh' ? '退出登录 (Sign Out)' : 'Sign Out / Log Out'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
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
            <span className={locale === 'en' ? 'text-[#1C3EAA] font-bold' : 'text-[#334155]'}>
              EN
            </span>
            <span className="text-[#94A3B8]">/</span>
            <span className={locale === 'zh' ? 'text-[#1C3EAA] font-bold' : 'text-[#334155]'}>
              中文
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
