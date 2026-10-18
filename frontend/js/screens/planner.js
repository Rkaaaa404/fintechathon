// Screen 6: Runway Planner (Route /planner)
// Strictly follows AEGISPATH_ANTIGRAVITY_PROTOTYPE_PROMPT.md

import { t, b } from '../i18n.js';
import { SEED_DATA } from '../mockData.js';
import {
  renderChopMascot,
  renderHeaderArt
} from '../svgAssets.js';

function renderSvgPlannerChart(scenarioKey = "on_time") {
  const schedule = SEED_DATA.plannerSchedule;
  const isDelayed = scenarioKey === "delayed";
  const scenario = schedule.scenarios[scenarioKey] || schedule.scenarios.on_time;
  const months = schedule.months;

  // Chart dimensions
  const width = 330;
  const height = 180;
  const padLeft = 40;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 30;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const maxVal = 3500;
  const minVal = 0;

  const getY = (val) => padTop + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
  const getX = (idx) => padLeft + (idx / (months.length - 1)) * chartW;

  // Safe minimum line ($1000)
  const safeY = getY(1000);

  // Points path
  let pathD = "";
  scenario.points.forEach((pt, i) => {
    const x = getX(i);
    const y = getY(pt);
    pathD += (i === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : ` L ${x.toFixed(1)} ${y.toFixed(1)}`);
  });

  // Tuition marker line (Jan is index 3)
  const janX = getX(3);

  return `
    <svg viewBox="0 0 ${width} ${height}" width="100%" height="${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Runway cashflow chart">
      <!-- Grid lines -->
      <line x1="${padLeft}" y1="${getY(3000)}" x2="${width - padRight}" y2="${getY(3000)}" stroke="#E6ECF8" stroke-width="1"/>
      <text x="${padLeft - 6}" y="${getY(3000) + 4}" text-anchor="end" font-size="9" fill="#5B6B8C" font-family="'IBM Plex Sans', sans-serif">$3k</text>

      <line x1="${padLeft}" y1="${getY(2000)}" x2="${width - padRight}" y2="${getY(2000)}" stroke="#E6ECF8" stroke-width="1"/>
      <text x="${padLeft - 6}" y="${getY(2000) + 4}" text-anchor="end" font-size="9" fill="#5B6B8C" font-family="'IBM Plex Sans', sans-serif">$2k</text>

      <!-- Safe minimum line ($1,000) dashed amber -->
      <line x1="${padLeft}" y1="${safeY}" x2="${width - padRight}" y2="${safeY}" stroke="#F5A524" stroke-width="1.6" stroke-dasharray="4 3"/>
      <text x="${padLeft - 6}" y="${safeY + 4}" text-anchor="end" font-size="9" fill="#F5A524" font-weight="700" font-family="'IBM Plex Sans', sans-serif">$1k</text>
      <text x="${width - padRight}" y="${safeY - 4}" text-anchor="end" font-size="8.5" fill="#B7791F" font-weight="600">Safe min 安全线</text>

      <!-- Tuition vertical marker at Jan -->
      <line x1="${janX}" y1="${padTop}" x2="${janX}" y2="${height - padBottom}" stroke="#3D6BEA" stroke-width="1.2" stroke-dasharray="2 2" opacity="0.6"/>
      <rect x="${janX - 28}" y="${padTop - 8}" width="56" height="15" rx="3" fill="#3D6BEA" opacity="0.9"/>
      <text x="${janX}" y="${padTop + 3}" text-anchor="middle" font-size="7.5" fill="#FFFFFF" font-weight="700">Tuition Jan 15</text>

      <!-- Month labels on X axis -->
      ${months.map((m, i) => `
        <text x="${getX(i)}" y="${height - 10}" text-anchor="middle" font-size="10" font-weight="${i === 3 ? '700' : '500'}" fill="${i === 3 ? '#3D6BEA' : '#5B6B8C'}" font-family="'IBM Plex Sans', sans-serif">${m}</text>
      `).join('')}

      <!-- Main Path -->
      <path d="${pathD}" stroke="${isDelayed ? '#E5484D' : '#3D6BEA'}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>

      <!-- Data Dots -->
      ${scenario.points.map((pt, i) => {
        const x = getX(i);
        const y = getY(pt);
        const isDip = pt < 1000;
        return `
          <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${isDip ? 5 : 3.5}" fill="${isDip ? '#E5484D' : '#3D6BEA'}" stroke="#FFFFFF" stroke-width="1.5"/>
          ${isDip ? `<text x="${x.toFixed(1)}" y="${(y - 8).toFixed(1)}" text-anchor="middle" font-size="9" font-weight="700" fill="#E5484D">$${pt}</text>` : ''}
        `;
      }).join('')}
    </svg>
  `;
}

