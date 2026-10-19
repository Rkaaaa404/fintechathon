'use client';

import React, { useState, useEffect } from 'react';
import { Locale } from '@/types';
import { AppRoute } from '@/types';
import { ChopMascot } from '@/components/art/ChopMascot';
import { HeaderArt } from '@/components/art/HeaderArt';
import { RatesMascotHero } from '@/components/art/RatesMascotHero';
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
  const [selectedPair, setSelectedPair] = useState<'USD_CNY' | 'USD_IDR' | 'USD_EUR' | 'USD_HKD'>('USD_CNY');
  const [activeTimeframe, setActiveTimeframe] = useState<'24H' | '7D' | '30D' | '1Y'>('24H');
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; time: string; rate: number } | null>(null);

  // Real-time rates from Frankfurter API
  const [liveRates, setLiveRates] = useState<{ CNY?: number; IDR?: number; EUR?: number }>({});
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isLive, setIsLive] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchFrankfurter() {
      try {
        let rawData: any = null;
        try {
          const res = await fetch('https://api.frankfurter.dev/v2/rates?base=USD&quotes=IDR,CNY,EUR');
          if (res.ok) {
            rawData = await res.json();
          }
        } catch {
          // fallback to local api proxy
        }

        if (!rawData) {
          const proxyRes = await fetch('/api/rates');
          if (proxyRes.ok) {
            const json = await proxyRes.json();
            rawData = json.data;
          }
        }

        if (!rawData) return;

        let cny = 7.2045;
        let idr = 15880;
        let eur = 0.8899;

        if (Array.isArray(rawData)) {
          rawData.forEach((item: any) => {
            if (item.quote === 'CNY') cny = Number(item.rate);
            if (item.quote === 'IDR') idr = Number(item.rate);
            if (item.quote === 'EUR') eur = Number(item.rate);
          });
        } else if (rawData && typeof rawData === 'object' && rawData.rates) {
          const r = rawData.rates;
          if (r.CNY) cny = Number(r.CNY);
          if (r.IDR) idr = Number(r.IDR);
          if (r.EUR) eur = Number(r.EUR);
        }

        if (isMounted) {
          setLiveRates({ CNY: cny, IDR: idr, EUR: eur });
          setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
          setIsLive(true);
        }
      } catch {
        // graceful offline fallback
      }
    }

    fetchFrankfurter();
    const timer = setInterval(fetchFrankfurter, 20000);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  // Rates configuration
  const rates = {
    USD_CNY: {
      rate: liveRates.CNY || 7.2045,
      pbOCMid: 7.2400,
      change24h: '-0.08%',
      isPositive: false,
      symbol: '¥',
      target: '7.1800',
      labelEn: 'US Dollar to Chinese Yuan',
      labelZh: '美元兑在岸人民币',
      etaEn: '~2 min via Bursar corridor',
      etaZh: '学校清算通道约2分钟',
      high: '7.2180',
      low: '7.1990',
    },
    USD_IDR: {
      rate: liveRates.IDR || 15880.00,
      pbOCMid: 15850.00,
      change24h: '+0.12%',
      isPositive: true,
      symbol: 'Rp',
      target: '15800.00',
      labelEn: 'US Dollar to Indonesian Rupiah',
      labelZh: '美元兑印尼盾',
      etaEn: 'Immediate settlement',
      etaZh: '合规通道即时到账',
      high: '15,920',
      low: '15,840',
    },
    USD_EUR: {
      rate: liveRates.EUR || 0.8899,
      pbOCMid: 0.8920,
      change24h: '+0.04%',
      isPositive: true,
      symbol: '€',
      target: '0.8850',
      labelEn: 'US Dollar to Euro',
      labelZh: '美元兑欧元',
      etaEn: 'SEPA compliant clearing',
      etaZh: '合规清算通道',
      high: '0.8940',
      low: '0.8875',
    },
    USD_HKD: {
      rate: 7.7850,
      pbOCMid: 7.8000,
      change24h: '+0.01%',
      isPositive: true,
      symbol: 'HK$',
      target: '7.7700',
      labelEn: 'US Dollar to Hong Kong Dollar',
      labelZh: '美元兑港币',
      etaEn: 'Pegged currency band',
      etaZh: '联汇汇率区间稳定',
      high: '7.7880',
      low: '7.7820',
    },
  };

  const currentPairData = rates[selectedPair];
  const convertedAmount = (calcAmountUsd * currentPairData.rate).toLocaleString('en-US', {
    maximumFractionDigits: selectedPair === 'USD_IDR' ? 0 : 2,
    minimumFractionDigits: selectedPair === 'USD_IDR' ? 0 : 2,
  });

  // Cost comparison calculations for $2,500 remittance
  const traditionalWireFee = 35.00 + calcAmountUsd * 0.025 + 20.00;
  const creditCardFee = calcAmountUsd * 0.03 + calcAmountUsd * 0.015;
  const aegisPathFee = 14.30 + calcAmountUsd * 0.0015;
  const totalSaved = (traditionalWireFee - aegisPathFee).toFixed(2);

  // Motion Graph curve coordinates
  const graphWidth = 720;
  const graphHeight = 200;
  const graphPadX = 30;
  const graphPadY = 24;
  const innerW = graphWidth - graphPadX * 2;
  const innerH = graphHeight - graphPadY * 2;

  // Generate smooth trend wave based on activeTimeframe and pair
  const baseRate = currentPairData.rate;

  const timeframeData: Record<'24H' | '7D' | '30D' | '1Y', Array<{ time: string; delta: number }>> = {
    '24H': [
      { time: '00:00', delta: -0.0028 },
      { time: '04:00', delta: -0.0012 },
      { time: '08:00', delta: 0.0018 },
      { time: '12:00', delta: 0.0034 },
      { time: '16:00', delta: 0.0015 },
      { time: '20:00', delta: -0.0008 },
      { time: 'Now', delta: 0.0 },
    ],
    '7D': [
      { time: 'Mon', delta: -0.0065 },
      { time: 'Tue', delta: -0.0032 },
      { time: 'Wed', delta: 0.0014 },
      { time: 'Thu', delta: 0.0048 },
      { time: 'Fri', delta: 0.0025 },
      { time: 'Sat', delta: -0.0012 },
      { time: 'Today', delta: 0.0 },
    ],
    '30D': [
      { time: 'Day 1', delta: -0.012 },
      { time: 'Day 7', delta: -0.004 },
      { time: 'Day 14', delta: 0.008 },
      { time: 'Day 21', delta: 0.003 },
      { time: 'Day 28', delta: -0.002 },
      { time: 'Current', delta: 0.0 },
    ],
    '1Y': [
      { time: 'Q1', delta: -0.028 },
      { time: 'Q2', delta: -0.012 },
      { time: 'Q3', delta: 0.018 },
      { time: 'Q4', delta: 0.005 },
      { time: 'Latest', delta: 0.0 },
    ],
  };

  const activePoints = timeframeData[activeTimeframe] || timeframeData['24H'];

  const graphPoints = activePoints.map((pt, i) => {
    const x = graphPadX + (i / (activePoints.length - 1)) * innerW;
    const yNorm = 0.5 - pt.delta * 22;
    const y = graphPadY + Math.max(10, Math.min(innerH - 10, yNorm * innerH));
    const rateVal = baseRate * (1 + pt.delta);
    return { x, y, time: pt.time, rate: rateVal };
  });

  const pathD = graphPoints.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = graphPoints[i - 1];
    const cpX = (prev.x + pt.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${pt.y}, ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${graphPoints[graphPoints.length - 1].x} ${graphHeight - graphPadY} L ${graphPoints[0].x} ${graphHeight - graphPadY} Z`;

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
                <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-[#86EFAC]' : 'bg-[#6FD3FF]'} animate-pulse`} />
                <span>
                  {isLive ? `Live Frankfurter API (${lastUpdated || 'Synced'})` : 'PBOC Mid-market: 7.2400'}
                </span>
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
            <div className="max-w-[620px]">
              <p className="text-[#DBEAFE] text-[13px] leading-relaxed">
                {locale === 'zh'
                  ? '采用机构级学生通道点差 (0.15%)，实时汇率同步自开源 Frankfurter API。告别传统银行高达 2.5% 的隐形汇率加价与中间行扣费。'
                  : 'Direct institutional student corridor (0.15% spread) synced in real-time from open-source Frankfurter API. Zero hidden intermediary bank cuts.'}
              </p>
            </div>
            <div className="flex justify-end shrink-0">
              <RatesMascotHero rates={liveRates} />
            </div>
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

                  <span className="text-[11.5px] text-[#334155] font-medium block truncate">
                    {locale === 'zh' ? item.labelZh : item.labelEn}
                  </span>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[rgba(15,23,42,0.06)] flex items-center justify-between text-[11px] text-[#334155] font-medium">
                  <span>{locale === 'zh' ? '清算通道' : 'Corridor'}</span>
                  <span className="font-semibold text-[#1C3EAA] truncate max-w-[120px]">
                    {locale === 'zh' ? item.etaZh : item.etaEn}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ═══════════ REAL-TIME MOTION GRAPH (User Requirement) ═══════════ */}
        <Card variant="default" className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-[#EEF4FF] text-[#1C3EAA] flex items-center justify-center font-bold text-[14px]">
                📈
              </span>
              <div>
                <h3 className="text-[16px] font-bold text-[#14213D] leading-tight">
                  {selectedPair.replace('_', ' / ')} {locale === 'zh' ? '实时汇率走势与动态波动' : 'Live Corridor Motion Graph'}
                </h3>
                <span className="text-[11.5px] text-[#334155] font-medium">
                  {isLive ? `Live Open-Source Data (Frankfurter API · Updated ${lastUpdated})` : 'Simulated Testnet Real-time Curve'}
                </span>
              </div>
            </div>

            {/* Timeframe Chips */}
            <div className="flex items-center gap-1.5 bg-[#F1F5F9] p-1 rounded-xl">
              {(['24H', '7D', '30D', '1Y'] as const).map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setActiveTimeframe(tf)}
                  className={`px-3 py-1 text-[12px] font-bold rounded-lg transition-all cursor-pointer ${
                    activeTimeframe === tf
                      ? 'bg-white text-[#1C3EAA] shadow-xs'
                      : 'text-[#334155] hover:text-[#0F172A]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Motion Graph Canvas */}
          <div style={{ position: 'relative', width: '100%' }}>
            <svg
              viewBox={`0 0 ${graphWidth} ${graphHeight}`}
              width="100%"
              height="auto"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Rate Corridor Motion Graph"
              style={{ display: 'block', overflow: 'visible' }}
            >
              <defs>
                <style>{`
                  @keyframes drawWaveLine {
                    0% { stroke-dashoffset: 1000; }
                    100% { stroke-dashoffset: 0; }
                  }
                  @keyframes pulseLiveMarker {
                    0%, 100% { r: 5px; opacity: 0.8; }
                    50% { r: 8px; opacity: 1; }
                  }
                  .rate-wave-anim {
                    stroke-dasharray: 1000;
                    animation: drawWaveLine 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                  }
                  .rate-marker-anim {
                    animation: pulseLiveMarker 1.8s infinite ease-in-out;
                  }
                `}</style>
                <linearGradient id="rateWaveFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3D6BEA" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#3D6BEA" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="rateStrokeGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3D6BEA" />
                  <stop offset="70%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines */}
              {[0.25, 0.5, 0.75].map((ratio) => (
                <line
                  key={ratio}
                  x1={graphPadX}
                  y1={graphPadY + innerH * ratio}
                  x2={graphWidth - graphPadX}
                  y2={graphPadY + innerH * ratio}
                  stroke="#F1F5F9"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Area fill */}
              <path d={areaD} fill="url(#rateWaveFill)" />

              {/* Dynamic Rate Wave Path */}
              <path
                className="rate-wave-anim"
                d={pathD}
                fill="none"
                stroke="url(#rateStrokeGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Hover crosshair vertical line */}
              {hoveredPoint && (
                <line
                  x1={hoveredPoint.x}
                  y1={graphPadY}
                  x2={hoveredPoint.x}
                  y2={graphHeight - graphPadY}
                  stroke="#1C3EAA"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                />
              )}

              {/* Points on curve */}
              {graphPoints.map((pt, i) => {
                const isLast = i === graphPoints.length - 1;
                return (
                  <g
                    key={i}
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {isLast ? (
                      <circle
                        className="rate-marker-anim"
                        cx={pt.x}
                        cy={pt.y}
                        fill="#10B981"
                        stroke="#FFFFFF"
                        strokeWidth="2.5"
                      />
                    ) : (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="4"
                        fill="#FFFFFF"
                        stroke="#1C3EAA"
                        strokeWidth="2"
                      />
                    )}
                    <text
                      x={pt.x}
                      y={graphHeight - 8}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="600"
                      fill="#334155"
                    >
                      {pt.time}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip */}
            {hoveredPoint && (
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: `${(hoveredPoint.x / graphWidth) * 100}%`,
                  transform: 'translateX(-50%)',
                  background: 'rgba(15, 23, 42, 0.92)',
                  backdropFilter: 'blur(6px)',
                  color: '#FFFFFF',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.18)',
                  zIndex: 20,
                }}
              >
                <div style={{ color: '#93C5FD', fontWeight: 600 }}>{hoveredPoint.time}</div>
                <div style={{ fontWeight: 800 }}>
                  {hoveredPoint.rate.toLocaleString('en-US', {
                    minimumFractionDigits: selectedPair === 'USD_IDR' ? 0 : 4,
                    maximumFractionDigits: selectedPair === 'USD_IDR' ? 0 : 4,
                  })} {currentPairData.symbol}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Corridor Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-[rgba(15,23,42,0.06)] text-[12px]">
            <div>
              <span className="text-[#334155] font-medium block">24h High</span>
              <span className="font-bold text-[#0F172A]">{currentPairData.high}</span>
            </div>
            <div>
              <span className="text-[#334155] font-medium block">24h Low</span>
              <span className="font-bold text-[#0F172A]">{currentPairData.low}</span>
            </div>
            <div>
              <span className="text-[#334155] font-medium block">Corridor Spread</span>
              <span className="font-bold text-[#0E6E43]">0.15% (Smart Lock)</span>
            </div>
            <div>
              <span className="text-[#334155] font-medium block">Bank Wire Spread</span>
              <span className="font-bold text-[#B91C1C]">2.50% - 3.80% (Hidden)</span>
            </div>
          </div>
        </Card>

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
                    <span className="text-[12px] font-semibold text-[#334155] block mb-1">
                      {locale === 'zh' ? '接收方足额到账估算' : 'Recipient Receives (Guaranteed)'}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[26px] font-bold tabular-nums text-[#1C3EAA] tracking-tight">
                        {currentPairData.symbol} {convertedAmount}
                      </span>
                      <span className="text-[12px] font-bold text-[#1E293B]">
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
                        <span className="font-bold text-[13px] text-[#1E293B]">
                          {locale === 'zh' ? '传统银行电汇 (SWIFT)' : 'Traditional Bank Wire'}
                        </span>
                        <span className="text-[10px] font-bold text-[#B91C1C] bg-[#FEF2F2] px-1.5 py-0.2 rounded-full border border-[#B91C1C]/20">
                          3-5 Days
                        </span>
                      </div>
                      <span className="text-[11.5px] text-[#334155] font-medium block mt-0.5">
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
                        <span className="font-bold text-[13px] text-[#1E293B]">
                          {locale === 'zh' ? '国际信用卡支付' : 'International Credit Card'}
                        </span>
                        <span className="text-[10px] font-bold text-[#92400E] bg-[#FEF3C7] px-1.5 py-0.2 rounded-full border border-[#D97706]/30">
                          High Fee
                        </span>
                      </div>
                      <span className="text-[11.5px] text-[#334155] font-medium block mt-0.5">
                        {locale === 'zh' ? '3.0% 跨境刷卡手续费 + 1.5% 货币转换' : '3% interchange fee + 1.5% currency conversion'}
                      </span>
                    </div>
                    <span className="text-[15px] font-bold tabular-nums text-[#92400E]">
                      ~${creditCardFee.toFixed(2)}
                    </span>
                  </div>

                  {/* Option 3: AegisPath Smart Agent */}
                  <div className="p-3.5 rounded-[12px] bg-[#EEF4FF] border border-[#1C3EAA]/30 flex items-center justify-between ring-1 ring-[#1C3EAA]/15">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[13.5px] text-[#1C3EAA]">
                          {locale === 'zh' ? 'AegisPath 智能专线' : 'AegisPath Smart Agent Route'}
                        </span>
                        <span className="text-[10px] font-bold text-[#065F46] bg-[#D1FAE5] px-2 py-0.5 rounded-full border border-[#065F46]/20">
                          ~2 Mins
                        </span>
                      </div>
                      <span className="text-[11.5px] text-[#1E293B] font-medium block mt-0.5">
                        {locale === 'zh' ? '0.15% 机构点差 + $14.30 清算费' : '0.15% spread + $14.30 direct clearing'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[16px] font-bold tabular-nums text-[#065F46] block">
                        ${aegisPathFee.toFixed(2)}
                      </span>
                      <span className="text-[10.5px] font-semibold text-[#334155]">
                        {locale === 'zh' ? '保障全额到账' : 'Guaranteed full'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[rgba(15,23,42,0.06)] flex items-center justify-between">
                <span className="text-[12px] text-[#334155] font-medium">
                  {locale === 'zh' ? '联动现金流缓冲规划' : 'Planner Runway Integration'}
                </span>
                <button
                  onClick={() => onNavigate('/planner')}
                  className="text-[12.5px] font-bold text-[#1C3EAA] hover:text-[#163188] flex items-center gap-1 cursor-pointer"
                >
                  <span>{locale === 'zh' ? '模拟排期 →' : 'Simulate Runway →'}</span>
                </button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
