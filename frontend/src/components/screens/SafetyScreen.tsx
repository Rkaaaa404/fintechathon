'use client';

import React from 'react';
import { Locale } from '@/lib/i18n';
import { AppRoute } from '@/types';
import { ChopMascot } from '@/components/art/ChopMascot';
import { HeaderArt } from '@/components/art/HeaderArt';
import { RadialAttackMap } from '@/components/art/RadialAttackMap';
import { FiveSegmentBar } from '@/components/art/FiveSegmentBar';
import SplitText from '@/components/SplitText';
import { SafetyRingsIcon, AegisShieldIcon } from '@/components/icons/AegisIcons';
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
    <div className="safety-screen pb-10 w-full">
      {/* ═══════════ LUMINOUS SAFETY HERO HEADER (1200px aligned) ═══════════ */}
      <header className="screen-header-blue safety-header relative overflow-hidden rounded-[20px] p-6 md:p-8 w-full mb-6">
        <HeaderArt screenType="safety" />

        <div className="header-content relative z-10 w-full">
          <div className="flex items-center justify-between mb-3">
            <div className="brand-row flex items-center gap-2.5">
              <button
                className="nav-back-btn p-1.5 rounded-full bg-white/15 text-white hover:bg-white/25 transition-all flex items-center justify-center cursor-pointer"
                onClick={() => onNavigate('/')}
                aria-label="Back to home"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-white/20 text-white">
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
              <span className="text-[12px] font-semibold bg-white/20 text-white px-3 py-1 rounded-full border border-white/25 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${activeCount === 3 ? 'bg-[#6FD3FF]' : 'bg-[#FFB020]'}`} />
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
            <p className="text-[#DBEAFE] text-[13px] max-w-[660px] leading-relaxed">
              {locale === 'zh'
                ? '确定性安全规则在语言模型外部独立执行。即使智能体受到提示词注入，资金依然受银行侧限额保护。'
                : 'Deterministic security rules run strictly outside the language model. Bank-side limits protect funds even during prompt injection attempts.'}
            </p>
          </div>
        </div>
      </header>

      {/* ═══════════ TWO EQUAL-HEIGHT COLUMNS ═══════════ */}
      <main className="screen-body w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Left Column (col-span-7): Attack Card (Night Theme, Zero Stray Circles, $0 Lost) */}
          <div className="md:col-span-7 flex flex-col h-full">
            <Card variant="night" className="h-full flex flex-col justify-between p-0 overflow-hidden">
              {/* Header: Title, Subtitle, and Computed Funds Lost Badge in one aligned row with 20px padding */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-white/10 w-full">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 font-bold text-[16px] text-white">
                    <span className="p-1 rounded bg-[#1E3A8A]/60 text-[#6FD3FF] shrink-0">
                      <AegisShieldIcon size={16} color="#6FD3FF" secondaryColor="rgba(111,211,255,0.25)" />
                    </span>
                    <span className="truncate">
                      {locale === 'zh' ? '发票隐藏提权攻击拦截' : 'Attack simulation blocked'}
                    </span>
                  </div>
                  <div className="text-[12px] text-[#93C5FD] mt-1 truncate">
                    {locale === 'zh'
                      ? '拦截发票与提示词中的越权转账指令'
                      : 'Prompt injection in invoice intercepted'}
                  </div>
                </div>

                <div className="shrink-0">
                  <span
                    className={`inline-flex items-center text-[12px] font-semibold h-6 px-2.5 rounded-full border whitespace-nowrap ${
                      fundsLost > 0
                        ? 'bg-[#FEF2F2]/20 border-[#B91C1C] text-[#FF6B6F]'
                        : 'bg-[#EBF7EE]/20 border-[#0E6E43] text-[#6EE7B7]'
                    }`}
                  >
                    {fundsLost > 0
                      ? locale === 'zh'
                        ? `模拟中资金损失 $${fundsLost}`
                        : `Funds lost $${fundsLost} in this simulation`
                      : locale === 'zh'
                      ? '模拟中资金损失 $0'
                      : 'Funds lost $0 in this simulation'}
                  </span>
                </div>
              </div>

              {/* Central Radial Attack Map SVG without stray circles outside rings */}
              <div className="radial-map-container my-auto flex items-center justify-center p-4" id="radial-map-wrapper">
                <RadialAttackMap
                  fundsLost={fundsLost}
                  outerActive={outerActive}
                  middleActive={middleActive}
                  innerActive={innerActive}
                  isReplaying={isAttackReplaying}
                />
              </div>

              {/* Bottom bar: caption and "Replay attack" button in flex row, padding 16px 20px, gap 16px, min-w-0 */}
              <div className="py-4 px-5 border-t border-white/10 flex items-center justify-between gap-4 w-full">
                <span className="text-[12px] text-[#93C5FD] min-w-0 flex-1 leading-snug">
                  {locale === 'zh' ? '回放注入攻击并检验防御环拦截能力' : 'Simulate attack vector through active defense rings'}
                </span>
                <button
                  className="btn-replay-attack h-10 px-4 rounded-[12px] bg-[#2554D7] hover:bg-[#1D4ED8] text-white font-bold text-[13px] transition-all flex items-center gap-2 cursor-pointer shadow-md shrink-0"
                  id="btn-replay-attack"
                  onClick={onReplayAttack}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                  </svg>
                  <span>{locale === 'zh' ? '回放攻击模拟' : 'Replay attack'}</span>
                </button>
              </div>
            </Card>
          </div>

          {/* Right Column (col-span-5): Defense Rings Panel with Accessible Switches & Pinned Pause */}
          <div className="md:col-span-5 flex flex-col h-full">
            <Card variant="default" className="h-full flex flex-col p-5">
              <div>
                {/* Panel Header */}
                <CardHeader className="pb-3 mb-3 border-b border-[rgba(15,23,42,0.06)]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-[#1C3EAA] rounded-full" />
                    <CardTitle className="text-[16px] text-[#14213D] font-bold">
                      {locale === 'zh' ? '防御环控制矩阵' : 'Defense Ring Matrix'}
                    </CardTitle>
                  </div>
                  <CardBadge variant="neutral">
                    {locale === 'zh' ? '点击切换' : 'Click to Toggle'}
                  </CardBadge>
                </CardHeader>

                {/* 3 Rings with Accessible Visible ON/OFF Toggle Switches (each row padding 14px 16px) */}
                <div className="space-y-2.5 mb-5">
                  {/* 1. Outer Ring: Privacy Filter */}
                  <div className="py-3.5 px-4 rounded-[14px] bg-[#F8FAFE] border border-[rgba(15,23,42,0.06)] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        role="switch"
                        aria-checked={outerActive}
                        onClick={() => onToggleLayer('privacy')}
                        className={`w-12 h-7 rounded-full transition-colors relative flex items-center px-1 cursor-pointer shrink-0 shadow-inner ${
                          outerActive ? 'bg-[#0E6E43]' : 'bg-[#475569]'
                        }`}
                        title={outerActive ? 'Switch ON' : 'Switch OFF'}
                      >
                        <span
                          className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform flex items-center justify-center text-[9px] font-bold ${
                            outerActive ? 'translate-x-5 text-[#0E6E43]' : 'translate-x-0 text-[#475569]'
                          }`}
                        >
                          {outerActive ? 'ON' : 'OFF'}
                        </span>
                      </button>

                      <div className="min-w-0">
                        <div className="font-bold text-[13.5px] text-[#14213D] leading-tight truncate">
                          {locale === 'zh' ? '外环 · 隐私过滤' : 'Outer · Privacy Filter'}
                        </div>
                        <div className="text-[12px] text-[#64748B] truncate mt-0.5">
                          {locale === 'zh' ? '提示词注入与隐私脱敏' : 'Prompt injection & PII redact'}
                        </div>
                      </div>
                    </div>

                    <CardBadge variant={outerActive ? 'green' : 'red'}>
                      {outerActive
                        ? locale === 'zh' ? '已生效' : 'Active'
                        : locale === 'zh' ? '已穿透' : 'Bypassed'}
                    </CardBadge>
                  </div>

                  {/* 2. Middle Ring: Spending Rules */}
                  <div className="py-3.5 px-4 rounded-[14px] bg-[#F8FAFE] border border-[rgba(15,23,42,0.06)] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        role="switch"
                        aria-checked={middleActive}
                        onClick={() => onToggleLayer('rules')}
                        className={`w-12 h-7 rounded-full transition-colors relative flex items-center px-1 cursor-pointer shrink-0 shadow-inner ${
                          middleActive ? 'bg-[#0E6E43]' : 'bg-[#475569]'
                        }`}
                        title={middleActive ? 'Switch ON' : 'Switch OFF'}
                      >
                        <span
                          className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform flex items-center justify-center text-[9px] font-bold ${
                            middleActive ? 'translate-x-5 text-[#0E6E43]' : 'translate-x-0 text-[#475569]'
                          }`}
                        >
                          {middleActive ? 'ON' : 'OFF'}
                        </span>
                      </button>

                      <div className="min-w-0">
                        <div className="font-bold text-[13.5px] text-[#14213D] leading-tight truncate">
                          {locale === 'zh' ? '中环 · 支出规则' : 'Middle · Spending Rules'}
                        </div>
                        <div className="text-[12px] text-[#64748B] truncate mt-0.5">
                          {locale === 'zh' ? '单日 $1,000 限额规则' : '$1,000/day allowance rule'}
                        </div>
                      </div>
                    </div>

                    <CardBadge variant={middleActive ? 'green' : 'red'}>
                      {middleActive
                        ? locale === 'zh' ? '已执行' : 'Enforced'
                        : locale === 'zh' ? '已穿透' : 'Bypassed'}
                    </CardBadge>
                  </div>

                  {/* 3. Inner Ring: Bank Limits */}
                  <div className="py-3.5 px-4 rounded-[14px] bg-[#F8FAFE] border border-[rgba(15,23,42,0.06)] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        role="switch"
                        aria-checked={innerActive}
                        onClick={() => onToggleLayer('bank')}
                        className={`w-12 h-7 rounded-full transition-colors relative flex items-center px-1 cursor-pointer shrink-0 shadow-inner ${
                          innerActive ? 'bg-[#0E6E43]' : 'bg-[#475569]'
                        }`}
                        title={innerActive ? 'Switch ON' : 'Switch OFF'}
                      >
                        <span
                          className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform flex items-center justify-center text-[9px] font-bold ${
                            innerActive ? 'translate-x-5 text-[#0E6E43]' : 'translate-x-0 text-[#475569]'
                          }`}
                        >
                          {innerActive ? 'ON' : 'OFF'}
                        </span>
                      </button>

                      <div className="min-w-0">
                        <div className="font-bold text-[13.5px] text-[#14213D] leading-tight truncate">
                          {locale === 'zh' ? '内环 · 银行限额' : 'Inner · Bank Limits'}
                        </div>
                        <div className="text-[12px] text-[#64748B] truncate mt-0.5">
                          {locale === 'zh' ? '银行侧独立锁定保护' : 'Bank-side transfer limits'}
                        </div>
                      </div>
                    </div>

                    <CardBadge variant={innerActive ? 'green' : 'red'}>
                      {innerActive
                        ? locale === 'zh' ? '已锁止' : 'Locked'
                        : locale === 'zh' ? '已穿透' : 'Bypassed'}
                    </CardBadge>
                  </div>
                </div>

                {/* Allowance Bar & Allowed Payees Section - Padded section, chips gap 8px */}
                <div className="p-4 rounded-[14px] bg-[#F8FAFC] border border-[rgba(15,23,42,0.08)] mb-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[13px] font-bold text-[#14213D]">
                      {locale === 'zh' ? '今日额度' : "Today's Allowance"}
                    </span>
                    <span className="text-[12px] font-bold text-[#1C3EAA]">
                      $200 / $1,000 used
                    </span>
                  </div>
                  <FiveSegmentBar filledCount={1} total={5} />

                  <div className="text-[12px] text-[#64748B] font-semibold mt-3 mb-2">
                    {locale === 'zh' ? '已授权收款人白名单:' : 'Allowed Whitelisted Payees:'}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-[#EEF4FF] text-[#1C3EAA] px-2.5 py-1 rounded-full text-[12px] font-semibold border border-[#3D6BEA]/15">
                      {locale === 'zh' ? '妈妈' : 'Mom'}
                    </span>
                    <span className="bg-white text-[#14213D] px-2.5 py-1 rounded-full text-[12px] font-semibold border border-[#E6ECF8]">
                      {locale === 'zh' ? '学校财务处' : 'Campus bursar'}
                    </span>
                    <span className="bg-[#EEF4FF] text-[#1C3EAA] px-2.5 py-1 rounded-full text-[12px] font-semibold border border-[#3D6BEA]/15">
                      {locale === 'zh' ? '爸爸' : 'Dad'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pause Agent Button in Footer with 16px padding, 40px height */}
              <CardFooter className="pt-4 mt-auto border-t border-[rgba(15,23,42,0.06)]">
                <button
                  className={`w-full h-10 px-4 rounded-[12px] font-bold text-[13px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                    agentPaused
                      ? 'bg-[#B91C1C] text-white border border-[#B91C1C] hover:bg-[#A81E23]'
                      : 'border border-[#B91C1C] text-[#B91C1C] bg-white hover:bg-[#FEF2F2]'
                  }`}
                  id="btn-pause-agent-toggle"
                  onClick={onTogglePause}
                >
                  {agentPaused ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                      <span>
                        {locale === 'zh'
                          ? '恢复智能体 (Passkey)'
                          : 'Resume agent (Passkey)'}
                      </span>
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                      </svg>
                      <span>
                        {locale === 'zh' ? '暂停智能体' : 'Pause agent'}
                      </span>
                    </>
                  )}
                </button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
