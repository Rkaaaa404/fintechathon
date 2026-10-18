// Screen 7: Safety Center (Route /safety)
// Strictly follows AEGISPATH_ANTIGRAVITY_PROTOTYPE_PROMPT.md

import { t, b } from '../i18n.js';
import { SEED_DATA } from '../mockData.js';
import {
  renderChopMascot,
  renderHeaderArt,
  renderRadialAttackMap,
  renderFiveSegmentBar
} from '../svgAssets.js';

export function renderSafetyScreen(state) {
  const outerActive = state.layersState?.privacy !== false;
  const middleActive = state.layersState?.rules !== false;
  const innerActive = state.layersState?.bank !== false;

  const fundsLost = (!outerActive && !middleActive && !innerActive) ? 2450 : 0;
  const activeCount = (outerActive ? 1 : 0) + (middleActive ? 1 : 0) + (innerActive ? 1 : 0);

  const isPaused = state.agentPaused || false;

  return `
    <div class="screen-container safety-screen">
      <!-- ═══════════ BLUE HEADER (150px) ═══════════ -->
      <header class="screen-header-blue safety-header">
        ${renderHeaderArt('safety')}

        <div class="header-content">
          <div class="header-topbar">
            <div class="brand-row">
              <button class="nav-back-btn" data-route="/" aria-label="Back to home" style="background:none;border:none;color:#fff;cursor:pointer;padding:4px;display:flex;align-items:center;">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <div>
                <h1 class="brand-title" style="font-size: 19px;">
                  ${b('safety_title', 'safety_sub')}
                </h1>
                <div style="font-size: 12px; font-weight: 700; margin-top: 2px;">
                  ${activeCount}/3 ${b('safety_header_active', 'safety_header_active_sub')}
                </div>
              </div>
            </div>

            <div class="mascot-header-cluster">
              ${renderChopMascot({
                bodyColor: "#FFFFFF",
                faceColor: "#DCE8FD",
                expression: isPaused ? "paused" : "block",
                size: 52
              })}
            </div>
          </div>
        </div>
      </header>

      <!-- ═══════════ SCREEN BODY ═══════════ -->
      <main class="screen-body" style="padding-top: 16px;">
        <!-- Night Card: Radial Attack Map -->
        <div class="night-card-radial">
          <div class="night-card-header">
            <div class="night-card-title">
              🛡️ ${b('attack_blocked_title', 'attack_blocked_sub')}
            </div>
            <div class="night-card-sub">
              Hidden instruction in an invoice · 发票中的隐藏指令
            </div>
          </div>

          <!-- Interactive Radial Attack Map SVG -->
          <div class="radial-map-container" id="radial-map-wrapper">
            ${renderRadialAttackMap({
              fundsLost: fundsLost,
              outerActive: outerActive,
              middleActive: middleActive,
              innerActive: innerActive,
              isReplaying: state.isAttackReplaying
            })}
          </div>

          <!-- Three Defense Rings Status Breakdown -->
          <div class="rings-status-breakdown">
            <!-- 1. Outer Ring: Privacy Filter -->
            <div class="ring-status-row">
              <div style="display:flex;align-items:center;gap:6px;">
                <button class="ring-toggle-pill ${outerActive ? '' : 'off'}" data-toggle-layer="privacy">
                  ${outerActive ? 'ON' : 'OFF'}
                </button>
                <div>
                  <strong style="color:#fff;">Outer 外环</strong>
                  <span class="ring-name">Privacy filter 隐私过滤</span>
                </div>
              </div>
              <span class="ring-verdict ${outerActive ? 'flagged' : 'refuse'}">
                ${outerActive ? 'Flagged 已标记' : 'Bypassed 已穿透'}
              </span>
            </div>

            <!-- 2. Middle Ring: Spending Rules -->
            <div class="ring-status-row">
              <div style="display:flex;align-items:center;gap:6px;">
                <button class="ring-toggle-pill ${middleActive ? '' : 'off'}" data-toggle-layer="rules">
                  ${middleActive ? 'ON' : 'OFF'}
                </button>
                <div>
                  <strong style="color:#fff;">Middle 中环</strong>
                  <span class="ring-name">Spending rules 支出规则</span>
                </div>
              </div>
              <span class="ring-verdict ${middleActive ? 'refuse' : 'refuse'}">
                ${middleActive ? 'Would refuse 将拒绝' : 'Bypassed 已穿透'}
              </span>
            </div>

            <!-- 3. Inner Ring: Bank-side Limit -->
            <div class="ring-status-row">
              <div style="display:flex;align-items:center;gap:6px;">
                <button class="ring-toggle-pill ${innerActive ? '' : 'off'}" data-toggle-layer="bank">
                  ${innerActive ? 'ON' : 'OFF'}
                </button>
                <div>
                  <strong style="color:#fff;">Inner 内环</strong>
                  <span class="ring-name">Bank-side limit 银行限额</span>
                </div>
              </div>
              <span class="ring-verdict ${innerActive ? 'ok' : 'refuse'}">
                ${innerActive ? 'Enforced 已拦截' : 'Bypassed 已穿透'}
              </span>
            </div>
          </div>

          <!-- Replay Attack Button -->
          <div class="replay-controls-row">
            <button class="btn-replay-attack" id="btn-replay-attack">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="1 4 1 10 7 10"></polyline>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
              </svg>
              <span>${b('btn_replay_attack', 'btn_replay_attack_sub')}</span>
            </button>
          </div>
        </div>

        <!-- Today's Allowance & Payees Summary Card -->
        <div class="evidence-source-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <span style="font-size:13px;font-weight:700;color:var(--ink);">Today's allowance 今日额度</span>
            <span style="font-size:12px;font-weight:600;color:var(--blue);">$200 / $1,000 used</span>
          </div>
          ${renderFiveSegmentBar(1, 5)}

          <div style="font-size:11.5px;color:var(--slate);margin:10px 0 6px 0;">Allowed payees 已授权收款人:</div>
          <div style="display:flex;gap:10px;">
            <span style="background:var(--sky);color:var(--blue);padding:4px 10px;border-radius:12px;font-size:11.5px;font-weight:600;">Mom 妈妈</span>
            <span style="background:var(--mist);color:var(--ink);padding:4px 10px;border-radius:12px;font-size:11.5px;font-weight:600;">Campus bursar 财务处</span>
            <span style="background:var(--sky);color:var(--blue);padding:4px 10px;border-radius:12px;font-size:11.5px;font-weight:600;">Dad 爸爸</span>
          </div>
        </div>

        <!-- Pause Agent Button -->
        <button class="btn-pause-agent-pill" id="btn-pause-agent-toggle">
          ${isPaused ? `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            <span>${b('btn_resume_agent', 'btn_resume_agent_sub')} (Passkey)</span>
          ` : `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
            <span>${b('btn_pause_agent', 'btn_pause_agent_sub')}</span>
          `}
        </button>

        <div class="app-footer-disclaimer">
          Safety enforced OUTSIDE the language model by three independent rings.
        </div>
      </main>
    </div>
  `;
}