export function renderPlannerScreen(state) {
  const currentScenario = state.plannerScenario || "on_time";
  const isDelayed = currentScenario === "delayed";
  const schedule = SEED_DATA.plannerSchedule;

  return `
    <div class="screen-container planner-screen">
      <!-- ═══════════ BLUE HEADER (150px) ═══════════ -->
      <header class="screen-header-blue planner-header">
        ${renderHeaderArt('planner')}

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
                  ${b('planner_title', 'planner_sub')}
                </h1>
                <div style="font-size: 11px; opacity: 0.9; margin-top: 2px;">
                  ${b('planner_subtitle', 'planner_subtitle_sub')}
                </div>
              </div>
            </div>

            <div class="mascot-header-cluster">
              ${renderChopMascot({
                bodyColor: "#FFFFFF",
                faceColor: "#DCE8FD",
                expression: "guard",
                size: 50
              })}
            </div>
          </div>
        </div>
      </header>

      <!-- ═══════════ SCREEN BODY ═══════════ -->
      <main class="screen-body" style="padding-top: 16px;">
        <!-- Chart Card -->
        <div class="planner-chart-card">
          <!-- Scenario Selection Chips -->
          <div class="chart-scenario-chips">
            <button class="scenario-chip-btn ${currentScenario === 'on_time' ? 'active' : ''}" data-scenario="on_time">
              <span>${b('opt_on_time', 'opt_on_time_sub')}</span>
            </button>
            <button class="scenario-chip-btn ${currentScenario === 'delayed' ? 'active' : ''}" data-scenario="delayed">
              <span>${b('opt_delayed', 'opt_delayed_sub')}</span>
            </button>
          </div>

          <!-- Dynamic SVG Chart -->
          ${renderSvgPlannerChart(currentScenario)}
        </div>

        <!-- Warning Card (when below safe line or in delayed mode) -->
        ${isDelayed ? `
          <div class="planner-warning-card">
            <div class="planner-warning-title">
              ⚠️ ${b('warning_below_safe', 'warning_below_safe_sub')} ($450 < $1,000)
            </div>
            <div style="font-size: 12px; color: var(--ink); margin-bottom: 10px;">
              Tuition due on Jan 15 precedes delayed scholarship on Feb 20. Suggested mitigating actions:
            </div>

            ${schedule.warningOptions.map(opt => `
              <div class="planner-option-item" data-action="apply-plan-mitigation">
                👉 <strong>${opt.labelEn}</strong> <span class="text-chinese-sub">${opt.labelZh}</span>
              </div>
            `).join('')}
          </div>
        ` : `
          <div style="background:var(--mist);border-radius:14px;padding:14px;border:1px solid var(--line);margin-bottom:14px;">
            <div style="font-size:13px;font-weight:700;color:var(--green);display:flex;align-items:center;gap:6px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Cash reserve maintains safe threshold ($1,615 min)</span>
            </div>
            <div style="font-size:11.5px;color:var(--slate);margin-top:4px;">
              Tuition payment on Jan 15 ($2,534.30) fully covered by expected reserves.
            </div>
          </div>
        `}

        <!-- Footer Disclaimer Note -->
        <div class="app-footer-disclaimer">
          ${b('planner_footer_note', 'planner_footer_note_sub')}
        </div>
      </main>
    </div>
  `;
}
