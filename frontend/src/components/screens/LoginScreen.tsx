'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Locale } from '@/types';
import { ShieldCheckIcon, LockKeyholeIcon } from '@/components/icons/AegisIcons';
import { ArrowRight, Eye, EyeOff, GraduationCap, Mail, University, UserRound, X, Zap } from 'lucide-react';
import styles from './LoginScreen.module.css';

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
  onLoginSuccess: (user: AuthUserProfile) => void;
  onShowToast: (message: string) => void;
  onLocaleToggle?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  locale = 'en',
  onLoginSuccess,
  onShowToast,
  onLocaleToggle,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [university, setUniversity] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Interaction loading states
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const googleModalRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!showGoogleModal) return;
    const previousFocus = document.activeElement;
    const modal = googleModalRef.current;
    if (!modal) return;
    const focusableSelector = 'button:not(:disabled), input:not(:disabled)';
    modal.querySelector<HTMLElement>(focusableSelector)?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setShowGoogleModal(false);
      }
      if (event.key !== 'Tab') return;
      const controls = Array.from(modal.querySelectorAll<HTMLElement>(focusableSelector));
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    modal.addEventListener('keydown', handleKeyDown);
    return () => {
      modal.removeEventListener('keydown', handleKeyDown);
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [showGoogleModal]);

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
  const [googleAuthTab, setGoogleAuthTab] = useState<'manual' | 'quick'>('manual');
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
      googleCustomUni.trim() || 'Google Demo User'
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
          ? `Google 演示登录成功：${selectedName}`
          : `Demo Google sign-in successful as ${selectedName}`
      );
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
    }, 600);
  };

  const handleAutofillDemo = () => {
    setEmail('ayu.sutanto@connect.ust.hk');
    setPassword('AegisGuard2026!');
    setFullName('Ayu Sutanto');
    setUniversity('HKUST');
    onShowToast(locale === 'zh' ? '已填入测试学生数据' : 'Autofilled demo student credentials');
  };

  const zh = locale === 'zh';
  const signup = mode === 'signup';
  const strengthText = (zh ? ['请输入密码', '弱密码', '一般密码', '良好密码', '强密码'] : ['Enter a password', 'Weak password', 'Fair password', 'Good password', 'Strong password'])[strength];

  return (
    <div className={styles.page} lang={zh ? 'zh-CN' : 'en'}>
      <div className={`${styles.panel} ${signup ? styles.signup : ''}`}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarCopy}>
            <div className={styles.brand}><img src="/brand/aegis-logo.png" alt="" width="62" height="70" /><div><strong>AegisPath</strong><span>WALLET</span></div></div>
            <h1>{signup ? (zh ? '开启你的' : 'Start Your') : (zh ? '守护你的' : 'Secure Your')}<br /><span>{signup ? (zh ? '学生钱包' : 'Student Wallet') : (zh ? '留学旅程' : 'Student Journey')}</span></h1>
            <p>{signup ? (zh ? '安全、简单，专为你的学术旅程打造。' : 'Secure, simple, and built for your academic journey.') : (zh ? '以确定性非托管保护，守护学费与学生资金。' : 'Deterministic, non-custodial protection for tuition and student funds.')}</p>
            <ul className={styles.features}>
              <li><span className={styles.featureIcon} aria-hidden="true"><ShieldCheckIcon size={26} /></span><div><strong>{zh ? '非托管' : 'Non-Custodial'}</strong><p>{zh ? '资金始终由你掌控。' : 'You stay in control of your funds.'}</p></div></li>
              <li><span className={styles.featureIcon} aria-hidden="true"><LockKeyholeIcon size={26} /></span><div><strong>{zh ? '确定性保护' : 'Deterministic Protection'}</strong><p>{zh ? '基于安全的三环矩阵。' : 'Built with a secure 3-Ring Matrix.'}</p></div></li>
              <li><span className={styles.featureIcon} aria-hidden="true"><GraduationCap size={28} /></span><div><strong>{zh ? '为学生而生' : 'Built for Students'}</strong><p>{signup ? (zh ? '深受全球社区信赖。' : 'Trusted by a global community.') : (zh ? '简单、安全、值得信赖。' : 'Simple, secure, and trusted.')}</p></div></li>
            </ul>
          </div>
          <img className={styles.art} src={`/auth/${mode}-art.png`} alt="" width={signup ? 284 : 308} height={signup ? 312 : 299} />
        </aside>
        <section className={styles.formPanel} aria-labelledby="auth-heading">
          <div className={styles.status}><span />{zh ? '内核守卫已启用' : 'Kernel Guard Active'}</div>
          <h2 id="auth-heading">{signup ? (zh ? '创建学生账户' : 'Create Student Account') : (zh ? '登录 AegisPath 钱包' : 'Sign in to AegisPath Wallet')}</h2>
          <p className={styles.subtitle}>{signup ? (zh ? '加入 AegisPath 钱包，掌控你的学生资金。' : 'Join AegisPath Wallet and take control of your student funds.') : (zh ? '进入钱包，安全管理你的学生资金。' : 'Access your wallet to manage your student funds securely.')}</p>
          <div className={styles.modes} data-mode={mode} aria-label={zh ? '账户操作' : 'Account action'}>
            <button type="button" aria-pressed={!signup} onClick={() => setMode('signin')}>{zh ? '登录' : 'Sign In'}</button>
            <button type="button" aria-pressed={signup} onClick={() => setMode('signup')}>{zh ? '创建账户' : 'Create Account'}</button>
          </div>
          <button type="button" className={styles.google} onClick={handleGoogleClick} disabled={isGoogleLoading}>
            <svg aria-hidden="true" width="23" height="23" viewBox="0 0 24 24" fill="none">
              <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" fill="#4285F4"/>
              <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z" fill="#34A853"/>
              <path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.97 0 12s.45 3.84 1.24 5.42l4.04-3.15z" fill="#FBBC05"/>
              <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z" fill="#EA4335"/>
            </svg>
            <span>{isGoogleLoading ? (zh ? '正在连接…' : 'Connecting…') : signup ? (zh ? '使用 Google 注册' : 'Sign up with Google') : (zh ? '使用 Google 继续' : 'Continue with Google')}</span><ArrowRight size={19} aria-hidden="true" />
          </button>
          {!signup && <div className={styles.divider}>{zh ? '或使用 AEGISPATH ID' : 'OR WITH AEGISPATH ID'}</div>}
          <form onSubmit={handleSubmit} className={styles.form}>
            {signup && <div className={styles.field}><label htmlFor="auth-name">{zh ? '真实姓名' : 'Full Legal Name'}</label><div className={styles.inputWrap}><UserRound aria-hidden="true" size={19} /><input id="auth-name" name="name" autoComplete="name" placeholder={zh ? '例如：Ayu Sutanto' : 'e.g. Ayu Sutanto'} required value={fullName} onChange={e => setFullName(e.target.value)} /></div></div>}
            <div className={styles.field}>
              <div className={styles.labelRow}><label htmlFor="auth-email">{zh ? '校园邮箱 / 学生 ID' : 'Campus Email or Student ID'}</label>{signup && <span className={styles.eligible}>{zh ? '.edu / .ac 适用' : '.edu / .ac eligible'}</span>}</div>
              <div className={styles.inputWrap}><Mail aria-hidden="true" size={19} /><input id="auth-email" name="email" type="email" autoComplete="email" placeholder={zh ? '例如：student@connect.ust.hk' : 'e.g. student@connect.ust.hk'} required value={email} onChange={e => setEmail(e.target.value)} /></div>
            </div>
            {signup && <div className={styles.field}><label htmlFor="auth-campus">{zh ? '大学 / 校区' : 'University / Campus'}</label><div className={styles.inputWrap}><University aria-hidden="true" size={20} /><input id="auth-campus" name="organization" autoComplete="organization" placeholder={zh ? '例如：HKUST、NUS' : 'e.g. HKUST, NUS'} list="auth-campuses" value={university} onChange={e => setUniversity(e.target.value)} /></div><datalist id="auth-campuses"><option value="HKUST" /><option value="NUS" /><option value="UC Berkeley" /></datalist></div>}
            <div className={styles.field}>
              <div className={styles.labelRow}><label htmlFor="auth-password">{zh ? '密码' : 'Password'}</label>{!signup && <button type="button" className={styles.textButton} onClick={() => onShowToast(zh ? '已向注册校园邮箱发送重置链接' : 'Password reset link sent to campus email')}>{zh ? '忘记密码？' : 'Forgot password?'}</button>}</div>
              <div className={styles.inputWrap}><span aria-hidden="true"><LockKeyholeIcon size={19} /></span><input id="auth-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete={signup ? 'new-password' : 'current-password'} placeholder={zh ? '请输入密码' : 'Enter your password'} required value={password} onChange={e => setPassword(e.target.value)} /><button type="button" className={styles.eye} aria-pressed={showPassword} aria-label={showPassword ? (zh ? '隐藏密码' : 'Hide password') : (zh ? '显示密码' : 'Show password')} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <Eye size={20} aria-hidden="true" /> : <EyeOff size={20} aria-hidden="true" />}</button></div>
              {signup && <div className={styles.strength} data-score={strength}><div className={styles.strengthTrack}><span style={{width: `${strength * 25}%`}} /></div><span>{strengthText}</span></div>}
            </div>
            {signup ? <label className={`${styles.checkbox} ${styles.agreement}`}><input name="agreement" type="checkbox" required checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} /><span>{zh ? '我接受 AegisPath 非托管代理协议与隐私保护条款' : 'I accept the AegisPath Non-Custodial Agent Agreement & Privacy Guard'}</span></label> : <label className={styles.checkbox}><input name="remember" type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} /><span>{zh ? '记住此受信任设备' : 'Remember this trusted device'}</span></label>}
            <button type="submit" className={styles.primary} disabled={isSubmitting}><span aria-hidden="true"><ShieldCheckIcon size={23} color="#FFFFFF" /></span><span>{isSubmitting ? (zh ? '正在处理…' : 'Please wait…') : signup ? (zh ? '确认创建账户' : 'Create Student Account') : (zh ? '安全登录' : 'Sign In with AegisPath')}</span><ArrowRight size={20} aria-hidden="true" /></button>
          </form>
          <div className={styles.autofill}><span>{zh ? '评审快捷填入：' : 'Judge/Reviewer Quick Autofill:'}</span><button type="button" onClick={handleAutofillDemo}><Zap size={16} aria-hidden="true" />Ayu (HKUST)</button></div>
          <div className={styles.secondary}><button type="button" onClick={handleEnterGuest}>{zh ? '以访客身份进入' : 'Enter as Guest'}</button>{onLocaleToggle && <button type="button" onClick={onLocaleToggle}>{zh ? 'English' : '简体中文'}</button>}</div>
          <footer className={styles.footer}><span><ShieldCheckIcon size={17} color="#20996C" />{zh ? '确定性三环矩阵' : 'Deterministic 3-Ring Matrix'}</span><i aria-hidden="true" /><span><LockKeyholeIcon size={16} color="#174CCB" />{zh ? '非托管学生隐私保护' : 'Non-custodial student privacy'}</span></footer>
        </section>
      </div>

      {showGoogleModal && (
        <div className={styles.modalBackdrop}>
          <section ref={googleModalRef} className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="google-heading" aria-describedby="google-disclosure">
            <div className={styles.modalHeader}>
              <h2 id="google-heading">{zh ? 'Google 演示登录' : 'Demo Google sign-in'}</h2>
              <button type="button" className={styles.close} aria-label={zh ? '关闭' : 'Close'} onClick={() => setShowGoogleModal(false)}><X size={20} aria-hidden="true" /></button>
            </div>
            <p id="google-disclosure" className={styles.disclosure}>{zh ? '仅供演示：不会验证 Google OAuth，也不会连接真实钱包。' : 'Demo only — no Google OAuth verification or live wallet connection.'}</p>
            <div className={styles.googleTabs}>
              <button type="button" aria-pressed={googleAuthTab === 'manual'} onClick={() => setGoogleAuthTab('manual')}>{zh ? '输入账号资料' : 'Enter account details'}</button>
              <button type="button" aria-pressed={googleAuthTab === 'quick'} onClick={() => setGoogleAuthTab('quick')}>{zh ? '快捷选择' : 'Quick Select'}</button>
            </div>
            {googleError && <p className={styles.error} role="alert">{googleError}</p>}
            {googleAuthTab === 'manual' ? (
              <form onSubmit={handleCustomGoogleSubmit} className={styles.form}>
                <div className={styles.field}>
                  <label htmlFor="google-email">{zh ? 'Google 邮箱地址' : 'Google Email Address'}</label>
                  <input className={styles.modalInput} id="google-email" name="google-email" type="email" autoComplete="email" required value={googleCustomEmail} onChange={e => setGoogleCustomEmail(e.target.value)} placeholder={zh ? '例如：yourname@gmail.com' : 'e.g. yourname@gmail.com'} />
                </div>
                <div className={styles.field}>
                  <label htmlFor="google-name">{zh ? '姓名' : 'Full Name'}</label>
                  <input className={styles.modalInput} id="google-name" name="google-name" autoComplete="name" required value={googleCustomName} onChange={e => setGoogleCustomName(e.target.value)} placeholder={zh ? '例如：Budi Santoso' : 'e.g. Budi Santoso'} />
                </div>
                <div className={styles.field}>
                  <label htmlFor="google-campus">{zh ? '大学 / 机构（选填）' : 'University / Affiliation (Optional)'}</label>
                  <input className={styles.modalInput} id="google-campus" name="google-organization" autoComplete="organization" value={googleCustomUni} onChange={e => setGoogleCustomUni(e.target.value)} placeholder={zh ? '例如：HKUST、NUS' : 'e.g. HKUST, NUS'} />
                </div>
                <button type="submit" className={styles.primary} disabled={isGoogleLoading}>{zh ? '继续演示登录' : 'Continue demo sign-in'}<ArrowRight size={20} aria-hidden="true" /></button>
              </form>
            ) : (
              <div className={styles.quickAccounts}>
                <button type="button" onClick={() => handleSelectGoogleAccount('alex.zhang@berkeley.edu', 'Alex Zhang', 'UC Berkeley')}><span className={styles.avatar} aria-hidden="true">AZ</span><span><strong>Alex Zhang</strong><span>alex.zhang@berkeley.edu</span><span>UC Berkeley · {zh ? '演示' : 'Demo'}</span></span></button>
                <button type="button" onClick={() => handleSelectGoogleAccount('ayu.sutanto@gmail.com', 'Ayu Sutanto', 'HKUST')}><span className={styles.avatar} aria-hidden="true">AY</span><span><strong>Ayu Sutanto</strong><span>ayu.sutanto@gmail.com</span><span>HKUST · {zh ? '演示' : 'Demo'}</span></span></button>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};
