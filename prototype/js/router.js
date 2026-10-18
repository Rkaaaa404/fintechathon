// AegisPath SPA Router Module
// Strictly follows 7 routes from AEGISPATH_ANTIGRAVITY_PROTOTYPE_PROMPT.md

import { t } from './i18n.js';
import { renderHomeScreen } from './screens/home.js';
import { renderChatScreen } from './screens/chat.js';
import { renderTuitionScreen } from './screens/tuition.js';
import { renderApprovalScreen } from './screens/approval.js';
import { renderEvidenceScreen } from './screens/evidence.js';
import { renderPlannerScreen } from './screens/planner.js';
import { renderSafetyScreen } from './screens/safety.js';

export function getActiveRoute() {
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash || hash === '') return '/';
  return hash.split('?')[0] || '/';
}

export function navigateTo(route) {
  const targetHash = '#' + route;
  if (window.location.hash === targetHash) {
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    window.location.hash = targetHash;
  }
}

export function renderBottomNav(currentRoute) {
  // Routes where standard bottom nav should be hidden: /approve
  if (currentRoute.startsWith('/approve')) {
    return '';
  }

  const isHome = currentRoute === '/' || currentRoute === '';
  const isPay = currentRoute.startsWith('/tuition');
  const isChat = currentRoute.startsWith('/chat');
  const isEvidence = currentRoute.startsWith('/evidence');
  const isSafety = currentRoute.startsWith('/safety');

  return `
    <nav class="bottom-nav-bar" aria-label="Main Navigation">
      <!-- 1. Home -->
      <button class="nav-item ${isHome ? 'active' : ''}" data-route="/" aria-label="Home">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${isHome ? '2.5' : '1.8'}" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span>${t('nav_home')}</span>
        <span class="nav-item-sub">${t('nav_home_sub')}</span>
      </button>

      <!-- 2. Pay -->
      <button class="nav-item ${isPay ? 'active' : ''}" data-route="/tuition" aria-label="Pay">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${isPay ? '2.5' : '1.8'}" stroke-linecap="round" stroke-linejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
          <line x1="1" y1="10" x2="23" y2="10"></line>
        </svg>
        <span>${t('nav_pay')}</span>
        <span class="nav-item-sub">${t('nav_pay_sub')}</span>
      </button>

      <!-- 3. Center Raised Chat Button -->
      <div class="nav-center-chat-wrapper">
        <button class="nav-center-chat-btn" data-route="/chat" aria-label="${t('nav_chat_aria')}">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            <circle cx="9" cy="10" r="1" fill="currentColor"></circle>
            <circle cx="12" cy="10" r="1" fill="currentColor"></circle>
            <circle cx="15" cy="10" r="1" fill="currentColor"></circle>
          </svg>
        </button>
      </div>

      <!-- 4. Evidence -->
      <button class="nav-item ${isEvidence ? 'active' : ''}" data-route="/evidence" aria-label="Evidence">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${isEvidence ? '2.5' : '1.8'}" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
        <span>${t('nav_evidence')}</span>
        <span class="nav-item-sub">${t('nav_evidence_sub')}</span>
      </button>

      <!-- 5. Safety -->
      <button class="nav-item ${isSafety ? 'active' : ''}" data-route="/safety" aria-label="Safety">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${isSafety ? '2.5' : '1.8'}" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <polyline points="9 12 11 14 15 10"></polyline>
        </svg>
        <span>${t('nav_safety')}</span>
        <span class="nav-item-sub">${t('nav_safety_sub')}</span>
      </button>
    </nav>
  `;
}

export function renderRoute(route, state) {
  const mountEl = document.getElementById('screen-mount');
  const navMountEl = document.getElementById('bottom-nav-mount');
  if (!mountEl) return;

  let screenHtml = '';

  if (route.startsWith('/chat')) {
    screenHtml = renderChatScreen(state);
  } else if (route.startsWith('/tuition')) {
    screenHtml = renderTuitionScreen(state);
  } else if (route.startsWith('/approve')) {
    screenHtml = renderApprovalScreen(state);
  } else if (route.startsWith('/evidence')) {
    screenHtml = renderEvidenceScreen(state);
  } else if (route.startsWith('/planner')) {
    screenHtml = renderPlannerScreen(state);
  } else if (route.startsWith('/safety')) {
    screenHtml = renderSafetyScreen(state);
  } else {
    // Default: Home screen
    screenHtml = renderHomeScreen(state);
  }

  mountEl.innerHTML = screenHtml;

  if (navMountEl) {
    navMountEl.innerHTML = renderBottomNav(route);
  }

  // Scroll to top
  const viewport = document.querySelector('.screen-viewport');
  if (viewport) viewport.scrollTop = 0;
}
