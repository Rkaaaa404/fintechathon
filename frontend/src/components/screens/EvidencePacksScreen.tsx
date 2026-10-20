'use client';

import React, { useState } from 'react';
import { Locale, AppRoute } from '@/types';
import { UserProfileContext, getAppDataForUser } from '@/lib/mockData';
import { HeaderArt } from '@/components/art/HeaderArt';
import { ChopMascot } from '@/components/art/ChopMascot';
import { EvidenceInspectMascot } from '@/components/art/EvidenceInspectMascot';
import { Card, CardHeader, CardTitle, CardBadge, CardBody, CardFooter } from '@/components/ui/Card';
import SplitText from '@/components/SplitText';
import { EvidenceDocIcon, AegisShieldIcon, TuitionGradCapIcon } from '@/components/icons/AegisIcons';
import { ArrowLeft, Check, Copy, Download, ExternalLink, Eye, EyeOff, FileText, Filter, Plus, QrCode, Search, ShieldCheck, Trash2, X } from 'lucide-react';

export interface EvidencePackItem {
  id: string;
  titleEn: string;
  titleZh: string;
  category: 'housing' | 'visa' | 'tuition' | 'exchange';
  recipient: string;
  status: 'active' | 'expiring' | 'revoked' | 'draft';
  issuedDate: string;
  expiryDate: string;
  daysRemaining?: number;
  hash: string;
  shareUrl: string;
  sources: string[];
  disclosedFields: string[];
  redactedFields: string[];
  verifiedAmount: string;
}

const INITIAL_PACKS: EvidencePackItem[] = [
  {
    id: 'pack-housing-2026',
    titleEn: 'Campus Housing Proof (Fall 2026)',
    titleZh: '校内宿舍申请资金证明（2026秋季）',
    category: 'housing',
    recipient: 'HKUST Student Housing Office',
    status: 'active',
    issuedDate: '12 Oct 2026',
    expiryDate: '26 Oct 2026',
    daysRemaining: 14,
    hash: '0x7f4a9b2c81e3d4a0f671b590e8c38d12fa6b98e7',
    shareUrl: 'https://aegispath.finance/verify/proof-7f4a9b2c',
    sources: ['Tier 1 Bank Statements (6 Mos)', 'Bank Sandbox API Live Sync'],
    disclosedFields: ['Avg Monthly Balance ($3,200)', 'Verified Steady Deposits (6 Mos)', 'Student Enrollment Status'],
    redactedFields: ['16-digit Bank Account Number', 'National ID / Passport Number', 'Detailed Merchant Transaction History'],
    verifiedAmount: '$12,450.00 USD',
  },
  {
    id: 'pack-visa-guarantee',
    titleEn: 'Student Visa Solvency Guarantee',
    titleZh: '香港入境处学生签注续签资金担保',
    category: 'visa',
    recipient: 'HKSAR Immigration Department',
    status: 'active',
    issuedDate: '08 Oct 2026',
    expiryDate: '08 Nov 2026',
    daysRemaining: 19,
    hash: '0x3c81e289f02938ab4c10283f90241b77823c9a42',
    shareUrl: 'https://aegispath.finance/verify/proof-3c81e289',
    sources: ['Tier 1 Bank Statements', 'Tuition Escrow Locked Buffer', 'Family Support Remittance'],
    disclosedFields: ['Total Liquid Balance ($12,450.00)', 'Tuition Reserve Ratio (100%)', 'University Tuition Acceptance'],
    redactedFields: ['Account Routing Code', 'Family Home Address', 'Sponsor Contact Number'],
    verifiedAmount: '$12,450.00 USD',
  },
  {
    id: 'pack-tuition-bursar',
    titleEn: 'Tuition Direct Bursar Certificate',
    titleZh: '大学财务处学费预付与直连证明',
    category: 'tuition',
    recipient: 'Campus Finance & Bursar',
    status: 'active',
    issuedDate: '15 Oct 2026',
    expiryDate: '31 Dec 2026',
    daysRemaining: 72,
    hash: '0x91e2aa0f77b1934c22904e5bf488147d3c004a88',
    shareUrl: 'https://aegispath.finance/verify/proof-91e2aa0f',
    sources: ['Scholarship Grant Letter', 'Bank Sandbox Escrow Ledger'],
    disclosedFields: ['Direct Bursar Routing Authorization', 'CNY 18,000 Tuition Quote Lock', 'Student ID 20491823'],
    redactedFields: ['Personal Credit Score', 'Unrelated Debit Transactions'],
    verifiedAmount: 'CNY 18,000 / $2,580.00 USD',
  },
  {
    id: 'pack-offcampus-lease',
    titleEn: 'Off-Campus Private Lease Solvency Proof',
    titleZh: '校外租房业主财力担保凭据（已撤回）',
    category: 'housing',
    recipient: 'Clear Water Bay Landlord Agency',
    status: 'revoked',
    issuedDate: '01 Oct 2026',
    expiryDate: '15 Oct 2026',
    daysRemaining: 0,
    hash: '0x11ab44c92e70f4381024bd29e8751aa3390f77e2',
    shareUrl: 'https://aegispath.finance/verify/proof-revoked',
    sources: ['Tier 1 Bank Statements (Simulated)'],
    disclosedFields: ['Avg Monthly Rent Coverage (4.2x)'],
    redactedFields: ['All Banking PII', 'Identity Card Numbers'],
    verifiedAmount: '$8,400.00 USD',
  },
  {
    id: 'pack-exchange-guarantee',
    titleEn: 'Global Study Abroad Exchange Proof',
    titleZh: '国际交换生财力资质凭证（草稿预生成）',
    category: 'exchange',
    recipient: 'Global Study Abroad Office',
    status: 'draft',
    issuedDate: 'Draft',
    expiryDate: 'Pending signature',
    hash: '0xaa4291c94022831bfe033bc77192a0e418471209',
    shareUrl: 'https://aegispath.finance/verify/draft-preview',
    sources: ['Tier 2 Bank API Weekly Sync', 'Scholarship Award Letter'],
    disclosedFields: ['Cross-Border Fund Availability', 'Travel Allowance ($3,000)'],
    redactedFields: ['Daily Account Balance Fluctuations'],
    verifiedAmount: '$5,000.00 USD',
  },
];

