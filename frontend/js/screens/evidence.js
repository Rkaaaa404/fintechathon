// Screen 5: Evidence Pack (Route /evidence)
// Strictly follows AEGISPATH_ANTIGRAVITY_PROTOTYPE_PROMPT.md

import { t, b } from '../i18n.js';
import { SEED_DATA } from '../mockData.js';
import {
  renderChopMascot,
  renderHeaderArt
} from '../svgAssets.js';

export function renderEvidenceScreen(state) {
  const ev = state.evidencePack || SEED_DATA.evidencePack;
  const isRevoked = state.landlordShareRevoked || false;

  return `
    <div class="screen-container evidence-screen">
      <!-- ═══════════ BLUE HEADER (150px) ═══════════ -->
      <header class="screen-header-blue evidence-header">
        ${renderHeaderArt('evidence')}

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
                  ${b('evidence_title', 'evidence_sub')}
                </h1>
                <div style="font-size: 11px; opacity: 0.9; margin-top: 2px;">
                  ${b('evidence_subtitle', 'evidence_subtitle_sub')}
                </div>
              </div>
            </div>

            <div class="mascot-header-cluster">
              ${renderChopMascot({
                bodyColor: "#FFFFFF",
                faceColor: "#DCE8FD",
                expression: "wave",
                size: 50
              })}
            </div>
          </div>
        </div>
      </header>

      <!-- ═══════════ SCREEN BODY ═══════════ -->
      <main class="screen-body" style="padding-top: 16px;">
        <!-- Two Stat Cards: Avg Balance & Income Months -->
        <div class="stat-cards-row">
          <div class="stat-card-sky">
            <div class="stat-card-header">
              <span>${b('avg_monthly_bal', 'avg_monthly_bal_sub')}</span>
            </div>
            <div class="stat-card-big-num">${ev.avgBalance}</div>
            <div class="stat-card-desc">Computed deterministically</div>
          </div>

          <div class="stat-card-sky">
            <div class="stat-card-header">
              <span>${b('income_months', 'income_months_sub')}</span>
            </div>
            <div class="stat-card-big-num">${ev.incomeMonths}</div>
            <div class="stat-card-desc">Verified deposits</div>
          </div>
        </div>

        <!-- Sources by Provenance Card -->
        <div class="evidence-source-card">
          <div class="section-header-title" style="margin: 0 0 12px 0;">
            <span class="section-accent-bar"></span>
            <span>${b('sources_title', 'sources_sub')}</span>
          </div>

          ${ev.sources.map(src => `
            <div class="source-item-row">
              <div>
                <div style="font-size: 13.5px; font-weight: 600; color: var(--ink);">
                  ${src.titleEn} <span class="text-chinese-sub">${src.titleZh}</span>
                </div>
                <div style="font-size: 11px; color: var(--slate); margin-top: 2px;">
                  ${src.provenanceEn} · ${src.provenanceZh}
                </div>
              </div>
              <span class="tier-pill-tag ${src.tier.toLowerCase().replace(' ', '-')}">
                ${src.tier}
              </span>
            </div>
          `).join('')}
        </div>

        <!-- Shared with Landlord A Card -->
        <div class="evidence-source-card">
          <div class="section-header-title" style="margin: 0 0 8px 0;">
            <span class="section-accent-bar"></span>
            <span>${b('shared_tenant_title', 'shared_tenant_sub')}</span>
          </div>

          <div style="font-size: 12px; color: ${isRevoked ? 'var(--red)' : 'var(--slate)'}; margin-bottom: 4px;">
            ${isRevoked
              ? '<strong>Token Revoked 已撤销.</strong> Access immediately invalidated.'
              : 'Expires in 14 days · 14天后到期'
            }
          </div>

          <div style="font-size: 12px; color: var(--ink); margin-bottom: 12px;">
            Shared fields: <strong>Balance & regular deposits</strong> (redacted ID & account numbers)
          </div>

          <div class="share-action-row">
            ${isRevoked ? `
              <button class="btn-new-link-blue" id="btn-recreate-share">
                ${b('btn_new_link', 'btn_new_link_sub')}
              </button>
            ` : `
              <button class="btn-revoke-red" id="btn-revoke-share">
                ${b('btn_revoke', 'btn_revoke_sub')}
              </button>
              <button class="btn-new-link-blue" id="btn-copy-share-link">
                ${b('btn_new_link', 'btn_new_link_sub')}
              </button>
            `}
          </div>
        </div>

        <!-- Footer Disclaimer Note -->
        <div class="app-footer-disclaimer">
          ${b('evidence_footer_note', 'evidence_footer_note_sub')}
        </div>
      </main>
    </div>
  `;
}
