// AegisPath Main Application Coordinator & State Store
// Strictly follows AEGISPATH_ANTIGRAVITY_PROTOTYPE_PROMPT.md

import { setLocale, getLocale, t } from './i18n.js';
import { SEED_DATA } from './mockData.js';
import { getActiveRoute, navigateTo, renderRoute } from './router.js';

// Application State Store
export const AppState = {
  viewMode: 'web',
  locale: 'en',
  devState: 'default',
  tuitionMode: 'cheapest',
  plannerScenario: 'on_time',
  layersState: {
    privacy: true,
    rules: true,
    bank: true
  },
  layersHealth: { ...SEED_DATA.layersHealth },
  agentPaused: false,
  isAttackReplaying: false,
  landlordShareRevoked: false,
  user: { ...SEED_DATA.user },
  approvalPlan: { ...SEED_DATA.currentApprovalPlan },
  recentActivities: [ ...SEED_DATA.recentActivities ],
  evidencePack: { ...SEED_DATA.evidencePack }
};


// Register PWA Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.log('SW registration note:', err);
    });
  });
}

// Toast Popup Feedback
export function showToast(message) {
  let toastEl = document.getElementById('app-toast');
  if (!toastEl) return;
  toastEl.textContent = message || t('toast_coming_soon');
  toastEl.classList.add('show');
  clearTimeout(toastEl._timeout);
  toastEl._timeout = setTimeout(() => {
    toastEl.classList.remove('show');
  }, 2200);
}

// Simulated Passkey Hardware Authorization
export function simulatePasskeyApproval(planId, onApproved) {
  const hash = AppState.approvalPlan.intentHash;
  const isConfirmed = window.confirm(
    `[Simulated Passkey Authentication 通行密钥确认]\n\nSign intent hash with local device key:\n${hash}\n\nPayee: Campus bursar (¥18,000)\nYou send: $2,534.30 USD\n\nClick OK to confirm passkey signature.`
  );

  if (isConfirmed) {
    AppState.approvalPlan.step = 4;
    AppState.user.dailyAllowanceUsed += 2534.30;
    AppState.user.dailyAllowanceRemaining = Math.max(0, AppState.user.dailyAllowanceTotal - AppState.user.dailyAllowanceUsed);
    AppState.devState = 'payment-sent';

    // Add to activity list
    AppState.recentActivities.unshift({
      id: 'act-tuition-' + Date.now(),
      titleEn: 'Tuition paid (Campus bursar)',
      titleZh: '学费已缴 (学校财务处)',
      amount: '-$2,534.30',
      type: 'success',
      icon: 'check',
      timestamp: 'Just now',
      timestampZh: '刚刚'
    });

    showToast('Signed with passkey! 通行密钥签名成功');
    if (onApproved) {
      onApproved();
    } else {
      navigateTo('/chat');
    }
  }
}

// Apply Dev State Switcher (7 States)
export function applyDevState(newState) {
  AppState.devState = newState;
  const devSelect = document.getElementById('dev-state-select');
  if (devSelect && devSelect.value !== newState) {
    devSelect.value = newState;
  }

  switch (newState) {
    case 'waiting-approval':
      navigateTo('/approve');
      showToast('State: Waiting for Approval');
      break;

    case 'payment-sent':
      AppState.approvalPlan.step = 4;
      navigateTo('/chat');
      showToast('State: Payment Sent Slip');
      break;

    case 'attack-blocked':
      AppState.isAttackReplaying = true;
      navigateTo('/safety');
      showToast('State: Attack Blocked Demo');
      break;

    case 'agent-paused':
      AppState.agentPaused = true;
      navigateTo('/safety');
      showToast('State: Agent Paused (Kill switch active)');
      break;

    case 'model-offline':
      showToast('Model offline mode: using deterministic rules.');
      renderCurrentRoute();
      break;

    case 'empty-activity':
      AppState.recentActivities = [];
      navigateTo('/');
      showToast('State: Empty Activity');
      break;

    default:
      AppState.agentPaused = false;
      AppState.isAttackReplaying = false;
      AppState.recentActivities = [ ...SEED_DATA.recentActivities ];
      AppState.user = { ...SEED_DATA.user };
      navigateTo('/');
      showToast('State: Default View');
      break;
  }
}

// Set View Mode (Versi Web vs Versi App)
export function setViewMode(mode) {
  AppState.viewMode = mode;
  const container = document.getElementById('main-container');
  const btnWeb = document.getElementById('btn-mode-web');
  const btnApp = document.getElementById('btn-mode-app');

  if (container) {
    container.classList.remove('mode-web', 'mode-app');
    container.classList.add(mode === 'app' ? 'mode-app' : 'mode-web');
  }
  if (btnWeb) btnWeb.classList.toggle('active', mode === 'web');
  if (btnApp) btnApp.classList.toggle('active', mode === 'app');

  localStorage.setItem('aegispath_view_mode', mode);
  renderCurrentRoute();
}


