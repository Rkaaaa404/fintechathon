'use client';

import React, { useState, useEffect } from 'react';
import { Locale, AppRoute } from '@/types';
import { HeaderArt } from '@/components/art/HeaderArt';
import { ChopMascot } from '@/components/art/ChopMascot';
import { Card, CardHeader, CardTitle, CardBadge, CardBody, CardFooter } from '@/components/ui/Card';
import SplitText from '@/components/SplitText';
import { SafetyRingsIcon, AegisShieldIcon, PayeesBookIcon, LockKeyholeIcon } from '@/components/icons/AegisIcons';
import { connector, PolicyResponse } from '@/lib/api/connector';
import { ArrowLeft, CheckCircle2, AlertTriangle, ShieldCheck, Download, ExternalLink, Lock, Eye, Ban, RefreshCw, Zap, PauseCircle, PlayCircle } from 'lucide-react';

interface SafetyRulesScreenProps {
  locale?: Locale;
  onNavigate: (route: AppRoute) => void;
  onShowToast: (message: string) => void;
  agentPaused: boolean;
  onTogglePause: () => void;
}

export const SafetyRulesScreen: React.FC<SafetyRulesScreenProps> = ({
  locale = 'en',
  onNavigate,
  onShowToast,
  agentPaused,
  onTogglePause,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'outer' | 'middle' | 'inner'>('all');
  const [policyData, setPolicyData] = useState<PolicyResponse | null>(null);
  const [isLoadingPolicy, setIsLoadingPolicy] = useState(false);

  const fetchPolicy = async () => {
    setIsLoadingPolicy(true);
    try {
      const data = await connector.getPolicy();
      setPolicyData(data);
    } catch {
      // Fallback policy data
      setPolicyData({
        daily_cap_usd: 1000.0,
        used_today_usd: 200.0,
        remaining_today_usd: 800.0,
        is_paused: agentPaused,
      });
    } finally {
      setIsLoadingPolicy(false);
    }
  };

  useEffect(() => {
    fetchPolicy();
  }, [agentPaused]);

  const handleExportPolicy = () => {
    const policyExport = {
      title: 'AegisPath Deterministic Safety Policy & Guidance',
      version: '2026.4.1',
      engine: 'Zero-Trust Deterministic Rules Outside LLM',
      live_policy: policyData,
      layers: {
        ring_1_outer_privacy: {
          pii_redaction: ['16-digit Card/Account Numbers', 'National ID / Passport Regex', 'Email Addresses', 'Phone Numbers'],
          prompt_injection_sentinel: 'Pattern-matching regex + heuristics scanner. Blocks override keywords with zero LLM bypass.',
        },
        ring_2_middle_spending: {
          single_send_cap_usd: 500.0,
          daily_aggregate_cap_usd: 1000.0,
          tuition_exception: 'Amounts exceeding $500 require dual biometric passkey / explicit demo approval.',
          allowlist_verification: 'Transfers strictly refused unless recipient exactly matches allowlisted names.',
        },
        ring_3_inner_bank: {
          session_token_isolation: 'Separate process, distinct secret keys, single-use idempotency tokens.',
          circuit_breaker: 'Instant pause stops all transaction dispatching immediately.',
        },
      },
    };
    const blob = new Blob([JSON.stringify(policyExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AegisPath_Safety_Policy_Guidance.json';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast(locale === 'zh' ? '已导出完整安全准则规范 JSON' : 'Exported safety policy specification JSON');
  };

  return (
    <div className="safety-rules-screen pb-14 w-full animate-fadeIn">
      {/* ═══════════ LUMINOUS HERO HEADER WITH MASCOT ═══════════ */}
      <header className="screen-header-blue relative overflow-hidden rounded-[20px] p-6 md:p-8 w-full mb-6 shadow-sm border border-[#2563EB]/30">
        <HeaderArt screenType="safety-rules" />

        <div className="header-content relative z-10 w-full">
          <div className="flex items-center justify-between mb-3">
            <div className="brand-row flex items-center gap-2.5">
              <button
                className="nav-back-btn p-1.5 rounded-full bg-white/15 text-white hover:bg-white/25 transition-all flex items-center justify-center cursor-pointer active:scale-95"
                onClick={() => onNavigate('/safety')}
                aria-label="Back to Safety Overview"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-white/20 text-white shadow-xs">
                  <SafetyRingsIcon size={20} color="#FFFFFF" />
                </span>
                <h1 className="brand-title text-white font-bold text-[20px] tracking-tight">
                  <SplitText
                    text={locale === 'zh' ? '确定性安全规则与策略准则' : 'Safety Rules & Policy Guidance'}
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
                <span className={`w-2 h-2 rounded-full ${agentPaused ? 'bg-[#FFB020]' : 'bg-[#6FD3FF]'} animate-pulse`} />
                <span>{agentPaused ? (locale === 'zh' ? '熔断防护已启动' : 'Circuit Breaker Paused') : (locale === 'zh' ? '3/3 规则全开保护' : 'All 3 Rings Enforced')}</span>
              </span>
              <div className="mascot-header-cluster">
                <ChopMascot bodyColor="#FFFFFF" faceColor="#DCE8FD" expression={agentPaused ? 'paused' : 'guard'} size={52} />
              </div>
            </div>
          </div>

          <div className="mt-1 pr-[140px] md:pr-[200px]">
            <p className="text-[#DBEAFE] text-[13px] max-w-[700px] leading-relaxed">
              {locale === 'zh'
                ? '确定性安全体系严格独立于语言模型之外运行。无论智能体收到何种伪装提示词注入，单笔限额、白名单收款人和银行隔离令牌都能无条件保障资金绝对安全。'
                : 'Deterministic security rules execute strictly outside language models. Even under zero-day prompt injection, hard-coded caps, allowlists, and bank isolation keep funds 100% safe.'}
            </p>
          </div>
        </div>
      </header>

      {/* ═══════════ LIVE POLICY STATUS STRIP ═══════════ */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card variant="default" className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] text-[#1C3EAA] flex items-center justify-center shrink-0 border border-[#3D6BEA]/20">
            <Lock size={18} />
          </div>
          <div>
            <span className="text-[11.5px] text-[#475569] font-medium block">
              {locale === 'zh' ? '单笔自主限额' : 'Single Send Cap'}
            </span>
            <div className="text-[20px] font-bold text-[#14213D] leading-tight mt-0.5">
              $500.00
            </div>
          </div>
        </Card>

        <Card variant="default" className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EBF7EE] text-[#0E6E43] flex items-center justify-center shrink-0 border border-[#0E6E43]/20">
            <ShieldCheck size={18} />
          </div>
          <div>
            <span className="text-[11.5px] text-[#475569] font-medium block">
              {locale === 'zh' ? '今日日累计限额' : 'Daily Aggregate Cap'}
            </span>
            <div className="text-[20px] font-bold text-[#0E6E43] leading-tight mt-0.5">
              ${policyData?.daily_cap_usd.toFixed(0) || '1,000'} USD
            </div>
          </div>
        </Card>

        <Card variant="default" className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 border border-[#2563EB]/20">
            <Zap size={18} />
          </div>
          <div>
            <span className="text-[11.5px] text-[#475569] font-medium block">
              {locale === 'zh' ? '今日剩余可用' : 'Remaining Today'}
            </span>
            <div className="text-[20px] font-bold text-[#1D4ED8] leading-tight mt-0.5">
              ${policyData?.remaining_today_usd.toFixed(0) || '800'} USD
            </div>
          </div>
        </Card>

        <Card variant="default" className="p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${agentPaused ? 'bg-[#FEF2F2] text-[#B91C1C] border-[#B91C1C]/20' : 'bg-[#EBF7EE] text-[#0E6E43] border-[#0E6E43]/20'}`}>
              {agentPaused ? <PauseCircle size={20} /> : <PlayCircle size={20} />}
            </div>
            <div>
              <span className="text-[11.5px] text-[#475569] font-medium block">
                {locale === 'zh' ? '熔断保护状态' : 'Circuit Breaker'}
              </span>
              <div className="text-[15px] font-bold text-[#14213D] leading-tight mt-0.5">
                {agentPaused ? (locale === 'zh' ? '已暂停交易' : 'Frozen / Paused') : (locale === 'zh' ? '运行中 / 保护正常' : 'Active & Armed')}
              </div>
            </div>
          </div>

          <button
            onClick={onTogglePause}
            className={`px-3 py-1.5 rounded-lg font-bold text-[11.5px] transition-all cursor-pointer ${
              agentPaused
                ? 'bg-[#1C3EAA] text-white hover:bg-[#163188]'
                : 'bg-white text-[#B91C1C] hover:bg-[#FEF2F2] border border-[#B91C1C]/30'
            }`}
          >
            {agentPaused ? (locale === 'zh' ? '恢复' : 'Resume') : (locale === 'zh' ? '紧急冻结' : 'Pause')}
          </button>
        </Card>
      </div>

      {/* ═══════════ NAVIGATION TABS & EXPORT ═══════════ */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl">
          {(['all', 'outer', 'middle', 'inner'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer ${
                activeTab === tab ? 'bg-white text-[#1C3EAA] shadow-2xs font-bold' : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              {tab === 'all'
                ? (locale === 'zh' ? '全部三环架构' : 'All 3 Rings')
                : tab === 'outer'
                ? (locale === 'zh' ? '外环 · 隐私防御' : 'Outer · Privacy')
                : tab === 'middle'
                ? (locale === 'zh' ? '中环 · 支出规则' : 'Middle · Rules')
                : (locale === 'zh' ? '内环 · 银行隔离' : 'Inner · Bank')}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/safety-logs')}
            className="h-9 px-3.5 rounded-xl bg-[#EEF4FF] hover:bg-[#DCE8FD] text-[#1C3EAA] font-bold text-[12.5px] flex items-center gap-1.5 transition-all cursor-pointer border border-[#3D6BEA]/30"
          >
            <span>{locale === 'zh' ? '查看安全审计日志' : 'View Safety Logs'}</span>
            <span>→</span>
          </button>
          <button
            onClick={handleExportPolicy}
            className="h-9 px-3.5 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#475569] font-bold text-[12.5px] flex items-center gap-1.5 transition-all cursor-pointer border border-[#CBD5E1]"
          >
            <Download size={14} />
            <span>{locale === 'zh' ? '导出规则规范 JSON' : 'Export JSON Spec'}</span>
          </button>
        </div>
      </div>

      {/* ═══════════ 3-RING ARCHITECTURE DETAILED GUIDANCE ═══════════ */}
      <div className="space-y-6">
        {/* RING 1: OUTER RING */}
        {(activeTab === 'all' || activeTab === 'outer') && (
          <Card variant="default" className="p-6 border-l-4 border-l-[#3B82F6] shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold text-[16px] border border-[#BFDBFE]">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-[16.5px] text-[#14213D]">
                    {locale === 'zh' ? '外环防护：隐私脱敏与提示词注入防御' : 'Ring 1 (Outer): Privacy Sentinel & Injection Defense'}
                  </h3>
                  <span className="text-[12px] text-[#64748B] font-medium">
                    Strict Client & Gateway Level · Input Data Scrubbing Prior to Transmission
                  </span>
                </div>
              </div>
              <CardBadge variant="green">Active</CardBadge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px] text-[#334155]">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <h4 className="font-bold text-[#14213D] flex items-center gap-1.5 mb-2 text-[13.5px]">
                  <CheckCircle2 size={16} className="text-[#0E6E43]" />
                  {locale === 'zh' ? '隐私敏感实体脱敏规则 (PII Scrubbing)' : 'PII Entity Scrubbing Rules'}
                </h4>
                <ul className="space-y-2 text-[12.5px]">
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-[#CBD5E1] text-[#B91C1C]">[REDACTED_ACCOUNT]</span>
                    <span>16位银行账户或借记卡卡号，通过严格正则在发送前掩码。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-[#CBD5E1] text-[#B91C1C]">[REDACTED_ID]</span>
                    <span>香港身份证号 (HKID) 与护照格式脱敏。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-[#CBD5E1] text-[#B91C1C]">[REDACTED_EMAIL]</span>
                    <span>去除自然语言提示词中夹带的个人电子邮箱。</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <h4 className="font-bold text-[#14213D] flex items-center gap-1.5 mb-2 text-[13.5px]">
                  <ShieldCheck size={16} className="text-[#1C3EAA]" />
                  {locale === 'zh' ? 'Sentinel 提示词注入检测防御' : 'Sentinel Injection Scanner'}
                </h4>
                <p className="text-[12.5px] leading-relaxed mb-2">
                  {locale === 'zh'
                    ? '在模型推断之前，由确定性 Sentinel 引擎进行特征模式扫描。检测包含 "ignore previous instructions"、"transfer all"、"bypass limit" 等越权攻击指令。'
                    : 'Scans prompts deterministically prior to model execution. Flags malicious patterns attempting to override spending limits or execute unconfirmed operations.'}
                </p>
                <div className="p-2.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[11.5px] text-[#1E40AF]">
                  <strong>Verdict Action:</strong> Block prompt immediately. Intent source stamped as <code>blocked</code> with zero bank contact.
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* RING 2: MIDDLE RING */}
        {(activeTab === 'all' || activeTab === 'middle') && (
          <Card variant="default" className="p-6 border-l-4 border-l-[#10B981] shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center font-bold text-[16px] border border-[#A7F3D0]">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-[16.5px] text-[#14213D]">
                    {locale === 'zh' ? '中环防护：确定性支出规则与白名单核验' : 'Ring 2 (Middle): Spending Rules & Allowlist Policy'}
                  </h3>
                  <span className="text-[12px] text-[#64748B] font-medium">
                    Strict API Core Policy Plane · Non-Negotiable Financial Invariants
                  </span>
                </div>
              </div>
              <CardBadge variant="green">Active</CardBadge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[13px] text-[#334155]">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="text-[11.5px] uppercase font-bold text-[#64748B] mb-1">Constraint 1</div>
                <h4 className="font-bold text-[#14213D] text-[14px] mb-1.5">$500 Per-Send Autonomous Cap</h4>
                <p className="text-[12px] text-[#64748B] leading-relaxed">
                  {locale === 'zh'
                    ? 'AI 智能体自主触发结算的单笔上限严格设为 $500 USD。超过 $500 的转账无论理由，必须生成 Approval Sheet 等待双重许可。'
                    : 'Autonomous agent execution is capped at $500 USD per transaction. Transactions exceeding $500 automatically escalate to Tier 2 Approval.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="text-[11.5px] uppercase font-bold text-[#64748B] mb-1">Constraint 2</div>
                <h4 className="font-bold text-[#14213D] text-[14px] mb-1.5">Strict Payee Allowlist</h4>
                <p className="text-[12px] text-[#64748B] leading-relaxed">
                  {locale === 'zh'
                    ? '转账收款人必须存在于用户白名单簿中（例如：Mom、Dad、Campus bursar）。未录入的收款人将被策略平面直接拒绝，无资金损耗风险。'
                    : 'Payees must strictly exist in the user’s pre-registered allowlist. Instructions targeting unlisted parties are deterministically refused.'}
                </p>
                <button
                  onClick={() => onNavigate('/payees')}
                  className="mt-2 text-[12px] font-bold text-[#1C3EAA] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{locale === 'zh' ? '管理收款人白名单' : 'Manage Payees'}</span>
                  <span>→</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="text-[11.5px] uppercase font-bold text-[#64748B] mb-1">Constraint 3</div>
                <h4 className="font-bold text-[#14213D] text-[14px] mb-1.5">Tuition Protocol Guard</h4>
                <p className="text-[12px] text-[#64748B] leading-relaxed">
                  {locale === 'zh'
                    ? '大额学费（如 CNY 18,000）只允许直接汇入认证的大学财务处账户，并锁定动态汇率缓冲。杜绝任何个人伪造学费转账。'
                    : 'Tuition quotes allow large sums only directly to verified campus bursars with locked FX buffer. Never routable to personal accounts.'}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* RING 3: INNER RING */}
        {(activeTab === 'all' || activeTab === 'inner') && (
          <Card variant="default" className="p-6 border-l-4 border-l-[#8B5CF6] shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center font-bold text-[16px] border border-[#DDD6FE]">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-[16.5px] text-[#14213D]">
                    {locale === 'zh' ? '内环防护：银行隔离令牌与物理熔断' : 'Ring 3 (Inner): Bank Scoped Token & Circuit Breaker'}
                  </h3>
                  <span className="text-[12px] text-[#64748B] font-medium">
                    Isolated Banking Architecture · Hardware & Process Separation
                  </span>
                </div>
              </div>
              <CardBadge variant="green">Active</CardBadge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px] text-[#334155]">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <h4 className="font-bold text-[#14213D] flex items-center gap-1.5 mb-2 text-[13.5px]">
                  <LockKeyholeIcon size={16} color="#7C3AED" />
                  {locale === 'zh' ? '进程密钥隔离与单次幂等令牌' : 'Bank Secret Isolation & Idempotency'}
                </h4>
                <ul className="space-y-1.5 text-[12.5px] text-[#475569]">
                  <li>• <strong>独立端口与密钥：</strong>银行沙盒服务运行于 8100 端口，拥有独立密钥，与面向用户的 API (8000) 彻底物理隔离。</li>
                  <li>• <strong>一次性交易哈希：</strong>每次转账生成 SHA-256 唯一幂等令牌，防止重放攻击 (Replay Attack) 与二次结算。</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <h4 className="font-bold text-[#14213D] flex items-center gap-1.5 mb-2 text-[13.5px]">
                  <AlertTriangle size={16} className="text-[#D97706]" />
                  {locale === 'zh' ? '一键物理熔断机制 (Kill Switch)' : 'Circuit Breaker / Emergency Stop'}
                </h4>
                <p className="text-[12.5px] text-[#475569] leading-relaxed mb-2">
                  {locale === 'zh'
                    ? '一旦检测到异常活动或用户手动触发，熔断机制将立即可靠地冻结所有对外资金通道，无需重启任何基础设施。'
                    : 'Instantly halts all outbound payment dispatches. When armed, no transactions can execute regardless of model instructions.'}
                </p>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${agentPaused ? 'bg-[#FEF2F2] text-[#B91C1C]' : 'bg-[#EBF7EE] text-[#0E6E43]'}`}>
                    Current: {agentPaused ? 'PAUSED / FROZEN' : 'ACTIVE / ARMED'}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* ═══════════ POLICY ENFORCEMENT MATRIX TABLE ═══════════ */}
      <div className="mt-8">
        <h3 className="font-bold text-[#14213D] text-[17px] mb-3 flex items-center gap-2">
          <span>📋</span>
          <span>{locale === 'zh' ? '安全策略执行矩阵与裁决流程' : 'Policy Enforcement Decision Matrix'}</span>
        </h3>

        <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-2xs">
          <table className="w-full text-left border-collapse text-[12.5px]">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569] font-bold">
                <th className="py-3 px-4">Event Trigger</th>
                <th className="py-3 px-4">Enforcing Layer</th>
                <th className="py-3 px-4">Deterministic Rule</th>
                <th className="py-3 px-4">System Verdict</th>
                <th className="py-3 px-4">Funds At Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-[#334155]">
              <tr>
                <td className="py-3 px-4 font-semibold text-[#14213D]">Prompt Injection Override</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#EFF6FF] text-[#1D4ED8]">Ring 1: Outer</span></td>
                <td className="py-3 px-4">Sentinel heuristic regex detects attack keywords</td>
                <td className="py-3 px-4 font-bold text-[#B91C1C]">BLOCKED_AT_GATEWAY</td>
                <td className="py-3 px-4 font-bold text-[#0E6E43]">$0.00</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-[#14213D]">Unlisted Payee Request</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#ECFDF5] text-[#059669]">Ring 2: Middle</span></td>
                <td className="py-3 px-4">Recipient not present in verified user allowlist</td>
                <td className="py-3 px-4 font-bold text-[#B91C1C]">REFUSED_ALLOWLIST</td>
                <td className="py-3 px-4 font-bold text-[#0E6E43]">$0.00</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-[#14213D]">Remittance Over $500</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#ECFDF5] text-[#059669]">Ring 2: Middle</span></td>
                <td className="py-3 px-4">Amount exceeds single autonomous limit</td>
                <td className="py-3 px-4 font-bold text-[#D97706]">ESCALATE_TO_APPROVAL</td>
                <td className="py-3 px-4 font-bold text-[#0E6E43]">$0.00 (Pending)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-[#14213D]">Circuit Breaker Engaged</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#F5F3FF] text-[#7C3AED]">Ring 3: Inner</span></td>
                <td className="py-3 px-4">Emergency kill switch toggled active</td>
                <td className="py-3 px-4 font-bold text-[#B91C1C]">FROZEN_ALL_TRANSACTIONS</td>
                <td className="py-3 px-4 font-bold text-[#0E6E43]">$0.00</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-[#14213D]">Standard Allowlisted Send</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#ECFDF5] text-[#059669]">All Rings</span></td>
                <td className="py-3 px-4">Passes PII scrub, allowlist check, and daily limits</td>
                <td className="py-3 px-4 font-bold text-[#0E6E43]">COMPLETED_SENT</td>
                <td className="py-3 px-4 font-bold text-[#14213D]">Verified Exact Sum</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
