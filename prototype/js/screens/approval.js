// Screen 4: Approval Sheet (Route /approve or /approve/:planId)
// Strictly follows AEGISPATH_ANTIGRAVITY_PROTOTYPE_PROMPT.md

import { t, b } from '../i18n.js';
import { SEED_DATA } from '../mockData.js';
import {
  renderChopMascot,
  renderHeaderArt
} from '../svgAssets.js';

export function renderApprovalScreen(state) {
  const plan = state.approvalPlan || SEED_DATA.currentApprovalPlan;

  return `
    <div class="screen-container approval-screen-container">
      <!-- ═══════════ BLUE HEADER (226px) ═══════════ -->
      <header class="approval-blue-header">
        ${renderHeaderArt('approval')}

        <div class="header-content">
          <div style="display:flex; justify-content:center; margin-bottom: 8px;">
            ${renderChopMascot({
              bodyColor: "#FFFFFF",
              faceColor: "#DCE8FD",
              expression: "guard",
              size: 58,
              showShield: true
            })}
          </div>

          <h1 class="approval-header-title">
            ${b('approval_title', 'approval_sub')}
          </h1>

          <div class="approval-header-reason">
            ${plan.reasonEn} ${plan.reasonZh}
          </div>

          <!-- 4-step Stepper -->
          <div class="stepper-container">
            <div class="stepper-progress-line">
              <div class="stepper-progress-fill"></div>
            </div>

            <!-- Step 1: Requested -->
            <div class="step-node done">
              <div class="step-dot"></div>
              <span>${b('step_requested', 'step_requested_sub')}</span>
            </div>

            <!-- Step 2: Understood -->
            <div class="step-node done">
              <div class="step-dot"></div>
              <span>${b('step_understood', 'step_understood_sub')}</span>
            </div>

            <!-- Step 3: Approve (Current Active) -->
            <div class="step-node active">
              <div class="step-pill">
                ${b('step_approve', 'step_approve_sub')}
              </div>
            </div>

            <!-- Step 4: Sent -->
            <div class="step-node">
              <div class="step-dot"></div>
              <span>${b('step_sent', 'step_sent_sub')}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- ═══════════ APPROVAL WHITE SHEET BODY ═══════════ -->
      <main class="approval-sheet-body">
        <!-- Dual Comparison Cards -->
        <div class="comparison-cards-grid">
          <!-- Left: You asked -->
          <div class="comp-card">
            <div class="comp-card-label">${b('card_you_asked', 'card_you_asked_sub')}</div>
            <div class="comp-card-val">"${plan.requestedTextEn}"</div>
          </div>

          <!-- Right: I understood -->
          <div class="comp-card">
            <div class="comp-card-label">${b('card_i_understood', 'card_i_understood_sub')}</div>
            <div class="comp-card-val">${plan.understoodTextEn}<br><span style="font-size:11px;color:var(--slate);">${plan.understoodTextZh}</span></div>
          </div>
        </div>

        <!-- Big Amount Display -->
        <div class="approval-amount-center">
          <div class="approval-amount-label">${b('approval_send_label', 'approval_send_sub')}</div>
          <div class="approval-big-dollars">$${plan.sendAmount.toFixed(2)}</div>
        </div>

        <!-- Changed Yellow Box -->
        <div class="changed-notice-box">
          <strong>${b('changed_label', 'changed_label_sub')}</strong>: currency assumed USD 币种默认美元
          <a class="changed-edit-link" id="link-edit-currency">${b('edit_action', 'edit_action_sub')}</a>
        </div>

        <!-- Rows Details -->
        <div class="breakdown-row">
          <span class="breakdown-label">${b('receives_label', 'receives_sub')}</span>
          <span class="breakdown-val">¥${plan.receivesAmount.toLocaleString()}</span>
        </div>

        <div class="breakdown-row">
          <span class="breakdown-label">${b('rate_simulated', 'rate_simulated_sub')}</span>
          <span class="breakdown-val">${plan.rate.toFixed(2)} ${plan.ratePair}</span>
        </div>

        <div class="breakdown-row">
          <span class="breakdown-label">${b('fee_and_buffer', 'fee_and_buffer_sub')}</span>
          <span class="breakdown-val">$${plan.feeWithBuffer.toFixed(2)}</span>
        </div>

        <div class="breakdown-row">
          <span class="breakdown-label">${b('arrives_label', 'arrives_sub')}</span>
          <span class="breakdown-val">${plan.etaTextEn} ${plan.etaTextZh}</span>
        </div>

        <!-- Locked Intent Binding Line -->
        <div class="intent-lock-row">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <div>
            <span>${b('locked_binding', 'locked_binding_sub')}</span>
            <span class="intent-hash-mono">${plan.intentHash} (simulated)</span>
          </div>
        </div>
      </main>

      <!-- ═══════════ STICKY BOTTOM ACTIONS ═══════════ -->
      <footer class="approval-sticky-actions">
        <button class="btn-cancel-flat" id="btn-approval-cancel" data-route="/tuition">
          ${b('btn_cancel', 'btn_cancel_sub')}
        </button>

        <button class="btn-approve-passkey" id="btn-approval-passkey">
          <span>${t('btn_approve_passkey')}</span>
          <span style="font-size:11px;opacity:0.9;">${t('btn_approve_passkey_sub')}</span>
        </button>
      </footer>
    </div>
  `;
}
