'use client';

import React from 'react';
import { Locale, b } from '@/lib/i18n';
import { AppRoute } from '@/types';
import { SEED_DATA, EvidencePack, EvidenceSource } from '@/lib/mockData';
import { ChopMascot } from '@/components/art/ChopMascot';
import { HeaderArt } from '@/components/art/HeaderArt';

interface EvidenceScreenProps {
  onNavigate: (route: AppRoute) => void;
  evidencePack?: EvidencePack;
  landlordShareRevoked: boolean;
  onToggleRevokeShare: () => void;
  onCopyShareLink: () => void;
  locale?: Locale;
}

export const EvidenceScreen: React.FC<EvidenceScreenProps> = ({
  onNavigate,
  evidencePack = SEED_DATA.evidencePack,
  landlordShareRevoked,
  onToggleRevokeShare,
  onCopyShareLink,
  locale = 'en',
}) => {
  const ev = evidencePack;

  return (
    <div className="screen-container evidence-screen">
      {/* ═══════════ BLUE HEADER (150px) ═══════════ */}
      <header className="screen-header-blue evidence-header">
        <HeaderArt screenType="evidence" />

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
                  {b('evidence_title', 'evidence_sub', locale)}
                </h1>
                <div style={{ fontSize: '11px', opacity: 0.9, marginTop: '2px' }}>
                  {b('evidence_subtitle', 'evidence_subtitle_sub', locale)}
                </div>
              </div>
            </div>

            <div className="mascot-header-cluster">
              <ChopMascot
                bodyColor="#FFFFFF"
                faceColor="#DCE8FD"
                expression="wave"
                size={50}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════ SCREEN BODY ═══════════ */}
      <main className="screen-body" style={{ paddingTop: '16px' }}>
        {/* Two Stat Cards: Avg Balance & Income Months */}
        <div className="stat-cards-row">
          <div className="stat-card-sky">
            <div className="stat-card-header">
              <span>{b('avg_monthly_bal', 'avg_monthly_bal_sub', locale)}</span>
            </div>
            <div className="stat-card-big-num">{ev.avgBalance}</div>
            <div className="stat-card-desc">Computed deterministically</div>
          </div>

          <div className="stat-card-sky">
            <div className="stat-card-header">
              <span>{b('income_months', 'income_months_sub', locale)}</span>
            </div>
            <div className="stat-card-big-num">{ev.incomeMonths}</div>
            <div className="stat-card-desc">Verified deposits</div>
          </div>
        </div>

        {/* Sources by Provenance Card */}
        <div className="evidence-source-card">
          <div className="section-header-title" style={{ margin: '0 0 12px 0' }}>
            <span className="section-accent-bar" />
            <span>{b('sources_title', 'sources_sub', locale)}</span>
          </div>

          {ev.sources.map((src: EvidenceSource) => (
            <div className="source-item-row" key={src.titleEn}>
              <div>
                <div
                  style={{
                    fontSize: '13.5px',
                    fontWeight: 600,
                    color: 'var(--ink)',
                  }}
                >
                  {src.titleEn}{' '}
                  <span className="text-chinese-sub">{src.titleZh}</span>
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--slate)',
                    marginTop: '2px',
                  }}
                >
                  {src.provenanceEn} · {src.provenanceZh}
                </div>
              </div>
              <span
                className={`tier-pill-tag ${src.tier
                  .toLowerCase()
                  .replace(' ', '-')}`}
              >
                {src.tier}
              </span>
            </div>
          ))}
        </div>

        {/* Shared with Landlord A Card */}
        <div className="evidence-source-card">
          <div className="section-header-title" style={{ margin: '0 0 8px 0' }}>
            <span className="section-accent-bar" />
            <span>{b('shared_tenant_title', 'shared_tenant_sub', locale)}</span>
          </div>

          <div
            style={{
              fontSize: '12px',
              color: landlordShareRevoked ? 'var(--red)' : 'var(--slate)',
              marginBottom: '4px',
            }}
          >
            {landlordShareRevoked ? (
              <span>
                <strong>Token Revoked 已撤销.</strong> Access immediately
                invalidated.
              </span>
            ) : (
              'Expires in 14 days · 14天后到期'
            )}
          </div>

          <div
            style={{
              fontSize: '12px',
              color: 'var(--ink)',
              marginBottom: '12px',
            }}
          >
            Shared fields: <strong>Balance & regular deposits</strong> (redacted ID &
            account numbers)
          </div>

          <div className="share-action-row">
            {landlordShareRevoked ? (
              <button
                className="btn-new-link-blue"
                id="btn-recreate-share"
                onClick={onToggleRevokeShare}
              >
                {b('btn_new_link', 'btn_new_link_sub', locale)}
              </button>
            ) : (
              <>
                <button
                  className="btn-revoke-red"
                  id="btn-revoke-share"
                  onClick={onToggleRevokeShare}
                >
                  {b('btn_revoke', 'btn_revoke_sub', locale)}
                </button>
                <button
                  className="btn-new-link-blue"
                  id="btn-copy-share-link"
                  onClick={onCopyShareLink}
                >
                  {b('btn_new_link', 'btn_new_link_sub', locale)}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer Disclaimer Note */}
        <div className="app-footer-disclaimer">
          {b('evidence_footer_note', 'evidence_footer_note_sub', locale)}
        </div>
      </main>
    </div>
  );
};