// Highlight Active Nav Links on Desktop Web App Bar
function updateDesktopNavLinks(currentRoute) {
  document.querySelectorAll('.web-nav-btn').forEach(link => {
    const r = link.getAttribute('data-route');
    const isActive = (r === '/' && (currentRoute === '/' || currentRoute === '')) ||
                     (r !== '/' && currentRoute.startsWith(r));
    link.classList.toggle('active', isActive);
  });

  document.querySelectorAll('.ring-toggle-pill').forEach(btn => {
    const r = btn.getAttribute('data-route');
    const isActive = (r === '/' && (currentRoute === '/' || currentRoute === '')) ||
                     (r !== '/' && currentRoute.startsWith(r));
    btn.classList.toggle('active', isActive);
  });

  // Update language labels in desktop nav
  const langEn = document.getElementById('lang-label-en');
  const langZh = document.getElementById('lang-label-zh');
  if (langEn && langZh) {
    langEn.className = AppState.locale === 'en' ? 'active-lang' : 'inactive-lang';
    langZh.className = AppState.locale === 'zh' ? 'active-lang' : 'inactive-lang';
  }
}

// Render Current Route with State Binding
export function renderCurrentRoute() {
  const currentRoute = getActiveRoute();
  renderRoute(currentRoute, AppState);
  updateDesktopNavLinks(currentRoute);
  bindScreenEvents();
}

