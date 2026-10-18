'use client';

import React from 'react';
import { ChopMascot } from '@/components/art/ChopMascot';
import { HeaderArt } from '@/components/art/HeaderArt';
import { FiveSegmentBar } from '@/components/art/FiveSegmentBar';
import { SEED_DATA } from '@/lib/mockData';
import { t, b } from '@/lib/i18n';
import { AppRoute, Locale } from '@/types';

interface HomeScreenProps {
  locale: Locale;
  isPaused: boolean;
  onTogglePause: () => void;
  onNavigate: (route: AppRoute) => void;
  onShowToast?: (message: string) => void;
  emptyActivity?: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  locale,
  isPaused,
  onTogglePause,
  onNavigate,
  onShowToast,
  emptyActivity = false,
}) => {
  const user = SEED_DATA.user;
  const activities = emptyActivity ? [] : SEED_DATA.recentActivities;

  return (
    <div className="home-screen pb-16">
      {/* ═══════════ BLUE HEADER (214px) ═══════════ */}
      <header className="screen-header-blue home-header relative overflow-hidden">
        <HeaderArt screenType="home" />

        <div className="header-content relative z-10">
          {/* Top row */}
          <div className="header-topbar flex items-center justify-between mb-3">
            <div className="brand-row flex items-center gap-2">
              <span className="brand-title text-white font-bold text-[18px]">AegisPath</span>
              <span className="pill-testnet text-[11px] font-semibold bg-[#1F3FA8]/80 text-[#6FD3FF] px-2.5 py-0.5 rounded-full border border-[#6FD3FF]/30">
                {b('testnet_pill', 'testnet_pill_sub', locale)}
              </span>
            </div>

            <div className="header-actions flex items-center gap-2">
              <button
                className="bell-btn p-1.5 text-white/90 hover:text-white transition-colors relative"
                aria-label="Notifications"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className="bell-badge absolute -top-1 -right-1 bg-[#E5484D] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  2
                </span>
              </button>
            </div>
          </div>

          {/* Greeting */}
          <div className="home-hero-greeting text-white font-medium text-[15px] opacity-90 mb-1">
            {b('greeting', 'greeting_sub', locale)}
          </div>

          {/* Daily Allowance Label */}
          <div className="home-allowance-label text-[#E6EEFF] text-[12px] opacity-80 mb-0.5">
            {b('daily_allowance', 'daily_allowance_sub', locale)}
          </div>

          <div className="home-allowance-flex flex items-center justify-between mb-2">
            <div className="allowance-amount-box flex items-baseline gap-1.5">
              <span className="big-allowance-amount text-white text-[32px] font-bold font-mono tracking-tight tabular-nums">
                ${user.dailyAllowanceRemaining}
              </span>
              <span className="allowance-total-tag text-[#9DB8FF] text-[12px]">
                {b('of_total', 'of_total_sub', locale)}
              </span>
            </div>

            {/* Mascot Cluster: Chop with Speech Bubble */}
            <div className="mascot-header-cluster relative flex items-center">
              <div className="speech-bubble-hi bg-white text-[#14213D] text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm mr-2 border border-[#E6ECF8]">
                Hi! 你好
              </div>
              <ChopMascot
                bodyColor="#FFFFFF"
                faceColor="#DCE8FD"
                expression={isPaused ? 'paused' : 'wave'}
                size={58}
                className="home-main-chop"
              />
            </div>
          </div>

          {/* 5-segment allowance bar */}
          <FiveSegmentBar filledCount={4} total={5} />
        </div>
      </header>

      {/* ═══════════ OVERLAPPING GUARD STRIP ═══════════ */}
      <div className="chop-guard-strip-card mx-4 -mt-3.5 relative z-20 bg-white rounded-[16px] p-3 shadow-[0_4px_20px_rgba(20,33,61,0.07)] border border-[#E6ECF8] flex items-center justify-between transition-all hover:shadow-[0_6px_24px_rgba(61,107,234,0.12)]">
        <div className="strip-left flex items-center gap-2">
          <ChopMascot
            bodyColor="#3D6BEA"
            faceColor="#FFFFFF"
            expression={isPaused ? 'paused' : 'guard'}
            size={24}
          />
          <span className="strip-title font-semibold text-[13px] text-[#14213D]">
            {b('chop_guard_strip', 'chop_guard_sub', locale)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="strip-tag-green text-[11px] font-bold bg-[#E3F6EE] text-[#1E9E6A] px-2 py-0.5 rounded-full">
            3/3 {b('three_layers_tag', 'three_layers_tag_sub', locale)}
          </span>
          <button
            onClick={onTogglePause}
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border transition-all ${
              isPaused
                ? 'bg-[#E5484D] text-white border-[#E5484D]'
                : 'bg-[#F4F7FE] text-[#5B6B8C] border-[#E6ECF8] hover:text-[#14213D]'
            }`}
          >
            {isPaused ? (locale === 'zh' ? '已暂停' : 'Paused') : (locale === 'zh' ? '暂停' : 'Pause')}
          </button>
        </div>
      </div>

      {/* Kill Switch Paused Banner if Paused */}
      {isPaused && (
        <div className="mx-4 mt-3 p-3 bg-[#FFF4DC] border border-[#F5A524] rounded-[14px] text-[12px] text-[#B7791F] flex items-center justify-between">
          <span>{b('agent_paused_banner', 'agent_paused_banner_sub', locale)}</span>
          <button
            onClick={onTogglePause}
            className="ml-2 font-bold underline cursor-pointer text-[#1F3FA8]"
          >
            {b('btn_resume_passkey', 'btn_resume_passkey_sub', locale)}
          </button>
        </div>
      )}

      {/* ═══════════ SCREEN BODY ═══════════ */}
      <main className="screen-body px-4 pt-4">
        {/* Services Section Header */}
        <div className="section-header-title flex items-center gap-2 mb-3">
          <span className="section-accent-bar w-1 h-3.5 bg-[#3D6BEA] rounded-full" />
          <span className="font-bold text-[14px] text-[#14213D]">
            {b('services_title', 'services_sub', locale)}
          </span>
        </div>

        {/* 4x2 Services Grid */}
        <div className="services-grid-4x2 grid grid-cols-4 gap-2 mb-4">
          {/* 1. Send */}
          <div
            className="service-tile cursor-pointer flex flex-col items-center justify-center p-2.5 bg-white rounded-[15px] border border-[#E6ECF8] shadow-sm hover:border-[#3D6BEA] transition-all"
            onClick={() => {
              if (onShowToast) {
                onShowToast(locale === 'zh' ? '已转至个人转账助手 (例如："给妈妈汇 $200")' : 'Opened Ask Chop for peer transfers ("Send $200 to Mom")');
              }
              onNavigate('/chat');
            }}
            role="button"
            tabIndex={0}
          >
            <div className="tile-icon-bubble w-9 h-9 rounded-full bg-[#E6EEFF] text-[#3D6BEA] flex items-center justify-center mb-1.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </div>
            <span className="tile-label-primary text-[12px] font-semibold text-[#14213D]">{t('service_send', locale)}</span>
            <span className="tile-label-sub text-[10px] text-[#5B6B8C]">{t('service_send_sub', locale)}</span>
          </div>

          {/* 2. Tuition */}
          <div
            className="service-tile cursor-pointer flex flex-col items-center justify-center p-2.5 bg-white rounded-[15px] border border-[#E6ECF8] shadow-sm hover:border-[#3D6BEA] transition-all"
            onClick={() => onNavigate('/tuition')}
            role="button"
            tabIndex={0}
          >
            <div className="tile-icon-bubble w-9 h-9 rounded-full bg-[#E6EEFF] text-[#3D6BEA] flex items-center justify-center mb-1.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <span className="tile-label-primary text-[12px] font-semibold text-[#14213D]">{t('service_tuition', locale)}</span>
            <span className="tile-label-sub text-[10px] text-[#5B6B8C]">{t('service_tuition_sub', locale)}</span>
          </div>

          {/* 3. Evidence */}
          <div
            className="service-tile cursor-pointer flex flex-col items-center justify-center p-2.5 bg-white rounded-[15px] border border-[#E6ECF8] shadow-sm hover:border-[#3D6BEA] transition-all"
            onClick={() => onNavigate('/evidence')}
            role="button"
            tabIndex={0}
          >
            <div className="tile-icon-bubble w-9 h-9 rounded-full bg-[#E6EEFF] text-[#3D6BEA] flex items-center justify-center mb-1.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <span className="tile-label-primary text-[12px] font-semibold text-[#14213D]">{t('service_evidence', locale)}</span>
            <span className="tile-label-sub text-[10px] text-[#5B6B8C]">{t('service_evidence_sub', locale)}</span>
          </div>

          {/* 4. Safety */}
          <div
            className="service-tile cursor-pointer flex flex-col items-center justify-center p-2.5 bg-white rounded-[15px] border border-[#E6ECF8] shadow-sm hover:border-[#3D6BEA] transition-all"
            onClick={() => onNavigate('/safety')}
            role="button"
            tabIndex={0}
          >
            <div className="tile-icon-bubble w-9 h-9 rounded-full bg-[#E6EEFF] text-[#3D6BEA] flex items-center justify-center mb-1.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span className="tile-label-primary text-[12px] font-semibold text-[#14213D]">{t('service_safety', locale)}</span>
            <span className="tile-label-sub text-[10px] text-[#5B6B8C]">{t('service_safety_sub', locale)}</span>
          </div>

          {/* 5. Payees */}
          <div
            className="service-tile cursor-pointer flex flex-col items-center justify-center p-2.5 bg-white rounded-[15px] border border-[#E6ECF8] shadow-sm hover:border-[#3D6BEA] transition-all"
            onClick={() => {
              if (onShowToast) {
                onShowToast(locale === 'zh' ? '收款人管理即将推出 (当前已绑定白名单: 妈妈、学校财务处)' : 'Payee directory coming soon in v1.1 (Active: Mom, Campus Bursar)');
              } else {
                onNavigate('/safety');
              }
            }}
            role="button"
            tabIndex={0}
          >
            <div className="tile-icon-bubble w-9 h-9 rounded-full bg-[#E6EEFF] text-[#3D6BEA] flex items-center justify-center mb-1.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <span className="tile-label-primary text-[12px] font-semibold text-[#14213D]">{t('service_payees', locale)}</span>
            <span className="tile-label-sub text-[10px] text-[#5B6B8C]">{t('service_payees_sub', locale)}</span>
          </div>

          {/* 6. Rates */}
          <div
            className="service-tile cursor-pointer flex flex-col items-center justify-center p-2.5 bg-white rounded-[15px] border border-[#E6ECF8] shadow-sm hover:border-[#3D6BEA] transition-all"
            onClick={() => {
              if (onShowToast) {
                onShowToast(locale === 'zh' ? '实时汇率看板即将推出 (参考: 1 USD ≈ 7.1022 CNY / 15,880 IDR)' : 'Live FX rates dashboard coming in v1.1 (Ref: 1 USD ≈ 7.1022 CNY / 15,880 IDR)');
              } else {
                onNavigate('/tuition');
              }
            }}
            role="button"
            tabIndex={0}
          >
            <div className="tile-icon-bubble w-9 h-9 rounded-full bg-[#E6EEFF] text-[#3D6BEA] flex items-center justify-center mb-1.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <span className="tile-label-primary text-[12px] font-semibold text-[#14213D]">{t('service_rates', locale)}</span>
            <span className="tile-label-sub text-[10px] text-[#5B6B8C]">{t('service_rates_sub', locale)}</span>
          </div>

          {/* 7. Planner */}
          <div
            className="service-tile cursor-pointer flex flex-col items-center justify-center p-2.5 bg-white rounded-[15px] border border-[#E6ECF8] shadow-sm hover:border-[#3D6BEA] transition-all"
            onClick={() => onNavigate('/planner')}
            role="button"
            tabIndex={0}
          >
            <div className="tile-icon-bubble w-9 h-9 rounded-full bg-[#E6EEFF] text-[#3D6BEA] flex items-center justify-center mb-1.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
            <span className="tile-label-primary text-[12px] font-semibold text-[#14213D]">{t('service_planner', locale)}</span>
            <span className="tile-label-sub text-[10px] text-[#5B6B8C]">{t('service_planner_sub', locale)}</span>
          </div>

          {/* 8. More */}
          <div
            className="service-tile cursor-pointer flex flex-col items-center justify-center p-2.5 bg-white rounded-[15px] border border-[#E6ECF8] shadow-sm hover:border-[#3D6BEA] transition-all"
            onClick={() => {
              if (onShowToast) {
                onShowToast(locale === 'zh' ? '更多设置与 WebAuthn 凭证管理即将推出' : 'More settings & Passkey management coming soon in v1.1');
              } else {
                onNavigate('/evidence');
              }
            }}
            role="button"
            tabIndex={0}
          >
            <div className="tile-icon-bubble w-9 h-9 rounded-full bg-[#E6EEFF] text-[#3D6BEA] flex items-center justify-center mb-1.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </div>
            <span className="tile-label-primary text-[12px] font-semibold text-[#14213D]">{t('service_more', locale)}</span>
            <span className="tile-label-sub text-[10px] text-[#5B6B8C]">{t('service_more_sub', locale)}</span>
          </div>
        </div>

        {/* Tuition Arrives In Full Banner Card */}
        <div className="tuition-banner-card bg-gradient-to-r from-[#EEF4FF] via-[#F6F9FE] to-[#FFFFFF] rounded-[18px] p-4 border border-[#B9D0FF]/60 shadow-[0_4px_16px_rgba(61,107,234,0.06)] flex items-center justify-between mb-4 transition-all hover:shadow-[0_6px_20px_rgba(61,107,234,0.10)]">
          <div className="banner-text-box text-left">
            <div className="banner-headline font-bold text-[15px] text-[#1F3FA8]">
              {t('tuition_banner_title', locale)}
            </div>
            <div className="banner-subhead text-[11px] text-[#5B6B8C] mb-2.5">
              {t('tuition_banner_sub', locale)}
            </div>
            <button
              className="banner-calc-btn bg-[#3D6BEA] text-white text-[12px] font-bold px-3.5 py-1.5 rounded-full shadow-sm hover:bg-[#1F3FA8] transition-all cursor-pointer inline-flex items-center gap-1.5"
              onClick={() => onNavigate('/tuition')}
            >
              <span>{b('btn_calculate', 'btn_calculate_sub', locale)}</span>
              <span>→</span>
            </button>
          </div>
          <div className="banner-art-box opacity-90">
            <svg width="84" height="60" viewBox="0 0 118 84" fill="none">
              <path d="M4 78 H114" stroke="#9DB8FF" strokeWidth="2" />
              <path d="M62 10 L106 24 L84 44 L78 34 Z" fill="#ffffff" stroke="#14213D" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Two Stat Cards: Protection & Evidence */}
        <div className="stat-cards-row grid grid-cols-2 gap-3 mb-4">
          {/* Protection Card */}
          <div
            className="stat-card-solid-blue cursor-pointer bg-gradient-to-br from-[#4E7FFF] to-[#2D55D6] text-white p-4 rounded-[18px] shadow-[0_4px_20px_rgba(61,107,234,0.20)] hover:shadow-[0_8px_28px_rgba(61,107,234,0.30)] transition-all text-left"
            onClick={() => onNavigate('/safety')}
            role="button"
            tabIndex={0}
          >
            <div className="stat-card-header flex items-center justify-between text-white/90 text-[12px] font-semibold mb-1">
              <span>{b('stat_protection_title', 'stat_protection_sub', locale)}</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className="stat-card-big-num text-[34px] font-bold leading-none mb-1 tabular-nums">3/3</div>
            <div className="stat-card-desc text-[11px] text-white/85">
              {b('stat_protection_desc', 'stat_protection_desc_sub', locale)}
            </div>
          </div>

          {/* Evidence Card */}
          <div
            className="stat-card-sky cursor-pointer bg-gradient-to-br from-[#EBF2FF] to-[#F4F8FE] text-[#1F3FA8] p-4 rounded-[18px] border border-[#B9D0FF]/60 shadow-[0_4px_16px_rgba(61,107,234,0.06)] hover:shadow-[0_6px_22px_rgba(61,107,234,0.12)] transition-all text-left"
            onClick={() => onNavigate('/evidence')}
            role="button"
            tabIndex={0}
          >
            <div className="stat-card-header flex items-center justify-between text-[#1F3FA8]/90 text-[12px] font-semibold mb-1">
              <span>{b('stat_evidence_title', 'stat_evidence_sub', locale)}</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              </svg>
            </div>
            <div className="stat-card-big-num text-[34px] font-bold leading-none mb-1 text-[#1F3FA8] tabular-nums">3/3</div>
            <div className="stat-card-desc text-[11px] text-[#5B6B8C]">
              {b('stat_evidence_desc', 'stat_evidence_desc_sub', locale)}
            </div>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="activity-card bg-white rounded-[18px] p-4 border border-[#E6ECF8] shadow-sm text-left">
          <div className="flex items-center justify-between mb-3">
            <div className="section-header-title flex items-center gap-2">
              <span className="section-accent-bar w-1 h-3.5 bg-[#3D6BEA] rounded-full" />
              <span className="font-bold text-[14px] text-[#14213D]">
                {b('recent_activity', 'recent_activity_sub', locale)}
              </span>
            </div>
            <button
              onClick={() => onNavigate('/safety')}
              className="text-[11.5px] font-semibold text-[#3D6BEA] hover:underline"
            >
              See all →
            </button>
          </div>

          {activities.length === 0 ? (
            <div className="p-6 text-center text-[#5B6B8C] text-[13px]">
              {locale === 'zh' ? '暂无交易动态' : 'No recent activities recorded'}
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((act) => (
                <div key={act.id} className="activity-row flex items-center justify-between py-1 border-b border-[#E6ECF8] last:border-none">
                  <div className="activity-left flex items-center gap-2.5">
                    <div
                      className={`activity-icon-bubble w-8 h-8 rounded-full flex items-center justify-center ${
                        act.type === 'success' ? 'bg-[#E3F6EE] text-[#1E9E6A]' : 'bg-[#FDE8E9] text-[#E5484D]'
                      }`}
                    >
                      {act.type === 'success' ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="activity-title text-[13px] font-semibold text-[#14213D]">
                        {locale === 'zh' ? act.titleZh : act.titleEn}
                      </div>
                      <div className="activity-sub text-[11px] text-[#5B6B8C]">
                        {locale === 'zh' ? act.timestampZh : act.timestamp}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-[13px] font-bold font-mono ${
                        act.type === 'success' ? 'text-[#1E9E6A]' : 'text-[#E5484D]'
                      }`}
                    >
                      {act.amount}
                    </div>
                    <div className="text-[10px] text-[#5B6B8C]">
                      {act.type === 'success' ? 'Delivered ✓' : 'Blocked 已拦截'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
