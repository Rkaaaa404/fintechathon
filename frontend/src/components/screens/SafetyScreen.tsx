'use client';

import React from 'react';
import { Locale } from '@/types';
import { AppRoute } from '@/types';
import { ChopMascot } from '@/components/art/ChopMascot';
import { HeaderArt } from '@/components/art/HeaderArt';
import { RadialAttackMap } from '@/components/art/RadialAttackMap';
import SplitText from '@/components/SplitText';
import { SafetyRingsIcon, AegisShieldIcon, PayeesBookIcon } from '@/components/icons/AegisIcons';
import { Card, CardHeader, CardTitle, CardBadge, CardBody, CardFooter } from '@/components/ui/Card';

export interface LayersState {
  privacy: boolean;
  rules: boolean;
  bank: boolean;
}

interface SafetyScreenProps {
  onNavigate: (route: AppRoute) => void;
  layersState: LayersState;
  onToggleLayer: (layer: keyof LayersState) => void;
  agentPaused: boolean;
  onTogglePause: () => void;
  onReplayAttack: () => void;
  isAttackReplaying?: boolean;
  locale?: Locale;
}

export const SafetyScreen: React.FC<SafetyScreenProps> = ({
  onNavigate,
  layersState,
  onToggleLayer,
  agentPaused,
  onTogglePause,
  onReplayAttack,
  isAttackReplaying = false,
  locale = 'en',
}) => {
  const outerActive = layersState.privacy !== false;
  const middleActive = layersState.rules !== false;
  const innerActive = layersState.bank !== false;

  const fundsLost = !outerActive && !middleActive && !innerActive ? 2450 : 0;
  const activeCount =
    (outerActive ? 1 : 0) + (middleActive ? 1 : 0) + (innerActive ? 1 : 0);

  return (
    <div className="safety-screen pb-14 w-full animate-fadeIn">
      {/* ═══════════ LUMINOUS SAFETY HERO HEADER (1200px aligned) ═══════════ */}
      <header className="screen-header-blue safety-header relative overflow-hidden rounded-[20px] p-6 md:p-8 w-full mb-6 shadow-sm">
        <HeaderArt screenType="safety" />

        <div className="header-content relative z-10 w-full">
          <div className="flex items-center justify-between mb-3">
            <div className="brand-row flex items-center gap-2.5">
              <button
                className="nav-back-btn p-1.5 rounded-full bg-white/15 text-white hover:bg-white/25 transition-all flex items-center justify-center cursor-pointer active:scale-95"
                onClick={() => onNavigate('/')}
                aria-label="Back to home"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-white/20 text-white shadow-xs">
                  <SafetyRingsIcon size={20} color="#FFFFFF" />
                </span>
                <h1 className="brand-title text-white font-bold text-[20px] tracking-tight">
                  <SplitText
                    text={locale === 'zh' ? '安全防护与三环架构' : 'Deterministic Safety'}
                    tag="span"
                    delay={25}
                    duration={0.6}
                    effect="fade"
                  />
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[12px] font-semibold bg-white/20 text-white px-3 py-1 rounded-full border border-white/25 flex items-center gap-1.5 shadow-xs">
                <span className={`w-2 h-2 rounded-full ${activeCount === 3 ? 'bg-[#6FD3FF]' : 'bg-[#FFB020]'} animate-pulse`} />
                <span>
                  {locale === 'zh'
                    ? `${activeCount}/3 层防护生效`
                    : `${activeCount}/3 layers active`}
                </span>
              </span>
              <div className="mascot-header-cluster">
                <ChopMascot
                  bodyColor="#FFFFFF"
                  faceColor="#DCE8FD"
                  expression={agentPaused ? 'paused' : 'block'}
                  size={52}
                />
              </div>
            </div>
          </div>

          <div className="mt-1 pr-[140px] md:pr-[180px]">
            <p className="text-[#DBEAFE] text-[13px] max-w-[680px] leading-relaxed">
              {locale === 'zh'
                ? '确定性安全规则在语言模型外部独立执行。即使智能体受到提示词注入，资金依然受银行侧限额保护。'
                : 'Deterministic security rules run strictly outside the language model. Bank-side limits protect funds even during prompt injection attempts.'}
            </p>
          </div>
        </div>
      </header>

      {/* ═══════════ MAIN CONTENT GRID (MATCHING IMAGE 2 EXACTLY) ═══════════ */}
      <main className="screen-body w-full space-y-6">
        {/* Row 1: Attack Radar (Left) & Defense Rings / Allowance (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column (col-span-7): Attack simulation blocked Card (Night Theme) */}
          <div className="lg:col-span-7 flex flex-col">
            <Card variant="night" className="h-full flex flex-col justify-between p-0 overflow-hidden shadow-md border border-[#1E3A8A]">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-white/10 w-full">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 font-bold text-[16px] text-white">
                    <span className="p-1 rounded bg-[#1E3A8A]/60 text-[#6FD3FF] shrink-0">
                      <AegisShieldIcon size={16} color="#6FD3FF" secondaryColor="rgba(111,211,255,0.25)" />
                    </span>
                    <span className="truncate">
                      {locale === 'zh' ? '攻击向量拦截演练' : 'Attack simulation blocked'}
                    </span>
                  </div>
                  <div className="text-[12px] text-[#93C5FD] mt-1 truncate">
                    {locale === 'zh'
                      ? '发票中的恶意提示词注入被外环隐私过滤器拦截'
                      : 'Prompt injection in invoice intercepted by Outer Layer.'}
                  </div>
                </div>

                <div className="shrink-0">
                  <span className="inline-flex items-center text-[12px] font-bold h-6 px-3 rounded-full bg-[#991B1B] text-white border border-[#DC2626] whitespace-nowrap shadow-xs">
                    {locale === 'zh'
                      ? `资金损失: $${fundsLost}`
                      : `Funds lost $${fundsLost} in this simulation`}
                  </span>
                </div>
              </div>

              {/* Radial Attack Map Visualization */}
              <div className="relative py-4 px-2 flex items-center justify-center flex-1 min-h-[260px]">
                {/* Floating Labels matching Image 2 */}
                <div className="absolute top-4 left-6 z-10 p-2 rounded-[10px] bg-[#0A1440]/90 border border-[#1E3A8A] text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                    <span className="text-[11.5px] font-bold text-white">Prompt injection</span>
                  </div>
                  <span className="text-[10px] text-[#93C5FD] block">Blocked by Privacy Filter</span>
                </div>

                <div className="absolute top-12 right-6 z-10 p-2 rounded-[10px] bg-[#0A1440]/90 border border-[#1E3A8A] text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                    <span className="text-[11.5px] font-bold text-white">Fake payee</span>
                  </div>
                  <span className="text-[10px] text-[#93C5FD] block">Blocked by Spending Rules</span>
                </div>

                <div className="absolute bottom-4 left-8 z-10 p-2 rounded-[10px] bg-[#0A1440]/90 border border-[#1E3A8A] text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                    <span className="text-[11.5px] font-bold text-white">Amount override</span>
                  </div>
                  <span className="text-[10px] text-[#93C5FD] block">Blocked by Bank Limits</span>
                </div>

                <RadialAttackMap
                  fundsLost={fundsLost}
                  outerActive={outerActive}
                  middleActive={middleActive}
                  innerActive={innerActive}
                  isReplaying={isAttackReplaying}
                />
              </div>

              {/* Replay Controller Bar */}
              <div className="p-4 bg-[#081026] border-t border-white/10 flex items-center justify-between gap-3 text-[12px]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#1C3EAA] text-white flex items-center justify-center shrink-0 shadow-xs">
                    ▶
                  </div>
                  <div className="min-w-0">
                    <span className="text-white font-bold block truncate">
                      {locale === 'zh'
                        ? '通过活跃的三环矩阵模拟攻击路径'
                        : 'Simulate attack vector through active defense rings'}
                    </span>
                    <span className="text-[#93C5FD] text-[11px] block truncate">
                      {locale === 'zh'
                        ? '观察每一环如何确定性阻断恶意指令'
                        : 'See how each layer blocks malicious instructions'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onReplayAttack}
                  className="px-4 py-2 rounded-[12px] bg-[#1C3EAA] hover:bg-[#2563EB] text-white font-bold text-[12.5px] flex items-center gap-1.5 shrink-0 transition-all active:scale-95 cursor-pointer shadow-xs"
                >
                  <span className={isAttackReplaying ? 'animate-spin' : ''}>↺</span>
                  <span>{locale === 'zh' ? '重放攻击' : 'Replay attack'}</span>
                </button>
              </div>
            </Card>
          </div>

          {/* Right Column (col-span-5): Defense Ring Matrix + Today's Allowance */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            {/* Top: Defense Ring Matrix */}
            <Card variant="default" className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <CardHeader className="pb-3 mb-3 border-b border-[rgba(15,23,42,0.06)]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-[#1C3EAA] rounded-full" />
                    <CardTitle className="text-[16px] text-[#14213D] font-bold">
                      {locale === 'zh' ? '确定性三环防御矩阵' : 'Defense Ring Matrix'}
                    </CardTitle>
                  </div>
                  <CardBadge variant="green">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0E6E43] mr-1.5 animate-pulse" />
                    {locale === 'zh' ? `${activeCount}/3 层生效` : `${activeCount}/3 layers active`}
                  </CardBadge>
                </CardHeader>

                <div className="space-y-2.5 my-2">
                  {/* Layer 1: Outer */}
                  <div
                    onClick={() => onToggleLayer('privacy')}
                    className="p-3 rounded-[14px] bg-[#F8FAFC] border border-[rgba(15,23,42,0.06)] hover:bg-[#EEF4FF]/50 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#EBF7EE] text-[#0E6E43] flex items-center justify-center shrink-0 border border-[#0E6E43]/20 shadow-xs">
                        <AegisShieldIcon size={18} color="#0E6E43" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-[13px] text-[#14213D] block leading-tight">
                          {locale === 'zh' ? '外环 · 隐私过滤' : 'Outer · Privacy Filter'}
                        </span>
                        <span className="text-[11.5px] text-[#334155] font-medium block truncate mt-0.5">
                          {locale === 'zh' ? '阻断提示词注入与脱敏学生敏感信息' : 'Blocks prompt injections & redacts sensitive student PII'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EBF7EE] text-[#0E6E43] border border-[#0E6E43]/20">
                        {outerActive ? (locale === 'zh' ? '有效' : 'Active') : (locale === 'zh' ? '关闭' : 'Off')}
                      </span>
                      <span className="text-[#334155] text-[13px]">›</span>
                    </div>
                  </div>

                  {/* Layer 2: Middle */}
                  <div
                    onClick={() => onToggleLayer('rules')}
                    className="p-3 rounded-[14px] bg-[#F8FAFC] border border-[rgba(15,23,42,0.06)] hover:bg-[#EEF4FF]/50 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] text-[#1C3EAA] flex items-center justify-center shrink-0 border border-[#3D6BEA]/20 shadow-xs">
                        <SafetyRingsIcon size={18} color="#1C3EAA" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-[13px] text-[#14213D] block leading-tight">
                          {locale === 'zh' ? '中环 · 支出规则' : 'Middle · Spending Rules'}
                        </span>
                        <span className="text-[11.5px] text-[#334155] font-medium block truncate mt-0.5">
                          {locale === 'zh' ? '强制执行每日$1,000限额并校验收款人白名单' : 'Enforces $1,000/day allowance & verifies payee whitelist'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EEF4FF] text-[#1C3EAA] border border-[#3D6BEA]/20">
                        {middleActive ? (locale === 'zh' ? '强制' : 'Enforced') : (locale === 'zh' ? '关闭' : 'Off')}
                      </span>
                      <span className="text-[#334155] text-[13px]">›</span>
                    </div>
                  </div>

                  {/* Layer 3: Inner */}
                  <div
                    onClick={() => onToggleLayer('bank')}
                    className="p-3 rounded-[14px] bg-[#F8FAFC] border border-[rgba(15,23,42,0.06)] hover:bg-[#EEF4FF]/50 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] text-[#1C3EAA] flex items-center justify-center shrink-0 border border-[#3D6BEA]/20 shadow-xs">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1C3EAA" strokeWidth="2.2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-[13px] text-[#14213D] block leading-tight">
                          {locale === 'zh' ? '内环 · 银行限额' : 'Inner · Bank Limits'}
                        </span>
                        <span className="text-[11.5px] text-[#334155] font-medium block truncate mt-0.5">
                          {locale === 'zh' ? '银行侧独立转账限额，模型外部绝对控制' : 'Bank-side transfer limits outside agent control'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F1F5F9] text-[#14213D] border border-[rgba(15,23,42,0.08)]">
                        {innerActive ? (locale === 'zh' ? '锁定' : 'Locked') : (locale === 'zh' ? '关闭' : 'Off')}
                      </span>
                      <span className="text-[#334155] text-[13px]">›</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Bottom: Today's Allowance Card */}
            <Card variant="default" className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[14.5px] text-[#14213D]">
                  {locale === 'zh' ? '今日额度使用' : "Today's Allowance"}
                </span>
                <span className="font-bold text-[15px] tabular-nums text-[#1C3EAA]">
                  $200 / $1,000 used
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 rounded-full bg-[#E2E8F0] overflow-hidden my-2">
                <div className="h-full bg-[#1C3EAA] rounded-full transition-all duration-500" style={{ width: '20%' }} />
              </div>

              <div className="flex items-center justify-between text-[12px] text-[#334155] font-medium mt-1">
                <span>{locale === 'zh' ? '剩余 $800 可用' : '$800 remaining'}</span>
                <span className="font-semibold text-[#1C3EAA]">{locale === 'zh' ? '6小时后重置' : 'Resets in 6h'}</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Row 2: Recent Security Events (Left) & Safety Controls (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Bottom Left (col-span-6): Recent Security Events */}
          <div className="lg:col-span-6 flex flex-col">
            <Card variant="default" className="p-5 h-full flex flex-col justify-between">
              <div>
                <CardHeader className="pb-3 mb-3 border-b border-[rgba(15,23,42,0.06)]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-[#1C3EAA] rounded-full" />
                    <CardTitle className="text-[16px] text-[#14213D] font-bold">
                      {locale === 'zh' ? '最近拦截安全事件' : 'Recent Security Events'}
                    </CardTitle>
                  </div>
                  <button
                    onClick={() => onNavigate('/chat')}
                    className="text-[12.5px] font-bold text-[#1C3EAA] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{locale === 'zh' ? '查看全部' : 'View all'}</span>
                    <span>→</span>
                  </button>
                </CardHeader>

                <div className="space-y-3 my-1">
                  {/* Event 1 */}
                  <div className="p-3 rounded-[12px] bg-[#F8FAFC] border border-[rgba(15,23,42,0.04)] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#EEF4FF] text-[#1C3EAA] flex items-center justify-center shrink-0 border border-[#3D6BEA]/20">
                        <AegisShieldIcon size={16} color="#1C3EAA" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-[13px] text-[#14213D] block truncate">
                          {locale === 'zh' ? '发票隐藏提示词攻击拦截' : 'Prompt injection blocked (invoice)'}
                        </span>
                        <span className="text-[11.5px] text-[#334155] font-medium block truncate">
                          1h ago · {locale === 'zh' ? '外环隐私过滤器拦截' : 'Malicious instruction detected and blocked by Outer Layer'}
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF2F2] text-[#B91C1C] border border-[#B91C1C]/20 shrink-0">
                      Blocked
                    </span>
                  </div>

                  {/* Event 2 */}
                  <div className="p-3 rounded-[12px] bg-[#F8FAFC] border border-[rgba(15,23,42,0.04)] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#EEF4FF] text-[#1C3EAA] flex items-center justify-center shrink-0 border border-[#3D6BEA]/20">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1C3EAA" strokeWidth="2.2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-[13px] text-[#14213D] block truncate">
                          {locale === 'zh' ? '拦截未授权收款人转账' : 'Unknown payee detected'}
                        </span>
                        <span className="text-[11.5px] text-[#334155] font-medium block truncate">
                          3h ago · {locale === 'zh' ? '目标账户不在白名单中' : 'Payee not in whitelist'}
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF2F2] text-[#B91C1C] border border-[#B91C1C]/20 shrink-0">
                      Blocked
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Bottom Right (col-span-6): Safety Controls (4-Card Grid) */}
          <div className="lg:col-span-6 flex flex-col">
            <Card variant="default" className="p-5 h-full flex flex-col justify-between">
              <div>
                <CardHeader className="pb-3 mb-3 border-b border-[rgba(15,23,42,0.06)]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-[#1C3EAA] rounded-full" />
                    <CardTitle className="text-[16px] text-[#14213D] font-bold">
                      {locale === 'zh' ? '安全控制中枢' : 'Safety Controls'}
                    </CardTitle>
                  </div>
                </CardHeader>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-1">
                  {/* 1. View rules */}
                  <div
                    onClick={() => onToggleLayer('rules')}
                    className="p-3 rounded-[12px] bg-[#F8FAFC] border border-[rgba(15,23,42,0.06)] hover:bg-[#EEF4FF]/50 transition-all cursor-pointer flex flex-col justify-between min-h-[92px] group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-7 h-7 rounded-lg bg-white text-[#1C3EAA] flex items-center justify-center border border-[rgba(15,23,42,0.06)] shadow-xs">
                        ⚙
                      </div>
                      <span className="text-[#64748B] text-[12px] group-hover:translate-x-0.5 transition-transform">›</span>
                    </div>
                    <div>
                      <span className="font-bold text-[12px] text-[#14213D] block leading-tight">View rules</span>
                      <span className="text-[10px] text-[#334155] font-medium block truncate mt-0.5">Allowance, filters</span>
                    </div>
                  </div>

                  {/* 2. Manage payees -> links to /payees! */}
                  <div
                    onClick={() => onNavigate('/payees')}
                    className="p-3 rounded-[12px] bg-[#F8FAFC] border border-[rgba(15,23,42,0.06)] hover:bg-[#EEF4FF]/50 transition-all cursor-pointer flex flex-col justify-between min-h-[92px] group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-7 h-7 rounded-lg bg-white text-[#1C3EAA] flex items-center justify-center border border-[rgba(15,23,42,0.06)] shadow-xs">
                        <PayeesBookIcon size={14} color="#1C3EAA" />
                      </div>
                      <span className="text-[#334155] text-[12px] group-hover:translate-x-0.5 transition-transform">›</span>
                    </div>
                    <div>
                      <span className="font-bold text-[12px] text-[#14213D] block leading-tight">Manage payees</span>
                      <span className="text-[10px] text-[#334155] font-medium block truncate mt-0.5">Family, campus</span>
                    </div>
                  </div>

                  {/* 3. View logs */}
                  <div
                    onClick={() => onNavigate('/chat')}
                    className="p-3 rounded-[12px] bg-[#F8FAFC] border border-[rgba(15,23,42,0.06)] hover:bg-[#EEF4FF]/50 transition-all cursor-pointer flex flex-col justify-between min-h-[92px] group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-7 h-7 rounded-lg bg-white text-[#1C3EAA] flex items-center justify-center border border-[rgba(15,23,42,0.06)] shadow-xs">
                        📄
                      </div>
                      <span className="text-[#334155] text-[12px] group-hover:translate-x-0.5 transition-transform">›</span>
                    </div>
                    <div>
                      <span className="font-bold text-[12px] text-[#14213D] block leading-tight">View logs</span>
                      <span className="text-[10px] text-[#334155] font-medium block truncate mt-0.5">Audit actions</span>
                    </div>
                  </div>

                  {/* 4. Simulate attack */}
                  <div
                    onClick={onReplayAttack}
                    className="p-3 rounded-[12px] bg-[#EEF4FF] border border-[#3D6BEA]/30 hover:bg-[#DCE8FD] transition-all cursor-pointer flex flex-col justify-between min-h-[92px] group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-7 h-7 rounded-lg bg-white text-[#1C3EAA] flex items-center justify-center border border-[#3D6BEA]/30 shadow-xs">
                        🛡️
                      </div>
                      <span className="text-[#1C3EAA] text-[12px] group-hover:translate-x-0.5 transition-transform">›</span>
                    </div>
                    <div>
                      <span className="font-bold text-[12px] text-[#1C3EAA] block leading-tight">Simulate attack</span>
                      <span className="text-[10px] text-[#475569] block truncate mt-0.5">Test system</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