interface EvidencePacksScreenProps {
  locale?: Locale;
  onNavigate: (route: AppRoute) => void;
  onShowToast: (message: string) => void;
  authUser?: UserProfileContext;
}

export const EvidencePacksScreen: React.FC<EvidencePacksScreenProps> = ({
  locale = 'en',
  onNavigate,
  onShowToast,
  authUser,
}) => {
  const [packs, setPacks] = useState<EvidencePackItem[]>(INITIAL_PACKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'housing' | 'visa' | 'tuition'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'revoked'>('all');
  const [inspectModalPack, setInspectModalPack] = useState<EvidencePackItem | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRecipient, setNewRecipient] = useState('');
  const [newPurpose, setNewPurpose] = useState('Campus Housing Application');

  const filteredPacks = packs.filter((p) => {
    const matchesSearch =
      p.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.titleZh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.hash.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && (p.status === 'active' || p.status === 'expiring')) ||
      (selectedStatus === 'revoked' && p.status === 'revoked');
    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleCopyLink = (pack: EvidencePackItem) => {
    if (pack.status === 'revoked') {
      onShowToast(locale === 'zh' ? '该凭证链接已被撤回，无法访问' : 'This proof link is revoked and inaccessible');
      return;
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(pack.shareUrl).catch(() => {});
    }
    onShowToast(locale === 'zh' ? `已复制凭证链接 (${pack.recipient})` : `Copied proof link for ${pack.recipient}`);
  };

  const handleToggleRevoke = (id: string) => {
    setPacks((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const isCurrentlyRevoked = p.status === 'revoked';
          const nextStatus = isCurrentlyRevoked ? 'active' : 'revoked';
          onShowToast(
            isCurrentlyRevoked
              ? (locale === 'zh' ? '凭证已重新恢复生效！' : 'Proof link restored and active!')
              : (locale === 'zh' ? '凭证已安全撤回，第三方将无法查阅！' : 'Proof link revoked. Third parties can no longer view details.')
          );
          return {
            ...p,
            status: nextStatus,
            shareUrl: isCurrentlyRevoked
              ? `https://aegispath.finance/verify/proof-${p.id.slice(0, 8)}`
              : 'https://aegispath.finance/verify/proof-revoked',
          };
        }
        return p;
      })
    );
  };

  const handleDownloadProofJson = (pack: EvidencePackItem) => {
    const payload = {
      evidence_pack_id: pack.id,
      title: locale === 'zh' ? pack.titleZh : pack.titleEn,
      recipient: pack.recipient,
      verified_amount: pack.verifiedAmount,
      sha256_hash: pack.hash,
      issued_date: pack.issuedDate,
      expiry_date: pack.expiryDate,
      disclosed_fields: pack.disclosedFields,
      redacted_pii_fields: pack.redactedFields,
      sources: pack.sources,
      attestation: 'VERIFIED_BY_AEGISPATH_DETERMINISTIC_RULES',
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AegisPath_${pack.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast(locale === 'zh' ? '已导出加密财力凭证 JSON' : 'Exported cryptographic proof JSON');
  };

  const handleCreatePack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipient.trim()) {
      onShowToast(locale === 'zh' ? '请输入凭证收款方或审核机构' : 'Please specify a recipient agency');
      return;
    }
    const newId = `pack-${Date.now().toString(36)}`;
    const randomHash = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const newPack: EvidencePackItem = {
      id: newId,
      titleEn: `${newPurpose} (${newRecipient})`,
      titleZh: `${newPurpose}（${newRecipient}）`,
      category: 'housing',
      recipient: newRecipient.trim(),
      status: 'active',
      issuedDate: 'Just now',
      expiryDate: '14 days from now',
      daysRemaining: 14,
      hash: randomHash,
      shareUrl: `https://aegispath.finance/verify/proof-${newId}`,
      sources: ['Tier 1 Bank Statements (Simulated)', 'Bank Sandbox API Live Sync'],
      disclosedFields: ['Avg Monthly Balance ($3,200)', 'Verified Solvency Status'],
      redactedFields: ['16-digit Bank Account', 'Personal ID Details'],
      verifiedAmount: '$12,450.00 USD',
    };
    setPacks([newPack, ...packs]);
    setShowCreateModal(false);
    setNewRecipient('');
    onShowToast(locale === 'zh' ? '已成功创建并签发新财力凭证包！' : 'New verifiable evidence pack created and signed!');
  };

  return (
    <div className="evidence-packs-screen pb-14 w-full animate-fadeIn">
      {/* ═══════════ LUMINOUS HERO HEADER WITH MASCOT ═══════════ */}
      <header className="screen-header-blue relative overflow-hidden rounded-[20px] p-6 md:p-8 w-full mb-6 shadow-sm border border-[#2563EB]/30">
        <HeaderArt screenType="evidence-packs" />

        <div className="header-content relative z-10 w-full">
          <div className="flex items-center justify-between mb-3">
            <div className="brand-row flex items-center gap-2.5">
              <button
                className="nav-back-btn p-1.5 rounded-full bg-white/15 text-white hover:bg-white/25 transition-all flex items-center justify-center cursor-pointer active:scale-95"
                onClick={() => onNavigate('/evidence')}
                aria-label="Back to Evidence Overview"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-white/20 text-white shadow-xs">
                  <EvidenceDocIcon size={20} color="#FFFFFF" />
                </span>
                <h1 className="brand-title text-white font-bold text-[20px] tracking-tight">
                  <SplitText
                    text={locale === 'zh' ? '财力凭证包总览与签发' : 'Evidence Packs Directory'}
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
                  {locale === 'zh'
                    ? `${packs.filter((p) => p.status === 'active').length} 份有效凭证包`
                    : `${packs.filter((p) => p.status === 'active').length} Active Packs`}
                </span>
              </span>
              <div className="mascot-header-cluster flex items-center gap-1">
                <EvidenceInspectMascot size={58} />
                <ChopMascot bodyColor="#FFFFFF" faceColor="#DCE8FD" expression="inspect" size={48} />
              </div>
            </div>
          </div>

          <div className="mt-1 pr-[140px] md:pr-[200px]">
            <p className="text-[#DBEAFE] text-[13px] max-w-[700px] leading-relaxed">
              {locale === 'zh'
                ? '自主多源汇总与选择性披露。对外出具包含确定性防伪哈希的证明链接，银行卡号及个人敏感隐私 100% 本地脱敏保护。'
                : 'Selective-disclosure verifiable proof packages. Share cryptographic proof of funds with landlords, bursars, and immigration with zero PII exposure.'}
            </p>
          </div>
        </div>
      </header>

      {/* ═══════════ TOP METRICS STRIP ═══════════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
        <Card variant="default" className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] text-[#1C3EAA] flex items-center justify-center shrink-0 border border-[#3D6BEA]/20">
            <FileText size={20} />
          </div>
          <div>
            <span className="text-[11.5px] text-[#475569] font-medium block">
              {locale === 'zh' ? '凭证包总数' : 'Total Packs'}
            </span>
            <div className="text-[20px] font-bold text-[#14213D] leading-tight mt-0.5">
              {packs.length}
            </div>
          </div>
        </Card>

        <Card variant="default" className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EBF7EE] text-[#0E6E43] flex items-center justify-center shrink-0 border border-[#0E6E43]/20">
            <ShieldCheck size={20} />
          </div>
          <div>
            <span className="text-[11.5px] text-[#475569] font-medium block">
              {locale === 'zh' ? '生效中分享' : 'Active Shares'}
            </span>
            <div className="text-[20px] font-bold text-[#0E6E43] leading-tight mt-0.5">
              {packs.filter((p) => p.status === 'active').length}
            </div>
          </div>
        </Card>

        <Card variant="default" className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] text-[#1C3EAA] flex items-center justify-center shrink-0 border border-[#3D6BEA]/20">
            <span className="text-[18px]">🏛️</span>
          </div>
          <div>
            <span className="text-[11.5px] text-[#475569] font-medium block">
              {locale === 'zh' ? '核验资金主体' : 'Verified Funds'}
            </span>
            <div className="text-[20px] font-bold text-[#14213D] leading-tight mt-0.5">
              $12,450
            </div>
          </div>
        </Card>

        <Card variant="default" className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 border border-[#2563EB]/20">
            <EyeOff size={18} />
          </div>
          <div>
            <span className="text-[11.5px] text-[#475569] font-medium block">
              {locale === 'zh' ? '隐私脱敏率' : 'PII Redacted'}
            </span>
            <div className="text-[20px] font-bold text-[#1D4ED8] leading-tight mt-0.5">
              100% Zero-Leak
            </div>
          </div>
        </Card>
      </div>

      {/* ═══════════ SEARCH & ACTION CONTROLS ═══════════ */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-5">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-[420px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === 'zh' ? '搜索凭证包名称、收款方或防伪哈希…' : 'Search by title, recipient, or hash…'}
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-white border border-[#CBD5E1] text-[13px] text-[#1E293B] focus:outline-none focus:border-[#1C3EAA] focus:ring-1 focus:ring-[#1C3EAA] shadow-2xs transition-all"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl">
            {(['all', 'housing', 'visa', 'tuition'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat ? 'bg-white text-[#1C3EAA] shadow-2xs' : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                {cat === 'all'
                  ? (locale === 'zh' ? '全部类别' : 'All')
                  : cat === 'housing'
                  ? (locale === 'zh' ? '租房' : 'Housing')
                  : cat === 'visa'
                  ? (locale === 'zh' ? '签证' : 'Visa')
                  : (locale === 'zh' ? '学费' : 'Tuition')}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="h-10 px-4 rounded-xl bg-[#1C3EAA] hover:bg-[#163188] text-white font-bold text-[13px] flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>{locale === 'zh' ? '新建财力凭证包' : 'Issue New Pack'}</span>
        </button>
      </div>

      {/* ═══════════ PACKS LIST ═══════════ */}
      <div className="space-y-4">
        {filteredPacks.length === 0 ? (
          <Card variant="default" className="p-10 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-[#F1F5F9] text-[#64748B] flex items-center justify-center mb-3">
              <FileText size={28} />
            </div>
            <h3 className="font-bold text-[#14213D] text-[16px]">
              {locale === 'zh' ? '未找到符合条件的财力凭证包' : 'No matching evidence packs found'}
            </h3>
            <p className="text-[#64748B] text-[13px] max-w-[400px] mt-1">
              {locale === 'zh' ? '尝试调整搜索条件或点击右上角签发新的财力证明包。' : 'Try clearing your search filters or generate a new proof pack.'}
            </p>
          </Card>
        ) : (
          filteredPacks.map((pack) => {
            const isRevoked = pack.status === 'revoked';
            return (
              <Card
                key={pack.id}
                variant="default"
                className={`p-5 transition-all hover:shadow-md border ${
                  isRevoked ? 'border-dashed border-[#EF4444]/40 bg-[#FAFAFA]' : 'border-[rgba(15,23,42,0.08)]'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Info */}
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                        isRevoked
                          ? 'bg-[#FEF2F2] text-[#B91C1C] border-[#B91C1C]/20'
                          : 'bg-[#EEF4FF] text-[#1C3EAA] border-[#3D6BEA]/20'
                      }`}
                    >
                      {pack.category === 'housing' && <span className="text-[20px]">🏠</span>}
                      {pack.category === 'visa' && <span className="text-[20px]">🛂</span>}
                      {pack.category === 'tuition' && <TuitionGradCapIcon size={22} color="#1C3EAA" />}
                      {pack.category === 'exchange' && <span className="text-[20px]">✈️</span>}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-[15px] text-[#14213D] leading-tight">
                          {locale === 'zh' ? pack.titleZh : pack.titleEn}
                        </h3>
                        <CardBadge variant={isRevoked ? 'red' : 'green'}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isRevoked ? 'bg-[#B91C1C]' : 'bg-[#0E6E43]'} mr-1.5`} />
                          {isRevoked ? 'Revoked' : 'Active'}
                        </CardBadge>
                        <span className="text-[11.5px] font-semibold text-[#1C3EAA] bg-[#EEF4FF] px-2 py-0.5 rounded-md">
                          {pack.verifiedAmount}
                        </span>
                      </div>

                      <div className="text-[12.5px] text-[#475569] font-medium mt-1 flex items-center gap-3 flex-wrap">
                        <span>
                          {locale === 'zh' ? '接受方: ' : 'Recipient: '}
                          <strong className="text-[#1E293B]">{pack.recipient}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          {locale === 'zh' ? '签发于 ' : 'Issued: '}
                          {pack.issuedDate}
                        </span>
                        <span>•</span>
                        <span>
                          {locale === 'zh' ? '有效期至 ' : 'Expires: '}
                          {pack.expiryDate} {pack.daysRemaining ? `(${pack.daysRemaining}d left)` : ''}
                        </span>
                      </div>

                      {/* Disclosure tags */}
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        <span className="text-[11px] font-medium text-[#0E6E43] bg-[#EBF7EE] px-2 py-0.5 rounded border border-[#0E6E43]/20 flex items-center gap-1">
                          <Check size={12} /> {pack.disclosedFields.length} {locale === 'zh' ? '项已核验披露' : 'disclosed'}
                        </span>
                        <span className="text-[11px] font-medium text-[#1E40AF] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#93C5FD] flex items-center gap-1">
                          <ShieldCheck size={12} /> {pack.redactedFields.length} {locale === 'zh' ? '项脱敏' : 'redacted'}
                        </span>
                        <span className="text-[11px] font-mono text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded truncate max-w-[210px]">
                          {pack.hash}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end lg:self-center flex-wrap">
                    <button
                      onClick={() => setInspectModalPack(pack)}
                      className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] hover:bg-[#EEF4FF] text-[#1C3EAA] font-bold text-[12px] flex items-center gap-1.5 border border-[#CBD5E1] transition-all cursor-pointer"
                    >
                      <Eye size={14} />
                      <span>{locale === 'zh' ? '详情与核验' : 'Inspect'}</span>
                    </button>

                    <button
                      onClick={() => handleCopyLink(pack)}
                      disabled={isRevoked}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[12px] flex items-center gap-1.5 transition-all cursor-pointer ${
                        isRevoked
                          ? 'bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed'
                          : 'bg-[#EEF4FF] hover:bg-[#DCE8FD] text-[#1C3EAA] border border-[#3D6BEA]/30'
                      }`}
                    >
                      <Copy size={14} />
                      <span>{locale === 'zh' ? '复制证明链接' : 'Copy Link'}</span>
                    </button>

                    <button
                      onClick={() => handleDownloadProofJson(pack)}
                      className="p-2 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1] transition-all cursor-pointer"
                      title={locale === 'zh' ? '下载加密 JSON 凭证' : 'Download JSON Proof'}
                    >
                      <Download size={14} />
                    </button>

                    <button
                      onClick={() => handleToggleRevoke(pack.id)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[12px] transition-all cursor-pointer ${
                        isRevoked
                          ? 'bg-[#EBF7EE] text-[#0E6E43] hover:bg-[#D4F1DE] border border-[#0E6E43]/30'
                          : 'bg-white text-[#B91C1C] hover:bg-[#FEF2F2] border border-[#B91C1C]/30'
                      }`}
                    >
                      {isRevoked
                        ? (locale === 'zh' ? '恢复生效' : 'Restore')
                        : (locale === 'zh' ? '撤回链接' : 'Revoke')}
                    </button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* ═══════════ INSPECT MODAL ═══════════ */}
      {inspectModalPack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-[560px] w-full p-6 shadow-2xl border border-[#CBD5E1] relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] text-[#1C3EAA] flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[16px] text-[#14213D]">
                    {locale === 'zh' ? inspectModalPack.titleZh : inspectModalPack.titleEn}
                  </h3>
                  <span className="text-[11.5px] text-[#64748B] font-mono">
                    ID: {inspectModalPack.id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setInspectModalPack(null)}
                className="p-1 rounded-lg text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-[13px]">
              {/* QR and Verification Hash Card */}
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <span className="text-[11px] uppercase tracking-wider text-[#64748B] font-bold block">
                    Cryptographic Integrity Hash
                  </span>
                  <p className="font-mono text-[11px] text-[#1E293B] break-all bg-white p-2 rounded-lg border border-[#CBD5E1]">
                    {inspectModalPack.hash}
                  </p>
                  <span className="text-[11.5px] text-[#0E6E43] font-semibold flex items-center gap-1 mt-1">
                    ✓ Verified by AegisPath Deterministic Consensus Engine
                  </span>
                </div>

                <div className="w-18 h-18 rounded-lg bg-white p-1 border border-[#CBD5E1] flex items-center justify-center shrink-0">
                  <QrCode size={60} className="text-[#14213D]" />
                </div>
              </div>

              {/* Verified Sources */}
              <div>
                <span className="font-bold text-[#14213D] block mb-1.5">
                  {locale === 'zh' ? '已核验数据源 (Multi-Source)' : 'Verified Data Sources'}
                </span>
                <ul className="space-y-1 text-[#475569]">
                  {inspectModalPack.sources.map((s, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-[#1C3EAA]">✦</span> {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disclosed vs Redacted Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0]">
                  <span className="font-bold text-[#166534] text-[12px] flex items-center gap-1.5 mb-1.5">
                    <Check size={14} /> {locale === 'zh' ? '安全对外披露' : 'Disclosed Fields'}
                  </span>
                  <ul className="space-y-1 text-[11.5px] text-[#14532D]">
                    {inspectModalPack.disclosedFields.map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA]">
                  <span className="font-bold text-[#991B1B] text-[12px] flex items-center gap-1.5 mb-1.5">
                    <EyeOff size={14} /> {locale === 'zh' ? '100% 隐私脱敏' : 'Redacted PII'}
                  </span>
                  <ul className="space-y-1 text-[11.5px] text-[#7F1D1D]">
                    {inspectModalPack.redactedFields.map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Share URL preview */}
              <div>
                <span className="font-bold text-[#14213D] block mb-1">
                  {locale === 'zh' ? '公共核验证书链接' : 'Public Verifiable Share URL'}
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={inspectModalPack.shareUrl}
                    className="flex-1 h-9 px-3 bg-[#F1F5F9] border border-[#CBD5E1] rounded-lg font-mono text-[11.5px] text-[#334155]"
                  />
                  <button
                    onClick={() => handleCopyLink(inspectModalPack)}
                    className="px-3 h-9 rounded-lg bg-[#1C3EAA] text-white text-[12px] font-bold hover:bg-[#163188] cursor-pointer"
                  >
                    {locale === 'zh' ? '复制' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 pt-3 border-t border-[#F1F5F9]">
              <button
                onClick={() => handleDownloadProofJson(inspectModalPack)}
                className="px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-[12.5px] font-semibold text-[#1E293B] hover:bg-[#F8FAFC] cursor-pointer"
              >
                {locale === 'zh' ? '导出 JSON' : 'Export JSON'}
              </button>
              <button
                onClick={() => setInspectModalPack(null)}
                className="px-4 py-2 rounded-xl bg-[#14213D] text-white text-[12.5px] font-semibold hover:bg-[#1E293B] cursor-pointer"
              >
                {locale === 'zh' ? '关闭' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ CREATE MODAL ═══════════ */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <form
            onSubmit={handleCreatePack}
            className="bg-white rounded-2xl max-w-[500px] w-full p-6 shadow-2xl border border-[#CBD5E1] relative"
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F1F5F9]">
              <h3 className="font-bold text-[17px] text-[#14213D]">
                {locale === 'zh' ? '签发新财力证明凭证包' : 'Issue New Evidence Pack'}
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-[13px]">
              <div>
                <label className="block text-[#475569] font-bold text-[12px] mb-1">
                  {locale === 'zh' ? '凭证用途' : 'Purpose / Category'}
                </label>
                <select
                  value={newPurpose}
                  onChange={(e) => setNewPurpose(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-[#CBD5E1] bg-white text-[#1E293B] focus:border-[#1C3EAA]"
                >
                  <option value="Campus Housing Application">Campus Housing Application (宿舍申请)</option>
                  <option value="Private Landlord Solvency Proof">Private Landlord Lease (校外租房担保)</option>
                  <option value="Visa Financial Guarantee">Student Visa Financial Guarantee (签注资产证明)</option>
                  <option value="Tuition Solvency Certificate">Tuition Solvency Certificate (学费担保)</option>
                  <option value="Academic Exchange Solvency">Exchange Program Solvency (交换生资质)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#475569] font-bold text-[12px] mb-1">
                  {locale === 'zh' ? '接收机构 / 审核人姓名' : 'Recipient / Verifying Authority'}
                </label>
                <input
                  type="text"
                  required
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  placeholder="e.g. HKUST Housing Office, Landlord Mr. Chan"
                  className="w-full h-10 px-3 rounded-xl border border-[#CBD5E1] bg-white text-[#1E293B] focus:border-[#1C3EAA]"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[12px] text-[#1E40AF] leading-relaxed">
                <strong>{locale === 'zh' ? '🛡️ 自动脱敏保障：' : '🛡️ Redaction Guarantee:'}</strong>{' '}
                {locale === 'zh'
                  ? '生成此凭证将仅授权显示您的月均存款稳健度与结余区间。完整的 16 位卡号与身份信息自动隐藏。'
                  : 'Only your average solvency rating and liquidity bracket will be disclosed. Account numbers and ID details are strictly scrubbed.'}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 pt-3 border-t border-[#F1F5F9]">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl border border-[#CBD5E1] text-[13px] font-semibold text-[#1E293B] hover:bg-[#F8FAFC] cursor-pointer"
              >
                {locale === 'zh' ? '取消' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#1C3EAA] hover:bg-[#163188] text-white text-[13px] font-bold shadow-xs cursor-pointer"
              >
                {locale === 'zh' ? '确认签发并生成哈希' : 'Generate & Sign Proof'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
