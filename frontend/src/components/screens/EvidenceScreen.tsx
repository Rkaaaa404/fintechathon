'use client';

import React, { useState } from 'react';
import { Locale } from '@/types';
import { AppRoute } from '@/types';
import { SEED_DATA, EvidencePack } from '@/lib/mockData';
import { ChopMascot } from '@/components/art/ChopMascot';
import { HeaderArt } from '@/components/art/HeaderArt';
import SplitText from '@/components/SplitText';
import { EvidenceDocIcon, AegisShieldIcon, TuitionGradCapIcon } from '@/components/icons/AegisIcons';
import { Card, CardHeader, CardTitle, CardBadge, CardBody, CardFooter } from '@/components/ui/Card';

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
  const [copiedToast, setCopiedToast] = useState(false);

  const handleCopy = () => {
    onCopyShareLink();
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  return (
    <div className="evidence-screen pb-14 w-full animate-fadeIn">
      {/* ═══════════ LUMINOUS EVIDENCE HERO HEADER (1200px aligned) ═══════════ */}
      <header className="screen-header-blue evidence-header relative overflow-hidden rounded-[20px] p-6 md:p-8 w-full mb-6 shadow-sm">
        <HeaderArt screenType="evidence" />

        <div className="header-content relative z-10 w-full">
          <div className="flex items-center justify-between mb-3">
            <div className="brand-row flex items-center gap-2.5">
              <button
                className="nav-back-btn p-1.5 rounded-full bg-white/15 text-white hover:bg-white/25 transition-all flex items-center justify-center cursor-pointer active:scale-95"
                onClick={() => onNavigate('/')}
                aria-label="Back to home"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-white/20 text-white shadow-xs">
                  <EvidenceDocIcon size={20} color="#FFFFFF" />
                </span>
                <h1 className="brand-title text-white font-bold text-[20px] tracking-tight">
                  <SplitText
                    text={locale === 'zh' ? '财力证明与凭证包' : 'Evidence Pack'}
                    tag="span"
                    delay={25}
                    duration={0.6}
                    effect="fade"
                  />
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[12px] font-semibold bg-white/20 text-white px-3 py-1 rounded-full border border-white/25 flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#6FD3FF] animate-pulse" />
                <span>
                  {locale === 'zh' ? '多源资金证明已汇总' : 'Proof Pack Ready · PII Redacted'}
                </span>
              </span>
              <div className="mascot-header-cluster">
                <ChopMascot
                  bodyColor="#FFFFFF"
                  faceColor="#DCE8FD"
                  expression="inspect"
                  size={52}
                />
              </div>
            </div>
          </div>

          <div className="mt-1 pr-[140px] md:pr-[180px]">
            <p className="text-[#DBEAFE] text-[13px] max-w-[680px] leading-relaxed">
              {locale === 'zh'
                ? '自主汇总多源资金证明，为租房、签证及入学出具脱敏且不可篡改的凭证摘要。'
                : 'Aggregate multi-source financial evidence into verifiable summaries for leasing, bursar, and visa verification.'}
            </p>
          </div>
        </div>
      </header>

      {/* ═══════════ MAIN CONTENT (MATCHING IMAGE 3 EXACTLY) ═══════════ */}
      <main className="screen-body w-full space-y-6">
        {/* Top: 3 Metric Summary Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Avg Monthly Balance */}
          <Card variant="default" className="p-5 flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#EEF4FF] text-[#1C3EAA] flex items-center justify-center shrink-0 border border-[#3D6BEA]/20 shadow-xs">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1C3EAA" strokeWidth="2.2">
                <rect x="2" y="5" width="20" height="14" rx="3" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <div>
              <span className="text-[12.5px] text-[#1E293B] font-semibold block">
                {locale === 'zh' ? '月均可用资金' : 'Avg. monthly balance'}
              </span>
              <div className="text-[26px] font-bold tabular-nums text-[#14213D] tracking-tight leading-tight my-0.5">
                {ev.avgBalance}
              </div>
              <span className="text-[11.5px] text-[#0E6E43] font-semibold flex items-center gap-1">
                ↗ {locale === 'zh' ? '确定性规则计算' : 'Computed deterministically'}
              </span>
            </div>
          </Card>

          {/* Card 2: Income Months */}
          <Card variant="default" className="p-5 flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#EEF4FF] text-[#1C3EAA] flex items-center justify-center shrink-0 border border-[#3D6BEA]/20 shadow-xs">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1C3EAA" strokeWidth="2.2">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
            <div>
              <span className="text-[12.5px] text-[#1E293B] font-semibold block">
                {locale === 'zh' ? '稳定流水周期' : 'Income months'}
              </span>
              <div className="text-[26px] font-bold tabular-nums text-[#14213D] tracking-tight leading-tight my-0.5">
                {ev.incomeMonths}
              </div>
              <span className="text-[11.5px] text-[#1C3EAA] font-semibold flex items-center gap-1">
                ✓ {locale === 'zh' ? '连续稳健入账' : 'Verified steady deposits'}
              </span>
            </div>
          </Card>

          {/* Card 3: Connected Sources */}
          <Card variant="default" className="p-5 flex items-start justify-between gap-3.5">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#EEF4FF] text-[#1C3EAA] flex items-center justify-center shrink-0 border border-[#3D6BEA]/20 shadow-xs">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1C3EAA" strokeWidth="2.2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </div>
              <div>
                <span className="text-[12.5px] text-[#1E293B] font-semibold block">
                  {locale === 'zh' ? '已绑定证明源' : 'Connected sources'}
                </span>
                <div className="text-[26px] font-bold tabular-nums text-[#14213D] tracking-tight leading-tight my-0.5">
                  3 sources
                </div>
                <div className="flex items-center gap-2 text-[#1C3EAA] mt-1 text-[13px]">
                  <span title="Bank Statement">🏛️</span>
                  <span title="Bank API">📄</span>
                  <span title="Scholarship">🎓</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/chat')}
              className="px-3 py-1 rounded-[10px] bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#14213D] font-bold text-[12px] cursor-pointer transition-all active:scale-95 shrink-0"
            >
              Manage
            </button>
          </Card>
        </div>

        {/* Middle Row: Connected Sources (Left) & Landlord Share Token (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column (col-span-7): Connected Sources */}
          <div className="lg:col-span-7 flex flex-col">
            <Card variant="default" className="p-5 h-full flex flex-col justify-between">
              <div>
                <CardHeader className="pb-3 mb-3 border-b border-[rgba(15,23,42,0.06)]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-[#1C3EAA] rounded-full" />
                    <CardTitle className="text-[16px] text-[#14213D] font-bold">
                      {locale === 'zh' ? '已连接证明源' : 'Connected Sources'}
                    </CardTitle>
                  </div>
                  <span className="text-[12.5px] text-[#334155] font-medium">
                    3 connected sources
                  </span>
                </CardHeader>

                <div className="space-y-3 my-1">
                  {/* Source 1: Bank Statements */}
                  <div className="p-3.5 rounded-[14px] bg-[#F8FAFC] border border-[rgba(15,23,42,0.06)] hover:bg-[#EEF4FF]/40 transition-all flex items-center justify-between gap-3 group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] text-[#1C3EAA] flex items-center justify-center shrink-0 border border-[#3D6BEA]/20 shadow-xs">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1C3EAA" strokeWidth="2.2">
                          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-[13.5px] text-[#14213D] block leading-tight">
                          Bank statements (simulated)
                        </span>
                        <span className="text-[12px] text-[#334155] font-medium block truncate mt-0.5">
                          Tier 1 · Uploaded 12 Oct 2026 · 6 months (Apr–Sep 2026)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EBF7EE] text-[#0E6E43] border border-[#0E6E43]/20">
                        Connected
                      </span>
                      <span className="text-[#334155] text-[13px] group-hover:translate-x-0.5 transition-transform">›</span>
                    </div>
                  </div>

                  {/* Source 2: Bank API */}
                  <div className="p-3.5 rounded-[14px] bg-[#F8FAFC] border border-[rgba(15,23,42,0.06)] hover:bg-[#EEF4FF]/40 transition-all flex items-center justify-between gap-3 group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] text-[#1C3EAA] flex items-center justify-center shrink-0 border border-[#3D6BEA]/20 shadow-xs">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1C3EAA" strokeWidth="2.2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-[13.5px] text-[#14213D] block leading-tight">
                          Bank API (simulated)
                        </span>
                        <span className="text-[12px] text-[#334155] font-medium block truncate mt-0.5">
                          Tier 2 · Auto-sync weekly · Balance & transactions
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EBF7EE] text-[#0E6E43] border border-[#0E6E43]/20">
                        Connected
                      </span>
                      <span className="text-[#334155] text-[13px] group-hover:translate-x-0.5 transition-transform">›</span>
                    </div>
                  </div>

                  {/* Source 3: Scholarship Letter */}
                  <div className="p-3.5 rounded-[14px] bg-[#F8FAFC] border border-[rgba(15,23,42,0.06)] hover:bg-[#EEF4FF]/40 transition-all flex items-center justify-between gap-3 group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] text-[#1C3EAA] flex items-center justify-center shrink-0 border border-[#3D6BEA]/20 shadow-xs">
                        <TuitionGradCapIcon size={20} color="#1C3EAA" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-[13.5px] text-[#14213D] block leading-tight">
                          Scholarship letter (simulated)
                        </span>
                        <span className="text-[12px] text-[#334155] font-medium block truncate mt-0.5">
                          Tier 3 · Signed 10 Oct 2026 · Redacted student details
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EBF7EE] text-[#0E6E43] border border-[#0E6E43]/20">
                        Connected
                      </span>
                      <span className="text-[#334155] text-[13px] group-hover:translate-x-0.5 transition-transform">›</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column (col-span-5): Landlord share token */}
          <div className="lg:col-span-5 flex flex-col">
            <Card variant="default" className="p-5 h-full flex flex-col justify-between">
              <div>
                <CardHeader className="pb-3 mb-3 border-b border-[rgba(15,23,42,0.06)]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-[#1C3EAA] rounded-full" />
                    <CardTitle className="text-[16px] text-[#14213D] font-bold">
                      {locale === 'zh' ? '房东证明分享令牌' : 'Landlord share token'}
                    </CardTitle>
                  </div>
                  <CardBadge variant={landlordShareRevoked ? 'red' : 'green'}>
                    <span className={`w-1.5 h-1.5 rounded-full ${landlordShareRevoked ? 'bg-[#B91C1C]' : 'bg-[#0E6E43]'} mr-1.5`} />
                    {landlordShareRevoked ? 'Revoked' : 'Active share'}
                  </CardBadge>
                </CardHeader>

                <div className="my-2 p-4 rounded-[14px] bg-[#F8FAFC] border border-[rgba(15,23,42,0.04)]">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#EEF4FF] text-[#1C3EAA] flex items-center justify-center shrink-0 border border-[#3D6BEA]/20">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1C3EAA" strokeWidth="2.2">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-bold text-[14px] text-[#14213D] block">
                        Expires in 14 days
                      </span>
                      <span className="text-[12px] text-[#334155] font-medium block mt-0.5">
                        Verified read-only proof token.
                      </span>
                      <span className="text-[11.5px] text-[#334155] font-medium block mt-1 leading-relaxed">
                        Shared fields: Balance & regular deposits (Bank account & PII strictly redacted).
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 pt-3">
                <button
                  onClick={handleCopy}
                  className="w-full h-10 rounded-[12px] bg-[#1C3EAA] hover:bg-[#163188] text-white font-bold text-[13px] flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>{copiedToast ? 'Link Copied!' : 'Copy share link'}</span>
                </button>

                <button
                  onClick={onToggleRevokeShare}
                  className="w-full h-10 rounded-[12px] bg-white border border-[#B91C1C]/40 text-[#B91C1C] hover:bg-[#FEF2F2] font-bold text-[13px] flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  <span>{landlordShareRevoked ? 'Restore link' : 'Revoke link'}</span>
                </button>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Row: Recent Evidence Packs (Left) & Notice / Need Help (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column (col-span-7): Recent evidence packs */}
          <div className="lg:col-span-7 flex flex-col">
            <Card variant="default" className="p-5 h-full flex flex-col justify-between">
              <div>
                <CardHeader className="pb-3 mb-3 border-b border-[rgba(15,23,42,0.06)]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-[#1C3EAA] rounded-full" />
                    <CardTitle className="text-[16px] text-[#14213D] font-bold">
                      {locale === 'zh' ? '近期财力凭证包' : 'Recent evidence packs'}
                    </CardTitle>
                  </div>
                  <button
                    onClick={() => onNavigate('/chat')}
                    className="text-[12.5px] font-bold text-[#1C3EAA] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{locale === 'zh' ? '查看全部' : 'View all'}</span>
                    <span>→</span>
                  </button>
                </CardHeader>

                <div className="space-y-3 my-1">
                  {/* Pack 1 */}
                  <div className="p-3.5 rounded-[14px] bg-[#F8FAFC] border border-[rgba(15,23,42,0.04)] flex items-center justify-between gap-3 group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] text-[#1C3EAA] flex items-center justify-center shrink-0 border border-[#3D6BEA]/20">
                        <EvidenceDocIcon size={18} color="#1C3EAA" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-[13.5px] text-[#14213D] block leading-tight">
                          Campus Housing Application
                        </span>
                        <span className="text-[12px] text-[#334155] font-medium block truncate mt-0.5">
                          Created 10 Oct 2026 · Expires in 14 days
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EBF7EE] text-[#0E6E43] border border-[#0E6E43]/20">
                        Active
                      </span>
                      <button className="p-1 text-[#334155] hover:text-[#1C3EAA] cursor-pointer" title="Download summary">
                        📥
                      </button>
                      <span className="text-[#334155] text-[13px] group-hover:translate-x-0.5 transition-transform">›</span>
                    </div>
                  </div>

                  {/* Pack 2 */}
                  <div className="p-3.5 rounded-[14px] bg-[#F8FAFC] border border-[rgba(15,23,42,0.04)] flex items-center justify-between gap-3 group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#F1F5F9] text-[#1C3EAA] flex items-center justify-center shrink-0 border border-[rgba(15,23,42,0.06)]">
                        <EvidenceDocIcon size={18} color="#1C3EAA" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-[13.5px] text-[#14213D] block leading-tight">
                          Bursar Verification (Fall 2026)
                        </span>
                        <span className="text-[12px] text-[#334155] font-medium block truncate mt-0.5">
                          Created 1 Sep 2026 · Expired 1 Oct 2026
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F1F5F9] text-[#334155] border border-[rgba(15,23,42,0.06)]">
                        Expired
                      </span>
                      <button className="p-1 text-[#334155] hover:text-[#1C3EAA] cursor-pointer" title="Download summary">
                        📥
                      </button>
                      <span className="text-[#334155] text-[13px] group-hover:translate-x-0.5 transition-transform">›</span>
                    </div>
                  </div>

                  {/* Pack 3 */}
                  <div className="p-3.5 rounded-[14px] bg-[#F8FAFC] border border-[rgba(15,23,42,0.04)] flex items-center justify-between gap-3 group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] text-[#1C3EAA] flex items-center justify-center shrink-0 border border-[#3D6BEA]/20">
                        <EvidenceDocIcon size={18} color="#1C3EAA" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-[13.5px] text-[#14213D] block leading-tight">
                          Internship Financial Proof
                        </span>
                        <span className="text-[12px] text-[#334155] font-medium block truncate mt-0.5">
                          Created 15 Aug 2026 · Expires in 15 days
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EBF7EE] text-[#0E6E43] border border-[#0E6E43]/20">
                        Active
                      </span>
                      <button className="p-1 text-[#64748B] hover:text-[#1C3EAA] cursor-pointer" title="Download summary">
                        📥
                      </button>
                      <span className="text-[#64748B] text-[13px] group-hover:translate-x-0.5 transition-transform">›</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column (col-span-5): Evidence Notice + Need Help */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            {/* Top: Evidence Notice Card */}
            <Card variant="default" className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#EEF4FF] text-[#1C3EAA] flex items-center justify-center shrink-0 border border-[#3D6BEA]/20">
                  <AegisShieldIcon size={18} color="#1C3EAA" />
                </div>
                <div>
                  <span className="font-bold text-[14px] text-[#14213D] block mb-1">
                    Evidence Notice
                  </span>
                  <p className="text-[12.5px] text-[#334155] font-medium leading-relaxed">
                    An evidence summary, not a credit score. Acceptance by others is not guaranteed.
                  </p>
                </div>
              </div>
            </Card>

            {/* Bottom: Need Help Companion Card */}
            <Card variant="default" className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <ChopMascot
                  bodyColor="#FFFFFF"
                  faceColor="#DCE8FD"
                  expression="inspect"
                  size={52}
                  className="shrink-0"
                />
                <div className="min-w-0">
                  <span className="font-bold text-[14px] text-[#14213D] block mb-0.5">
                    Need help?
                  </span>
                  <p className="text-[12px] text-[#334155] font-medium leading-snug">
                    Ask Chop to generate a customized evidence pack for your purpose.
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('/chat')}
                className="w-10 h-10 rounded-full bg-[#1C3EAA] hover:bg-[#163188] text-white flex items-center justify-center shrink-0 shadow-xs transition-all active:scale-95 cursor-pointer"
                title="Ask Chop"
              >
                →
              </button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
