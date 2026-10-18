// Screen 3: Pay Tuition (Route /tuition)
// Strictly follows AEGISPATH_ANTIGRAVITY_PROTOTYPE_PROMPT.md

import { t, b } from '../i18n.js';
import { SEED_DATA } from '../mockData.js';
import {
  renderChopMascot,
  renderHeaderArt
} from '../svgAssets.js';

export function renderTuitionScreen(state) {
  const tuition = SEED_DATA.tuition;
  const currentMode = state.tuitionMode || 'cheapest';
  const modeData = tuition.modes[currentMode] || tuition.modes.cheapest;

  return `
    <div class="screen-container tuition-screen">
      <!-- ═══════════ BLUE HEADER (176px) ═══════════ -->
      <header class="screen-header-blue tuition-header">
        ${renderHeaderArt('tuition')}

        <div class="header-content">
          <div class="header-topbar">
            <div class="brand-row">
              <button class="nav-back-btn" data-route="/" aria-label="Back to home" style="background:none;border:none;color:#fff;cursor:pointer;padding:4px;display:flex;align-items:center;">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <h1 class="brand-title" style="font-size: 19px;">
                ${b('tuition_header_title', 'tuition_header_sub')}
              </h1>
            </div>

            <div class="mascot-header-cluster">
              ${renderChopMascot({
                bodyColor: "#FFFFFF",
                faceColor: "#DCE8FD",
                expression: "guard",
                size: 52
              })}
            </div>
          </div>

          <div class="tuition-header-due">
            ${b('tuition_due_label', 'tuition_due_sub')}
          </div>

          <div class="tuition-header-big-amount">
            ¥${tuition.dueAmountCny.toLocaleString()}
          </div>

          <div class="tuition-header-subdue">
            ${b('tuition_due_bursar', 'tuition_due_bursar_sub')}
          </div>
        </div>
      </header>

      <!-- ═══════════ SCREEN BODY ═══════════ -->
      <main class="screen-body" style="padding-top: 16px;">
        <!-- Tuition Calculation Card -->
        <div class="tuition-card">
          <!-- Segmented Control: Fastest / Cheapest / Balanced -->
          <div class="segmented-control" role="tablist">
            <button class="seg-btn ${currentMode === 'fastest' ? 'active' : ''}" data-tuition-mode="fastest" role="tab">
              <span>${t('tab_fastest')}</span>
              <span class="seg-btn-sub">${t('tab_fastest_sub')}</span>
            </button>
            <button class="seg-btn ${currentMode === 'cheapest' ? 'active' : ''}" data-tuition-mode="cheapest" role="tab">
              <span>${t('tab_cheapest')}</span>
              <span class="seg-btn-sub">${t('tab_cheapest_sub')}</span>
            </button>
            <button class="seg-btn ${currentMode === 'balanced' ? 'active' : ''}" data-tuition-mode="balanced" role="tab">
              <span>${t('tab_balanced')}</span>
              <span class="seg-btn-sub">${t('tab_balanced_sub')}</span>
            </button>
          </div>

          <!-- Breakdown Rows -->
          <div class="breakdown-row">
            <span class="breakdown-label">${b('base_amount', 'base_amount_sub')}</span>
            <span class="breakdown-val">$${modeData.baseAmount.toFixed(2)}</span>
          </div>

          <div class="breakdown-row">
            <span class="breakdown-label">${b('rate_simulated', 'rate_simulated_sub')}</span>
            <span class="breakdown-val">${modeData.rate.toFixed(2)} CNY/USD</span>
          </div>

          <div class="breakdown-row">
            <span class="breakdown-label">${b('transfer_fee', 'transfer_fee_sub')}</span>
            <span class="breakdown-val">$${modeData.fee.toFixed(2)}</span>
          </div>

          <div class="breakdown-row">
            <span class="breakdown-label">${b('bank_buffer', 'bank_buffer_sub')}</span>
            <span class="breakdown-val">$${modeData.buffer.toFixed(2)}</span>
          </div>

          <!-- Total 'You send' -->
          <div class="breakdown-total-row">
            <div class="total-send-label">${b('you_send', 'you_send_sub')}</div>
            <div class="total-send-amount">$${modeData.total.toFixed(2)}</div>
          </div>

          <!-- Estimate Warning -->
          <div class="estimate-warning-pill">
            ${b('tuition_estimate_note', 'tuition_estimate_note_sub')}
          </div>
        </div>

        <!-- Payee Card -->
        <div class="payee-summary-card">
          <div class="payee-avatar-circle">B</div>
          <div class="payee-info-col">
            <div class="payee-name-title">${b('payee_label', 'payee_label_sub')}</div>
            <div class="payee-note-text">${b('payee_note', 'payee_note_sub')}</div>
          </div>
          <span class="tag-official-channel">${b('official_channel_tag', 'official_channel_tag_sub')}</span>
        </div>

        <!-- Primary CTA: Review Payment -->
        <button class="primary-cta-button" id="btn-review-tuition-payment" data-route="/approve">
          <span>${t('btn_review_payment')}</span>
          <span class="cta-sub-text">${t('btn_review_payment_sub')}</span>
        </button>
      </main>
    </div>
  `;
}
