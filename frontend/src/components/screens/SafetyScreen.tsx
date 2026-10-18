'use client';

import React from 'react';
import { Locale, b } from '@/lib/i18n';
import { AppRoute } from '@/types';
import { ChopMascot } from '@/components/art/ChopMascot';
import { HeaderArt } from '@/components/art/HeaderArt';
import { RadialAttackMap } from '@/components/art/RadialAttackMap';
import { FiveSegmentBar } from '@/components/art/FiveSegmentBar';

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
    <div className="screen-container safety-screen">
      {/* ═══════════ BLUE HEADER (150px) ═══════════ */}
      <header className="screen-header-blue safety-header">
        <HeaderArt screenType="safety" />

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
                  {b('safety_title', 'safety_sub', locale)}
                </h1>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    marginTop: '2px',
                  }}
                >
                  {activeCount}/3{' '}
                  {b('safety_header_active', 'safety_header_active_sub', locale)}
                </div>
              </div>
            </div>

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
      </header>

      {/* ═══════════ SCREEN BODY ═══════════ */}
      <main className="screen-body" style={{ paddingTop: '16px' }}>
        {/* Night Card: Radial Attack Map */}
        <div className="night-card-radial">
          <div className="night-card-header">
            <div className="night-card-title">
              🛡️ {b('attack_blocked_title', 'attack_blocked_sub', locale)}
            </div>
            <div className="night-card-sub">
              Hidden instruction in an invoice · 发票中的隐藏指令
            </div>
          </div>

          {/* Interactive Radial Attack Map SVG */}
          <div className="radial-map-container" id="radial-map-wrapper">
            <RadialAttackMap
              fundsLost={fundsLost}
              outerActive={outerActive}
              middleActive={middleActive}
              innerActive={innerActive}
              isReplaying={isAttackReplaying}
            />
          </div>

          {/* Three Defense Rings Status Breakdown */}
          <div className="rings-status-breakdown">
            {/* 1. Outer Ring: Privacy Filter */}
            <div className="ring-status-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  className={`ring-toggle-pill ${outerActive ? '' : 'off'}`}
                  onClick={() => onToggleLayer('privacy')}
                  aria-label="Toggle Outer Privacy Filter"
                >
                  {outerActive ? 'ON' : 'OFF'}
                </button>
                <div>
                  <strong style={{ color: '#fff' }}>Outer 外环</strong>
                  <span className="ring-name">Privacy filter 隐私过滤</span>
                </div>
              </div>
              <span
                className={`ring-verdict ${outerActive ? 'flagged' : 'bypassed'}`}
              >
                {outerActive ? 'Flagged 已标记' : 'Bypassed 已穿透'}
              </span>
            </div>

            {/* 2. Middle Ring: Spending Rules */}
            <div className="ring-status-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  className={`ring-toggle-pill ${middleActive ? '' : 'off'}`}
                  onClick={() => onToggleLayer('rules')}
                  aria-label="Toggle Middle Spending Rules"
                >
                  {middleActive ? 'ON' : 'OFF'}
                </button>
                <div>
                  <strong style={{ color: '#fff' }}>Middle 中环</strong>
                  <span className="ring-name">Spending rules 支出规则</span>
                </div>
              </div>
              <span
                className={`ring-verdict ${middleActive ? 'refuse' : 'bypassed'}`}
              >
                {middleActive ? 'Would refuse 将拒绝' : 'Bypassed 已穿透'}
              </span>
            </div>

            {/* 3. Inner Ring: Bank-side Limit */}
            <div className="ring-status-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  className={`ring-toggle-pill ${innerActive ? '' : 'off'}`}
                  onClick={() => onToggleLayer('bank')}
                  aria-label="Toggle Inner Bank-side Limit"
                >
                  {innerActive ? 'ON' : 'OFF'}
                </button>
                <div>
                  <strong style={{ color: '#fff' }}>Inner 内环</strong>
                  <span className="ring-name">Bank-side limit 银行限额</span>
                </div>
              </div>
              <span className={`ring-verdict ${innerActive ? 'ok' : 'bypassed'}`}>
                {innerActive ? 'Enforced 已拦截' : 'Bypassed 已穿透'}
              </span>
            </div>
          </div>

          {/* Replay Attack Button */}
          <div className="replay-controls-row">
            <button
              className="btn-replay-attack"
              id="btn-replay-attack"
              onClick={onReplayAttack}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              <span>{b('btn_replay_attack', 'btn_replay_attack_sub', locale)}</span>
            </button>
          </div>
        </div>

        {/* Today's Allowance & Payees Summary Card */}
        <div className="evidence-source-card">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
            <span
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--ink)',
              }}
            >
              Today&apos;s allowance 今日额度
            </span>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--blue)',
              }}
            >
              $200 / $1,000 used
            </span>
          </div>
          <FiveSegmentBar filledCount={1} total={5} />

          <div
            style={{
              fontSize: '11.5px',
              color: 'var(--slate)',
              margin: '10px 0 6px 0',
            }}
          >
            Allowed payees 已授权收款人:
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span
              style={{
                background: 'var(--sky)',
                color: 'var(--blue)',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '11.5px',
                fontWeight: 600,
              }}
            >
              Mom 妈妈
            </span>
            <span
              style={{
                background: 'var(--mist)',
                color: 'var(--ink)',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '11.5px',
                fontWeight: 600,
              }}
            >
              Campus bursar 财务处
            </span>
            <span
              style={{
                background: 'var(--sky)',
                color: 'var(--blue)',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '11.5px',
                fontWeight: 600,
              }}
            >
              Dad 爸爸
            </span>
          </div>
        </div>

        {/* Pause Agent Button */}
        <button
          className="btn-pause-agent-pill"
          id="btn-pause-agent-toggle"
          onClick={onTogglePause}
        >
          {agentPaused ? (
            <>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>{b('btn_resume_agent', 'btn_resume_agent_sub', locale)} (Passkey)</span>
            </>
          ) : (
            <>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
              <span>{b('btn_pause_agent', 'btn_pause_agent_sub', locale)}</span>
            </>
          )}
        </button>

        <div className="app-footer-disclaimer">
          Safety enforced OUTSIDE the language model by three independent rings.
        </div>
      </main>
    </div>
  );
};
