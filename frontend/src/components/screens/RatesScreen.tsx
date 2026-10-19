'use client';

import React, { useState } from 'react';
import { Locale } from '@/types';
import { AppRoute } from '@/types';
import { ChopMascot } from '@/components/art/ChopMascot';
import { HeaderArt } from '@/components/art/HeaderArt';
import SplitText from '@/components/SplitText';
import { Card, CardHeader, CardTitle, CardBadge, CardBody, CardFooter } from '@/components/ui/Card';
import {
  RatesExchangeIcon,
  AegisShieldIcon,
  TuitionGradCapIcon,
  ArrowUpRightIcon,
  PlannerRunwayIcon,
} from '@/components/icons/AegisIcons';

interface RatesScreenProps {
  onNavigate: (route: AppRoute) => void;
  locale?: Locale;
  onShowToast?: (message: string) => void;
}

export const RatesScreen: React.FC<RatesScreenProps> = ({
  onNavigate,
  locale = 'en',
  onShowToast,
}) => {
  const [calcAmountUsd, setCalcAmountUsd] = useState<number>(2500);
  const [targetAlertActive, setTargetAlertActive] = useState<boolean>(true);
  const [selectedPair, setSelectedPair] = useState<'USD_CNY' | 'USD_IDR' | 'USD_HKD' | 'CNY_HKD'>('USD_CNY');

  // Rates data
  const rates = {
    USD_CNY: {
      rate: 7.2045,
      pbocMid: 7.2400,
      change24h: '-0.08%',
      isPositive: false,
      symbol: '¥',
      target: '7.1800',
      labelEn: 'US Dollar to Chinese Yuan',
      labelZh: '美元兑在岸人民币',
      etaEn: '~2 min via Bursar corridor',
      etaZh: '学校清算通道约2分钟',
    },
    USD_IDR: {
      rate: 15880.00,
      pbocMid: 15850.00,
      change24h: '+0.12%',
      isPositive: true,
      symbol: 'Rp',
      target: '15800.00',
      labelEn: 'US Dollar to Indonesian Rupiah',
      labelZh: '美元兑印尼盾',
      etaEn: 'Immediate settlement',
      etaZh: '合规通道即时到账',
    },
    USD_HKD: {
      rate: 7.7850,
      pbocMid: 7.8000,
      change24h: '+0.01%',
      isPositive: true,
      symbol: 'HK$',
      target: '7.7700',
      labelEn: 'US Dollar to Hong Kong Dollar',
      labelZh: '美元兑港币',
      etaEn: 'Pegged currency band',
      etaZh: '联汇汇率区间稳定',
    },
    CNY_HKD: {
      rate: 1.0810,
      pbocMid: 1.0825,
      change24h: '-0.03%',
      isPositive: false,
      symbol: 'HK$',
      target: '1.0750',
      labelEn: 'Chinese Yuan to Hong Kong Dollar',
      labelZh: '人民币兑港币',
      etaEn: 'Greater Bay Area cross-border',
      etaZh: '大湾区跨境结算通道',
    },
  };

  const currentPairData = rates[selectedPair];
  const convertedAmount = (calcAmountUsd * currentPairData.rate).toLocaleString('en-US', {
    maximumFractionDigits: selectedPair === 'USD_IDR' ? 0 : 2,
    minimumFractionDigits: selectedPair === 'USD_IDR' ? 0 : 2,
  });

  // Cost comparison calculations for $2,500 remittance
  const traditionalWireFee = 35.00 + calcAmountUsd * 0.025 + 20.00; // $117.50
  const creditCardFee = calcAmountUsd * 0.03 + calcAmountUsd * 0.015; // $112.50
  const aegisPathFee = 14.30 + calcAmountUsd * 0.0015; // ~$18.05
  const totalSaved = (traditionalWireFee - aegisPathFee).toFixed(2);

  return (
    <div className="rates-screen pb-12 w-full animate-fadeIn">
      {/* ═══════════ LUMINOUS HERO HEADER ═══════════ */}
      <header className="screen-header-blue rates-header relative overflow-hidden rounded-[20px] p-6 md:p-8 w-full mb-6 shadow-sm">
        <HeaderArt screenType="rates" />

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
                  <RatesExchangeIcon size={20} color="#FFFFFF" />
                </span>
                <h1 className="brand-title text-white font-bold text-[20px] tracking-tight">
                  <SplitText
                    text={locale === 'zh' ? '实时汇率与清算基准' : 'Exchange Rates & Corridor'}
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
                <span className="w-2 h-2 rounded-full bg-[#6FD3FF] animate-pulse" />
                <span>
                  {locale === 'zh' ? 'PBOC 中间价已同步' : 'PBOC Mid-market: 7.2400'}
                </span>
              </span>
              <div className="mascot-header-cluster">
                <ChopMascot
                  bodyColor="#FFFFFF"
                  faceColor="#DCE8FD"
                  expression="wave"
                  size={52}
                />
              </div>
            </div>
          </div>

          <div className="mt-1 pr-[140px] md:pr-[180px]">
            <p className="text-[#DBEAFE] text-[13px] max-w-[680px] leading-relaxed">
              {locale === 'zh'
                ? '采用机构级学生通道点差 (0.15%)，告别传统银行高达 2.5% 的隐形汇率加价与中间行扣费，保障全额足额到账。'
                : 'Direct institutional student corridor (0.15% spread). Zero hidden intermediary bank cuts, guaranteed full-amount bursar delivery.'}
            </p>
          </div>
        </div>
      </header>

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <main className="screen-body w-full space-y-6">
        {/* Currency Pair Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(rates) as Array<keyof typeof rates>).map((key) => {
            const item = rates[key];
            const isSelected = selectedPair === key;

            return (
              <div
                key={key}
                onClick={() => setSelectedPair(key)}
                className={`p-4 rounded-[16px] border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-[#1C3EAA] shadow-md ring-2 ring-[#1C3EAA]/20 -translate-y-0.5'
                    : 'bg-white border-[rgba(15,23,42,0.08)] hover:border-[#1C3EAA]/30 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[13px] text-[#14213D]">
                      {key.replace('_', ' / ')}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        item.isPositive
                          ? 'bg-[#EBF7EE] text-[#0E6E43]'
                          : 'bg-[#EEF4FF] text-[#1C3EAA]'
                      }`}
                    >
                      {item.change24h}
                    </span>
                  </div>

                  <div className="text-[24px] font-bold tabular-nums text-[#14213D] tracking-tight leading-tight mb-1">
                    {item.rate.toLocaleString('en-US', {
                      minimumFractionDigits: key === 'USD_IDR' ? 0 : 4,
                      maximumFractionDigits: key === 'USD_IDR' ? 0 : 4,
                    })}
                  </div>

                  <span className="text-[11.5px] text-[#64748B] block truncate">
                    {locale === 'zh' ? item.labelZh : item.labelEn}
                  </span>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[rgba(15,23,42,0.06)] flex items-center justify-between text-[11px] text-[#64748B]">
                  <span>{locale === 'zh' ? '清算通道' : 'Corridor'}</span>
                  <span className="font-semibold text-[#1C3EAA] truncate max-w-[120px]">
                    {locale === 'zh' ? item.etaZh : item.etaEn}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Currency Calculator & Smart Remittance Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left (col-span-6): Interactive Calculator */}
          <div className="lg:col-span-6 flex flex-col">
            <Card variant="default" className="p-5 h-full flex flex-col justify-between">
              <div>
                <CardHeader className="pb-3 mb-3 border-b border-[rgba(15,23,42,0.06)]">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-[#EEF4FF] text-[#1C3EAA] flex items-center justify-center font-bold text-[14px]">
                      ⇄
                    </span>
                    <CardTitle className="text-[16px] text-[#14213D] font-bold">
                      {locale === 'zh' ? '实时汇率折算器' : 'Live Corridor Calculator'}
                    </CardTitle>
                  </div>
                  <CardBadge variant="blue">
                    {selectedPair.replace('_', ' → ')}
                  </CardBadge>
                </CardHeader>

                <div className="space-y-4 my-2">
                  <div>
                    <label className="block text-[12.5px] font-bold text-[#14213D] mb-1.5">
                      {locale === 'zh' ? '发送金额 (USD)' : 'You Send (USD)'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] font-bold text-[15px]">
                        $
                      </span>
                      <input
                        type="number"
                        value={calcAmountUsd}
                        onChange={(e) => setCalcAmountUsd(Math.max(1, Number(e.target.value) || 0))}
                        className="w-full h-11 pl-8 pr-4 rounded-[12px] border border-[rgba(15,23,42,0.12)] text-[16px] font-bold tabular-nums text-[#14213D] bg-white focus:outline-none focus:border-[#1C3EAA] focus:ring-1 focus:ring-[#1C3EAA]"
                      />
                    </div>
                  </div>

                  {/* Calculated Output Box */}
                  <div className="p-4 rounded-[14px] bg-[#F8FAFC] border border-[rgba(15,23,42,0.06)]">
                    <span className="text-[12px] font-medium text-[#64748B] block mb-1">
                      {locale === 'zh' ? '接收方足额到账估算' : 'Recipient Receives (Guaranteed)'}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[26px] font-bold tabular-nums text-[#1C3EAA] tracking-tight">
                        {currentPairData.symbol} {convertedAmount}
                      </span>
                      <span className="text-[12px] font-bold text-[#64748B]">
                        {selectedPair.split('_')[1]}
                      </span>
                    </div>
                    <span className="text-[11.5px] text-[#0E6E43] font-medium block mt-1">
                      ✓ {locale === 'zh' ? '包含银行手续费缓冲保障，绝无中途扣费' : 'Includes fee buffer guarantee; zero intermediary cuts'}
                    </span>
                  </div>

                  {/* Target FX Order Alert Option */}
                  <div className="p-3.5 rounded-[12px] bg-[#EEF4FF] border border-[#3D6BEA]/20 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[13px] text-[#14213D] block">
                        {locale === 'zh' ? '汇率锁定目标预警' : 'Target Rate Volatility Guard'}
                      </span>
                      <span className="text-[11.5px] text-[#475569] block">
                        {locale === 'zh'
                          ? `当 ${selectedPair.replace('_', '/')} 达到 ${currentPairData.target} 时提醒`
                          : `Alert when ${selectedPair.replace('_', '/')} reaches ${currentPairData.target}`}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setTargetAlertActive(!targetAlertActive);
                        onShowToast?.(
                          targetAlertActive
                            ? (locale === 'zh' ? '已关闭汇率预警' : 'Target alert disabled')
                            : (locale === 'zh' ? '已开启目标汇率提醒' : 'Target rate alert enabled')
                        );
                      }}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        targetAlertActive ? 'bg-[#1C3EAA]' : 'bg-[#CBD5E1]'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                          targetAlertActive ? 'left-7' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('/tuition')}
                className="mt-4 w-full h-11 rounded-[12px] bg-[#1C3EAA] hover:bg-[#163188] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <span>{locale === 'zh' ? '前往学费汇款方案' : 'Apply Rate to Pay Tuition'}</span>
                <span>→</span>
              </button>
            </Card>
          </div>

          {/* Right (col-span-6): Savings Breakdown Comparison */}
          <div className="lg:col-span-6 flex flex-col">
            <Card variant="default" className="p-5 h-full flex flex-col justify-between">
              <div>
                <CardHeader className="pb-3 mb-3 border-b border-[rgba(15,23,42,0.06)]">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-[#EBF7EE] text-[#0E6E43] flex items-center justify-center font-bold text-[14px]">
                      $
                    </span>
                    <CardTitle className="text-[16px] text-[#14213D] font-bold">
                      {locale === 'zh' ? '跨境手续费透明对比' : 'Student Remittance Fee Comparison'}
                    </CardTitle>
                  </div>
                  <CardBadge variant="green">
                    {locale === 'zh' ? `立省 ~$${totalSaved}` : `Save ~$${totalSaved}`}
                  </CardBadge>
                </CardHeader>

                <div className="space-y-3 my-2">
                  {/* Option 1: Traditional Wire */}
                  <div className="p-3.5 rounded-[12px] bg-[#F8FAFC] border border-[rgba(15,23,42,0.06)] flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[13px] text-[#64748B]">
                          {locale === 'zh' ? '传统银行电汇 (SWIFT)' : 'Traditional Bank Wire'}
                        </span>
                        <span className="text-[10px] font-semibold text-[#B91C1C] bg-[#FEF2F2] px-1.5 py-0.2 rounded-full">
                          3-5 Days
                        </span>
                      </div>
                      <span className="text-[11.5px] text-[#94A3B8] block mt-0.5">
                        {locale === 'zh' ? '电汇费 $35 + 2.5% 点差 + 中间行 $20' : 'Wire fee $35 + 2.5% FX spread + $20 routing'}
                      </span>
                    </div>
                    <span className="text-[15px] font-bold tabular-nums text-[#B91C1C]">
                      ~${traditionalWireFee.toFixed(2)}
                    </span>
                  </div>

                  {/* Option 2: Credit Card */}
                  <div className="p-3.5 rounded-[12px] bg-[#F8FAFC] border border-[rgba(15,23,42,0.06)] flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[13px] text-[#64748B]">
                          {locale === 'zh' ? '国际信用卡支付' : 'International Credit Card'}
                        </span>
                        <span className="text-[10px] font-semibold text-[#D97706] bg-[#FFFBEB] px-1.5 py-0.2 rounded-full">
                          High Fee
                        </span>
                      </div>
                      <span className="text-[11.5px] text-[#94A3B8] block mt-0.5">
                        {locale === 'zh' ? '3.0% 跨境刷卡手续费 + 1.5% 货币转换' : '3% interchange fee + 1.5% currency conversion'}
                      </span>
                    </div>
                    <span className="text-[15px] font-bold tabular-nums text-[#D97706]">
                      ~${creditCardFee.toFixed(2)}
                    </span>
                  </div>

                  {/* Option 3: AegisPath Smart Agent */}
                  <div className="p-3.5 rounded-[12px] bg-[#EEF4FF] border border-[#1C3EAA]/30 flex items-center justify-between ring-1 ring-[#1C3EAA]/15">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[13px] text-[#1C3EAA]">
                          {locale === 'zh' ? 'AegisPath 智能体合规调度' : 'AegisPath Smart Agent Route'}
                        </span>
                        <span className="text-[10px] font-bold text-[#0E6E43] bg-[#EBF7EE] px-1.5 py-0.2 rounded-full">
                          ~2 Mins
                        </span>
                      </div>
                      <span className="text-[11.5px] text-[#475569] block mt-0.5">
                        {locale === 'zh' ? '机构中间价点差 (0.15%) + $14.30 固定清算' : '0.15% spread + $14.30 direct clearing'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[16px] font-bold tabular-nums text-[#0E6E43] block">
                        ${aegisPathFee.toFixed(2)}
                      </span>
                      <span className="text-[10px] font-semibold text-[#0E6E43]">
                        {locale === 'zh' ? '全额到账保障' : 'Guaranteed full'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-[12px] bg-[#F1F5F9] text-[12px] text-[#64748B] flex items-center justify-between mt-3">
                <span>{locale === 'zh' ? '资金缓冲规划联动' : 'Planner Runway Integration'}</span>
                <button
                  onClick={() => onNavigate('/planner')}
                  className="font-bold text-[#1C3EAA] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>{locale === 'zh' ? '模拟资金缓冲' : 'Simulate Runway'}</span>
                  <span>→</span>
                </button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
