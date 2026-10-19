'use client';

import React, { useState } from 'react';
import { ChopMascot } from '@/components/art/ChopMascot';
import { HeaderArt } from '@/components/art/HeaderArt';
import { SEED_DATA } from '@/lib/mockData';
import { AppRoute, Locale } from '@/types';
import SplitText from '@/components/SplitText';
import { Card } from '@/components/ui/Card';
import { TuitionGradCapIcon, RatesExchangeIcon } from '@/components/icons/AegisIcons';

interface TuitionScreenProps {
  locale: Locale;
  onNavigate: (route: AppRoute) => void;
  onRequestTuition: (mode: 'fastest' | 'cheapest' | 'balanced') => void;
}

export const TuitionScreen: React.FC<TuitionScreenProps> = ({
  locale,
  onNavigate,
  onRequestTuition,
}) => {
  const tuition = SEED_DATA.tuition;
  const [currentMode, setCurrentMode] = useState<'fastest' | 'cheapest' | 'balanced'>('cheapest');

  // Mode calculations directly matching Image 1
  const routeOptions = {
    fastest: {
      id: 'fastest',
      labelEn: 'Fastest',
      labelZh: '最快通道',
      timeEn: '~ 10 minutes',
      timeZh: '约10分钟',
      rate: 7.28,
      fee: 25.10,
      buffer: 20.00,
      baseAmount: 2500.00,
      total: 2545.10,
    },
    cheapest: {
      id: 'cheapest',
      labelEn: 'Cheapest',
      labelZh: '最划算',
      timeEn: '~ 2 minutes',
      timeZh: '约2分钟',
      rate: 7.20,
      fee: 14.30,
      buffer: 20.00,
      baseAmount: 2500.00,
      total: 2534.30,
    },
    balanced: {
      id: 'balanced',
      labelEn: 'Balanced',
      labelZh: '均衡方案',
      timeEn: '~ 5 minutes',
      timeZh: '约5分钟',
      rate: 7.24,
      fee: 18.60,
      buffer: 20.00,
      baseAmount: 2500.00,
      total: 2538.60,
    },
  };

  const selectedData = routeOptions[currentMode];

  const handleReview = () => {
    onRequestTuition(currentMode);
  };

  return (
    <div className="tuition-screen pb-14 w-full animate-fadeIn">
      {/* ═══════════ LUMINOUS HERO HEADER (1200px aligned) ═══════════ */}
      <header className="screen-header-blue tuition-header relative overflow-hidden rounded-[20px] p-6 md:p-8 w-full mb-6 shadow-sm">
        <HeaderArt screenType="tuition" />

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
                  <TuitionGradCapIcon size={20} color="#FFFFFF" />
                </span>
                <h1 className="brand-title text-white font-bold text-[20px] tracking-tight">
                  <SplitText
                    text={locale === 'zh' ? '学费跨境缴纳' : 'Pay Tuition'}
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
                <span className="w-2 h-2 rounded-full bg-[#FFB020] animate-pulse" />
                <span>
                  {locale === 'zh' ? '14天内截止 · 学校财务处' : 'Due in 14 days · Campus bursar'}
                </span>
              </span>
              <div className="mascot-header-cluster">
                <ChopMascot
                  bodyColor="#FFFFFF"
                  faceColor="#DCE8FD"
                  expression="guard"
                  size={52}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-baseline gap-2 sm:gap-4 mt-2">
            <div className="text-white text-[32px] md:text-[36px] font-bold tabular-nums tracking-tight leading-none">
              ¥{tuition.dueAmountCny.toLocaleString('en-US')}
              <span className="text-[14px] font-semibold text-[#9DB8FF] ml-2">CNY</span>
            </div>
            <div className="text-[#DBEAFE] text-[13px]">
              {locale === 'zh'
                ? '学校财务处官方全额到账直连结算通道'
                : 'Direct bursar settlement · Guaranteed zero intermediate deduction'}
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════ MAIN REMITTANCE CARD (EXACT REFERENCE DESIGN) ═══════════ */}
      <main className="screen-body w-full max-w-[840px] mx-auto">
        <Card variant="default" className="p-6 md:p-8 shadow-sm border border-[rgba(15,23,42,0.08)] rounded-[20px]">
          {/* Header Step Indicator & PBOC Benchmark */}
          <div className="flex items-center justify-between pb-5 mb-5 border-b border-[rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#1C3EAA] text-white flex items-center justify-center font-bold text-[12px] shadow-xs">
                1
              </span>
              <h2 className="text-[17px] font-bold text-[#14213D] tracking-tight">
                {locale === 'zh' ? '选择汇款路由方案' : 'Select Remittance Route'}
              </h2>
            </div>

            <div
              onClick={() => onNavigate('/rates')}
              className="flex items-center gap-1.5 text-[12.5px] text-[#64748B] hover:text-[#1C3EAA] transition-colors cursor-pointer group"
              title="Click to view live exchange rates"
            >
              <span>{locale === 'zh' ? '中间价基准:' : 'PBOC Mid-market:'}</span>
              <span className="font-bold text-[#14213D] group-hover:text-[#1C3EAA] tabular-nums">7.24</span>
              <span className="w-4 h-4 rounded-full bg-[#F1F5F9] group-hover:bg-[#EEF4FF] text-[#64748B] group-hover:text-[#1C3EAA] flex items-center justify-center text-[10px]">
                ⓘ
              </span>
            </div>
          </div>

          {/* 3-Column Route Choice Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
            {/* 1. Fastest */}
            <div
              onClick={() => setCurrentMode('fastest')}
              className={`p-4 rounded-[16px] border transition-all cursor-pointer text-center flex flex-col items-center justify-between min-h-[140px] ${
                currentMode === 'fastest'
                  ? 'bg-[#1C3EAA] text-white border-[#1C3EAA] shadow-md ring-2 ring-[#1C3EAA]/20 -translate-y-0.5'
                  : 'bg-white text-[#14213D] border-[rgba(15,23,42,0.08)] hover:border-[#1C3EAA]/30 hover:shadow-xs'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                currentMode === 'fastest' ? 'bg-white/20 text-white' : 'bg-[#EEF4FF] text-[#1C3EAA]'
              }`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>

              <div>
                <span className={`font-bold text-[14.5px] block ${currentMode === 'fastest' ? 'text-white' : 'text-[#14213D]'}`}>
                  {locale === 'zh' ? routeOptions.fastest.labelZh : routeOptions.fastest.labelEn}
                </span>
                <span className={`text-[12px] block mt-0.5 ${currentMode === 'fastest' ? 'text-white/80' : 'text-[#64748B]'}`}>
                  {locale === 'zh' ? routeOptions.fastest.timeZh : routeOptions.fastest.timeEn}
                </span>
              </div>

              <div className="mt-2 pt-2 border-t border-current/10 w-full">
                <span className={`text-[12.5px] font-bold block ${currentMode === 'fastest' ? 'text-white' : 'text-[#14213D]'}`}>
                  {routeOptions.fastest.rate.toFixed(2)} USD/CNY
                </span>
                <span className={`text-[11.5px] font-medium block ${currentMode === 'fastest' ? 'text-white/80' : 'text-[#64748B]'}`}>
                  ${routeOptions.fastest.fee.toFixed(2)}
                </span>
              </div>
            </div>

            {/* 2. Cheapest (Default Active Match Reference) */}
            <div
              onClick={() => setCurrentMode('cheapest')}
              className={`p-4 rounded-[16px] border transition-all cursor-pointer text-center flex flex-col items-center justify-between min-h-[140px] ${
                currentMode === 'cheapest'
                  ? 'bg-[#1C3EAA] text-white border-[#1C3EAA] shadow-md ring-2 ring-[#1C3EAA]/20 -translate-y-0.5'
                  : 'bg-white text-[#14213D] border-[rgba(15,23,42,0.08)] hover:border-[#1C3EAA]/30 hover:shadow-xs'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                currentMode === 'cheapest' ? 'bg-white/20 text-white' : 'bg-[#EEF4FF] text-[#1C3EAA]'
              }`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                </svg>
              </div>

              <div>
                <span className={`font-bold text-[14.5px] block ${currentMode === 'cheapest' ? 'text-white' : 'text-[#14213D]'}`}>
                  {locale === 'zh' ? routeOptions.cheapest.labelZh : routeOptions.cheapest.labelEn}
                </span>
                <span className={`text-[12px] block mt-0.5 ${currentMode === 'cheapest' ? 'text-white/80' : 'text-[#64748B]'}`}>
                  {locale === 'zh' ? routeOptions.cheapest.timeZh : routeOptions.cheapest.timeEn}
                </span>
              </div>

              <div className="mt-2 pt-2 border-t border-current/10 w-full">
                <span className={`text-[12.5px] font-bold block ${currentMode === 'cheapest' ? 'text-white' : 'text-[#14213D]'}`}>
                  {routeOptions.cheapest.rate.toFixed(2)} USD/CNY
                </span>
                <span className={`text-[11.5px] font-medium block ${currentMode === 'cheapest' ? 'text-white/80' : 'text-[#64748B]'}`}>
                  ${routeOptions.cheapest.fee.toFixed(2)}
                </span>
              </div>
            </div>

            {/* 3. Balanced */}
            <div
              onClick={() => setCurrentMode('balanced')}
              className={`p-4 rounded-[16px] border transition-all cursor-pointer text-center flex flex-col items-center justify-between min-h-[140px] ${
                currentMode === 'balanced'
                  ? 'bg-[#1C3EAA] text-white border-[#1C3EAA] shadow-md ring-2 ring-[#1C3EAA]/20 -translate-y-0.5'
                  : 'bg-white text-[#14213D] border-[rgba(15,23,42,0.08)] hover:border-[#1C3EAA]/30 hover:shadow-xs'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                currentMode === 'balanced' ? 'bg-white/20 text-white' : 'bg-[#EEF4FF] text-[#1C3EAA]'
              }`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v18" />
                  <path d="m6 8 6-2 6 2" />
                  <path d="m3 13 3-5 3 5a3 3 0 0 1-6 0Z" />
                  <path d="m15 13 3-5 3 5a3 3 0 0 1-6 0Z" />
                </svg>
              </div>

              <div>
                <span className={`font-bold text-[14.5px] block ${currentMode === 'balanced' ? 'text-white' : 'text-[#14213D]'}`}>
                  {locale === 'zh' ? routeOptions.balanced.labelZh : routeOptions.balanced.labelEn}
                </span>
                <span className={`text-[12px] block mt-0.5 ${currentMode === 'balanced' ? 'text-white/80' : 'text-[#64748B]'}`}>
                  {locale === 'zh' ? routeOptions.balanced.timeZh : routeOptions.balanced.timeEn}
                </span>
              </div>

              <div className="mt-2 pt-2 border-t border-current/10 w-full">
                <span className={`text-[12.5px] font-bold block ${currentMode === 'balanced' ? 'text-white' : 'text-[#14213D]'}`}>
                  {routeOptions.balanced.rate.toFixed(2)} USD/CNY
                </span>
                <span className={`text-[11.5px] font-medium block ${currentMode === 'balanced' ? 'text-white/80' : 'text-[#64748B]'}`}>
                  ${routeOptions.balanced.fee.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Breakdown Table (Clean Rows with subtle dividers matching Image 1) */}
          <div className="rounded-[16px] border border-[rgba(15,23,42,0.08)] overflow-hidden mb-6 text-[13.5px]">
            {/* Row 1: University / Campus */}
            <div className="flex items-center justify-between p-3.5 bg-white border-b border-[rgba(15,23,42,0.06)]">
              <span className="text-[#64748B] font-medium">
                {locale === 'zh' ? '高校 / 财务结算方' : 'University / Campus'}
              </span>
              <div className="flex items-center gap-1.5 font-semibold text-[#14213D]">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1C3EAA" strokeWidth="2.2">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span>{locale === 'zh' ? '学校财务处' : 'Campus bursar'}</span>
                <span className="text-[#0E6E43] font-semibold text-[12px]">
                  ({locale === 'zh' ? '已核验' : 'verified'})
                </span>
                <span className="w-4 h-4 rounded-full bg-[#EBF7EE] text-[#0E6E43] flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
              </div>
            </div>

            {/* Row 2: Base amount */}
            <div className="flex items-center justify-between p-3.5 bg-white border-b border-[rgba(15,23,42,0.06)]">
              <span className="text-[#64748B] font-medium">
                {locale === 'zh' ? '应缴学费基数' : 'Base amount'}
              </span>
              <span className="font-bold tabular-nums text-[#14213D]">
                ¥18,000 CNY <span className="text-[#64748B] font-normal">(= $2,500.00 USD)</span>
              </span>
            </div>

            {/* Row 3: Exchange rate (simulated) */}
            <div className="flex items-center justify-between p-3.5 bg-white border-b border-[rgba(15,23,42,0.06)]">
              <span className="text-[#64748B] font-medium">
                {locale === 'zh' ? '汇率中间价 (模拟)' : 'Exchange rate (simulated)'}
              </span>
              <div className="flex items-center gap-1.5 font-bold tabular-nums text-[#14213D]">
                <span>{selectedData.rate.toFixed(2)} USD/CNY</span>
                <span className="w-4 h-4 rounded-full bg-[#F1F5F9] text-[#64748B] flex items-center justify-center text-[10px] font-normal cursor-help">
                  ⓘ
                </span>
              </div>
            </div>

            {/* Row 4: Transfer fee */}
            <div className="flex items-center justify-between p-3.5 bg-white border-b border-[rgba(15,23,42,0.06)]">
              <span className="text-[#64748B] font-medium">
                {locale === 'zh' ? '清算通道手续费' : 'Transfer fee'}
              </span>
              <div className="flex items-center gap-1.5 font-bold tabular-nums text-[#14213D]">
                <span>${selectedData.fee.toFixed(2)} <span className="text-[#64748B] font-normal">({selectedData.timeEn})</span></span>
                <span className="w-4 h-4 rounded-full bg-[#F1F5F9] text-[#64748B] flex items-center justify-center text-[10px] font-normal cursor-help">
                  ⓘ
                </span>
              </div>
            </div>

            {/* Row 5: Bank-charge buffer */}
            <div className="flex items-center justify-between p-3.5 bg-white">
              <span className="text-[#64748B] font-medium">
                {locale === 'zh' ? '银行扣费防缺口缓冲' : 'Bank-charge buffer'}
              </span>
              <div className="flex items-center gap-1.5 font-bold tabular-nums text-[#14213D]">
                <span>+ $20.00</span>
                <span className="w-4 h-4 rounded-full bg-[#F1F5F9] text-[#64748B] flex items-center justify-center text-[10px] font-normal cursor-help" title="Guarantees full net arrival">
                  ⓘ
                </span>
              </div>
            </div>
          </div>

          {/* You Send Summary Box (Light Blue Highlight matching Image 1) */}
          <div className="p-4 rounded-[16px] bg-[#EEF4FF] border border-[#3D6BEA]/20 flex items-center justify-between mb-6 shadow-2xs">
            <span className="text-[17px] font-bold text-[#1C3EAA]">
              {locale === 'zh' ? '汇出总额' : 'You send'}
            </span>
            <span className="text-[26px] md:text-[28px] font-bold tabular-nums text-[#14213D] tracking-tight">
              ${selectedData.total.toFixed(2)} <span className="text-[15px] font-bold text-[#1C3EAA]">USD</span>
            </span>
          </div>

          {/* Review Payment CTA Button (Matching Image 1) */}
          <button
            onClick={handleReview}
            className="w-full h-12 rounded-[14px] bg-[#1C3EAA] hover:bg-[#163188] text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer"
          >
            <span>{locale === 'zh' ? '核对审批汇款' : 'Review payment'}</span>
            <span className="text-[16px]">→</span>
          </button>
        </Card>
      </main>
    </div>
  );
};
