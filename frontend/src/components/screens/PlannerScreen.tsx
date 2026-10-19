'use client';

import React from 'react';
import { Locale, b } from '@/lib/i18n';
import { AppRoute } from '@/types';
import { SEED_DATA, PlannerWarningOption } from '@/lib/mockData';
import { ChopMascot } from '@/components/art/ChopMascot';
import { HeaderArt } from '@/components/art/HeaderArt';
import { PlannerChart } from '@/components/art/PlannerChart';
import SplitText from '@/components/SplitText';
import { PlannerRunwayIcon } from '@/components/icons/AegisIcons';

import { Card, CardBadge, Badge } from '@/components/ui/Card';

interface PlannerScreenProps {
  onNavigate: (route: AppRoute) => void;
  plannerScenario?: 'on_time' | 'delayed' | 'optimized';
  onSelectScenario: (scenario: 'on_time' | 'delayed' | 'optimized') => void;
  onApplyMitigation: () => void;
  locale?: Locale;
}

export const PlannerScreen: React.FC<PlannerScreenProps> = ({
  onNavigate,
  plannerScenario = 'on_time',
  onSelectScenario,
  onApplyMitigation,
  locale = 'en',
}) => {
  const isDelayed = plannerScenario === 'delayed';
  const isOptimized = plannerScenario === 'optimized';
  const schedule = SEED_DATA.plannerSchedule;
  const scenario = schedule.scenarios[plannerScenario] || schedule.scenarios.on_time;
  const bars = scenario.bars || [
    { month: "Oct", committed: 1.8, reserve: 3.0, total: 4.8, share: 38, netFlow: "+$450", runwayDays: "180d", status: "Healthy" },
    { month: "Nov", committed: 1.7, reserve: 2.7, total: 4.4, share: 39, netFlow: "-$120", runwayDays: "165d", status: "Healthy" },
    { month: "Dec", committed: 1.9, reserve: 2.3, total: 4.2, share: 45, netFlow: "-$200", runwayDays: "145d", status: "Healthy" },
    { month: "Jan", committed: 3.2, reserve: 1.1, total: 4.3, share: 74, netFlow: "-$1,234", runwayDays: "95d", status: "Tuition Due" },
    { month: "Feb", committed: 1.6, reserve: 2.1, total: 3.7, share: 43, netFlow: "+$600", runwayDays: "120d", status: "Healthy" },
    { month: "Mar", committed: 1.5, reserve: 2.6, total: 4.1, share: 37, netFlow: "+$850", runwayDays: "150d", status: "Healthy" }
  ];

  return (
    <div className="planner-screen pb-10 w-full">
      {/* ═══════════ LUMINOUS PLANNER HEADER (1200px aligned) ═══════════ */}
      <header className="screen-header-blue planner-header relative overflow-hidden rounded-[20px] p-6 md:p-8 w-full mb-6">
        <HeaderArt screenType="planner" />

        <div className="header-content relative z-10 w-full">
          <div className="flex items-center justify-between mb-3">
            <div className="brand-row flex items-center gap-2">
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
                <span className="p-1 rounded-lg bg-white/20 text-white">
                  <PlannerRunwayIcon size={20} color="#FFFFFF" />
                </span>
                <h1 className="brand-title text-white font-bold text-[20px] tracking-tight">
                  <SplitText
                    text={locale === 'zh' ? '现金流调度与缓冲规划' : 'Buffer & Cashflow Planner'}
                    tag="span"
                    delay={25}
                    duration={0.6}
                    effect="fade"
                  />
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-[12px] font-semibold px-3 py-1 rounded-full border border-white/25 flex items-center gap-1.5 ${
                isDelayed
                  ? 'bg-[#B91C1C]/40 text-white'
                  : isOptimized
                  ? 'bg-[#0E6E43]/40 text-white'
                  : 'bg-white/20 text-white'
              }`}>
                <span>
                  {isDelayed
                    ? (locale === 'zh' ? '⚠️ 延期风险 (28d)' : '⚠️ Delay Risk (28d)')
                    : isOptimized
                    ? (locale === 'zh' ? '✨ 智能优化 (180d)' : '✨ AI Optimized (180d)')
                    : (locale === 'zh' ? '安全缓冲充足 (95d)' : 'Sufficient Buffer (95d)')}
                </span>
              </span>
              <div className="mascot-header-cluster">
                <ChopMascot
                  bodyColor="#FFFFFF"
                  faceColor="#DCE8FD"
                  expression={isDelayed ? "guard" : "idle"}
                  size={52}
                />
              </div>
            </div>
          </div>

          <div className="mt-1 pr-[140px] md:pr-[180px]">
            <p className="text-[#DBEAFE] text-[13px] max-w-[660px] leading-relaxed">
              {b('planner_subtitle', 'planner_subtitle_sub', locale)}
            </p>
          </div>
        </div>
      </header>

      {/* ═══════════ SCREEN BODY (W-FULL ALIGNED) ═══════════ */}
      <main className="screen-body w-full">
        {/* 4-Tile Financial KPI Grid */}
        <div className="planner-kpi-grid">
          <div className="planner-kpi-card">
            <div className="planner-kpi-label">Committed Outflows</div>
            <div className="planner-kpi-val">$6,234.30</div>
            <div className="planner-kpi-sub">Tuition + living minimum</div>
          </div>

          <div className="planner-kpi-card">
            <div className="planner-kpi-label">Safe Horizon</div>
            <div
              className="planner-kpi-val"
              style={{
                color: isDelayed
                  ? 'var(--red)'
                  : isOptimized
                  ? 'var(--green)'
                  : 'var(--blue)',
              }}
            >
              {isDelayed ? '28 Days ⚠️' : isOptimized ? '180 Days ✨' : '150 Days'}
            </div>
            <div className="planner-kpi-sub">Buffer above safe minimum</div>
          </div>

          <div className="planner-kpi-card">
            <div className="planner-kpi-label">Monthly Net Burn</div>
            <div className="planner-kpi-val">-$280/mo</div>
            <div className="planner-kpi-sub">Normalized operating burn</div>
          </div>

          <div className="planner-kpi-card">
            <div className="planner-kpi-label">FX Protection</div>
            <div className="planner-kpi-val" style={{ color: 'var(--blue)' }}>
              {locale === 'zh' ? '全额锁定' : 'Fully Locked'}
            </div>
            <div className="planner-kpi-sub">Forward hedge @ 7.1022</div>
          </div>
        </div>

        {/* ═══════════ STACKED BAR CHART CARD ═══════════ */}
        <Card className="p-6 mb-6">
          {/* Scenario Selection Chips */}
          <div className="chart-scenario-chips mb-3">
            <button
              className={`scenario-chip-btn ${
                plannerScenario === 'on_time' ? 'active' : ''
              }`}
              onClick={() => onSelectScenario('on_time')}
            >
              <span>{locale === 'zh' ? '按时 (1月15日)' : 'On-time'}</span>
            </button>
            <button
              className={`scenario-chip-btn ${
                plannerScenario === 'delayed' ? 'active' : ''
              }`}
              onClick={() => onSelectScenario('delayed')}
            >
              <span>{locale === 'zh' ? '延后 (+30天)' : 'Delayed (+30d)'}</span>
            </button>
            <button
              className={`scenario-chip-btn ${
                plannerScenario === 'optimized' ? 'active' : ''
              }`}
              onClick={() => onSelectScenario('optimized')}
              style={
                plannerScenario === 'optimized'
                  ? {
                      background: 'linear-gradient(135deg, #10B981, #059669)',
                      borderColor: '#10B981',
                    }
                  : undefined
              }
            >
              <span>{locale === 'zh' ? '✨ 智能分期优化' : '✨ AI-Optimized'}</span>
            </button>
          </div>

          {/* Trend Trajectory Insights Banner */}
          <div className="planner-trajectory-banner mb-3">
            <div className="planner-trajectory-pill" style={{ color: 'var(--ink)' }}>
              <span>📉</span>
              <span>{scenario.cagr1}</span>
            </div>
            <div
              className="planner-trajectory-pill"
              style={{
                color: isDelayed
                  ? 'var(--red)'
                  : isOptimized
                  ? 'var(--green)'
                  : 'var(--blue)',
              }}
            >
              <span>{isDelayed ? '⚠️' : '📈'}</span>
              <span>{scenario.cagr2}</span>
            </div>
          </div>

          {/* Legend Bar Matching App Colors (English-only tokens) */}
          <div className="planner-legend-bar mb-3">
            <div className="legend-items-cluster">
              <div className="legend-item">
                <span
                  className="legend-swatch"
                  style={{
                    backgroundColor: isOptimized ? '#0E6E43' : '#1C3EAA',
                  }}
                />
                <span>
                  {isOptimized ? 'AI Liquid Buffer (Reserve)' : 'Liquid Buffer (Available)'}
                </span>
              </div>
              <div className="legend-item">
                <span
                  className="legend-swatch"
                  style={{
                    backgroundColor: isDelayed
                      ? '#B91C1C'
                      : isOptimized
                      ? '#1C3EAA'
                      : '#D97706',
                  }}
                />
                <span>
                  {isOptimized ? 'Tranche Split (AI)' : 'Committed Outflows (Tuition)'}
                </span>
              </div>
            </div>
            <div
              style={{
                fontSize: '11.5px',
                fontWeight: 700,
                color: '#334155',
              }}
            >
              $5.0k Cap Horizon
            </div>
          </div>

          {/* Dynamic SVG Stacked Bar Chart */}
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <PlannerChart scenarioKey={plannerScenario} />
          </div>
        </Card>

        {/* ═══════════ DETAILED FINANCIAL METRICS DATA MATRIX ═══════════ */}
        <Card className="p-5 md:p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h2 className="text-[18px] font-semibold text-[#14213D] leading-none">
              Integrated Financial Metrics
            </h2>
            <span className="text-[13px] text-[#334155] font-medium">
              Aligned with Monthly Schedule
            </span>
          </div>

          <div className="planner-data-table-container">
            <table className="planner-data-table">
              <thead>
                <tr>
                  <th className="col-metric">Financial Metric</th>
                  <th>Oct</th>
                  <th>Nov</th>
                  <th>Dec</th>
                  <th className="col-jan-highlight">
                    Jan {isOptimized ? '(Split)' : '(Due)'}
                  </th>
                  <th>Feb</th>
                  <th>Mar</th>
                </tr>
              </thead>
              <tbody>
                {/* Row 1: Committed Share (%) [74% as the only red number] */}
                <tr>
                  <td className="col-metric">Committed Share (%)</td>
                  {bars.map((b, i) => {
                    const isJan = i === 3;
                    const isRed = isJan && b.share > 70;
                    return (
                      <td
                        key={b.month}
                        className={isJan ? 'col-jan-highlight' : ''}
                        style={{
                          color: isRed ? '#B91C1C' : '#14213D',
                          fontWeight: isRed ? 700 : 500,
                        }}
                      >
                        {b.share}%
                      </td>
                    );
                  })}
                </tr>

                {/* Row 2: Net Monthly Flow ($) - green for positive, red for negative with +/- */}
                <tr>
                  <td className="col-metric">Net Flow ($)</td>
                  {bars.map((b, i) => {
                    const isJan = i === 3;
                    const isNeg = b.netFlow.startsWith('-');
                    return (
                      <td
                        key={b.month}
                        className={isJan ? 'col-jan-highlight' : ''}
                        style={{
                          color: isNeg ? '#B91C1C' : '#0E6E43',
                          fontWeight: 600,
                        }}
                      >
                        {b.netFlow}
                      </td>
                    );
                  })}
                </tr>

                {/* Row 3: Runway Buffer (Days) */}
                <tr>
                  <td className="col-metric">Runway Horizon</td>
                  {bars.map((b, i) => {
                    const isJan = i === 3;
                    return (
                      <td
                        key={b.month}
                        className={isJan ? 'col-jan-highlight' : ''}
                        style={{ fontWeight: 500 }}
                      >
                        {b.runwayDays}
                      </td>
                    );
                  })}
                </tr>

                {/* Row 4: Safety Status Badges */}
                <tr>
                  <td className="col-metric">Safety Status</td>
                  {bars.map((b, i) => {
                    const isJan = i === 3;
                    let badgeVariant: 'green' | 'amber' | 'red' = 'green';
                    if (b.status === 'Critical Dip') {
                      badgeVariant = isDelayed ? 'red' : 'amber';
                    } else if (b.status === 'Tuition Due') {
                      badgeVariant = 'amber';
                    }
                    return (
                      <td key={b.month} className={isJan ? 'col-jan-highlight' : ''}>
                        <Badge variant={badgeVariant}>
                          {b.status}
                        </Badge>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* ═══════════ MITIGATION / ADVISORY CARD (24px top margin, 16px 20px padding) ═══════════ */}
        {isDelayed ? (
          <div className="planner-warning-card mt-6 p-4 md:px-5 rounded-[16px] mb-4">
            <div
              className="planner-warning-title"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>
                {b('warning_below_safe', 'warning_below_safe_sub', locale)} ($300
                &lt; $1,000)
              </span>
            </div>
            <div
              style={{
                fontSize: '12px',
                color: 'var(--ink)',
                marginBottom: '12px',
                lineHeight: 1.5,
              }}
            >
              Tuition due on Jan 15 precedes delayed scholarship arrival on Feb
              20. Estimated reserve buffer dips below safe threshold. Recommended
              AI mitigation:
            </div>

            {schedule.warningOptions.map((opt: PlannerWarningOption) => (
              <div
                className="planner-option-item"
                onClick={onApplyMitigation}
                role="button"
                tabIndex={0}
                key={opt.labelEn}
              >
                <div>
                  <strong>👉 {locale === 'zh' ? opt.labelZh : opt.labelEn}</strong>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--blue)',
                    background: '#E8EFFE',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {locale === 'zh' ? '应用优化' : 'Apply'}
                </span>
              </div>
            ))}
          </div>
        ) : isOptimized ? (
          <div
            style={{
              background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
              border: '1px solid #A7F3D0',
            }}
            className="mt-6 p-4 md:px-5 rounded-[16px] mb-4"
          >
            <div
              style={{
                fontSize: '13.5px',
                fontWeight: 700,
                color: '#065F46',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>AI Multi-Tranche Active (智能分期保护已生效)</span>
            </div>
            <div
              style={{
                fontSize: '12px',
                color: '#047857',
                marginTop: '6px',
                lineHeight: 1.5,
              }}
            >
              • Tuition ¥18,000 split:{' '}
              <strong>¥9,000 ($1,267.15)</strong> on Jan 15 +{' '}
              <strong>¥9,000 ($1,267.15)</strong> on Feb 20.
              <br />
              • FX rate locked at <strong>7.1022 CNY/USD</strong> forward hedge.
              <br />
              • Liquid reserve buffer stays above <strong>$1,900.00</strong>{' '}
              across all periods (Zero deficit).
            </div>
          </div>
        ) : (
          <div
            style={{
              background: '#F8FAFC',
              border: '1px solid rgba(15,23,42,0.08)',
            }}
            className="mt-6 p-4 md:px-5 rounded-[16px] mb-4"
          >
            <div
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--green)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Cash reserve maintains safe threshold ($1,100+ buffer min)</span>
            </div>
            <div
              style={{
                fontSize: '12.5px',
                color: '#334155',
                marginTop: '4px',
              }}
            >
              Tuition payment on Jan 15 ($2,534.30) fully covered by expected
              reserves. Normal scholarship arrival on Jan 10.
            </div>
          </div>
        )}

        {/* Footer Disclaimer Note */}
        <div
          className="app-footer-disclaimer"
          style={{
            textAlign: 'center',
            fontSize: '12px',
            color: '#475569',
            lineHeight: 1.4,
            padding: '6px 0',
          }}
        >
          {b('planner_footer_note', 'planner_footer_note_sub', locale)}
        </div>
      </main>
    </div>
  );
};
