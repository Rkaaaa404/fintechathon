'use client';

import React from 'react';
import { Locale, b } from '@/lib/i18n';
import { AppRoute } from '@/types';
import { SEED_DATA, PlannerWarningOption } from '@/lib/mockData';
import { ChopMascot } from '@/components/art/ChopMascot';
import { HeaderArt } from '@/components/art/HeaderArt';
import { PlannerChart } from '@/components/art/PlannerChart';

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
    <div className="screen-container planner-screen">
      {/* ═══════════ BLUE HEADER (140px) ═══════════ */}
      <header className="screen-header-blue planner-header">
        <HeaderArt screenType="planner" />

        <div className="header-content">
          <div className="header-topbar">
            <div className="brand-row">
              <button
                className="nav-back-btn"
                onClick={() => onNavigate('/')}
                aria-label="Back to home"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <div>
                <h1 className="brand-title" style={{ fontSize: '19px' }}>
                  {b('planner_title', 'planner_sub', locale)}
                </h1>
                <div style={{ fontSize: '11px', opacity: 0.9, marginTop: '2px' }}>
                  {b('planner_subtitle', 'planner_subtitle_sub', locale)}
                </div>
              </div>
            </div>

            <div className="mascot-header-cluster">
              <ChopMascot
                bodyColor="#FFFFFF"
                faceColor="#DCE8FD"
                expression={isDelayed ? "guard" : "idle"}
                size={48}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════ SCREEN BODY ═══════════ */}
      <main className="screen-body" style={{ paddingTop: '14px' }}>
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
              100% Locked
            </div>
            <div className="planner-kpi-sub">Forward hedge @ 7.1022</div>
          </div>
        </div>

        {/* ═══════════ STACKED BAR CHART CARD ═══════════ */}
        <div className="planner-chart-card">
          {/* Scenario Selection Chips */}
          <div className="chart-scenario-chips">
            <button
              className={`scenario-chip-btn ${
                plannerScenario === 'on_time' ? 'active' : ''
              }`}
              onClick={() => onSelectScenario('on_time')}
            >
              <span>On-time 按时</span>
            </button>
            <button
              className={`scenario-chip-btn ${
                plannerScenario === 'delayed' ? 'active' : ''
              }`}
              onClick={() => onSelectScenario('delayed')}
            >
              <span>Delayed (+30d) 延后</span>
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
              <span>✨ AI-Optimized 智能分期</span>
            </button>
          </div>

          {/* Trend Trajectory Insights Banner (Clear, uncollided CAGR callouts) */}
          <div className="planner-trajectory-banner">
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

          {/* Legend Bar Matching App Colors */}
          <div className="planner-legend-bar">
            <div className="legend-items-cluster">
              <div className="legend-item">
                <span
                  className="legend-swatch"
                  style={{
                    backgroundColor: isOptimized ? '#10B981' : '#3D6BEA',
                  }}
                />
                <span>
                  {isOptimized
                    ? 'AI Liquid Buffer (流动性储备)'
                    : 'Liquid Buffer (可用储备)'}
                </span>
              </div>
              <div className="legend-item">
                <span
                  className="legend-swatch"
                  style={{
                    backgroundColor: isDelayed
                      ? '#E5484D'
                      : isOptimized
                      ? '#3D6BEA'
                      : '#F5A524',
                  }}
                />
                <span>
                  {isOptimized
                    ? 'Tranche Split (智能分期)'
                    : 'Committed Outflows (学费与刚需)'}
                </span>
              </div>
            </div>
            <div
              style={{
                fontSize: '10.5px',
                fontWeight: 700,
                color: 'var(--slate)',
              }}
            >
              $5.0k Cap Horizon
            </div>
          </div>

          {/* Dynamic SVG Stacked Bar Chart */}
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <PlannerChart scenarioKey={plannerScenario} />
          </div>
        </div>

        {/* ═══════════ DETAILED FINANCIAL METRICS DATA MATRIX ═══════════ */}
        <div className="planner-data-table-card">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <div
              style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}
            >
              Integrated Financial Metrics (综合财务指标矩阵)
            </div>
            <div style={{ fontSize: '11px', color: 'var(--slate)' }}>
              Aligned with Monthly Schedule
            </div>
          </div>

          <table className="planner-data-table">
            <thead>
              <tr>
                <th className="col-metric">Financial Metric</th>
                <th>Oct</th>
                <th>Nov</th>
                <th>Dec</th>
                <th
                  className={`highlight-col ${isDelayed ? 'danger' : ''}`}
                >
                  Jan {isOptimized ? '(Split)' : '(Due)'}
                </th>
                <th>Feb</th>
                <th>Mar</th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1: Committed Share (%) [Matching reference image's Buyout share (%)] */}
              <tr>
                <td className="metric-name">Committed Share (%)</td>
                {bars.map((b, i) => (
                  <td
                    key={b.month}
                    className={
                      i === 3
                        ? `highlight-col ${b.share > 70 ? 'danger' : ''}`
                        : ''
                    }
                    style={
                      b.share > 70
                        ? { color: 'var(--red)', fontWeight: 700 }
                        : undefined
                    }
                  >
                    {b.share}%
                  </td>
                ))}
              </tr>

              {/* Row 2: Net Monthly Flow ($) */}
              <tr>
                <td className="metric-name">Net Flow ($)</td>
                {bars.map((b, i) => {
                  const isNeg = b.netFlow.startsWith('-');
                  return (
                    <td
                      key={b.month}
                      className={i === 3 ? 'highlight-col' : ''}
                      style={{
                        color: isNeg ? 'var(--red)' : 'var(--green)',
                      }}
                    >
                      {b.netFlow}
                    </td>
                  );
                })}
              </tr>

              {/* Row 3: Runway Buffer (Days) */}
              <tr>
                <td className="metric-name">Runway Horizon</td>
                {bars.map((b, i) => (
                  <td
                    key={b.month}
                    className={i === 3 ? 'highlight-col' : ''}
                    style={
                      parseInt(b.runwayDays) < 40
                        ? { color: 'var(--red)', fontWeight: 700 }
                        : undefined
                    }
                  >
                    {b.runwayDays}
                  </td>
                ))}
              </tr>

              {/* Row 4: Safety Status Badges */}
              <tr>
                <td className="metric-name">Safety Status</td>
                {bars.map((b, i) => {
                  let pillClass = 'healthy';
                  if (
                    b.status === 'Critical Dip' ||
                    b.status === 'Tuition Due'
                  ) {
                    pillClass = isDelayed ? 'alert' : 'warning';
                  } else if (b.status === 'Optimal') {
                    pillClass = 'optimal';
                  }
                  return (
                    <td key={b.month} className={i === 3 ? 'highlight-col' : ''}>
                      <span className={`status-pill ${pillClass}`}>
                        {b.status}
                      </span>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        {/* ═══════════ MITIGATION / ADVISORY CARD ═══════════ */}
        {isDelayed ? (
          <div className="planner-warning-card">
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
                  <strong>👉 {opt.labelEn}</strong>
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'var(--slate)',
                      marginTop: '2px',
                    }}
                  >
                    {opt.labelZh}
                  </div>
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
                  Apply 优化
                </span>
              </div>
            ))}
          </div>
        ) : isOptimized ? (
          <div
            style={{
              background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
              borderRadius: '14px',
              padding: '16px',
              border: '1px solid #A7F3D0',
              marginBottom: '14px',
            }}
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
              background: 'var(--mist)',
              borderRadius: '14px',
              padding: '14px 16px',
              border: '1px solid var(--line)',
              marginBottom: '14px',
            }}
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
                fontSize: '11.5px',
                color: 'var(--slate)',
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
            fontSize: '11px',
            color: 'var(--slate)',
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
