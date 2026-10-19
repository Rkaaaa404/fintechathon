'use client';

import React from 'react';
import { Locale } from '@/lib/i18n';
import { AppRoute } from '@/types';
import { SEED_DATA, EvidencePack, EvidenceSource } from '@/lib/mockData';
import { ChopMascot } from '@/components/art/ChopMascot';
import { HeaderArt } from '@/components/art/HeaderArt';
import SplitText from '@/components/SplitText';
import { EvidenceDocIcon, AegisShieldIcon } from '@/components/icons/AegisIcons';
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

  return (
    <div className="evidence-screen pb-10 w-full">
      {/* ═══════════ LUMINOUS EVIDENCE HERO HEADER (1200px aligned) ═══════════ */}
      <header className="screen-header-blue evidence-header relative overflow-hidden rounded-[20px] p-6 md:p-8 w-full mb-6">
        <HeaderArt screenType="evidence" />

        <div className="header-content relative z-10 w-full">
          <div className="flex items-center justify-between mb-3">
            <div className="brand-row flex items-center gap-2.5">
              <button
                className="nav-back-btn p-1.5 rounded-full bg-white/15 text-white hover:bg-white/25 transition-all flex items-center justify-center cursor-pointer"
                onClick={() => onNavigate('/')}
                aria-label="Back to home"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-white/20 text-white">
                  <EvidenceDocIcon size={20} color="#FFFFFF" />
                </span>
                <h1 className="brand-title text-white font-bold text-[20px] tracking-tight">
                  <SplitText
                    text={locale === 'zh' ? '财力证明包' : 'Evidence Pack'}
                    tag="span"
                    delay={25}
                    duration={0.6}
                    effect="fade"
                  />
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[12px] font-semibold bg-white/20 text-white px-3 py-1 rounded-full border border-white/25 hidden md:inline-flex">
                {locale === 'zh' ? '凭证包已就绪 · 隐私脱敏' : 'Proof Pack Ready · PII Redacted'}
              </span>
              <div className="mascot-header-cluster">
                <ChopMascot
                  bodyColor="#FFFFFF"
                  faceColor="#DCE8FD"
                  expression="inspect"
                  size={62}
                />
              </div>
            </div>
          </div>

          <div className="mt-1 pr-[140px] md:pr-[180px]">
            <p className="text-[#DBEAFE] text-[13px] max-w-[660px] leading-relaxed">
              {locale === 'zh'
                ? '自主汇总多源资金证明，为租房、签证及入学出具不可篡改的凭证摘要。'
                : 'Aggregate multi-source financial evidence into verifiable summaries for leasing and bursar verification.'}
            </p>
          </div>
        </div>
      </header>

      {/* ═══════════ TWO EQUAL-HEIGHT COLUMNS ═══════════ */}
      <main className="screen-body w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Left Column (col-span-7): Stat Cards & Provenance Sources */}
          <div className="md:col-span-7 flex flex-col h-full gap-6">
            {/* Two Stat Cards: Avg Balance & Income Months */}
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <Card variant="default" className="p-5">
                <span className="text-[13px] text-[#64748B] font-medium block">
                  {locale === 'zh' ? '月均可用资金' : 'Avg. monthly balance'}
                </span>
                <div className="text-[28px] font-bold tabular-nums text-[#14213D] tracking-tight leading-none my-1">
                  {ev.avgBalance}
                </div>
                <div className="text-[12px] text-[#0E6E43] font-medium mt-2">
                  ✓ {locale === 'zh' ? '确定性规则计算' : 'Computed deterministically'}
                </div>
              </Card>

              <Card variant="default" className="p-5">
                <span className="text-[13px] text-[#64748B] font-medium block">
                  {locale === 'zh' ? '稳定流水周期' : 'Income months'}
                </span>
                <div className="text-[28px] font-bold tabular-nums text-[#14213D] tracking-tight leading-none my-1">
                  {ev.incomeMonths}
                </div>
                <div className="text-[12px] text-[#1C3EAA] font-medium mt-2">
                  ✓ {locale === 'zh' ? '连续合规入账' : 'Verified steady deposits'}
                </div>
              </Card>
            </div>

            {/* Sources by Provenance Card - Divider lines between rows instead of separate bordered boxes */}
            <Card variant="default" className="flex-1 flex flex-col p-0 overflow-hidden">
              <div className="p-5 pb-3">
                <CardHeader className="pb-0 mb-0 border-b-0">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-[#1C3EAA] rounded-full" />
                    <CardTitle className="text-[16px] text-[#14213D] font-bold">
                      {locale === 'zh' ? '来源凭证列表' : 'Sources'}
                    </CardTitle>
                  </div>
                  <CardBadge variant="neutral">
                    {locale === 'zh' ? '3项已关联数据源' : '3 Connected Sources'}
                  </CardBadge>
                </CardHeader>
              </div>

              {/* Rows with thin divider lines instead of separate bordered boxes, padding 16px 20px */}
              <div className="divide-y divide-[rgba(15,23,42,0.06)] border-t border-[rgba(15,23,42,0.06)] w-full flex-1">
                {ev.sources.map((src: EvidenceSource) => (
                  <div
                    key={src.titleEn}
                    className="flex items-center justify-between gap-4 py-4 px-5 hover:bg-[#F8FAFC] transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-[#F4F7FE] text-[#1C3EAA] flex items-center justify-center shrink-0 border border-[#3D6BEA]/15">
                        <EvidenceDocIcon size={17} color="#1C3EAA" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[14px] font-bold text-[#14213D] truncate">
                          {locale === 'zh' ? src.titleZh : src.titleEn}
                        </div>
                        <div className="text-[12.5px] text-[#64748B] mt-0.5 truncate">
                          {locale === 'zh' ? src.provenanceZh : src.provenanceEn}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 mr-1">
                      <CardBadge variant={src.tier === 'Tier 1' ? 'green' : src.tier === 'Tier 2' ? 'blue' : 'amber'}>
                        {src.tier}
                      </CardBadge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column (col-span-5): Landlord Sharing & Info Banner */}
          <div className="md:col-span-5 flex flex-col h-full gap-6">
            <Card variant="default" className="flex-1 flex flex-col p-5">
              <div>
                {/* Header row: title + "Active share" badge */}
                <CardHeader className="flex items-center justify-between pb-3 mb-3 border-b border-[rgba(15,23,42,0.06)]">
                  <CardTitle className="text-[16px] text-[#14213D] font-bold">
                    {locale === 'zh' ? '房东分享凭证' : 'Landlord share token'}
                  </CardTitle>
                  <CardBadge variant={landlordShareRevoked ? 'red' : 'green'}>
                    {landlordShareRevoked
                      ? locale === 'zh' ? '已撤销' : 'Revoked'
                      : locale === 'zh' ? '已生效' : 'Active share'}
                  </CardBadge>
                </CardHeader>

                {/* Body text with 8px line gaps in a subtle #F8FAFC block with 12px padding */}
                <div className="flex flex-col gap-2 p-3 bg-[#F8FAFC] rounded-[12px] text-[13px] text-[#14213D] leading-relaxed">
                  {landlordShareRevoked ? (
                    <div>
                      <strong>{locale === 'zh' ? '凭证已撤销。' : 'Token Revoked.'}</strong>{' '}
                      {locale === 'zh' ? '访问权限已即时失效。' : 'Access immediately invalidated.'}
                    </div>
                  ) : (
                    <div>
                      <strong>{locale === 'zh' ? '14天后到期。' : 'Expires in 14 days.'}</strong>{' '}
                      {locale === 'zh' ? '受保护的只读资金证明凭证。' : 'Verified read-only proof token.'}
                    </div>
                  )}

                  <div className="text-[12.5px] text-[#64748B]">
                    {locale === 'zh' ? (
                      <>
                        分享字段: <strong>资金余额与稳定入账周期</strong> (银行账号与学生个人身份已严格脱敏)。
                      </>
                    ) : (
                      <>
                        Shared fields: <strong>Balance & regular deposits</strong> (Bank account & PII strictly redacted).
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons inside card: 40px height, 16px padding, 8px gap */}
              <CardFooter className="pt-3 mt-4 flex flex-col gap-2 w-full border-t border-[rgba(15,23,42,0.06)]">
                {landlordShareRevoked ? (
                  <button
                    className="w-full h-10 px-4 rounded-[12px] bg-[#1C3EAA] text-white font-bold text-[13px] hover:bg-[#15328C] transition-all cursor-pointer shadow-xs flex items-center justify-center text-center"
                    id="btn-recreate-share"
                    onClick={onToggleRevokeShare}
                  >
                    {locale === 'zh' ? '重新生成分享链接' : 'Create new share link'}
                  </button>
                ) : (
                  <>
                    <button
                      className="w-full h-10 px-4 rounded-[12px] bg-[#1C3EAA] text-white font-bold text-[13px] hover:bg-[#15328C] transition-all cursor-pointer shadow-xs flex items-center justify-center text-center"
                      id="btn-copy-share-link"
                      onClick={onCopyShareLink}
                    >
                      {locale === 'zh' ? '复制分享链接' : 'Copy share link'}
                    </button>
                    <button
                      className="w-full h-10 px-4 rounded-[12px] bg-white border border-[#B91C1C] text-[#B91C1C] font-semibold text-[13px] hover:bg-[#FEF2F2] transition-all cursor-pointer flex items-center justify-center text-center"
                      id="btn-revoke-share"
                      onClick={onToggleRevokeShare}
                    >
                      {locale === 'zh' ? '撤销该凭证链接' : 'Revoke link'}
                    </button>
                  </>
                )}
              </CardFooter>
            </Card>

            {/* Evidence Notice: padding 16px 20px, text 13px muted, icon aligned with title */}
            <div className="p-4 md:px-5 rounded-[16px] bg-[#F8FAFC] border border-[rgba(15,23,42,0.08)] text-[13px] text-[#64748B] leading-relaxed">
              <div className="font-bold text-[#14213D] mb-1 flex items-center gap-1.5">
                <AegisShieldIcon size={16} color="#1C3EAA" secondaryColor="rgba(28,62,170,0.2)" />
                <span>{locale === 'zh' ? '凭证说明' : 'Evidence Notice'}</span>
              </div>
              <p>
                {locale === 'zh'
                  ? '本证明为财力摘要，非信用评分，不保证第三方无条件接受。'
                  : 'An evidence summary, not a credit score. Acceptance by others is not guaranteed.'}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
