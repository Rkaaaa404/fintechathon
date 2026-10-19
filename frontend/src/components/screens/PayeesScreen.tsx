'use client';

import React, { useState } from 'react';
import { Locale } from '@/types';
import { AppRoute } from '@/types';
import { ChopMascot } from '@/components/art/ChopMascot';
import { HeaderArt } from '@/components/art/HeaderArt';
import SplitText from '@/components/SplitText';
import { Card, CardHeader, CardTitle, CardBadge, CardBody, CardFooter } from '@/components/ui/Card';
import {
  PayeesBookIcon,
  AegisShieldIcon,
  TuitionGradCapIcon,
  ArrowUpRightIcon,
  SafetyRingsIcon,
} from '@/components/icons/AegisIcons';

interface PayeesScreenProps {
  onNavigate: (route: AppRoute) => void;
  locale?: Locale;
  onShowToast?: (message: string) => void;
}

interface PayeeItem {
  id: string;
  nameEn: string;
  nameZh: string;
  category: 'campus' | 'family' | 'housing';
  categoryLabelEn: string;
  categoryLabelZh: string;
  accountDescEn: string;
  accountDescZh: string;
  limitDescEn: string;
  limitDescZh: string;
  tier: string;
  verifiedDate: string;
  status: 'active' | 'cooling';
}

