'use client';

import React from 'react';
import { ChopMascot } from '@/components/art/ChopMascot';
import { HeaderArt } from '@/components/art/HeaderArt';
import { FiveSegmentBar } from '@/components/art/FiveSegmentBar';
import { SEED_DATA, getAppDataForUser, UserProfileContext } from '@/lib/mockData';
import { t, b } from '@/lib/i18n';
import { AppRoute, Locale } from '@/types';
import SplitText from '@/components/SplitText';
import { Card, CardHeader, CardTitle, CardBadge, CardBody, CardFooter } from '@/components/ui/Card';
import {
  AegisShieldIcon,
  TuitionGradCapIcon,
  PlannerRunwayIcon,
  EvidenceDocIcon,
  SafetyRingsIcon,
  AskChopBotIcon,
  ArrowUpRightIcon,
  PayeesBookIcon,
  RatesExchangeIcon,
} from '@/components/icons/AegisIcons';

interface HomeScreenProps {
  locale: Locale;
  isPaused: boolean;
  onTogglePause: () => void;
  onNavigate: (route: AppRoute) => void;
  onShowToast?: (message: string) => void;
  emptyActivity?: boolean;
  authUser?: UserProfileContext;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  locale,
  isPaused,
  onTogglePause,
  onNavigate,
  onShowToast,
  emptyActivity = false,
  authUser,
}) => {
  const appData = getAppDataForUser(authUser);
  const user = appData.user;
  const tuition = appData.tuition;
  const activities = emptyActivity ? [] : appData.recentActivities;

  const [mascotThoughtIdx, setMascotThoughtIdx] = React.useState(0);
  const mascotThoughts = [
    {
      titleEn: "Hi Ayu!",
      titleZh: "Ayu 你好！",
      bodyEn: "All 3 security layers are active. Monitoring tuition buffers.",
      bodyZh: "三环安全已就绪，正在监控学费交割缓冲。",
    },
    {
      titleEn: "Corridor Alert ✨",
      titleZh: "汇率最优提示 ✨",
      bodyEn: "USD/CNY is currently within 0.2% of 30d optimal rate for tuition!",
      bodyZh: "当前美元/人民币处于近30日极佳汇率区间，建议按期缴纳！",
    },
    {
      titleEn: "Safety Guarantee 🛡️",
      titleZh: "确定性防护 🛡️",
      bodyEn: "0 prompt injection attacks can bypass bank-side limits on my watch.",
      bodyZh: "有我在，任何针对发票的恶意提示词注入都无法越过银行侧限额！",
    },
    {
      titleEn: "Family Send Ready ⚡",
      titleZh: "生活费即时汇款 ⚡",
      bodyEn: "Allowance to Mom is whitelisted for instant 1-click execution.",
      bodyZh: "给妈妈的生活费已在白名单中，点击转账即可秒级执行。",
    },
  ];

  const currentThought = mascotThoughts[mascotThoughtIdx % mascotThoughts.length];

  // Derive dynamic calculated numbers strictly from seed & planner models
  const tuitionDueCny = tuition.dueAmountCny; // 18,000
  const tuitionSendUsd = tuition.modes.cheapest.total.toFixed(2); // 2,534.30
  const isGoogle = authUser?.provider === 'google' && authUser?.isAuthenticated;
  const onTimePlan = SEED_DATA.plannerSchedule.scenarios.on_time;
  const janBar = onTimePlan.bars?.[3] || { total: 4.3, reserve: 1.1, runwayDays: '95d' };
  const plannerTotalFormatted = isGoogle
    ? '12,500.00'
    : (janBar.total * 1000).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }); // 4,300.00
  const plannerRunway = isGoogle ? '180d' : (janBar.runwayDays || '95d');

  return (
    <div className="home-screen pb-10 w-full">
      {/* ═══════════ LUMINOUS HERO HEADER (Max-width 1200px aligned) ═══════════ */}
      <header className="screen-header-blue home-header relative overflow-hidden rounded-[20px] p-6 md:p-8 w-full mb-6">
        <HeaderArt screenType="home" />

        <div className="header-content relative z-10 w-full">
          {/* Top Bar on Mobile */}
          <div className="header-topbar flex items-center justify-between mb-4 md:hidden">
            <div className="brand-row flex items-center gap-2">
              <SplitText
                text="AegisPath"
                tag="span"
                className="brand-title text-white font-bold text-[18px] tracking-tight"
                delay={25}
                duration={0.6}
                effect="fade"
              />
              <span className="pill-testnet-dark pill-testnet text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-white/40 shadow-xs">
                {isGoogle ? 'Live Verified' : (locale === 'zh' ? '测试网' : 'Testnet')}
              </span>
            </div>

            <div className="header-actions flex items-center gap-2">
              <button
                className="bell-btn p-1.5 text-white hover:text-white/80 transition-colors relative"
                aria-label="Notifications"
                title={locale === 'zh' ? '通知' : 'Notifications'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className="bell-badge absolute -top-1 -right-1 bg-[#D97706] text-white text-[11px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  2
                </span>
              </button>
            </div>
          </div>

          {/* Desktop & Mobile Responsive 2-Column Hero Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left Column: Greeting, Allowance, Quick Jump */}
            <div className="md:col-span-7 lg:col-span-8 pr-0 md:pr-4">
              <div className="hidden md:flex items-center gap-2 mb-2">
                {isGoogle ? (
                  <span className="text-[12px] font-semibold tracking-wide text-white bg-[#0E6E43]/90 px-3 py-1 rounded-full border border-white/30 flex items-center gap-1.5 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    <span>{locale === 'zh' ? 'Google 实名认证 · 真实账户' : 'Google Verified · Live Real Account'}</span>
                  </span>
                ) : (
                  <span className="text-[12px] font-semibold tracking-wide text-white bg-[#D97706]/90 px-3 py-1 rounded-full border border-white/30 flex items-center gap-1.5 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-[#FDE047] animate-pulse" />
                    <span>{locale === 'zh' ? '访客演示模式 · 合成测试数据' : 'Guest Demo Mode · Synthetic Testnet Data'}</span>
                  </span>
                )}
                {authUser?.email && (
                  <span className="text-[11.5px] text-white/85 font-medium">
                    {authUser.email}
                  </span>
                )}
              </div>

              {/* Personal Greeting to User */}
              <div className="home-hero-greeting text-white font-medium text-[16px] md:text-[18px] mb-3 flex items-baseline gap-2">
                <SplitText
                  key={user.name}
                  text={locale === 'zh' ? `欢迎回来，${user.name}` : `Welcome back, ${user.name}`}
                  tag="span"
                  className="text-white font-bold"
                  delay={20}
                  duration={0.5}
                  effect="fade"
                />
              </div>

              {/* Allowance Display */}
              <div className="home-allowance-block mb-4 max-w-[420px]">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="text-white font-semibold text-[13px] tracking-wide uppercase">
                    {locale === 'zh' ? '今日可用额度' : 'Daily Allowance'}
                  </span>
                  <span className="text-[11px] font-semibold text-white bg-[#0A1440] px-2.5 py-0.5 rounded-full border border-white/30 shadow-2xs">
                    {locale === 'zh' ? '6小时后重置' : 'Resets in 6h'}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="big-allowance-amount text-white text-[36px] md:text-[40px] font-semibold tabular-nums tracking-tight">
                    ${user.dailyAllowanceRemaining.toLocaleString('en-US')}
                  </span>
                  <span className="text-white text-[13px] font-semibold">
                    {locale === 'zh' ? `总额 $${user.dailyAllowanceTotal.toLocaleString('en-US')}` : `of $${user.dailyAllowanceTotal.toLocaleString('en-US')}`}
                  </span>
                </div>

                {/* 5-Segment Allowance Indicator Bar */}
                <FiveSegmentBar filledCount={isGoogle ? 5 : 4} total={5} />
              </div>

              {/* Quick Jump Action Pills */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => onNavigate('/tuition')}
                  className="px-4 py-2 rounded-full bg-white text-[#1C3EAA] font-bold text-[13px] shadow-sm hover:bg-[#F4F7FE] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <TuitionGradCapIcon size={15} color="#1C3EAA" />
                  <span>
                    {locale === 'zh'
                      ? `学费待缴 ¥${tuitionDueCny.toLocaleString('en-US')} →`
                      : `Pay Tuition: ¥${tuitionDueCny.toLocaleString('en-US')} Due →`}
                  </span>
                </button>

                <button
                  onClick={() => onNavigate('/planner')}
                  className="px-3.5 py-2 rounded-full bg-white/20 text-white font-semibold text-[13px] border border-white/30 hover:bg-white/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <PlannerRunwayIcon size={14} color="#FFFFFF" />
                  <span>
                    {locale === 'zh'
                      ? `资金缓冲规划 (${plannerRunway})`
                      : `Buffer Runway: ${plannerRunway}`}
                  </span>
                </button>
              </div>
            </div>

            {/* Right Column: Interactive Chop Companion Stage */}
            <div className="md:col-span-5 lg:col-span-4 flex flex-col items-center md:items-end justify-center mt-2 md:mt-0">
              <div className="companion-stage flex flex-col items-center text-center max-w-[320px] w-full relative">
                {/* Speech Bubble (Clickable to cycle thoughts) */}
                <div
                  onClick={() => setMascotThoughtIdx((prev) => prev + 1)}
                  className="speech-bubble-companion bg-white text-[#14213D] text-[12px] font-semibold p-3.5 rounded-[16px] shadow-sm mb-3 border border-[#E6ECF8] w-full relative cursor-pointer hover:border-[#3D6BEA] hover:shadow-md transition-all active:scale-98 group"
                  title="Click to chat with Chop!"
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[13px] font-bold text-[#1C3EAA]">
                      {locale === 'zh' ? currentThought.titleZh : currentThought.titleEn}
                    </span>
                    <span className="text-[10px] text-[#94A3B8] group-hover:text-[#3D6BEA] transition-colors">
                      tap 💬
                    </span>
                  </div>
                  <div className="text-[12px] text-[#1E293B] leading-relaxed">
                    {locale === 'zh' ? currentThought.bodyZh : currentThought.bodyEn}
                  </div>
                </div>

                {/* Substantial Mascot Element with Sparkles & Pulse */}
                <div
                  onClick={() => setMascotThoughtIdx((prev) => prev + 1)}
                  className="mascot-mount py-1 relative cursor-pointer active:scale-95 transition-transform"
                >
                  {/* Subtle Aura Halo */}
                  <div className="absolute inset-0 bg-[#6FD3FF]/20 rounded-full blur-md -z-10 animate-pulse" />
                  <ChopMascot
                    bodyColor="#FFFFFF"
                    faceColor="#DCE8FD"
                    expression={isPaused ? 'paused' : 'wave'}
                    size={84}
                    className="home-main-chop hover:scale-110 transition-transform duration-300 drop-shadow-md"
                  />
                </div>

                {/* Agent Guard Status & Styled Pause Button */}
                <div className="w-full pt-3 mt-1 flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-[#FF6B6F]' : 'bg-[#6FD3FF]'}`} />
                    <span>
                      {isPaused
                        ? locale === 'zh' ? '已暂停守护' : 'Agent Paused'
                        : locale === 'zh' ? '智能体在线守护' : 'Chop Guarding'}
                    </span>
                  </div>

                  <button
                    onClick={onTogglePause}
                    className={`px-3.5 py-1.5 rounded-full font-bold text-[12px] transition-all cursor-pointer shadow-xs ${
                      isPaused
                        ? 'bg-[#B91C1C] text-white hover:bg-[#A81E23]'
                        : 'bg-white text-[#1C3EAA] hover:bg-[#F4F7FE]'
                    }`}
                  >
                    {isPaused
                      ? locale === 'zh' ? '▶ 恢复' : '▶ Resume'
                      : locale === 'zh' ? '⏸ 暂停' : '⏸ Pause'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Kill Switch Alert Banner when Agent is Paused */}
      {isPaused && (
        <div className="w-full mb-6">
          <div className="p-4 bg-[#FFFBEB] border border-[#D97706]/40 rounded-[16px] text-[13px] text-[#8A5200] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8A5200" strokeWidth="2.2" className="shrink-0">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span className="leading-relaxed">
                {locale === 'zh'
                  ? '智能体已被紧急暂停。所有自主调度与转账请求已锁止。'
                  : 'AI agent is paused. All autonomous transfers and scheduling locked.'}
              </span>
            </div>
            <button
              onClick={onTogglePause}
              className="ml-3 font-bold underline cursor-pointer text-[#173595] text-[13px] shrink-0"
            >
              {locale === 'zh' ? '恢复运行' : 'Resume agent'}
            </button>
          </div>
        </div>
      )}

      {/* ═══════════ SAFETY KERNEL CARD (Refined Spacing & Balanced Typography) ═══════════ */}
      <section className="safety-kernel-section w-full mb-6">
        <Card variant="default" className="p-4 md:p-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Left: Title, Tag, Core Guarantee Wording & CTA */}
            <div className="md:col-span-5 flex flex-col justify-center gap-2.5 pr-0 md:pr-5 border-b md:border-b-0 md:border-r border-[rgba(15,23,42,0.06)] pb-4 md:pb-0">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-9 h-9 rounded-xl bg-[#EBF7EE] text-[#0E6E43] flex items-center justify-center border border-[#0E6E43]/20 shrink-0 shadow-xs">
                    <AegisShieldIcon size={18} color="#0E6E43" />
                  </div>
                  <CardTitle className="text-[16px] text-[#14213D] font-bold">
                    {locale === 'zh' ? '安全核心' : 'Safety kernel'}
                  </CardTitle>
                  <CardBadge variant="green">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0E6E43] mr-1.5 animate-pulse" />
                    {locale === 'zh' ? '3/3 层有效' : '3/3 layers active'}
                  </CardBadge>
                </div>

                <p className="text-[12.5px] text-[#334155] leading-relaxed max-w-sm">
                  {locale === 'zh'
                    ? '安全防护在语言模型外部独立执行，银行侧限额隔离保护资金。'
                    : 'Deterministic security rules run strictly outside the LLM. Bank-side limits protect funds.'}
                </p>
              </div>

              <div>
                <button
                  onClick={() => onNavigate('/safety')}
                  className="group inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] bg-[#F4F7FE] hover:bg-[#EEF4FF] text-[#1C3EAA] border border-[rgba(15,23,42,0.08)] hover:border-[#3D6BEA]/30 transition-all font-semibold text-[12.5px] cursor-pointer"
                >
                  <span>{locale === 'zh' ? '查看三环防护' : 'Inspect Kernel'}</span>
                  <span className="w-4 h-4 rounded-full bg-white text-[#1C3EAA] flex items-center justify-center text-[10px] shadow-xs group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                </button>
              </div>
            </div>

            {/* Right: Three Compact Layer Items with clean padding & symmetric status dots */}
            <div className="md:col-span-7 flex flex-col gap-2">
              {/* Item 1: Outer Privacy Filter */}
              <div className="py-2.5 px-3.5 rounded-[12px] bg-[#F8FAFC] border border-[rgba(15,23,42,0.06)] hover:bg-white transition-all flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-white text-[#1C3EAA] flex items-center justify-center shrink-0 border border-[#E6ECF8] shadow-xs">
                    <AegisShieldIcon size={14} color="#1C3EAA" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-[13px] text-[#14213D] block leading-tight">
                      {locale === 'zh' ? '外环 · 隐私过滤' : 'Outer · Privacy Filter'}
                    </span>
                    <span className="text-[11.5px] text-[#334155] font-medium block truncate mt-0.5">
                      {locale === 'zh'
                        ? '阻断提示词注入攻击，隐藏敏感身份凭据'
                        : 'Blocks prompt injections & redacts sensitive student PII'}
                    </span>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#0E6E43] shrink-0 shadow-xs" title="Active" />
              </div>

              {/* Item 2: Middle Spending Rules */}
              <div className="py-2.5 px-3.5 rounded-[12px] bg-[#F8FAFC] border border-[rgba(15,23,42,0.06)] hover:bg-white transition-all flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-white text-[#1C3EAA] flex items-center justify-center shrink-0 border border-[#E6ECF8] shadow-xs">
                    <SafetyRingsIcon size={14} color="#1C3EAA" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-[13px] text-[#14213D] block leading-tight">
                      {locale === 'zh' ? '中环 · 支出规则' : 'Middle · Spending Rules'}
                    </span>
                    <span className="text-[11.5px] text-[#334155] font-medium block truncate mt-0.5">
                      {locale === 'zh'
                        ? '强制每日 $1,000 额度，校验收款人白名单'
                        : 'Enforces $1,000/day allowance & verifies payee whitelist'}
                    </span>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#0E6E43] shrink-0 shadow-xs" title="Active" />
              </div>

              {/* Item 3: Inner Bank Limits */}
              <div className="py-2.5 px-3.5 rounded-[12px] bg-[#F8FAFC] border border-[rgba(15,23,42,0.06)] hover:bg-white transition-all flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-white text-[#1C3EAA] flex items-center justify-center shrink-0 border border-[#E6ECF8] shadow-xs">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1C3EAA" strokeWidth="2.2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-[13px] text-[#14213D] block leading-tight">
                      {locale === 'zh' ? '内环 · 银行限额' : 'Inner · Bank Limits'}
                    </span>
                    <span className="text-[11.5px] text-[#334155] font-medium block truncate mt-0.5">
                      {locale === 'zh'
                        ? '银行侧转账限额，模型外部独立锁定保护'
                        : 'Bank-side transfer limits outside agent control'}
                    </span>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#0E6E43] shrink-0 shadow-xs" title="Active" />
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* ═══════════ SERVICES SECTION (8-ICON GRID RESTORING PAYEES & RATES) ═══════════ */}
      <section className="services-section w-full mb-6">
        <div className="section-header-title mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-[18px] text-[#14213D] tracking-tight">
            {locale === 'zh' ? '服务' : 'Services'}
          </h2>
          <span className="text-[13px] text-[#334155] font-medium">
            {locale === 'zh' ? '跨境金融服务与智能调度' : 'Cross-border Student Services'}
          </span>
        </div>

        {/* 8-Icon Service Grid (Gojek-Style Reference) Restoring Payees and Rates */}
        <Card variant="default" className="p-4 md:p-5 mb-6">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4 items-start justify-items-center">
            {/* 1. Send */}
            <button
              onClick={() => {
                onShowToast?.(locale === 'zh' ? '打开个人汇款对话' : 'Opened Ask Chop for transfers');
                onNavigate('/chat');
              }}
              className="group flex flex-col items-center cursor-pointer w-full text-center focus:outline-none"
            >
              <div className="w-12 h-12 rounded-[16px] bg-[#F4F7FE] text-[#1C3EAA] flex items-center justify-center relative group-hover:bg-[#1C3EAA] group-hover:text-white transition-all shadow-xs">
                <ArrowUpRightIcon size={20} color="currentColor" />
                <span className="absolute -top-1.5 -right-1 bg-[#EEF4FF] text-[#1C3EAA] text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-[#3D6BEA]/20">
                  7.24
                </span>
              </div>
              <span className="text-[12px] md:text-[13px] font-semibold text-[#14213D] group-hover:text-[#1C3EAA] transition-colors mt-2 leading-tight">
                {locale === 'zh' ? '转账' : 'Send'}
              </span>
              <span className="text-[11px] text-[#334155] font-medium mt-0.5 leading-none">
                {locale === 'zh' ? '即时汇款' : 'Remit'}
              </span>
            </button>

            {/* 2. Tuition */}
            <button
              onClick={() => onNavigate('/tuition')}
              className="group flex flex-col items-center cursor-pointer w-full text-center focus:outline-none"
            >
              <div className="w-12 h-12 rounded-[16px] bg-[#F4F7FE] text-[#1C3EAA] flex items-center justify-center relative group-hover:bg-[#1C3EAA] group-hover:text-white transition-all shadow-xs">
                <TuitionGradCapIcon size={20} color="currentColor" />
                <span className="absolute -top-1.5 -right-1 bg-[#FFFBEB] text-[#D97706] text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-[#D97706]/20">
                  14d
                </span>
              </div>
              <span className="text-[12px] md:text-[13px] font-semibold text-[#14213D] group-hover:text-[#1C3EAA] transition-colors mt-2 leading-tight">
                {locale === 'zh' ? '学费' : 'Tuition'}
              </span>
              <span className="text-[11px] text-[#334155] font-medium mt-0.5 leading-none">
                {locale === 'zh' ? '跨境缴纳' : 'Pay'}
              </span>
            </button>

            {/* 3. Evidence */}
            <button
              onClick={() => onNavigate('/evidence')}
              className="group flex flex-col items-center cursor-pointer w-full text-center focus:outline-none"
            >
              <div className="w-12 h-12 rounded-[16px] bg-[#F4F7FE] text-[#1C3EAA] flex items-center justify-center relative group-hover:bg-[#1C3EAA] group-hover:text-white transition-all shadow-xs">
                <EvidenceDocIcon size={19} color="currentColor" />
                <span className="absolute -top-1.5 -right-1 bg-[#EBF7EE] text-[#0E6E43] text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-[#0E6E43]/20">
                  Tier 1
                </span>
              </div>
              <span className="text-[12px] md:text-[13px] font-semibold text-[#14213D] group-hover:text-[#1C3EAA] transition-colors mt-2 leading-tight">
                {locale === 'zh' ? '证明' : 'Evidence'}
              </span>
              <span className="text-[11px] text-[#334155] font-medium mt-0.5 leading-none">
                {locale === 'zh' ? '财力包' : 'Proof'}
              </span>
            </button>

            {/* 4. Safety */}
            <button
              onClick={() => onNavigate('/safety')}
              className="group flex flex-col items-center cursor-pointer w-full text-center focus:outline-none"
            >
              <div className="w-12 h-12 rounded-[16px] bg-[#F4F7FE] text-[#1C3EAA] flex items-center justify-center relative group-hover:bg-[#1C3EAA] group-hover:text-white transition-all shadow-xs">
                <SafetyRingsIcon size={19} color="currentColor" />
                <span className="absolute -top-1.5 -right-1 bg-[#EBF7EE] text-[#0E6E43] text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-[#0E6E43]/20">
                  3/3
                </span>
              </div>
              <span className="text-[12px] md:text-[13px] font-semibold text-[#14213D] group-hover:text-[#1C3EAA] transition-colors mt-2 leading-tight">
                {locale === 'zh' ? '安全' : 'Safety'}
              </span>
              <span className="text-[11px] text-[#334155] font-medium mt-0.5 leading-none">
                {locale === 'zh' ? '三环防御' : 'Kernel'}
              </span>
            </button>

            {/* 5. Payees */}
            <button
              onClick={() => onNavigate('/payees')}
              className="group flex flex-col items-center cursor-pointer w-full text-center focus:outline-none active:scale-95 transition-transform"
            >
              <div className="w-12 h-12 rounded-[16px] bg-[#F4F7FE] text-[#1C3EAA] flex items-center justify-center relative group-hover:bg-[#1C3EAA] group-hover:text-white transition-all shadow-xs group-hover:scale-105">
                <PayeesBookIcon size={19} color="currentColor" />
                <span className="absolute -top-1.5 -right-1 bg-[#EEF4FF] text-[#1C3EAA] text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-[#3D6BEA]/20">
                  3
                </span>
              </div>
              <span className="text-[12px] md:text-[13px] font-semibold text-[#14213D] group-hover:text-[#1C3EAA] transition-colors mt-2 leading-tight">
                {locale === 'zh' ? '收款人' : 'Payees'}
              </span>
              <span className="text-[11px] text-[#334155] font-medium mt-0.5 leading-none">
                {locale === 'zh' ? '白名单' : 'Allowed'}
              </span>
            </button>

            {/* 6. Rates */}
            <button
              onClick={() => onNavigate('/rates')}
              className="group flex flex-col items-center cursor-pointer w-full text-center focus:outline-none active:scale-95 transition-transform"
            >
              <div className="w-12 h-12 rounded-[16px] bg-[#F4F7FE] text-[#1C3EAA] flex items-center justify-center relative group-hover:bg-[#1C3EAA] group-hover:text-white transition-all shadow-xs group-hover:scale-105">
                <RatesExchangeIcon size={19} color="currentColor" />
                <span className="absolute -top-1.5 -right-1 bg-[#EEF4FF] text-[#1C3EAA] text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-[#3D6BEA]/20">
                  Live
                </span>
              </div>
              <span className="text-[12px] md:text-[13px] font-semibold text-[#14213D] group-hover:text-[#1C3EAA] transition-colors mt-2 leading-tight">
                {locale === 'zh' ? '汇率' : 'Rates'}
              </span>
              <span className="text-[11px] text-[#334155] font-medium mt-0.5 leading-none">
                {locale === 'zh' ? '中间价' : 'PBOC Mid'}
              </span>
            </button>

            {/* 7. Planner */}
            <button
              onClick={() => onNavigate('/planner')}
              className="group flex flex-col items-center cursor-pointer w-full text-center focus:outline-none"
            >
              <div className="w-12 h-12 rounded-[16px] bg-[#F4F7FE] text-[#1C3EAA] flex items-center justify-center relative group-hover:bg-[#1C3EAA] group-hover:text-white transition-all shadow-xs">
                <PlannerRunwayIcon size={19} color="currentColor" />
                <span className="absolute -top-1.5 -right-1 bg-[#EBF7EE] text-[#0E6E43] text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-[#0E6E43]/20">
                  95d
                </span>
              </div>
              <span className="text-[12px] md:text-[13px] font-semibold text-[#14213D] group-hover:text-[#1C3EAA] transition-colors mt-2 leading-tight">
                {locale === 'zh' ? '规划' : 'Planner'}
              </span>
              <span className="text-[11px] text-[#334155] font-medium mt-0.5 leading-none">
                {locale === 'zh' ? '现金缓冲' : 'Runway'}
              </span>
            </button>

            {/* 8. Ask Chop */}
            <button
              onClick={() => onNavigate('/chat')}
              className="group flex flex-col items-center cursor-pointer w-full text-center focus:outline-none"
            >
              <div className="w-12 h-12 rounded-[16px] bg-[#F4F7FE] text-[#1C3EAA] flex items-center justify-center relative group-hover:bg-[#1C3EAA] group-hover:text-white transition-all shadow-xs">
                <AskChopBotIcon size={19} color="currentColor" />
                <span className="absolute -top-1.5 -right-1 bg-[#EEF4FF] text-[#1C3EAA] text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-[#3D6BEA]/20">
                  AI
                </span>
              </div>
              <span className="text-[12px] md:text-[13px] font-semibold text-[#14213D] group-hover:text-[#1C3EAA] transition-colors mt-2 leading-tight">
                {locale === 'zh' ? '智能体' : 'Ask Chop'}
              </span>
              <span className="text-[11px] text-[#334155] font-medium mt-0.5 leading-none">
                {locale === 'zh' ? '助手咨询' : 'Chat'}
              </span>
            </button>
          </div>
        </Card>

        {/* Featured Cards: Pay Tuition & Buffer Planner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
          {/* Featured Card 1: Pay Tuition */}
          <Card
            variant="default"
            className="p-4 md:p-5 flex flex-col justify-between cursor-pointer hover:border-[#1C3EAA]/30 hover:shadow-xs transition-all"
            onClick={() => onNavigate('/tuition')}
            role="button"
            tabIndex={0}
          >
            <div>
              {/* Header */}
              <CardHeader className="pb-2.5 mb-2.5 border-b border-[rgba(15,23,42,0.06)]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] text-[#1C3EAA] flex items-center justify-center shrink-0 border border-[#3D6BEA]/20 shadow-xs">
                    <TuitionGradCapIcon size={18} color="#1C3EAA" />
                  </div>
                  <CardTitle className="text-[14.5px] text-[#14213D] font-bold leading-tight tracking-tight">
                    {locale === 'zh' ? '缴纳学费 (跨境汇款)' : 'Pay Tuition (Cross-Border)'}
                  </CardTitle>
                </div>
                <CardBadge variant="amber">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] mr-1.5 animate-pulse" />
                  {locale === 'zh' ? '14天内截止' : 'Due in 14 days'}
                </CardBadge>
              </CardHeader>

              {/* Amount Display Widget (Reference-matched balanced scale) */}
              <div className="my-2 p-3.5 rounded-[12px] bg-[#F8FAFC] border border-[rgba(15,23,42,0.04)]">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[22px] md:text-[24px] font-bold tabular-nums text-[#14213D] tracking-tight">
                    ¥{tuitionDueCny.toLocaleString('en-US')}
                  </span>
                  <span className="text-[11.5px] font-semibold text-[#334155] uppercase tracking-wider">
                    CNY
                  </span>
                </div>
                <p className="text-[12px] text-[#334155] leading-normal mt-1">
                  {locale === 'zh'
                    ? `应缴 ¥${tuitionDueCny.toLocaleString('en-US')} · 需汇出 $${tuitionSendUsd} USD 至学校财务处`
                    : `Due ¥${tuitionDueCny.toLocaleString('en-US')} · Send $${tuitionSendUsd} USD to Campus bursar`}
                </p>
              </div>
            </div>

            {/* Footer link with divider */}
            <CardFooter className="pt-2.5 mt-auto border-t border-[rgba(15,23,42,0.06)] flex items-center justify-between text-[12.5px] font-semibold text-[#1C3EAA]">
              <span>
                {locale === 'zh' ? '选择支付方案 (快/省/稳)' : 'Select Schedule (Fast/Cheapest)'}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[11px] font-semibold text-[#334155] bg-[#F1F5F9] px-2 py-0.5 rounded-full border border-[rgba(15,23,42,0.06)]">
                  Fall 2026
                </span>
                <span className="w-5 h-5 rounded-full bg-[#1C3EAA] text-white flex items-center justify-center text-[10px] shadow-xs">
                  →
                </span>
              </div>
            </CardFooter>
          </Card>

          {/* Featured Card 2: Cashflow & Buffer Planner */}
          <Card
            variant="default"
            className="p-4 md:p-5 flex flex-col justify-between cursor-pointer hover:border-[#1C3EAA]/30 hover:shadow-xs transition-all"
            onClick={() => onNavigate('/planner')}
            role="button"
            tabIndex={0}
          >
            <div>
              {/* Header */}
              <CardHeader className="pb-2.5 mb-2.5 border-b border-[rgba(15,23,42,0.06)]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] text-[#1C3EAA] flex items-center justify-center shrink-0 border border-[#3D6BEA]/20 shadow-xs">
                    <PlannerRunwayIcon size={18} color="#1C3EAA" />
                  </div>
                  <CardTitle className="text-[14.5px] text-[#14213D] font-bold leading-tight tracking-tight">
                    {locale === 'zh' ? '现金流调度与缓冲规划' : 'Buffer & Cashflow Planner'}
                  </CardTitle>
                </div>
                <CardBadge variant="green">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E6E43] mr-1.5 animate-pulse" />
                  {locale === 'zh' ? `缓冲充足 · ${plannerRunway}` : `Runway: ${plannerRunway}`}
                </CardBadge>
              </CardHeader>

              {/* Amount Display Widget (Reference-matched balanced scale) */}
              <div className="my-2 p-3.5 rounded-[12px] bg-[#F8FAFC] border border-[rgba(15,23,42,0.04)]">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[22px] md:text-[24px] font-bold tabular-nums text-[#14213D] tracking-tight">
                    ${plannerTotalFormatted}
                  </span>
                  <span className="text-[11.5px] font-semibold text-[#334155] uppercase tracking-wider">
                    USD
                  </span>
                </div>
                <p className="text-[12px] text-[#334155] leading-normal mt-1">
                  {locale === 'zh'
                    ? (isGoogle
                        ? `实名钱包总资产 · 充足储备与 ${plannerRunway} 安全线`
                        : `1月总资产 ($${janBar.reserve}k 储备缓冲) · ${plannerRunway} 充足安全线`)
                    : (isGoogle
                        ? `Primary Live Assets ($12.5k Reserve) · ${plannerRunway} healthy runway`
                        : `Jan Total Assets ($${janBar.reserve}k Reserve) · ${plannerRunway} healthy runway`)}
                </p>
              </div>
            </div>

            {/* Footer link with divider */}
            <CardFooter className="pt-2.5 mt-auto border-t border-[rgba(15,23,42,0.06)] flex items-center justify-between text-[12.5px] font-semibold text-[#1C3EAA]">
              <span className="truncate">
                {locale === 'zh' ? '模拟资金延期 / 优化场景' : 'Simulate Delayed / Optimized Scenarios'}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[11px] font-semibold text-[#0E6E43] bg-[#EBF7EE] px-2 py-0.5 rounded-full border border-[#0E6E43]/20">
                  Healthy Buffer
                </span>
                <span className="w-5 h-5 rounded-full bg-[#1C3EAA] text-white flex items-center justify-center text-[10px] shadow-xs">
                  →
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* ═══════════ RECENT ACTIVITY SECTION (Unified 1200px Spacing) ═══════════ */}
      <section className="recent-activity-section w-full">
        <div className="section-header-title mb-3 flex items-center justify-between">
          <h3 className="font-bold text-[16px] text-[#14213D] tracking-tight">
            {locale === 'zh' ? '最近活动' : 'Recent Activity'}
          </h3>
          <span className="text-[12.5px] text-[#334155] font-medium">
            {activities.length} {locale === 'zh' ? '条记录' : 'events'}
          </span>
        </div>

        <div className="bg-[#F8FAFE] p-1.5 rounded-[26px] border border-[#E2E8F0] shadow-xs">
          <div className="bg-white rounded-[20px] divide-y divide-[#F1F5F9] overflow-hidden">
            {activities.length === 0 ? (
              <div className="p-6 text-center text-[#475569] text-[13px]">
                {locale === 'zh' ? '暂无交易记录' : 'No recent transactions'}
              </div>
            ) : (
              activities.map((act) => (
                <div
                  key={act.id}
                  className="activity-item px-5 py-4 hover:bg-[#F8FAFE] transition-colors flex items-center justify-between gap-4 cursor-pointer"
                >
                  {/* Left: Custom SVG Icon + Title + Caption */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#EEF4FF] text-[#1C3EAA] flex items-center justify-center shrink-0 border border-[#3D6BEA]/15">
                      {act.type === 'blocked' ? (
                        <AegisShieldIcon size={17} color="#1C3EAA" />
                      ) : (
                        <ArrowUpRightIcon size={18} color="#1C3EAA" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-[13.5px] text-[#14213D] truncate">
                        {locale === 'zh' ? act.titleZh : act.titleEn}
                      </div>
                      <div className="text-[12px] text-[#334155] mt-0.5 truncate">
                        {locale === 'zh' ? act.timestampZh : act.timestamp} · {act.receivedText || (locale === 'zh' ? '已拦截' : 'Blocked')}
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount Right-Aligned + Tag Below Amount */}
                  <div className="text-right shrink-0">
                    <div className="font-semibold tabular-nums text-[15px] text-[#14213D] amount-condensed">
                      {act.amount}
                    </div>
                    <div className="mt-0.5">
                      <span
                        className={`inline-block text-[11px] font-semibold ${
                          act.type === 'blocked' ? 'text-[#B91C1C]' : 'text-[#0E6E43]'
                        }`}
                      >
                        {act.type === 'blocked'
                          ? locale === 'zh' ? '已拦截' : 'Blocked'
                          : locale === 'zh' ? '已验证' : 'Verified'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      {/* Secondary Screens Scope Discipline (MVP-SCOPE-01) */}
      <section className="mt-6 p-3.5 rounded-[16px] bg-[#F8FAFC] border border-[#E2E8F0] text-center text-[12px] text-[#64748B]">
        <span>
          {locale === 'zh'
            ? 'Payee directory coming soon in v1.1 · Settings & on-chain anchor coming soon'
            : 'Payee directory coming soon in v1.1 · Settings & on-chain anchor coming soon'}
        </span>
        <span className="hidden">{b(locale, 'toast_coming_soon')}</span>
      </section>
    </div>
  );
};
