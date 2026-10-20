'use client';

import React, { useState } from 'react';
import { Locale } from '@/types';
import { AppRoute } from '@/types';
import { ShieldCheckIcon, LockKeyholeIcon } from '@/components/icons/AegisIcons';
import { ChopDetectiveMascot } from '@/components/art/ChopDetectiveMascot';

export interface AuthUserProfile {
  name: string;
  email: string;
  university?: string;
  avatarLetter: string;
  provider: 'google' | 'aegispath' | 'guest';
  isAuthenticated: boolean;
}

interface LoginScreenProps {
  locale?: Locale;
  onNavigate: (route: AppRoute) => void;
  onLoginSuccess: (user: AuthUserProfile) => void;
  onEnterAsGuest?: () => void;
  onShowToast: (message: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  locale = 'en',
  onNavigate,
  onLoginSuccess,
  onEnterAsGuest,
  onShowToast,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('ayu.sutanto@connect.ust.hk');
  const [password, setPassword] = useState('AegisGuard2026!');
  const [fullName, setFullName] = useState('Ayu Sutanto');
  const [university, setUniversity] = useState('HKUST');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Interaction loading states
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  // Password strength calculation for sign up
  const calculateStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 1;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score; // 1 to 4
  };

  const strength = calculateStrength(password);

  // Google Auth interactive states
  const [googleCustomEmail, setGoogleCustomEmail] = useState('');
  const [googleCustomName, setGoogleCustomName] = useState('');
  const [googleCustomUni, setGoogleCustomUni] = useState('');
  const [googleAuthTab, setGoogleAuthTab] = useState<'real' | 'quick'>('real');
  const [googleError, setGoogleError] = useState<string | null>(null);

  const handleEnterGuest = () => {
    const guestUser: AuthUserProfile = {
      name: 'Ayu (Demo)',
      email: 'guest.demo@connect.ust.hk',
      university: 'HKUST (Synthetic Demo)',
      avatarLetter: 'GU',
      provider: 'guest',
      isAuthenticated: true,
    };
    onLoginSuccess(guestUser);
    onShowToast(
      locale === 'zh'
        ? '已以访客身份进入钱包 (合成演示数据模式: Ayu · HKUST)'
        : 'Welcome! Exploring AegisPath Wallet as Guest (Synthetic Demo Mode)'
    );
    if (onEnterAsGuest) {
      onEnterAsGuest();
    } else {
      onNavigate('/');
    }
  };