// Bind Screen Interactions
function bindScreenEvents() {
  // 1. Language Toggle Buttons (Desktop Nav & Screen Headers)
  const toggleLang = () => {
    const newLocale = AppState.locale === 'en' ? 'zh' : 'en';
    AppState.locale = newLocale;
    setLocale(newLocale);
    renderCurrentRoute();
    showToast(newLocale === 'zh' ? '已切换至简体中文' : 'Switched to English');
  };

  document.getElementById('web-header-lang-toggle')?.addEventListener('click', toggleLang);
  document.getElementById('header-lang-toggle')?.addEventListener('click', toggleLang);

  // 2. Bell Notification Buttons
  const handleBell = () => {
    showToast(AppState.locale === 'zh' ? '2条新安全通知：智能体状态正常' : '2 new safety notices: Agent healthy');
  };
  document.getElementById('web-header-bell-btn')?.addEventListener('click', handleBell);
  document.getElementById('header-bell-btn')?.addEventListener('click', handleBell);

  // Mode Toggles
  document.getElementById('btn-mode-web')?.addEventListener('click', () => setViewMode('web'));
  document.getElementById('btn-mode-app')?.addEventListener('click', () => setViewMode('app'));
  document.getElementById('web-btn-toggle-app')?.addEventListener('click', () => setViewMode('app'));

  // 3. Tuition Modes Selection
  document.querySelectorAll('[data-tuition-mode], .tuition-mode-card').forEach(card => {

    card.addEventListener('click', () => {
      const mode = card.getAttribute('data-tuition-mode') || card.getAttribute('data-mode');
      if (mode) {
        AppState.tuitionMode = mode;
        renderCurrentRoute();
      }
    });
  });

  // 4. Planner Scenario Toggle
  document.querySelectorAll('.scenario-toggle-btn, .scenario-chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const scenario = btn.getAttribute('data-scenario');
      if (scenario) {
        AppState.plannerScenario = scenario;
        renderCurrentRoute();
      }
    });
  });

  // 5. Safety Screen Layer Toggles & Kill Switch
  document.querySelectorAll('[data-toggle-layer]').forEach(btn => {
    btn.addEventListener('click', () => {
      const layer = btn.getAttribute('data-toggle-layer');
      if (layer && AppState.layersState[layer] !== undefined) {
        AppState.layersState[layer] = !AppState.layersState[layer];
        renderCurrentRoute();
      }
    });
  });

  const togglePause = () => {
    AppState.agentPaused = !AppState.agentPaused;
    renderCurrentRoute();
    showToast(AppState.agentPaused ? 'Agent paused! (Kill switch active)' : 'Agent resumed! 智能体已恢复');
  };
  document.getElementById('btn-kill-switch')?.addEventListener('click', togglePause);
  document.getElementById('btn-pause-agent-toggle')?.addEventListener('click', togglePause);

  document.getElementById('btn-replay-attack')?.addEventListener('click', () => {
    AppState.isAttackReplaying = true;
    showToast(AppState.locale === 'zh' ? '正在执行攻击拦截回放...' : 'Replaying attack simulation...');
    setTimeout(() => {
      showToast(AppState.locale === 'zh' ? '攻击已被外环与中环拦截，损失 $0' : 'Attack stopped by external rings. $0 lost.');
    }, 800);
  });

  // 6. Approval Passkey Button
  const handlePasskeySign = () => {
    simulatePasskeyApproval(AppState.approvalPlan.id);
  };
  document.getElementById('btn-passkey-sign')?.addEventListener('click', handlePasskeySign);
  document.getElementById('btn-approval-passkey')?.addEventListener('click', handlePasskeySign);

  // 7. Evidence Revoke Button
  document.getElementById('btn-revoke-share')?.addEventListener('click', () => {
    AppState.landlordShareRevoked = !AppState.landlordShareRevoked;
    renderCurrentRoute();
    showToast(AppState.landlordShareRevoked ? 'Shared link revoked! 链接已撤回' : 'Share link active.');
  });
  document.getElementById('btn-recreate-share')?.addEventListener('click', () => {
    AppState.landlordShareRevoked = false;
    renderCurrentRoute();
    showToast('New share link generated! 新链接已生成');
  });
  document.getElementById('btn-copy-share-link')?.addEventListener('click', () => {
    showToast('Proof link copied to clipboard! 证明链接已复制');
  });

  // 8. Chat Chips & Suggestions
  document.querySelectorAll('[data-chat-prompt], [data-action]').forEach(chip => {
    chip.addEventListener('click', (e) => {
      const prompt = chip.getAttribute('data-chat-prompt');
      const action = chip.getAttribute('data-action');

      if (action === 'toast-coming-soon') {
        showToast(AppState.locale === 'zh' ? '该功能即将推出' : 'Coming soon in next release');
      } else if (action === 'prompt-send-3000' || action === 'quick-send' || prompt === 'send3000') {
        applyDevState('waiting-approval');
      } else if (action === 'apply-plan-mitigation') {
        showToast(AppState.locale === 'zh' ? '已应用缓解方案：学费分两期支付' : 'Mitigation applied: Split payment into 2 batches');
      } else if (prompt === 'tuition') {
        navigateTo('/tuition');
      } else if (prompt === 'proof') {
        navigateTo('/evidence');
      } else if (prompt) {
        showToast(prompt);
      }
    });
  });

  // 9. Chat Composer Submit (Main Chat Screen)
  const chatForm = document.getElementById('chat-composer-form');
  const chatInput = document.getElementById('chat-input-text');
  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = chatInput?.value?.trim();
      if (!val) return;
      chatInput.value = '';

      const lower = val.toLowerCase();
      if (lower.includes('attack') || lower.includes('hack') || lower.includes('ignore') || lower.includes('invoice')) {
        applyDevState('attack-blocked');
      } else if (lower.includes('3000') || lower.includes('tuition') || lower.includes('approve')) {
        applyDevState('waiting-approval');
      } else if (lower.includes('200') || lower.includes('mom') || lower.includes('send')) {
        applyDevState('payment-sent');
      } else if (lower.includes('pause') || lower.includes('stop')) {
        AppState.agentPaused = true;
        renderCurrentRoute();
        showToast('Agent paused! 智能体已暂停');
      } else {
        showToast(AppState.locale === 'zh' ? `Chop 正在分析: "${val}"` : `Chop analyzing: "${val}"`);
      }
    });
  }

  // 10. Companion Panel Composer & Actions (Desktop Sidebar)
  const companionInput = document.getElementById('companion-input-box');
  const handleCompanionSend = () => {
    const val = companionInput?.value?.trim();
    if (!val) return;
    companionInput.value = '';

    const lower = val.toLowerCase();
    if (lower.includes('attack') || lower.includes('hack') || lower.includes('ignore') || lower.includes('invoice')) {
      applyDevState('attack-blocked');
    } else if (lower.includes('3000') || lower.includes('tuition') || lower.includes('approve')) {
      applyDevState('waiting-approval');
    } else if (lower.includes('200') || lower.includes('mom') || lower.includes('send')) {
      applyDevState('payment-sent');
    } else {
      showToast(AppState.locale === 'zh' ? `Chop 正在规划: "${val}"` : `Chop: Planning transfer for "${val}"`);
    }
  };
  document.getElementById('companion-send-action')?.addEventListener('click', handleCompanionSend);
  companionInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleCompanionSend();
  });
}

// Global Delegation for data-route clicks
function setupGlobalNavigation() {
  document.addEventListener('click', (e) => {
    const routeEl = e.target.closest('[data-route]');
    if (routeEl) {
      e.preventDefault();
      const route = routeEl.getAttribute('data-route');
      if (route) {
        navigateTo(route);
      }
    }
  });

  window.addEventListener('hashchange', () => {
    renderCurrentRoute();
  });

  // Dev State Select Dropdown
  document.getElementById('dev-state-select')?.addEventListener('change', (e) => {
    applyDevState(e.target.value);
  });
}

// Initialize Application
function init() {
  const urlParams = new URLSearchParams(window.location.search);
  const requestedMode = urlParams.get('mode') || localStorage.getItem('aegispath_view_mode') || 'web';
  AppState.viewMode = requestedMode;

  const savedLocale = localStorage.getItem('aegispath_locale') || 'en';
  AppState.locale = savedLocale;
  setLocale(savedLocale);

  setupGlobalNavigation();
  setViewMode(requestedMode);
}

document.addEventListener('DOMContentLoaded', init);


