'use client';

import React, { useState, useRef, useEffect } from 'react';
import { DesktopHeader } from '@/components/shell/DesktopHeader';
import { AppFrame } from '@/components/shell/AppFrame';
import { SiteFooter } from '@/components/shell/SiteFooter';
import { DemoPanel } from '@/components/shell/DemoPanel';
import { HomeScreen } from '@/components/screens/HomeScreen';
import { TuitionScreen } from '@/components/screens/TuitionScreen';
import { ApprovalScreen } from '@/components/screens/ApprovalScreen';
import { SafetyScreen, LayersState } from '@/components/screens/SafetyScreen';
import { EvidenceScreen } from '@/components/screens/EvidenceScreen';
import { PlannerScreen } from '@/components/screens/PlannerScreen';
import { ChatScreen } from '@/components/screens/ChatScreen';
import { LoginScreen, AuthUserProfile } from '@/components/screens/LoginScreen';
import { PayeesScreen } from '@/components/screens/PayeesScreen';
import { RatesScreen } from '@/components/screens/RatesScreen';
import { AppPresentationState, AppRoute, Locale } from '@/types';
import { connector, type ApprovalSheetResponse } from '@/lib/api/connector';

export default function HomePage() {
  const [currentState, setCurrentState] = useState<AppPresentationState>('default');
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('/login');
  const [locale, setLocale] = useState<Locale>('en');
  const [isPaused, setIsPaused] = useState(false);
  const [emptyActivity, setEmptyActivity] = useState(false);
  const [pendingApproval, setPendingApproval] = useState<ApprovalSheetResponse | null>(null);
  const [chatDraft, setChatDraft] = useState('');
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [authUser, setAuthUser] = useState<AuthUserProfile>({
    name: 'Guest',
    email: '',
    avatarLetter: 'G',
    provider: 'guest',
    isAuthenticated: false,
  });

  // Safety, Evidence, Planner Interactive States
  const [layersState, setLayersState] = useState<LayersState>({
    privacy: true,
    rules: true,
    bank: true,
  });
  const [isAttackReplaying, setIsAttackReplaying] = useState(false);
  const [landlordShareRevoked, setLandlordShareRevoked] = useState(false);
  const [plannerScenario, setPlannerScenario] = useState<'on_time' | 'delayed' | 'optimized'>('on_time');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const PROTECTED_ROUTES: AppRoute[] = ['/', '/approve', '/planner', '/chat', '/safety', '/evidence', '/payees', '/rates', '/tuition'];

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem('aegispath_auth_user');
      const hasEntered = sessionStorage.getItem('aegispath_entered') === 'true';
      if (cached && hasEntered) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.isAuthenticated) {
          setAuthUser(parsed);
          const params = new URLSearchParams(window.location.search);
          const r = params.get('route');
          if (r && ['/', '/tuition', '/chat', '/evidence', '/safety', '/planner', '/approve', '/payees', '/rates', '/login'].includes(r)) {
            setCurrentRoute(r as AppRoute);
          } else {
            setCurrentRoute('/');
          }
          return;
        }
      }
    } catch {
      // fallback
    }
    // Always start at /login when opening the web application without an active session
    setCurrentRoute('/login');
  }, []);

  useEffect(() => {
    const handleUrlRoute = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const r = params.get('route');
      const hasEntered = sessionStorage.getItem('aegispath_entered') === 'true';
      const cached = sessionStorage.getItem('aegispath_auth_user');
      let isAuthed = false;
      try {
        isAuthed = hasEntered && cached ? Boolean(JSON.parse(cached)?.isAuthenticated) : false;
      } catch {
        isAuthed = false;
      }

      if (!isAuthed) {
        // Must show login screen on initial open / when not authenticated
        setCurrentRoute('/login');
        return;
      }

      if (r && ['/', '/tuition', '/chat', '/evidence', '/safety', '/planner', '/approve', '/payees', '/rates', '/login'].includes(r)) {
        setCurrentRoute(r as AppRoute);
      } else {
        setCurrentRoute('/');
      }

      const s = params.get('state');
      if (s && ['default', 'agent-paused', 'waiting-approval', 'payment-sent', 'attack-blocked', 'model-offline', 'empty-activity'].includes(s)) {
        handleStateChange(s as AppPresentationState);
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    return () => window.removeEventListener('popstate', handleUrlRoute);
  }, []);

  useEffect(() => {
    let mounted = true;
    const probe = async () => {
      try {
        const res = await connector.checkHealth();
        if (mounted) setBackendOnline(res.online);
      } catch {
        if (mounted) setBackendOnline(false);
      }
    };
    probe();
    const interval = setInterval(probe, 6000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const showToast = (message: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToastMessage(message);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleLogout = async () => {
    try {
      await connector.logout();
    } catch {
      connector.clearSession();
    }
    const unauthUser: AuthUserProfile = {
      name: 'Guest',
      email: '',
      avatarLetter: 'G',
      provider: 'guest',
      isAuthenticated: false,
    };
    setAuthUser(unauthUser);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('aegispath_auth_user');
      sessionStorage.removeItem('aegispath_entered');
    }
    setCurrentRoute('/login');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/?route=/login');
    }
    showToast(
      locale === 'zh'
        ? '已安全退出登录 · Sesi telah diakhiri'
        : 'Signed out successfully · Session terminated'
    );
  };

  const navigateTo = (route: AppRoute) => {
    if (PROTECTED_ROUTES.includes(route) && !authUser.isAuthenticated) {
      setCurrentRoute('/login');
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/?route=/login');
      }
      showToast(
        locale === 'zh'
          ? '请先登录以访问此功能'
          : 'Please sign in to access this wallet feature'
      );
      return;
    }
    setCurrentRoute(route);
    if (typeof window !== 'undefined') {
      const url = route === '/' ? '/' : `/?route=${route}`;
      window.history.pushState({}, '', url);
    }
  };

  const toggleLocale = () => {
    const nextLocale = locale === 'en' ? 'zh' : 'en';
    setLocale(nextLocale);
    showToast(nextLocale === 'zh' ? '已切换至简体中文' : 'Switched to English');
  };

  const handleStateChange = (state: AppPresentationState) => {
    setCurrentState(state);
    if (state === 'agent-paused') {
      setIsPaused(true);
      setCurrentRoute('/safety');
      setEmptyActivity(false);
      showToast('State: Agent Paused (Kill switch active)');
    } else if (state === 'waiting-approval') {
      setIsPaused(false);
      setCurrentRoute('/approve');
      showToast(locale === 'zh' ? '审批视图：仅显示后端返回的计划' : 'Approval view: backend-issued plans only');
    } else if (state === 'payment-sent') {
      setIsPaused(false);
      setCurrentRoute('/approve');
      showToast(locale === 'zh' ? '回执仅在银行确认执行后显示' : 'Receipts appear only after confirmed bank execution');
    } else if (state === 'attack-blocked') {
      setIsPaused(false);
      setCurrentRoute('/safety');
      setIsAttackReplaying(true);
      showToast('State: Attack Blocked Demo');
      setTimeout(() => {
        setIsAttackReplaying(false);
      }, 2000);
    } else if (state === 'model-offline') {
      showToast(locale === 'zh' ? '仅切换演示视图；服务器模型配置未改变' : 'Presentation only — server model configuration is unchanged');
    } else if (state === 'empty-activity') {
      setIsPaused(false);
      setCurrentRoute('/');
      setEmptyActivity(true);
      showToast('State: Empty Activity');
    } else {
      setIsPaused(false);
      setEmptyActivity(false);
      setIsAttackReplaying(false);
      setCurrentRoute('/');
      showToast('State: Default View');
    }
  };

  const handleReplayAttack = async () => {
    setIsAttackReplaying(true);
    showToast(
      locale === 'zh'
        ? '正在执行攻击拦截回放...'
        : 'Replaying attack simulation...'
    );
    try {
      const disabledList: string[] = [];
      if (!layersState.privacy) disabledList.push('privacy');
      if (!layersState.rules) disabledList.push('rules');
      if (!layersState.bank) disabledList.push('bank');

      const res = await connector.replayAttack('invoice_hidden_instruction_01', disabledList);
      setTimeout(() => {
        setIsAttackReplaying(false);
        if (res.stopped_by === 'none') {
          showToast(
            locale === 'zh'
              ? `所有防线已关闭！资金损失 $${res.funds_lost_usd}`
              : `Catastrophic failure: All rings disabled! Lost $${res.funds_lost_usd}`
          );
        } else {
          showToast(
            locale === 'zh'
              ? `攻击已成功拦截！由 ${res.stopped_by} 环防御，损失 $0`
              : `Stopped by ${res.stopped_by} ring! $0 lost.`
          );
        }
      }, 1200);
    } catch {
      setTimeout(() => {
        setIsAttackReplaying(false);
        showToast(
          locale === 'zh'
            ? '攻击回放完成：4/4 已拦截，损失 $0'
            : 'Replay complete: 4/4 stopped. $0 lost.'
        );
      }, 1200);
    }
  };

  const handleTogglePause = async () => {
    const next = !isPaused;
    setIsPaused(next);
    try {
      if (next) {
        await connector.pauseAgent();
      } else {
        await connector.resumeAgent();
      }
    } catch {
      // Fallback handles gracefully
    }
    showToast(
      next
        ? locale === 'zh'
          ? '智能体已暂停！(Kill switch active)'
          : 'Agent paused! (Kill switch active)'
        : locale === 'zh'
        ? '智能体已恢复！'
        : 'Agent resumed! 智能体已恢复'
    );
  };

  const renderActiveScreen = () => {
    switch (currentRoute) {
      case '/':
        return (
          <HomeScreen
            locale={locale}
            isPaused={isPaused}
            onTogglePause={handleTogglePause}
            onNavigate={(route: AppRoute) => navigateTo(route)}
            onShowToast={showToast}
            emptyActivity={emptyActivity}
            authUser={authUser}
          />
        );
      case '/tuition':
        return (
          <TuitionScreen
            locale={locale}
            onNavigate={(route: AppRoute) => navigateTo(route)}
            onRequestTuition={(mode) => {
              setChatDraft(`Pay tuition CNY 18000 to Campus bursar, ${mode} route`);
              navigateTo('/chat');
            }}
          />
        );
      case '/approve':
        return (
          <ApprovalScreen
            key={pendingApproval?.plan_id ?? 'no-plan'}
            locale={locale}
            onNavigate={(route: AppRoute) => navigateTo(route)}
            plan={pendingApproval}
          />
        );
      case '/safety':
        return (
          <SafetyScreen
            locale={locale}
            onNavigate={(route: AppRoute) => navigateTo(route)}
            layersState={layersState}
            onToggleLayer={(layer) => {
              setLayersState((prev) => ({
                ...prev,
                [layer]: !prev[layer],
              }));
            }}
            agentPaused={isPaused}
            onTogglePause={handleTogglePause}
            onReplayAttack={handleReplayAttack}
            isAttackReplaying={isAttackReplaying}
          />
        );
      case '/evidence':
        return (
          <EvidenceScreen
            locale={locale}
            onNavigate={(route: AppRoute) => navigateTo(route)}
            landlordShareRevoked={landlordShareRevoked}
            onToggleRevokeShare={() => {
              const next = !landlordShareRevoked;
              setLandlordShareRevoked(next);
              showToast(
                next
                  ? 'Shared link revoked! 链接已撤回'
                  : 'New share link generated! 新链接已生成'
              );
            }}
            onCopyShareLink={() => {
              showToast('Proof link copied to clipboard! 证明链接已复制');
            }}
            authUser={authUser}
          />
        );
      case '/planner':
        return (
          <PlannerScreen
            locale={locale}
            onNavigate={(route: AppRoute) => navigateTo(route)}
            plannerScenario={plannerScenario}
            onSelectScenario={setPlannerScenario}
            onApplyMitigation={() => {
              setPlannerScenario('optimized');
              showToast(
                locale === 'zh'
                  ? '已应用 AI 智能优化：学费分两期支付并锁定汇率'
                  : 'AI Optimization Applied: Split tuition into 2 batches with locked FX'
              );
            }}
          />
        );
      case '/chat':
        return (
          <ChatScreen
            locale={locale}
            onNavigate={(route: AppRoute) => navigateTo(route)}
            agentPaused={isPaused}
            onTogglePause={handleTogglePause}
            initialDraft={chatDraft}
            onReviewPlan={(plan) => {
              setPendingApproval(plan);
              navigateTo('/approve');
            }}
          />
        );
      case '/login':
        return (
          <LoginScreen
            locale={locale}
            onNavigate={(route: AppRoute) => {
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('aegispath_entered', 'true');
              }
              navigateTo(route);
            }}
            onLoginSuccess={(user) => {
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('aegispath_entered', 'true');
                sessionStorage.setItem('aegispath_auth_user', JSON.stringify(user));
              }
              setAuthUser(user);
              navigateTo('/');
            }}
            onEnterAsGuest={() => {
              const guestUser: AuthUserProfile = {
                name: 'Ayu (Demo)',
                email: 'guest.demo@connect.ust.hk',
                university: 'HKUST (Synthetic Demo)',
                avatarLetter: 'GU',
                provider: 'guest',
                isAuthenticated: true,
              };
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('aegispath_entered', 'true');
                sessionStorage.setItem('aegispath_auth_user', JSON.stringify(guestUser));
              }
              setAuthUser(guestUser);
              navigateTo('/');
            }}
            onShowToast={showToast}
          />
        );
      case '/payees':
        return (
          <PayeesScreen
            locale={locale}
            onNavigate={(route: AppRoute) => navigateTo(route)}
            onShowToast={showToast}
            authUser={authUser}
          />
        );
      case '/rates':
        return (
          <RatesScreen
            locale={locale}
            onNavigate={(route: AppRoute) => navigateTo(route)}
            onShowToast={showToast}
          />
        );
      default:
        return (
          <HomeScreen
            locale={locale}
            isPaused={isPaused}
            onTogglePause={handleTogglePause}
            onNavigate={(route: AppRoute) => navigateTo(route)}
            onShowToast={showToast}
            emptyActivity={emptyActivity}
            authUser={authUser}
          />
        );
    }
  };

  return (
    <>
      {/* ═══════════ MAIN WEB APPLICATION VIEWPORT ═══════════ */}
      <main className="webapp-container mode-web" id="main-container">
        {/* Desktop Web Application Header (sticky, 6 items, zero overflow) */}
        <DesktopHeader
          currentRoute={currentRoute}
          onRouteChange={setCurrentRoute}
          locale={locale}
          onLocaleToggle={toggleLocale}
          isPaused={isPaused}
          authUser={authUser}
          onLogout={handleLogout}
        />

        {/* ═══════════ APPLICATION VIEWPORT FRAME (Responsive Web / Mobile) ═══════════ */}
        <AppFrame
          currentRoute={currentRoute}
          onRouteChange={setCurrentRoute}
          locale={locale}
        >
          {renderActiveScreen()}
        </AppFrame>

        {/* ═══════════ PROFESSIONAL SITE FOOTER (Desktop only) ═══════════ */}
        <SiteFooter locale={locale} />

        {/* Toast Feedback Popup */}
        <div className={`toast-popup ${toastMessage ? 'show' : ''}`} id="app-toast">
          {toastMessage}
        </div>
      </main>

      {/* ═══════════ JUDGE DEMO PANEL (Hidden in normal view; Ctrl+Shift+D or ?demo=1) ═══════════ */}
      <DemoPanel
        currentState={currentState}
        onStateChange={handleStateChange}
        backendOnline={backendOnline}
      />
    </>
  );
}
