import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const rawText = body.text || body.message || '';
  const { locale = 'en', synthetic_demo = false } = body;
  const text = typeof rawText === 'string' ? rawText : '';
  const lower = text.toLowerCase();

  // 1. Attack / Injection Detection
  const isAttack =
    lower.includes('ignore') ||
    lower.includes('bypass') ||
    lower.includes('override') ||
    lower.includes('hack') ||
    lower.includes('prompt injection') ||
    lower.includes('system prompt') ||
    (lower.includes('full balance') && (lower.includes('account x') || lower.includes('transfer')));

  if (isAttack) {
    return NextResponse.json({
      user_id: 'usr_student_ayu',
      input: text,
      parsed: { action: 'attack_detected', intent: 'override_rules' },
      response: {
        type: 'blocked_slip',
        quoted_instruction: text,
        amount_lost_usd: 0.0,
        verdicts: [
          {
            ring: 'outer',
            name: 'Privacy Filter',
            status: 'flagged',
            text: 'Prompt injection pattern intercepted before reaching language model',
          },
          {
            ring: 'middle',
            name: 'Spending Rules',
            status: 'refused',
            text: 'Unverified payee account blocked by whitelist policy',
          },
          {
            ring: 'inner',
            name: 'Bank Limits',
            status: 'inactive',
            text: 'Zero scoped bank token issued',
          },
        ],
        conclusion: 'Prompt injection detected: Attempt to override spending rules was blocked deterministically outside LLM.',
        stamp: 'BLOCKED',
      },
      ai: {
        source: 'blocked',
        provider: 'none',
        model: null,
      },
    });
  }

  // 2. Project Timeline / Gantt / Schedule Reference
  const isProjectQuery =
    lower.includes('timeline') ||
    lower.includes('jadwal') ||
    lower.includes('gantt') ||
    lower.includes('proyek') ||
    lower.includes('project') ||
    lower.includes('cogs') ||
    lower.includes('hpp') ||
    lower.includes('pos') ||
    lower.includes('bep') ||
    lower.includes('milestone') ||
    lower.includes('rekomendasi');

  if (isProjectQuery) {
    return NextResponse.json({
      user_id: 'usr_student_ayu',
      input: text,
      parsed: { action: 'project_roadmap', topic: 'project_schedule_gantt' },
      response: {
        type: 'gantt_roadmap',
        title: locale === 'zh' ? '项目执行甘特图与进度规划 (Gantt Chart)' : 'Project Schedule & Roadmap Recommendation',
        summary: locale === 'zh'
          ? '已加载 5 个完整项目阶段（启动、HPP/成本规划、POS系统执行、监控及损益平衡BEP）与 32 个关键任务里程碑。'
          : 'Loaded 5 Project Execution Phases: Initiation, Planning (COGS/HPP), Execution (POS/Vendors), Monitoring, and Closing (BEP) with 32 tasks and key milestones.',
      },
      ai: {
        source: 'deterministic',
        provider: 'none',
        model: null,
      },
    });
  }

  // Try reaching backend API port 8000 first with quick timeout
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const backendRes = await fetch('http://127.0.0.1:8000/v1/agent/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, locale, synthetic_demo }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data);
    }
  } catch {
    // Backend offline or unreachable - seamlessly proceed to local deterministic dispatch
  }

  // 3. Over-Cap Transfers (e.g. $600 to Mom)
  const isOverCap = lower.includes('600') || lower.includes('3000') || lower.includes('3,000') || lower.includes('1000');
  if (isOverCap) {
    return NextResponse.json({
      user_id: 'usr_student_ayu',
      input: text,
      parsed: { action: 'transfer', amount_usd: 600.0, payee: 'Mom' },
      response: {
        type: 'approval_sheet',
        plan_id: 'plan_sim_over_cap_01',
        payee_name: 'Mom (Ibu Ayu)',
        you_asked: text,
        understood: 'Send USD 600.00 to Mom',
        send_amount_usd: 600.0,
        receives_idr: 9528000,
        rate: 15880.0,
        rate_pair: 'USD/IDR',
        fee_with_buffer_usd: 0.42,
        eta: '~ 2 minutes',
        intent_hash: 'hash_sim_600_usd',
        why_approval_needed: 'Amount $600.00 exceeds daily single-transaction limit of $500.00.',
        status: 'WAITING_APPROVAL',
      },
      ai: {
        source: 'deterministic',
        provider: 'none',
        model: null,
      },
    });
  }

  // 4. Tuition inquiries
  const isTuition = lower.includes('tuition') || lower.includes('kuliah') || lower.includes('18000') || lower.includes('bursar');
  if (isTuition) {
    return NextResponse.json({
      user_id: 'usr_student_ayu',
      input: text,
      parsed: { action: 'tuition_quote', amount_cny: 18000.0, payee: 'Campus Bursar' },
      response: {
        type: 'approval_sheet',
        plan_id: 'plan_tuition_cny_18000',
        payee_name: 'Campus Bursar (HKUST Tuition & Fees)',
        you_asked: text,
        understood: 'Pay Tuition CNY 18,000 to Campus Bursar',
        send_amount_usd: 2534.42,
        receives_cny: 18000.0,
        rate: 7.1022,
        rate_pair: 'USD/CNY',
        fee_with_buffer_usd: 12.92,
        eta: 'Arrives in 1 business day',
        intent_hash: 'hash_tuition_cny_18000_verified',
        why_approval_needed: 'High-value educational disbursement requiring biometric / passkey approval.',
        status: 'WAITING_APPROVAL',
      },
      ai: {
        source: 'deterministic',
        provider: 'none',
        model: null,
      },
    });
  }

  // 5. Rates inquiry
  const isRates = lower.includes('rate') || lower.includes('kurs') || lower.includes('fx') || lower.includes('dollar') || lower.includes('rupiah') || lower.includes('yuan');
  if (isRates) {
    return NextResponse.json({
      user_id: 'usr_student_ayu',
      input: text,
      parsed: { action: 'info_rates' },
      response: {
        type: 'info_note',
        message: locale === 'zh'
          ? '实时汇率：USD/IDR ~ 15,880.00 | USD/CNY ~ 7.2045 | USD/EUR ~ 0.8899。学生专用通道点差仅 0.15%。可前往 Rates 页面查看实时动态走势图。'
          : 'Live Rates: USD/IDR ~ 15,880.00 | USD/CNY ~ 7.2045 | USD/EUR ~ 0.8899. Student corridor features 0.15% tight spread. Visit the Rates page for real-time motion graphs.',
      },
      ai: {
        source: 'deterministic',
        provider: 'none',
        model: null,
      },
    });
  }

  // 6. Default standard transfer (e.g. $200 to Mom)
  return NextResponse.json({
    user_id: 'usr_student_ayu',
    input: text,
    parsed: { action: 'transfer', amount_usd: 200.0, payee: 'Mom' },
    response: {
      type: 'slip',
      plan_chips: ['Quote', 'Payee', 'Limits', 'Simulate', 'Execute'],
      status: 'COMPLETED',
      amount_usd: 200.0,
      payee_name: 'Mom',
      received_text: 'Received (IDR): Rp 3,176,000',
      tx_id: `tx_sandbox_${Date.now().toString(36)}`,
      remaining_balance_usd: 12250.0,
      stamp: 'SENT',
      checks: {
        privacy_filter: 'pass',
        spending_rules: 'pass',
        bank_token: 'pass',
      },
      note: 'Done. Arrives in about 2 minutes. Safety enforced outside LLM.',
    },
    ai: {
      source: 'deterministic',
      provider: 'none',
      model: null,
    },
  });
}
