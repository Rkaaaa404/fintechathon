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
  plannerScenario?: 'on_time' | 'delayed';
  onSelectScenario: (scenario: 'on_time' | 'delayed') => void;
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
  const schedule = SEED_DATA.plannerSchedule;

  return (
    <div className="screen-container planner-screen">
      {/* ═══════════ BLUE HEADER (150px) ═══════════ */}
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
                expression="guard"
                size={50}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════ SCREEN BODY ═══════════ */}
      <main className="screen-body" style={{ paddingTop: '16px' }}>
        {/* Chart Card */}
        <div className="planner-chart-card">
          {/* Scenario Selection Chips */}
          <div className="chart-scenario-chips">
            <button
              className={`scenario-chip-btn ${
                plannerScenario === 'on_time' ? 'active' : ''
              }`}
              onClick={() => onSelectScenario('on_time')}
            >
              <span>{b('opt_on_time', 'opt_on_time_sub', locale)}</span>
            </button>
            <button
              className={`scenario-chip-btn ${
                plannerScenario === 'delayed' ? 'active' : ''
              }`}
              onClick={() => onSelectScenario('delayed')}
            >
              <span>{b('opt_delayed', 'opt_delayed_sub', locale)}</span>
            </button>
          </div>

          {/* Dynamic SVG Chart */}
          <PlannerChart scenarioKey={plannerScenario} />
        </div>

        {/* Warning Card (when below safe line or in delayed mode) */}
        {isDelayed ? (
          <div className="planner-warning-card">
            <div className="planner-warning-title">
              ⚠️ {b('warning_below_safe', 'warning_below_safe_sub', locale)} ($450 &lt;
              $1,000)
            </div>
            <div
              style={{
                fontSize: '12px',
                color: 'var(--ink)',
                marginBottom: '10px',
              }}
            >
              Tuition due on Jan 15 precedes delayed scholarship on Feb 20. Suggested
              mitigating actions:
            </div>

            {schedule.warningOptions.map((opt: PlannerWarningOption) => (
              <div
                className="planner-option-item"
                onClick={onApplyMitigation}
                role="button"
                tabIndex={0}
                key={opt.labelEn}
              >
                👉 <strong>{opt.labelEn}</strong>{' '}
                <span className="text-chinese-sub">{opt.labelZh}</span>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              background: 'var(--mist)',
              borderRadius: '14px',
              padding: '14px',
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
              <span>Cash reserve maintains safe threshold ($1,615 min)</span>
            </div>
            <div
              style={{
                fontSize: '11.5px',
                color: 'var(--slate)',
                marginTop: '4px',
              }}
            >
              Tuition payment on Jan 15 ($2,534.30) fully covered by expected reserves.
            </div>
          </div>
        )}

        {/* Footer Disclaimer Note */}
        <div className="app-footer-disclaimer">
          {b('planner_footer_note', 'planner_footer_note_sub', locale)}
        </div>
      </main>
    </div>
  );
};