export const PayeesScreen: React.FC<PayeesScreenProps> = ({
  onNavigate,
  locale = 'en',
  onShowToast,
}) => {
  const [filter, setFilter] = useState<'all' | 'campus' | 'family' | 'housing'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPayeeName, setNewPayeeName] = useState('');
  const [newPayeeAccount, setNewPayeeAccount] = useState('');
  const [newPayeeCategory, setNewPayeeCategory] = useState<'campus' | 'family' | 'housing'>('campus');
  const [newPayeeLimit, setNewPayeeLimit] = useState('500');

  const [payees, setPayees] = useState<PayeeItem[]>([
    {
      id: 'payee-1',
      nameEn: 'Campus Bursar (HKUST Tuition & Fees)',
      nameZh: '学校财务处 (香港科技大学学费及杂费)',
      category: 'campus',
      categoryLabelEn: 'Higher Education',
      categoryLabelZh: '高等教育',
      accountDescEn: 'Direct Campus Bursar Clearing · SWIFT / Local HKD',
      accountDescZh: '学校财务结算通道 · 直连清算',
      limitDescEn: '$2,500.00 / transaction (Tuition Cap)',
      limitDescZh: '$2,500.00 / 笔 (学费独立额度)',
      tier: 'Tier 1 Official Registry',
      verifiedDate: 'Verified 12 Sep 2026',
      status: 'active',
    },
    {
      id: 'payee-2',
      nameEn: 'Mom (Ibu Ayu · Family Support)',
      nameZh: '妈妈 (家庭生活备用金)',
      category: 'family',
      categoryLabelEn: 'Family Allowance',
      categoryLabelZh: '家庭汇款',
      accountDescEn: 'Bank Mandiri / BCA · IDR Immediate Settlement',
      accountDescZh: '印尼银行合规汇款账户 · 即时到账',
      limitDescEn: '$500.00 / day (Personal Send Cap)',
      limitDescZh: '$500.00 / 日 (个人自主限额)',
      tier: 'Tier 1 Passkey Bound',
      verifiedDate: 'Verified 01 Oct 2026',
      status: 'active',
    },
    {
      id: 'payee-3',
      nameEn: 'High Street Student Apartments',
      nameZh: '大学路学生公寓 (月度租金)',
      category: 'housing',
      categoryLabelEn: 'Campus Housing',
      categoryLabelZh: '校外住宿',
      accountDescEn: 'Verified Property Management Trust · HKD',
      accountDescZh: '合规物业管理资金信托 · 港币自动入账',
      limitDescEn: '$1,200.00 / month (Rental Schedule)',
      limitDescZh: '$1,200.00 / 月 (固定租金批次)',
      tier: 'Tier 2 Lease Verified',
      verifiedDate: 'Verified 28 Sep 2026',
      status: 'active',
    },
  ]);

  const filteredPayees = filter === 'all' ? payees : payees.filter((p) => p.category === filter);

  const handleAddPayeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayeeName.trim() || !newPayeeAccount.trim()) {
      onShowToast?.(locale === 'zh' ? '请填写完整的收款人信息' : 'Please provide payee details');
      return;
    }

    const newItem: PayeeItem = {
      id: `payee-${Date.now()}`,
      nameEn: newPayeeName,
      nameZh: newPayeeName,
      category: newPayeeCategory,
      categoryLabelEn: newPayeeCategory === 'campus' ? 'Higher Education' : newPayeeCategory === 'family' ? 'Family Allowance' : 'Housing',
      categoryLabelZh: newPayeeCategory === 'campus' ? '高等教育' : newPayeeCategory === 'family' ? '家庭汇款' : '校外住宿',
      accountDescEn: newPayeeAccount,
      accountDescZh: newPayeeAccount,
      limitDescEn: `$${newPayeeLimit}.00 / day`,
      limitDescZh: `$${newPayeeLimit}.00 / 日`,
      tier: 'Tier 2 Policy Pending',
      verifiedDate: 'Added Today (Active)',
      status: 'active',
    };

    setPayees([newItem, ...payees]);
    setIsModalOpen(false);
    setNewPayeeName('');
    setNewPayeeAccount('');
    onShowToast?.(
      locale === 'zh'
        ? `已将「${newPayeeName}」加入中环收款人白名单`
        : `Added ${newPayeeName} to Middle Ring whitelist`
    );
  };

  return (
    <div className="payees-screen pb-12 w-full animate-fadeIn">
      {/* ═══════════ LUMINOUS HERO HEADER ═══════════ */}
      <header className="screen-header-blue payees-header relative overflow-hidden rounded-[20px] p-6 md:p-8 w-full mb-6 shadow-sm">
        <HeaderArt screenType="payees" />

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
                  <PayeesBookIcon size={20} color="#FFFFFF" />
                </span>
                <h1 className="brand-title text-white font-bold text-[20px] tracking-tight">
                  <SplitText
                    text={locale === 'zh' ? '收款人白名单管理' : 'Whitelisted Payees'}
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
                    ? `${payees.length} 个已验证收款方`
                    : `${payees.length} Whitelisted Payees`}
                </span>
              </span>
              <div className="mascot-header-cluster">
                <ChopMascot
                  bodyColor="#FFFFFF"
                  faceColor="#DCE8FD"
                  expression="guard"
                  size={52}
                />
              </div>
            </div>
          </div>

          <div className="mt-1 pr-[140px] md:pr-[180px]">
            <p className="text-[#DBEAFE] text-[13px] max-w-[680px] leading-relaxed">
              {locale === 'zh'
                ? '中环支出规则强制校验收款人白名单。任何未在此列表中的收款请求均会被系统阻断，防止提示词越权或伪造账户盗刷。'
                : 'Middle Ring spending rules strictly verify payees. Unlisted transfer targets are deterministically blocked before any request reaches the bank.'}
            </p>
          </div>
        </div>
      </header>

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <main className="screen-body w-full space-y-6">
        {/* Controls & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-[16px] border border-[rgba(15,23,42,0.08)] shadow-2xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-[#1C3EAA] text-white shadow-xs'
                  : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#14213D]'
              }`}
            >
              {locale === 'zh' ? '全部收款人' : 'All Payees'} ({payees.length})
            </button>
            <button
              onClick={() => setFilter('campus')}
              className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                filter === 'campus'
                  ? 'bg-[#1C3EAA] text-white shadow-xs'
                  : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#14213D]'
              }`}
            >
              {locale === 'zh' ? '高校学费' : 'Tuition & Campus'}
            </button>
            <button
              onClick={() => setFilter('family')}
              className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                filter === 'family'
                  ? 'bg-[#1C3EAA] text-white shadow-xs'
                  : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#14213D]'
              }`}
            >
              {locale === 'zh' ? '家庭汇款' : 'Family Support'}
            </button>
            <button
              onClick={() => setFilter('housing')}
              className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                filter === 'housing'
                  ? 'bg-[#1C3EAA] text-white shadow-xs'
                  : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#14213D]'
              }`}
            >
              {locale === 'zh' ? '学生住宿' : 'Housing'}
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center justify-center gap-2 h-9 px-4 rounded-[12px] bg-[#1C3EAA] hover:bg-[#163188] text-white font-semibold text-[13px] shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <span>+</span>
            <span>{locale === 'zh' ? '添加白名单收款人' : 'Add Whitelist Payee'}</span>
          </button>
        </div>

        {/* Payee Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPayees.map((payee) => (
            <Card
              key={payee.id}
              variant="default"
              className="p-5 flex flex-col justify-between hover:border-[#1C3EAA]/30 hover:shadow-xs transition-all duration-200 group"
            >
              <div>
                <CardHeader className="pb-2.5 mb-2.5 border-b border-[rgba(15,23,42,0.06)]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] text-[#1C3EAA] flex items-center justify-center shrink-0 border border-[#3D6BEA]/20 shadow-xs group-hover:scale-105 transition-transform">
                      {payee.category === 'campus' && <TuitionGradCapIcon size={20} color="#1C3EAA" />}
                      {payee.category === 'family' && <ArrowUpRightIcon size={20} color="#1C3EAA" />}
                      {payee.category === 'housing' && <AegisShieldIcon size={20} color="#1C3EAA" />}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold text-[#3D6BEA] uppercase tracking-wider block">
                        {locale === 'zh' ? payee.categoryLabelZh : payee.categoryLabelEn}
                      </span>
                      <CardTitle className="text-[14.5px] text-[#14213D] font-bold truncate block">
                        {locale === 'zh' ? payee.nameZh : payee.nameEn}
                      </CardTitle>
                    </div>
                  </div>

                  <CardBadge variant="green">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0E6E43] mr-1.5 animate-pulse" />
                    {locale === 'zh' ? '白名单有效' : 'Whitelisted'}
                  </CardBadge>
                </CardHeader>

                <div className="my-2 p-3 rounded-[12px] bg-[#F8FAFC] border border-[rgba(15,23,42,0.04)] space-y-1.5 text-[12px]">
                  <div className="flex items-center justify-between text-[#64748B]">
                    <span>{locale === 'zh' ? '清算账户' : 'Clearing Route'}</span>
                    <span className="font-semibold text-[#14213D] truncate max-w-[160px]">
                      {locale === 'zh' ? payee.accountDescZh : payee.accountDescEn}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#64748B]">
                    <span>{locale === 'zh' ? '限额控制' : 'Spending Limit'}</span>
                    <span className="font-bold text-[#0E6E43] tabular-nums">
                      {locale === 'zh' ? payee.limitDescZh : payee.limitDescEn}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#64748B]">
                    <span>{locale === 'zh' ? '校验凭据' : 'Verification'}</span>
                    <span className="font-medium text-[#1C3EAA]">
                      {payee.tier}
                    </span>
                  </div>
                </div>
              </div>

              <CardFooter className="pt-3 border-t border-[rgba(15,23,42,0.06)] flex items-center justify-between text-[12.5px]">
                <span className="text-[11.5px] text-[#64748B] font-medium">
                  {payee.verifiedDate}
                </span>

                <button
                  onClick={() => {
                    if (payee.category === 'campus') {
                      onNavigate('/tuition');
                    } else {
                      onShowToast?.(
                        locale === 'zh'
                          ? `已准备向「${payee.nameZh}」汇款`
                          : `Prepared transfer to ${payee.nameEn}`
                      );
                      onNavigate('/chat');
                    }
                  }}
                  className="inline-flex items-center gap-1.5 text-[#1C3EAA] hover:text-[#163188] font-bold cursor-pointer group-hover:translate-x-0.5 transition-transform"
                >
                  <span>{locale === 'zh' ? '发起转账' : 'Remit Funds'}</span>
                  <span className="text-[12px]">→</span>
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Security Matrix Infobox */}
        <div className="p-4 rounded-[16px] bg-[#EEF4FF] border border-[#3D6BEA]/20 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-white text-[#1C3EAA] flex items-center justify-center shrink-0 border border-[#3D6BEA]/20 shadow-xs">
            <SafetyRingsIcon size={18} color="#1C3EAA" />
          </div>
          <div className="text-[12.5px] text-[#1E3A8A] leading-relaxed">
            <strong className="block font-bold text-[#14213D] mb-0.5">
              {locale === 'zh' ? '三环中环防护保障 (Middle Ring Spending Gate)' : 'Middle Ring Deterministic Guarantee'}
            </strong>
            {locale === 'zh'
              ? '自主 AI 智能体即使生成了恶意收款地址或受到发票钓鱼攻击，中环规则引擎也会在请求送达银行系统前自动将其拦截，保障资金绝不流入未授权账户。'
              : 'Even if an autonomous AI prompt injection generates an unknown payment target, the deterministic Middle Ring blocks the execution before the request ever reaches the bank.'}
          </div>
        </div>
      </main>

      {/* ═══════════ ADD PAYEE MODAL ═══════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[20px] max-w-md w-full p-6 shadow-xl border border-[rgba(15,23,42,0.1)] animate-scaleIn">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[rgba(15,23,42,0.06)]">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#EEF4FF] text-[#1C3EAA] flex items-center justify-center font-bold">
                  +
                </span>
                <h3 className="font-bold text-[16px] text-[#14213D]">
                  {locale === 'zh' ? '添加白名单收款人' : 'Add Whitelist Payee'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#64748B] hover:text-[#14213D] text-[18px] p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPayeeSubmit} className="space-y-4">
              <div>
                <label className="block text-[12.5px] font-bold text-[#14213D] mb-1">
                  {locale === 'zh' ? '收款方类别' : 'Category'}
                </label>
                <select
                  value={newPayeeCategory}
                  onChange={(e) => setNewPayeeCategory(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-[10px] border border-[rgba(15,23,42,0.12)] text-[13px] bg-white text-[#14213D] focus:outline-none focus:border-[#1C3EAA]"
                >
                  <option value="campus">{locale === 'zh' ? '高等教育 / 学费 (Campus)' : 'Higher Education (Campus Bursar)'}</option>
                  <option value="family">{locale === 'zh' ? '家庭汇款 (Family Support)' : 'Family Allowance (Mom / Guardian)'}</option>
                  <option value="housing">{locale === 'zh' ? '房屋租金 (Campus Housing)' : 'Campus Housing & Rent'}</option>
                </select>
              </div>

              <div>
                <label className="block text-[12.5px] font-bold text-[#14213D] mb-1">
                  {locale === 'zh' ? '收款方名称' : 'Payee Name'}
                </label>
                <input
                  type="text"
                  placeholder={locale === 'zh' ? '例如：香港科技大学财务处' : 'e.g., Campus bursar'}
                  value={newPayeeName}
                  onChange={(e) => setNewPayeeName(e.target.value)}
                  className="w-full h-10 px-3 rounded-[10px] border border-[rgba(15,23,42,0.12)] text-[13px] bg-white text-[#14213D] focus:outline-none focus:border-[#1C3EAA]"
                  required
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-bold text-[#14213D] mb-1">
                  {locale === 'zh' ? '账户账号 / 清算识别码' : 'Account Identifier / Clearing Route'}
                </label>
                <input
                  type="text"
                  placeholder={locale === 'zh' ? 'SWIFT / 银行账号 / 官方账户' : 'SWIFT / Bank Account Number'}
                  value={newPayeeAccount}
                  onChange={(e) => setNewPayeeAccount(e.target.value)}
                  className="w-full h-10 px-3 rounded-[10px] border border-[rgba(15,23,42,0.12)] text-[13px] bg-white text-[#14213D] focus:outline-none focus:border-[#1C3EAA]"
                  required
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-bold text-[#14213D] mb-1">
                  {locale === 'zh' ? '单笔/日度支出限额 (USD)' : 'Per-Send Cap (USD)'}
                </label>
                <input
                  type="number"
                  value={newPayeeLimit}
                  onChange={(e) => setNewPayeeLimit(e.target.value)}
                  min="50"
                  max="5000"
                  className="w-full h-10 px-3 rounded-[10px] border border-[rgba(15,23,42,0.12)] text-[13px] bg-white text-[#14213D] focus:outline-none focus:border-[#1C3EAA]"
                  required
                />
              </div>

              <div className="p-3 rounded-[10px] bg-[#FFFBEB] border border-[#D97706]/20 text-[11.5px] text-[#8A5200]">
                {locale === 'zh'
                  ? '注意：新增白名单收款人将记录至确定性审计日志，并受中环单日限额管控。'
                  : 'Notice: New payees are audited into the deterministic ledger and subject to policy limits.'}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-[10px] border border-[rgba(15,23,42,0.1)] text-[#64748B] hover:text-[#14213D] font-semibold text-[13px] cursor-pointer"
                >
                  {locale === 'zh' ? '取消' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-[10px] bg-[#1C3EAA] hover:bg-[#163188] text-white font-bold text-[13px] shadow-xs cursor-pointer transition-all active:scale-95"
                >
                  {locale === 'zh' ? '确认添加' : 'Confirm Whitelist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