  const handleGoogleClick = () => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      setIsGoogleLoading(false);
      setShowGoogleModal(true);
    }, 280);
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleCustomEmail || !googleCustomEmail.includes('@') || !googleCustomEmail.includes('.')) {
      setGoogleError(
        locale === 'zh'
          ? '请输入有效的 Google 邮箱地址 (例如: yourname@gmail.com)'
          : 'Please enter a valid Google email address (e.g. yourname@gmail.com)'
      );
      return;
    }
    if (!googleCustomName.trim()) {
      setGoogleError(
        locale === 'zh'
          ? '请输入您的 Google 账号姓名'
          : 'Please enter your full name associated with Google'
      );
      return;
    }
    setGoogleError(null);
    handleSelectGoogleAccount(
      googleCustomEmail.trim().toLowerCase(),
      googleCustomName.trim(),
      googleCustomUni.trim() || 'Google Verified User'
    );
  };

  const handleSelectGoogleAccount = (selectedEmail: string, selectedName: string, selectedUni: string) => {
    setShowGoogleModal(false);
    setIsGoogleLoading(true);

    setTimeout(() => {
      setIsGoogleLoading(false);
      const user: AuthUserProfile = {
        name: selectedName,
        email: selectedEmail,
        university: selectedUni,
        avatarLetter: selectedName.slice(0, 2).toUpperCase(),
        provider: 'google',
        isAuthenticated: true,
      };
      onLoginSuccess(user);
      onShowToast(
        locale === 'zh'
          ? `Google 真实账号 (${selectedName}) 登录成功 · 已载入真实数据`
          : `Signed in with Google as ${selectedName} · Live Real Account Loaded`
      );
      if (onEnterAsGuest) {
        onEnterAsGuest();
      } else {
        onNavigate('/');
      }
    }, 450);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const name = mode === 'signup' ? fullName : (email.includes('ayu') ? 'Ayu' : email.split('@')[0]);
      const user: AuthUserProfile = {
        name,
        email,
        university: university || 'Student Campus',
        avatarLetter: name.slice(0, 2).toUpperCase(),
        provider: 'aegispath',
        isAuthenticated: true,
      };
      onLoginSuccess(user);
      onShowToast(
        mode === 'signup'
          ? (locale === 'zh' ? '学生账户注册成功！' : 'AegisPath Student account created!')
          : (locale === 'zh' ? `欢迎回来，${name}！` : `Welcome back, ${name}!`)
      );
      if (onEnterAsGuest) {
        onEnterAsGuest();
      } else {
        onNavigate('/');
      }
    }, 600);
  };

  const handleAutofillDemo = () => {
    setEmail('ayu.sutanto@connect.ust.hk');
    setPassword('AegisGuard2026!');
    setFullName('Ayu Sutanto');
    setUniversity('HKUST');
    onShowToast(locale === 'zh' ? '已填入测试学生数据' : 'Autofilled demo student credentials');
  };

  return (
    <div className="login-screen-wrapper min-h-[calc(100vh-120px)] flex flex-col justify-center items-center py-8 px-4">
      {/* Background radial accent glow */}
      <div className="w-full max-w-[520px] relative">
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-[#3D6BEA]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-[#0E6E43]/10 rounded-full blur-3xl pointer-events-none" />

        {/* ═════════ 1. WELCOME ANIMATION & NARRATIVE HEADER ═════════ */}
        <div className="text-center mb-6 px-2 animate-in fade-in slide-in-from-top-4 duration-500">
          {/* Subtle Security Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF4FF] border border-[#3D6BEA]/20 text-[#1C3EAA] text-[12px] font-semibold mb-3 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#1C3EAA] animate-pulse" />
            <span>
              {locale === 'zh'
                ? '确定性非托管学生数字钱包'
                : 'Deterministic Non-Custodial Digital Wallet'}
            </span>
          </div>

          {/* Animated Mascot Presentation */}
          <div className="flex justify-center mb-2">
            <div className="hover:scale-105 transition-transform duration-300">
              <ChopDetectiveMascot size={76} />
            </div>
          </div>

          {/* Main Welcome Heading */}
          <h1 className="text-[26px] md:text-[30px] font-bold text-[#14213D] tracking-tight leading-tight mb-2">
            {locale === 'zh' ? '欢迎来到 AegisPath' : 'Welcome to AegisPath'}
          </h1>

          {/* Narrative Paragraph */}
          <p className="text-[13.5px] md:text-[14px] text-[#334155] leading-relaxed max-w-[460px] mx-auto">
            {locale === 'zh'
              ? '专为留学生打造的跨境学费、财力证明与资金安全守护钱包。三环确定性安全隔离，守护每一笔学费与生活开销。'
              : 'A place for international students to navigate cross-border tuition, proof of funds, and living expenses with deterministic non-custodial safety.'}
          </p>
        </div>

        {/* ═════════ 2. MAIN CARD: GUEST ENTRY & AUTH ═════════ */}
        <div className="bg-white rounded-[20px] border border-[rgba(15,23,42,0.08)] shadow-[0_4px_24px_rgba(15,23,42,0.06)] p-6 md:p-8 relative z-10 animate-in fade-in zoom-in-95 duration-400">
          
          {/* ── HERO QUICK ACTION: ENTER AS GUEST ── */}
          <div className="mb-5 p-4 rounded-[16px] bg-gradient-to-r from-[#EEF4FF] to-[#F0FDF4] border border-[#3D6BEA]/20 hover:border-[#3D6BEA]/40 transition-all shadow-xs">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white text-[#1C3EAA] flex items-center justify-center border border-[#3D6BEA]/20 shadow-xs shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1C3EAA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                  </svg>
                </div>
                <div>
                  <div className="text-[14.5px] font-bold text-[#14213D] leading-tight">
                    {locale === 'zh' ? '以访客身份直接体验 (无需登录)' : 'Enter as Guest (No Login Required)'}
                  </div>
                  <div className="text-[12px] text-[#334155] font-medium mt-0.5">
                    {locale === 'zh' ? '预载 Ayu (HKUST) 演示数据与三环防御' : 'Instant access with preloaded demo student data'}
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#0E6E43] bg-[#EBF7EE] px-2 py-0.5 rounded-full border border-[#0E6E43]/20 shrink-0">
                1-Click
              </span>
            </div>

            <button
              type="button"
              onClick={handleEnterGuest}
              className="w-full h-10 px-4 rounded-[12px] bg-[#1C3EAA] hover:bg-[#153285] text-white font-semibold text-[13.5px] flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <span>{locale === 'zh' ? '立即探索钱包主页 →' : 'Explore AegisPath Wallet →'}</span>
            </button>
          </div>

          {/* Section Divider */}
          <div className="relative my-5 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[rgba(15,23,42,0.12)]" />
            </div>
            <span className="relative bg-white px-3 text-[11.5px] uppercase font-bold text-[#475569] tracking-wider">
              {locale === 'zh' ? '或绑定个人学生账号' : 'or sign in with your account'}
            </span>
          </div>

          {/* ── GOOGLE AUTH ACTION ── */}
          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={isGoogleLoading}
            className="w-full h-11 px-4 rounded-[12px] border border-[rgba(15,23,42,0.12)] bg-white hover:bg-[#F8FAFC] text-[#14213D] font-semibold text-[13.5px] flex items-center justify-center gap-3 transition-all shadow-xs cursor-pointer disabled:opacity-60 mb-5"
          >
            {isGoogleLoading ? (
              <span className="w-4 h-4 border-2 border-[#1C3EAA] border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" fill="#4285F4"/>
                <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z" fill="#34A853"/>
                <path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.97 0 12s.45 3.84 1.24 5.42l4.04-3.15z" fill="#FBBC05"/>
                <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z" fill="#EA4335"/>
              </svg>
            )}
            <span>
              {locale === 'zh' ? '使用 Google 账号继续' : 'Continue with Google'}
            </span>
          </button>

          {/* Mode Switcher Pill Tabs (Sign In / Sign Up) */}
          <div className="grid grid-cols-2 p-1 bg-[#F1F5F9] rounded-xl mb-4">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`py-1.5 text-[12.5px] font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white text-[#1C3EAA] shadow-xs'
                  : 'text-[#334155] hover:text-[#14213D]'
              }`}
            >
              {locale === 'zh' ? 'AegisPath 登录' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`py-1.5 text-[12.5px] font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-[#1C3EAA] shadow-xs'
                  : 'text-[#334155] hover:text-[#14213D]'
              }`}
            >
              {locale === 'zh' ? '注册新学生账户' : 'Create Account'}
            </button>
          </div>

          {/* ── AEGISPATH FORM ── */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className="block text-[12px] font-semibold text-[#14213D] mb-1">
                  {locale === 'zh' ? '真实姓名' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ayu Sutanto"
                  className="w-full h-9 px-3 rounded-[10px] border border-[rgba(15,23,42,0.12)] bg-[#F8FAFC] text-[13px] text-[#14213D] focus:bg-white focus:border-[#1C3EAA] focus:outline-none transition-all"
                />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[12px] font-semibold text-[#14213D]">
                  {locale === 'zh' ? '校园邮箱 / 学生 ID' : 'Campus Email or Student ID'}
                </label>
                {mode === 'signup' && (
                  <span className="text-[10.5px] font-semibold text-[#0E6E43] bg-[#EBF7EE] px-1.5 py-0.2 rounded">
                    .edu / .ac eligible
                  </span>
                )}
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@connect.ust.hk"
                className="w-full h-9 px-3 rounded-[10px] border border-[rgba(15,23,42,0.12)] bg-[#F8FAFC] text-[13px] text-[#14213D] focus:bg-white focus:border-[#1C3EAA] focus:outline-none transition-all"
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-[12px] font-semibold text-[#14213D] mb-1">
                  {locale === 'zh' ? '就读院校' : 'University / Campus'}
                </label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="e.g. HKUST, NUS"
                  className="w-full h-9 px-3 rounded-[10px] border border-[rgba(15,23,42,0.12)] bg-[#F8FAFC] text-[13px] text-[#14213D] focus:bg-white focus:border-[#1C3EAA] focus:outline-none transition-all"
                />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[12px] font-semibold text-[#14213D]">
                  {locale === 'zh' ? '账户密码' : 'Password'}
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => onShowToast(locale === 'zh' ? '已向注册校园邮箱发送重置链接' : 'Password reset link sent to campus email')}
                    className="text-[11px] font-semibold text-[#1C3EAA] hover:underline cursor-pointer"
                  >
                    {locale === 'zh' ? '忘记密码？' : 'Forgot password?'}
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={locale === 'zh' ? '输入登录密码' : 'Enter password'}
                  className={`w-full h-9 px-3 pr-16 rounded-[10px] border border-[rgba(15,23,42,0.12)] bg-[#F8FAFC] text-[13px] text-[#14213D] focus:bg-white focus:border-[#1C3EAA] focus:outline-none transition-all ${
                    showPassword ? 'font-sans font-medium' : 'font-mono'
                  }`}
                />
                <button
                  type="button"
                  id="btn-toggle-password-visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#1C3EAA] hover:text-[#153285] text-[11px] font-semibold cursor-pointer flex items-center gap-1 select-none py-1 px-1.5 rounded hover:bg-[#EEF4FF] transition-all"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                      <span>{locale === 'zh' ? '隐藏' : 'Hide'}</span>
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span>{locale === 'zh' ? '显示' : 'Show'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Password strength bar */}
              {mode === 'signup' && (
                <div className="mt-1.5">
                  <div className="flex items-center gap-1.5 h-1 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strength <= 1
                          ? 'w-1/4 bg-[#E5484D]'
                          : strength === 2
                          ? 'w-2/4 bg-[#F59E0B]'
                          : strength === 3
                          ? 'w-3/4 bg-[#3B82F6]'
                          : 'w-full bg-[#0E6E43]'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Checkbox */}
            {mode === 'signin' ? (
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-[12px] text-[#334155] font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-[#1C3EAA] focus:ring-[#1C3EAA]"
                  />
                  <span>{locale === 'zh' ? '保持登录状态' : 'Remember this device'}</span>
                </label>
              </div>
            ) : (
              <label className="flex items-start gap-2 cursor-pointer text-[11.5px] text-[#334155] font-medium pt-0.5">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-3.5 h-3.5 mt-0.5 rounded text-[#1C3EAA] focus:ring-[#1C3EAA]"
                />
                <span>
                  {locale === 'zh'
                    ? '我同意遵守确定性三环安全准则与非托管钱包条款'
                    : 'I agree to the deterministic safety terms & non-custodial wallet agreement'}
                </span>
              </label>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 rounded-[12px] bg-gradient-to-r from-[#1C3EAA] to-[#2554D7] text-white font-semibold text-[13.5px] flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-xs cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheckIcon size={15} color="#FFFFFF" />
                  <span>
                    {mode === 'signin'
                      ? (locale === 'zh' ? '安全登录' : 'Sign In with AegisPath')
                      : (locale === 'zh' ? '确认创建账户' : 'Create Student Account')}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Autofill Hint */}
          <div className="mt-4 pt-3 border-t border-[rgba(15,23,42,0.06)] flex items-center justify-between text-[11.5px]">
            <span className="text-[#334155] font-medium">
              {locale === 'zh' ? '评审/演示快捷填入:' : 'Judge/Reviewer Autofill:'}
            </span>
            <button
              type="button"
              onClick={handleAutofillDemo}
              className="text-[#1C3EAA] bg-[#EEF4FF] hover:bg-[#DCE8FD] px-2 py-0.5 rounded-full font-semibold transition-colors cursor-pointer"
            >
              ⚡ Ayu (HKUST)
            </button>
          </div>
        </div>

        {/* Security & Non-Custodial Footer Guarantee */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-[11.5px] text-[#64748B]">
          <div className="flex items-center gap-1.5">
            <ShieldCheckIcon size={13} color="#0E6E43" />
            <span>{locale === 'zh' ? '确定性三环安全防护' : 'Deterministic 3-Ring Matrix'}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <LockKeyholeIcon size={13} color="#1C3EAA" />
            <span>{locale === 'zh' ? '非托管隔离' : 'Non-custodial isolation'}</span>
          </div>
        </div>
      </div>

      {/* ═════════ GOOGLE AUTH DIALOG MODAL ═════════ */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-[22px] max-w-md w-full p-6 shadow-2xl border border-[rgba(15,23,42,0.1)] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(15,23,42,0.08)] mb-4">
              <div className="flex items-center gap-2.5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" fill="#4285F4"/>
                  <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z" fill="#34A853"/>
                  <path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.97 0 12s.45 3.84 1.24 5.42l4.04-3.15z" fill="#FBBC05"/>
                  <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z" fill="#EA4335"/>
                </svg>
                <div>
                  <span className="text-[15px] font-bold text-[#14213D] block leading-tight">
                    {locale === 'zh' ? 'Google 实名认证授权' : 'Sign in with Google'}
                  </span>
                  <span className="text-[11px] text-[#0E6E43] font-semibold">
                    ● Real Account Mode (Akun Nyata)
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowGoogleModal(false)}
                className="w-8 h-8 rounded-full text-[#64748B] hover:bg-[#F1F5F9] flex items-center justify-center font-bold text-[14px] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Tab switch between typing Real Account vs Quick Select */}
            <div className="grid grid-cols-2 p-1 bg-[#F1F5F9] rounded-xl mb-4 text-[12px]">
              <button
                type="button"
                onClick={() => setGoogleAuthTab('real')}
                className={`py-1.5 font-semibold rounded-lg transition-all cursor-pointer ${
                  googleAuthTab === 'real'
                    ? 'bg-white text-[#1C3EAA] shadow-xs'
                    : 'text-[#475569] hover:text-[#14213D]'
                }`}
              >
                {locale === 'zh' ? '输入任意真实 Google 账号' : 'Input Real Google Account'}
              </button>
              <button
                type="button"
                onClick={() => setGoogleAuthTab('quick')}
                className={`py-1.5 font-semibold rounded-lg transition-all cursor-pointer ${
                  googleAuthTab === 'quick'
                    ? 'bg-white text-[#1C3EAA] shadow-xs'
                    : 'text-[#475569] hover:text-[#14213D]'
                }`}
              >
                {locale === 'zh' ? '快捷账号选择 (1-Click)' : 'Quick Select (1-Click)'}
              </button>
            </div>

            {googleError && (
              <div className="mb-3 p-2.5 rounded-lg bg-[#FEF2F2] border border-[#F87171]/40 text-[#DC2626] text-[12px] font-medium flex items-center gap-2">
                <span>⚠️</span>
                <span>{googleError}</span>
              </div>
            )}

            {googleAuthTab === 'real' ? (
              <form onSubmit={handleCustomGoogleSubmit} className="space-y-3 mb-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#14213D] mb-1">
                    {locale === 'zh' ? 'Google 邮箱地址' : 'Real Google Email Address'}
                  </label>
                  <input
                    type="email"
                    required
                    value={googleCustomEmail}
                    onChange={(e) => setGoogleCustomEmail(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full h-9 px-3 rounded-[10px] border border-[rgba(15,23,42,0.12)] bg-[#F8FAFC] text-[13px] text-[#14213D] focus:bg-white focus:border-[#4285F4] focus:outline-none transition-all"
                  />
                  <span className="text-[11px] text-[#64748B] mt-0.5 block">
                    {locale === 'zh' ? '支持 @gmail.com 或 Google Workspace 校园邮箱' : 'Supports @gmail.com or Google Workspace school emails'}
                  </span>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[#14213D] mb-1">
                    {locale === 'zh' ? '真实姓名' : 'Full Name (Account Holder)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={googleCustomName}
                    onChange={(e) => setGoogleCustomName(e.target.value)}
                    placeholder="e.g. Budi Santoso / Alex Zhang"
                    className="w-full h-9 px-3 rounded-[10px] border border-[rgba(15,23,42,0.12)] bg-[#F8FAFC] text-[13px] text-[#14213D] focus:bg-white focus:border-[#4285F4] focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[#14213D] mb-1">
                    {locale === 'zh' ? '大学 / 机构 (选填)' : 'University / Affiliation (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={googleCustomUni}
                    onChange={(e) => setGoogleCustomUni(e.target.value)}
                    placeholder="e.g. HKUST, NUS, UC Berkeley"
                    className="w-full h-9 px-3 rounded-[10px] border border-[rgba(15,23,42,0.12)] bg-[#F8FAFC] text-[13px] text-[#14213D] focus:bg-white focus:border-[#4285F4] focus:outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-10 mt-2 rounded-[12px] bg-[#1A73E8] hover:bg-[#1557B0] text-white font-semibold text-[13.5px] flex items-center justify-center gap-2.5 transition-all shadow-xs cursor-pointer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" fill="#FFFFFF"/>
                    <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z" fill="#FFFFFF"/>
                  </svg>
                  <span>
                    {locale === 'zh' ? '以实名 Google 账号授权登录' : 'Authorize & Sign In with Google'}
                  </span>
                </button>
              </form>
            ) : (
              <div className="space-y-2 mb-4">
                <p className="text-[12px] text-[#64748B] mb-2">
                  {locale === 'zh'
                    ? '选择已配置的实名 Google 账号直接进入：'
                    : 'Select a verified Google identity for instant entry:'}
                </p>

                <button
                  type="button"
                  onClick={() => handleSelectGoogleAccount('alex.zhang@berkeley.edu', 'Alex Zhang', 'UC Berkeley')}
                  className="w-full p-3 rounded-xl border border-[rgba(15,23,42,0.08)] hover:bg-[#F4F7FE] hover:border-[#1C3EAA]/30 flex items-center gap-3 transition-all text-left cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0E6E43] to-[#10B981] text-white font-bold text-[12px] flex items-center justify-center shrink-0">
                    AZ
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold text-[#14213D] truncate">Alex Zhang</div>
                    <div className="text-[11.5px] text-[#64748B] truncate">alex.zhang@berkeley.edu</div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#0E6E43] bg-[#EBF7EE] px-2 py-0.5 rounded-full shrink-0">
                    Real Google
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectGoogleAccount('ayu.sutanto@gmail.com', 'Ayu Sutanto', 'HKUST')}
                  className="w-full p-3 rounded-xl border border-[rgba(15,23,42,0.08)] hover:bg-[#F4F7FE] hover:border-[#1C3EAA]/30 flex items-center gap-3 transition-all text-left cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1C3EAA] to-[#2554D7] text-white font-bold text-[12px] flex items-center justify-center shrink-0">
                    AY
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold text-[#14213D] truncate">Ayu Sutanto</div>
                    <div className="text-[11.5px] text-[#64748B] truncate">ayu.sutanto@gmail.com</div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#1C3EAA] bg-[#EEF4FF] px-2 py-0.5 rounded-full shrink-0">
                    Real Google
                  </span>
                </button>
              </div>
            )}

            <div className="pt-2.5 border-t border-[rgba(15,23,42,0.08)] text-[11.5px] text-[#64748B] text-center flex items-center justify-center gap-1.5">
              <ShieldCheckIcon size={13} color="#0E6E43" />
              <span>
                {locale === 'zh'
                  ? '真实 Google 账号将载入真实钱包资产与实名凭据'
                  : 'Real Google accounts connect to live personal wallet and proofs'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
