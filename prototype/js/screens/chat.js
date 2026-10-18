// Screen 2: Agent Chat (Route /chat)
// Strictly follows AEGISPATH_ANTIGRAVITY_PROTOTYPE_PROMPT.md

import { t, b } from '../i18n.js';
import { SEED_DATA } from '../mockData.js';
import {
  renderChopMascot,
  renderHeaderArt,
  renderStamp
} from '../svgAssets.js';

export function renderChatScreen(state) {
  const isBlocked = state.devState === "attack-blocked";
  const stampType = isBlocked ? "BLOCKED" : "SENT";

  return `
    <div class="screen-container chat-screen">
      <!-- ═══════════ BLUE HEADER (128px) ═══════════ -->
      <header class="screen-header-blue chat-header">
        ${renderHeaderArt('chat')}

        <div class="header-content">
          <div class="header-topbar" style="margin-bottom: 8px;">
            <div class="brand-row">
              <button class="nav-back-btn" data-route="/" aria-label="Back to home" style="background:none;border:none;color:#fff;cursor:pointer;padding:4px;display:flex;align-items:center;">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <div>
                <h1 class="brand-title" style="font-size: 19px; line-height: 1.2;">
                  ${b('chat_header_title', 'chat_header_sub')}
                </h1>
                <div style="font-size: 11px; opacity: 0.9; margin-top: 2px;">
                  ${b('chat_status', 'chat_status_sub')}
                </div>
              </div>
            </div>

            <div class="mascot-header-cluster">
              ${renderChopMascot({
                bodyColor: "#FFFFFF",
                faceColor: "#DCE8FD",
                expression: state.agentPaused ? "paused" : (isBlocked ? "block" : "wave"),
                size: 46
              })}
            </div>
          </div>
        </div>
      </header>

      <!-- ═══════════ CHAT STREAM ═══════════ -->
      <div class="chat-stream-container">
        <!-- 1. User Bubble -->
        <div class="user-msg-bubble">
          <div class="user-msg-text-primary">Send $200 to Mom, cheapest route</div>
          <div class="user-msg-text-sub">给妈妈汇 $200, 选最便宜路线</div>
        </div>

        <!-- 2. Agent Live Plan Card with Chips -->
        <div class="agent-plan-card">
          <div class="plan-title-row">
            ${renderChopMascot({
              bodyColor: "#3D6BEA",
              faceColor: "#FFFFFF",
              expression: "guard",
              size: 22
            })}
            <span>${b('planning_title', 'planning_sub')}</span>
          </div>

          <div class="plan-chips-flex">
            <span class="plan-chip done">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Quote 报价
            </span>
            <span class="plan-chip done">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Payee 收款人
            </span>
            <span class="plan-chip done">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Limits 额度
            </span>
            <span class="plan-chip done">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Simulate 模拟
            </span>
            <span class="plan-chip active">
              <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--blue);margin-right:2px;"></span>
              Execute 执行
            </span>
          </div>
        </div>

        <!-- 3. Receipt Slip Card with Stamp -->
        <div class="receipt-slip-card">
          ${renderStamp({
            type: stampType,
            textEn: isBlocked ? "BLOCKED" : "SENT",
            textZh: isBlocked ? "已拦截" : "已汇出",
            rotated: true
          })}

          <div class="slip-header-row">
            <div>
              <div class="slip-sent-label">
                ${isBlocked ? '<span style="color:var(--red);">Blocked 已拦截</span>' : b('stamp_sent', 'stamp_sent_sub')}
              </div>
              <div class="slip-amount-big">$200.00 to Mom</div>
            </div>
          </div>

          <div class="slip-details-line">
            Received 收款 Rp 3,176,000 · fee 手续费 $0.42 (simulated)
          </div>

          <!-- 3 Security Checks -->
          <div class="slip-checks-row">
            <span class="slip-check-tag">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Privacy 隐私
            </span>
            <span class="slip-check-tag">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Rules 规则
            </span>
            <span class="slip-check-tag">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Bank limit 银行限额
            </span>
          </div>

          <div class="slip-notice-box">
            ${isBlocked
              ? 'Blocked by Privacy filter: hidden prompt instruction detected in memo. $0 lost.'
              : 'Done. Arrives in about 2 minutes. 已完成,约2分钟到账。'
            }
          </div>
        </div>

        <!-- Quick Suggestions Row -->
        <div class="quick-chips-row">
          <button class="quick-chip-btn" data-route="/tuition">
            Pay tuition 缴学费
          </button>
          <button class="quick-chip-btn" data-action="prompt-send-3000">
            Send $3,000 汇款
          </button>
          <button class="quick-chip-btn" data-route="/evidence">
            Share proof 分享证明
          </button>
        </div>
      </div>

      <!-- ═══════════ FLOATING COMPOSER PILL ═══════════ -->
      <form class="chat-composer-bar" id="chat-composer-form">
        <input
          type="text"
          class="chat-input-field"
          placeholder="Ask Chop... 向 Chop 提问..."
          id="chat-input-text"
          aria-label="Ask Chop input"
        />

        <button type="button" class="chat-mic-btn" title="Voice input (visual only)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
          </svg>
        </button>

        <button type="submit" class="chat-send-btn" title="Send message">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  `;
}
