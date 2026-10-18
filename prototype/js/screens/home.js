// Screen 1: Home Dashboard (Route /)
// Strictly follows AEGISPATH_ANTIGRAVITY_PROTOTYPE_PROMPT.md

import { t, b } from '../i18n.js';
import { SEED_DATA } from '../mockData.js';
import {
  renderChopMascot,
  renderStudentDoodle,
  renderHeaderArt,
  renderFiveSegmentBar,
  renderStamp
} from '../svgAssets.js';


export function renderHomeScreen(state) {
  const user = state.user || SEED_DATA.user;
  const layers = state.layersHealth || SEED_DATA.layersHealth;
  const evidence = state.evidencePack || SEED_DATA.evidencePack;
  const activities = state.recentActivities || SEED_DATA.recentActivities;

  return `
    <div class="screen-container home-screen">
      <!-- ═══════════ BLUE HEADER (214px) ═══════════ -->
      <header class="screen-header-blue home-header">
        ${renderHeaderArt('home')}

        <div class="header-content">
          <!-- Top row -->
          <div class="header-topbar">
            <div class="brand-row">
              <span class="brand-title">AegisPath</span>
              <span class="pill-testnet">${b('testnet_pill', 'testnet_pill_sub')}</span>
            </div>

            <div class="header-actions">
              <button class="lang-toggle-btn" id="header-lang-toggle" aria-label="Toggle language">
                <span class="${state.locale === 'en' ? 'active-lang' : 'inactive-lang'}">EN</span>
                <span>|</span>
                <span class="${state.locale === 'zh' ? 'active-lang' : 'inactive-lang'}">中文</span>
              </button>

              <button class="bell-btn" id="header-bell-btn" aria-label="Notifications">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <span class="bell-badge">2</span>
              </button>
            </div>
          </div>

          <!-- Greeting -->
          <div class="home-hero-greeting">
            ${b('greeting', 'greeting_sub')}
          </div>

          <!-- Daily Allowance -->
          <div class="home-allowance-label">
            ${b('daily_allowance', 'daily_allowance_sub')}
          </div>

          <div class="home-allowance-flex">
            <div class="allowance-amount-box">
              <span class="big-allowance-amount">$${user.dailyAllowanceRemaining}</span>
              <span class="allowance-total-tag">${b('of_total', 'of_total_sub')}</span>
            </div>

            <!-- Mascots cluster: Big wave Chop + small Chop + speech bubble -->
            <div class="mascot-header-cluster">
              <div class="speech-bubble-hi">Hi! 你好</div>
              ${renderChopMascot({
                bodyColor: "#FFFFFF",
                faceColor: "#DCE8FD",
                expression: state.agentPaused ? "paused" : "wave",
                size: 64,
                className: "home-main-chop"
              })}
            </div>
          </div>

          <!-- 5-segment allowance bar (4 of 5 filled) -->
          ${renderFiveSegmentBar(4, 5)}
        </div>
      </header>

      <!-- ═══════════ OVERLAPPING GUARD STRIP ═══════════ -->
      <div class="chop-guard-strip-card">
        <div class="strip-left">
          ${renderChopMascot({
            bodyColor: "#3D6BEA",
            faceColor: "#FFFFFF",
            expression: state.agentPaused ? "paused" : "guard",
            size: 26
          })}
          <span class="strip-title">${b('chop_guard_strip', 'chop_guard_sub')}</span>
        </div>
        <span class="strip-tag-green">${layers.active}/${layers.total} ${b('three_layers_tag', 'three_layers_tag_sub')}</span>
      </div>

      <!-- ═══════════ SCREEN BODY ═══════════ -->
      <main class="screen-body">
        <div class="home-layout-container">
          <!-- ── Main Left Column (Dashboard) ── -->
          <div class="home-main-column">
            <!-- Services Section Header -->
            <div class="section-header-title">
              <span class="section-accent-bar"></span>
              <span>${b('services_title', 'services_sub')}</span>
            </div>

            <!-- 4x2 Services Grid -->
            <div class="services-grid-4x2">
              <!-- 1. Send -->
              <div class="service-tile" data-route="/tuition" role="button" tabindex="0">
                <div class="tile-icon-bubble">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
                <span class="tile-label-primary">${t('service_send')}</span>
                <span class="tile-label-sub">${t('service_send_sub')}</span>
              </div>

              <!-- 2. Tuition -->
              <div class="service-tile" data-route="/tuition" role="button" tabindex="0">
                <div class="tile-icon-bubble">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                  </svg>
                </div>
                <span class="tile-label-primary">${t('service_tuition')}</span>
                <span class="tile-label-sub">${t('service_tuition_sub')}</span>
              </div>

              <!-- 3. Evidence -->
              <div class="service-tile" data-route="/evidence" role="button" tabindex="0">
                <div class="tile-icon-bubble">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                </div>
                <span class="tile-label-primary">${t('service_evidence')}</span>
                <span class="tile-label-sub">${t('service_evidence_sub')}</span>
              </div>

              <!-- 4. Safety -->
              <div class="service-tile" data-route="/safety" role="button" tabindex="0">
                <div class="tile-icon-bubble">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <polyline points="9 12 11 14 15 10"></polyline>
                  </svg>
                </div>
                <span class="tile-label-primary">${t('service_safety')}</span>
                <span class="tile-label-sub">${t('service_safety_sub')}</span>
              </div>

              <!-- 5. Payees -->
              <div class="service-tile" data-action="toast-coming-soon" role="button" tabindex="0">
                <div class="tile-icon-bubble">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <span class="tile-label-primary">${t('service_payees')}</span>
                <span class="tile-label-sub">${t('service_payees_sub')}</span>
              </div>

              <!-- 6. Rates -->
              <div class="service-tile" data-action="toast-coming-soon" role="button" tabindex="0">
                <div class="tile-icon-bubble">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <span class="tile-label-primary">${t('service_rates')}</span>
                <span class="tile-label-sub">${t('service_rates_sub')}</span>
              </div>

              <!-- 7. Planner -->
              <div class="service-tile" data-route="/planner" role="button" tabindex="0">
                <div class="tile-icon-bubble">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                  </svg>
                </div>
                <span class="tile-label-primary">${t('service_planner')}</span>
                <span class="tile-label-sub">${t('service_planner_sub')}</span>
              </div>

              <!-- 8. More -->
              <div class="service-tile" data-action="toast-coming-soon" role="button" tabindex="0">
                <div class="tile-icon-bubble">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                </div>
                <span class="tile-label-primary">${t('service_more')}</span>
                <span class="tile-label-sub">${t('service_more_sub')}</span>
              </div>
            </div>

            <!-- Sky Banner: Tuition Arrives In Full -->
            <div class="tuition-banner-card">
              <div class="banner-text-box">
                <div class="banner-headline">${t('tuition_banner_title')}</div>
                <div class="banner-subhead">${t('tuition_banner_sub')}</div>
                <button class="banner-calc-btn" data-route="/tuition">
                  ${b('btn_calculate', 'btn_calculate_sub')}
                </button>
              </div>
              <div class="banner-art-box">
                ${renderStudentDoodle({ width: 118, height: 84 })}
              </div>
            </div>

            <!-- Two Stat Cards: Protection & Evidence -->
            <div class="stat-cards-row">
              <!-- Protection Card -->
              <div class="stat-card-solid-blue" data-route="/safety" role="button" tabindex="0">
                <div class="stat-card-header">
                  <span>${b('stat_protection_title', 'stat_protection_sub')}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <div class="stat-card-big-num">${layers.active}/${layers.total}</div>
                <div class="stat-card-desc">${b('stat_protection_desc', 'stat_protection_desc_sub')}</div>
              </div>

              <!-- Evidence Card -->
              <div class="stat-card-sky" data-route="/evidence" role="button" tabindex="0">
                <div class="stat-card-header">
                  <span>${b('stat_evidence_title', 'stat_evidence_sub')}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  </svg>
                </div>
                <div class="stat-card-big-num">3/3</div>
                <div class="stat-card-desc">${b('stat_evidence_desc', 'stat_evidence_desc_sub')}</div>
              </div>
            </div>


            <!-- Recent Activity Card -->
            <div class="activity-card">
              <!-- Activity 1: Sent to Mom -->
              <div class="activity-row">
                <div class="activity-left">
                  <div class="activity-icon-bubble check">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <div class="activity-title">${b('act_mom_title', 'act_mom_title_sub')}</div>
                    <div class="activity-sub">${activities[0]?.timestamp || '14 min ago'}</div>
                  </div>
                </div>
                <div class="activity-amount-tag">-$200.00</div>
              </div>

              <!-- Activity 2: Attack Blocked -->
              <div class="activity-row">
                <div class="activity-left">
                  <div class="activity-icon-bubble cross">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </div>
                  <div>
                    <div class="activity-title">${b('act_attack_title', 'act_attack_title_sub')}</div>
                    <div class="activity-sub">${activities[1]?.timestamp || '1 hr ago'}</div>
                  </div>
                </div>
                <span class="activity-badge-red">$0 lost</span>
              </div>
            </div>
          </div>

          <!-- ── Desktop Right Column: Live Ask Chop AI Companion Panel ── -->
          <aside class="home-companion-column">
            <div class="web-companion-card">
              <div class="companion-header">
                <div class="companion-header-left">
                  ${renderChopMascot({
                    bodyColor: "#3D6BEA",
                    faceColor: "#FFFFFF",
                    expression: "guard",
                    size: 28
                  })}
                  <div>
                    <div class="companion-title">Ask Chop 询问智能体</div>
                    <div class="companion-status">Agent online 在线 · Testnet 测试网</div>
                  </div>
                </div>
                <button class="companion-expand-btn" data-route="/chat" title="Buka Halaman Chat Penuh">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </button>
              </div>

              <div class="companion-chat-stream">
                <!-- User Msg Bubble -->
                <div class="user-msg-bubble">
                  <div class="user-msg-text-primary">Send $200 to Mom, cheapest route</div>
                  <div class="user-msg-text-sub">给妈妈汇 $200, 选最便宜路线</div>
                </div>

                <!-- Agent Live Plan Card -->
                <div class="agent-plan-card">
                  <div class="plan-title-row">
                    <span style="font-size: 12.5px; font-weight: 600; color: var(--ink);">Planning your transfer 正在规划</span>
                  </div>
                  <div class="plan-chips-flex" style="gap: 5px;">
                    <span class="plan-chip done" style="font-size: 11px; padding: 2px 7px;"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Quote 报价</span>
                    <span class="plan-chip done" style="font-size: 11px; padding: 2px 7px;"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Payee 收款人</span>
                    <span class="plan-chip done" style="font-size: 11px; padding: 2px 7px;"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Limits 额度</span>
                    <span class="plan-chip done" style="font-size: 11px; padding: 2px 7px;"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Simulate 模拟</span>
                    <span class="plan-chip active" style="font-size: 11px; padding: 2px 7px;"><span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:var(--blue);margin-right:2px;"></span> Execute 执行</span>
                  </div>
                </div>

                <!-- Receipt Slip Card with rotated stamp -->
                <div class="receipt-slip-card">
                  ${renderStamp({
                    type: "SENT",
                    textEn: "SENT",
                    textZh: "已汇出",
                    rotated: true
                  })}

                  <div class="slip-header-row">
                    <div>
                      <div class="slip-sent-label">${b('stamp_sent', 'stamp_sent_sub')}</div>
                      <div class="slip-amount-big">$200.00 to Mom</div>
                    </div>
                  </div>

                  <div class="slip-details-line">
                    Received 收款 Rp 3,176,000 · fee 手续费 $0.42 (simulated)
                  </div>

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
                </div>


                <!-- Agent Note Bubble -->
                <div class="agent-note-bubble" style="font-size: 12px; padding: 8px 12px;">
                  Done. Arrives in about 2 minutes.<br><span style="font-size: 11px; opacity: 0.85;">已完成,约2分钟到账。</span>
                </div>

                <!-- Quick Prompt Chips -->
                <div class="chat-quick-chips" style="gap: 6px; margin: 4px 0;">
                  <button class="chip-prompt-btn" data-route="/tuition" style="font-size: 11px; padding: 5px 9px;">Pay tuition 缴纳学费</button>
                  <button class="chip-prompt-btn" data-action="quick-send" style="font-size: 11px; padding: 5px 9px;">Send $3,000 汇款</button>
                  <button class="chip-prompt-btn" data-route="/evidence" style="font-size: 11px; padding: 5px 9px;">Share proof 分享证明</button>
                </div>
              </div>

              <!-- Quick Composer Bar -->
              <div class="companion-composer-bar">
                <input type="text" class="companion-input" id="companion-input-box" placeholder="Ask Chop... 向 Chop 提问..." />
                <button class="companion-send-btn" id="companion-send-action" aria-label="Send">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  `;
}
