export interface UserSeed {
  name: string;
  greetingTime: string;
  dailyAllowanceTotal: number;
  dailyAllowanceUsed: number;
  dailyAllowanceRemaining: number;
  perSendCap: number;
  totalBalance: number;
  currency: string;
}

export interface TuitionMode {
  id: string;
  labelEn: string;
  labelZh: string;
  baseAmount: number;
  rate: number;
  fee: number;
  buffer: number;
  total: number;
  etaEn: string;
  etaZh: string;
  isDefault?: boolean;
}

export interface TuitionSeed {
  dueAmountCny: number;
  payeeName: string;
  payeeNameZh: string;
  dueDate: string;
  dueDateZh: string;
  modes: {
    fastest: TuitionMode;
    cheapest: TuitionMode;
    balanced: TuitionMode;
  };
}

export interface ActivityItem {
  id: string;
  titleEn: string;
  titleZh: string;
  amount: string;
  receivedText?: string;
  type: 'success' | 'blocked' | 'pending';
  icon: string;
  timestamp: string;
  timestampZh: string;
}

export interface ApprovalPlan {
  id: string;
  step: number;
  reasonEn: string;
  reasonZh: string;
  requestedTextEn: string;
  understoodTextEn: string;
  understoodTextZh: string;
  sendAmount: number;
  receivesAmount: number;
  rate: number;
  ratePair: string;
  feeWithBuffer: number;
  etaTextEn: string;
  etaTextZh: string;
  intentHash: string;
  payee: string;
  payeeZh: string;
  youSend: string;
}

export interface EvidenceSource {
  titleEn: string;
  titleZh: string;
  provenanceEn: string;
  provenanceZh: string;
  tier: string;
}

export interface EvidencePack {
  avgBalance: string;
  incomeMonths: string;
  sources: EvidenceSource[];
}

export interface PlannerBarItem {
  month: string;
  committed: number;
  reserve: number;
  total: number;
  share: number;
  netFlow: string;
  runwayDays: string;
  status: string;
}

export interface PlannerScenario {
  labelEn: string;
  labelZh: string;
  points: number[];
  safeStatus: string;
  cagr1?: string;
  cagr2?: string;
  bars?: PlannerBarItem[];
}

export interface PlannerWarningOption {
  id?: string;
  labelEn: string;
  labelZh: string;
}

export interface PlannerSchedule {
  months: string[];
  scenarios: {
    on_time: PlannerScenario;
    delayed: PlannerScenario;
    optimized?: PlannerScenario;
  };
  warningOptions: PlannerWarningOption[];
}

export const SEED_DATA = {
  user: {
    name: "Ayu",
    greetingTime: "morning",
    dailyAllowanceTotal: 1000,
    dailyAllowanceUsed: 200,
    dailyAllowanceRemaining: 800,
    perSendCap: 500,
    totalBalance: 2450.00,
    currency: "USD",
  } as UserSeed,

  rates: {
    USD_CNY: 7.20,
    USD_IDR: 15880,
  },

  tuition: {
    dueAmountCny: 18000,
    payeeName: "Campus bursar",
    payeeNameZh: "学校财务处",
    dueDate: "Jan 15",
    dueDateZh: "1月15日截止",
    modes: {
      fastest: {
        id: "fastest",
        labelEn: "Fastest",
        labelZh: "最快",
        baseAmount: 2500.00,
        rate: 7.20,
        fee: 22.50,
        buffer: 20.00,
        total: 2542.50,
        etaEn: "~30 sec",
        etaZh: "约30秒"
      },
      cheapest: {
        id: "cheapest",
        labelEn: "Cheapest",
        labelZh: "最便宜",
        baseAmount: 2500.00,
        rate: 7.20,
        fee: 14.30,
        buffer: 20.00,
        total: 2534.30,
        etaEn: "~2 min",
        etaZh: "约2分钟",
        isDefault: true
      },
      balanced: {
        id: "balanced",
        labelEn: "Balanced",
        labelZh: "均衡",
        baseAmount: 2500.00,
        rate: 7.20,
        fee: 18.00,
        buffer: 20.00,
        total: 2538.00,
        etaEn: "~1 min",
        etaZh: "约1分钟"
      }
    }
  } as TuitionSeed,

  currentApprovalPlan: {
    id: "plan-tuition-001",
    step: 3,
    reasonEn: "Tuition payment exceeds autonomous $500 limit.",
    reasonZh: "学费金额超过自主汇款 $500 限额，需通行密钥确认。",
    requestedTextEn: "Pay tuition ¥18,000 to Campus bursar",
    understoodTextEn: "Send $2,534.30 USD to Campus bursar (guaranteed full ¥18,000 CNY arrival)",
    understoodTextZh: "向学校财务处汇款 $2,534.30 美元 (保障 ¥18,000 人民币足额到账)",
    sendAmount: 2534.30,
    receivesAmount: 18000,
    rate: 7.20,
    ratePair: "USD/CNY",
    feeWithBuffer: 34.30,
    etaTextEn: "~2 min arrival",
    etaTextZh: "约2分钟到账",
    intentHash: "0x9f2a77c1e40b8a3d",
    payee: "Campus bursar (¥18,000)",
    payeeZh: "学校财务处 (¥18,000)",
    youSend: "$2,534.30 USD"
  } as ApprovalPlan,

  evidencePack: {
    avgBalance: "$1,820",
    incomeMonths: "6/6 mos",
    sources: [
      {
        titleEn: "Bank statement (Shenzhen)",
        titleZh: "深圳招商银行流水",
        provenanceEn: "Verified API",
        provenanceZh: "官方API直连",
        tier: "Tier 1"
      },
      {
        titleEn: "Tuition invoice",
        titleZh: "大学录取及学费单",
        provenanceEn: "Signed PDF",
        provenanceZh: "加密PDF解析",
        tier: "Tier 2"
      },
      {
        titleEn: "Guardian consent",
        titleZh: "监护人联合确认",
        provenanceEn: "Passkey signature",
        provenanceZh: "通行密钥签名",
        tier: "Tier 1"
      }
    ]
  } as EvidencePack,

  plannerSchedule: {
    months: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    scenarios: {
      on_time: {
        labelEn: "On-time 按时",
        labelZh: "学费按时缴付 (1月15日)",
        points: [2450, 2700, 2900, 1365, 1700, 2100],
        safeStatus: "healthy",
        cagr1: "Q4 Trajectory: -6% MoM Burn | Steady Reserve",
        cagr2: "Jan-Mar Recovery: +28% MoM Post-Tuition Rebound",
        bars: [
          { month: "Oct", committed: 1.8, reserve: 3.0, total: 4.8, share: 38, netFlow: "+$450", runwayDays: "180d", status: "Healthy" },
          { month: "Nov", committed: 1.7, reserve: 2.7, total: 4.4, share: 39, netFlow: "-$120", runwayDays: "165d", status: "Healthy" },
          { month: "Dec", committed: 1.9, reserve: 2.3, total: 4.2, share: 45, netFlow: "-$200", runwayDays: "145d", status: "Healthy" },
          { month: "Jan", committed: 3.2, reserve: 1.1, total: 4.3, share: 74, netFlow: "-$1,234", runwayDays: "95d", status: "Tuition Due" },
          { month: "Feb", committed: 1.6, reserve: 2.1, total: 3.7, share: 43, netFlow: "+$600", runwayDays: "120d", status: "Healthy" },
          { month: "Mar", committed: 1.5, reserve: 2.6, total: 4.1, share: 37, netFlow: "+$850", runwayDays: "150d", status: "Healthy" }
        ]
      },
      delayed: {
        labelEn: "Delayed (+30d) 延后",
        labelZh: "学费延后到账 (+30天)",
        points: [2450, 2700, 2500, 950, 1200, 1600],
        safeStatus: "warning",
        cagr1: "Q4 Baseline: -8% MoM Run Rate",
        cagr2: "Jan Critical Shock: -68% Drawdown (< $1k Safe Min)",
        bars: [
          { month: "Oct", committed: 1.8, reserve: 3.0, total: 4.8, share: 38, netFlow: "+$450", runwayDays: "180d", status: "Healthy" },
          { month: "Nov", committed: 1.7, reserve: 2.7, total: 4.4, share: 39, netFlow: "-$120", runwayDays: "165d", status: "Healthy" },
          { month: "Dec", committed: 1.9, reserve: 2.0, total: 3.9, share: 49, netFlow: "-$350", runwayDays: "125d", status: "Healthy" },
          { month: "Jan", committed: 3.2, reserve: 0.3, total: 3.5, share: 91, netFlow: "-$2,534", runwayDays: "28d", status: "Critical Dip" },
          { month: "Feb", committed: 1.6, reserve: 1.2, total: 2.8, share: 57, netFlow: "+$900", runwayDays: "75d", status: "Rebound" },
          { month: "Mar", committed: 1.5, reserve: 2.2, total: 3.7, share: 41, netFlow: "+$1,400", runwayDays: "130d", status: "Healthy" }
        ]
      },
      optimized: {
        labelEn: "AI-Optimized 智能分期",
        labelZh: "AI 智能分期优化方案",
        points: [2450, 2700, 2900, 1950, 2100, 2400],
        safeStatus: "healthy",
        cagr1: "Q4 Optimization: -4% Pacing Smooth",
        cagr2: "Jan-Mar Horizon: Buffer Kept > $1.8k at All Times",
        bars: [
          { month: "Oct", committed: 1.8, reserve: 3.0, total: 4.8, share: 38, netFlow: "+$450", runwayDays: "180d", status: "Optimal" },
          { month: "Nov", committed: 1.7, reserve: 2.7, total: 4.4, share: 39, netFlow: "-$120", runwayDays: "165d", status: "Optimal" },
          { month: "Dec", committed: 1.8, reserve: 2.4, total: 4.2, share: 43, netFlow: "-$150", runwayDays: "150d", status: "Optimal" },
          { month: "Jan", committed: 2.1, reserve: 1.9, total: 4.0, share: 53, netFlow: "-$650", runwayDays: "110d", status: "Optimal" },
          { month: "Feb", committed: 2.0, reserve: 2.1, total: 4.1, share: 49, netFlow: "+$400", runwayDays: "125d", status: "Optimal" },
          { month: "Mar", committed: 1.5, reserve: 2.8, total: 4.3, share: 35, netFlow: "+$950", runwayDays: "160d", status: "Optimal" }
        ]
      }
    },
    warningOptions: [
      {
        id: "opt_split",
        labelEn: "Apply AI Multi-Tranche Split (50% Jan / 50% Feb)",
        labelZh: "应用 AI 智能双期分期付款 (1月50% / 2月50%)"
      },
      {
        id: "opt_lock",
        labelEn: "Lock FX forward buffer @ 7.1022 CNY/USD",
        labelZh: "锁定远期汇率缓冲 @ 7.1022 人民币/美元"
      },
      {
        id: "opt_advance",
        labelEn: "Request family emergency reserve advance ($500)",
        labelZh: "申请家庭应急备用金额度 ($500)"
      }
    ]
  } as PlannerSchedule,

  recentActivities: [
    {
      id: "act-1",
      titleEn: "Sent to Mom",
      titleZh: "汇给妈妈",
      amount: "-$200.00",
      receivedText: "Rp 3,176,000",
      type: "success",
      icon: "check",
      timestamp: "14m ago",
      timestampZh: "14分钟前"
    },
    {
      id: "act-2",
      titleEn: "Attack blocked (Invoice injection)",
      titleZh: "已拦截攻击 (发票恶意注入)",
      amount: "$0 lost",
      type: "blocked",
      icon: "shield-alert",
      timestamp: "1h ago",
      timestampZh: "1小时前"
    }
  ] as ActivityItem[]
};

export interface PayeeItem {
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

export interface UserProfileContext {
  name?: string;
  email?: string;
  university?: string;
  avatarLetter?: string;
  provider?: 'google' | 'aegispath' | 'guest';
  isAuthenticated?: boolean;
}

export function getAppDataForUser(authUser?: UserProfileContext | null) {
  const isGoogle = authUser?.provider === 'google' && authUser?.isAuthenticated;

  if (isGoogle) {
    const realName = authUser.name || 'Google User';
    const realEmail = authUser.email || 'user@gmail.com';
    const realUni = authUser.university || 'Verified Campus';

    const user: UserSeed = {
      name: realName,
      greetingTime: 'morning',
      dailyAllowanceTotal: 2500,
      dailyAllowanceUsed: 0,
      dailyAllowanceRemaining: 2500,
      perSendCap: 1000,
      totalBalance: 12500.00,
      currency: 'USD',
    };

    const tuition: TuitionSeed = {
      dueAmountCny: 18000,
      payeeName: `${realUni} Student Bursar`,
      payeeNameZh: `${realUni} 财务处`,
      dueDate: 'Feb 15',
      dueDateZh: '2月15日截止',
      modes: SEED_DATA.tuition.modes,
    };

    const recentActivities: ActivityItem[] = [
      {
        id: 'real-act-1',
        titleEn: 'Google Identity Security Link',
        titleZh: 'Google 真实账号安全绑定',
        amount: 'Verified',
        receivedText: realEmail,
        type: 'success',
        icon: 'check',
        timestamp: 'Just now',
        timestampZh: '刚刚',
      },
      {
        id: 'real-act-2',
        titleEn: 'FIDO2 Passkey Hardware Active',
        titleZh: '硬件通行密钥防御已激活',
        amount: 'Active',
        receivedText: 'Secure Enclave',
        type: 'success',
        icon: 'check',
        timestamp: 'Just now',
        timestampZh: '刚刚',
      },
      {
        id: 'real-act-3',
        titleEn: 'USD Live Vault Primary Genesis',
        titleZh: '美元实名主账户建立',
        amount: '+$12,500.00',
        receivedText: 'Live Balance Active',
        type: 'success',
        icon: 'check',
        timestamp: 'Today',
        timestampZh: '今天',
      },
    ];

    const evidencePack: EvidencePack = {
      avgBalance: '$12,500',
      incomeMonths: 'Verified Live',
      sources: [
        {
          titleEn: `Google Certified Account (${realEmail})`,
          titleZh: `Google 官方认证账户 (${realEmail})`,
          provenanceEn: 'OAuth 2.0 Security Binding',
          provenanceZh: 'Google 身份凭证直连',
          tier: 'Tier 1',
        },
        {
          titleEn: 'Direct Bank Settlement (Primary USD)',
          titleZh: '主结算行实时资金流水',
          provenanceEn: 'Live Bank Network API',
          provenanceZh: '银行网络直连核验',
          tier: 'Tier 1',
        },
        {
          titleEn: `Cryptographic Passkey (${realName})`,
          titleZh: `实名硬件通行密钥凭证 (${realName})`,
          provenanceEn: 'Passkey Signed Attestation',
          provenanceZh: '硬件签名防伪凭证',
          tier: 'Tier 1',
        },
      ],
    };

    const payees: PayeeItem[] = [
      {
        id: 'payee-real-1',
        nameEn: `${realName} (Primary Bank Wire)`,
        nameZh: `${realName} (主银行电汇账户)`,
        category: 'campus',
        categoryLabelEn: 'Personal Primary',
        categoryLabelZh: '个人主账户',
        accountDescEn: `FedWire / ACH Direct Wire (${realEmail})`,
        accountDescZh: `FedWire / ACH 直连账户 (${realEmail})`,
        limitDescEn: '$2,500 / day personal limit',
        limitDescZh: '每日限额 $2,500',
        tier: 'Tier 1',
        verifiedDate: 'Active Live',
        status: 'active',
      },
      {
        id: 'payee-real-2',
        nameEn: `${realUni} Student Bursar`,
        nameZh: `${realUni} 学生财务处`,
        category: 'campus',
        categoryLabelEn: 'Higher Education',
        categoryLabelZh: '高等教育',
        accountDescEn: 'Cross-Border Tuition Clearing Wire',
        accountDescZh: '跨境学费清算账户',
        limitDescEn: '$10,000 tuition cap with passkey',
        limitDescZh: '凭通行密钥限额 $10,000',
        tier: 'Tier 1',
        verifiedDate: 'Active Live',
        status: 'active',
      },
      {
        id: 'payee-real-3',
        nameEn: 'Authorized Family Beneficiary',
        nameZh: '授权家庭成员收款人',
        category: 'family',
        categoryLabelEn: 'Family Allowance',
        categoryLabelZh: '家庭生活费',
        accountDescEn: 'Global Remittance Network Wire',
        accountDescZh: '全球汇款网络直连',
        limitDescEn: '$500 / day autonomous transfer',
        limitDescZh: '自主汇款上限 $500/日',
        tier: 'Tier 1',
        verifiedDate: 'Active Live',
        status: 'active',
      },
    ];

    return {
      user,
      tuition,
      recentActivities,
      evidencePack,
      payees,
      isRealAccount: true,
      accountBadgeEn: 'Google Verified · Live Real Account',
      accountBadgeZh: 'Google 实名认证 · 真实账户',
    };
  }

  // Guest / Demo Synthetic Mode (Default)
  const defaultPayees: PayeeItem[] = [
    {
      id: 'payee-1',
      nameEn: 'Campus Bursar (HKUST Tuition & Fees)',
      nameZh: '学校财务处 (香港科技大学学费及杂费)',
      category: 'campus',
      categoryLabelEn: 'Higher Education',
      categoryLabelZh: '高等教育',
      accountDescEn: 'BOC (Hong Kong) •••• 8820',
      accountDescZh: '中银香港 •••• 8820',
      limitDescEn: 'Up to $10,000/term with Passkey',
      limitDescZh: '学期上限 $10,000 (需通行密钥)',
      tier: 'Tier 1',
      verifiedDate: 'Sep 2026',
      status: 'active',
    },
    {
      id: 'payee-2',
      nameEn: 'Rina Sutanto (Mom - Family Allowance)',
      nameZh: 'Rina Sutanto (妈妈 - 生活费汇款)',
      category: 'family',
      categoryLabelEn: 'Family Allowance',
      categoryLabelZh: '家庭生活费',
      accountDescEn: 'Bank Central Asia (BCA) •••• 4192',
      accountDescZh: 'BCA 银行 •••• 4192',
      limitDescEn: '$500/day autonomous transfer',
      limitDescZh: '每日 $500 自主即时汇款',
      tier: 'Tier 1',
      verifiedDate: 'Aug 2026',
      status: 'active',
    },
    {
      id: 'payee-3',
      nameEn: 'Mr. Chan (Kowloon Landlord - Rent)',
      nameZh: '陈先生 (九龙房东 - 房租)',
      category: 'housing',
      categoryLabelEn: 'Housing & Rent',
      categoryLabelZh: '租房与租金',
      accountDescEn: 'Hang Seng Bank •••• 1039',
      accountDescZh: '恒生银行 •••• 1039',
      limitDescEn: '$1,200/month recurring allowance',
      limitDescZh: '每月 $1,200 周期房租限额',
      tier: 'Tier 2',
      verifiedDate: 'Pending co-sign',
      status: 'cooling',
    },
  ];

  return {
    user: SEED_DATA.user,
    tuition: SEED_DATA.tuition,
    recentActivities: SEED_DATA.recentActivities,
    evidencePack: SEED_DATA.evidencePack,
    payees: defaultPayees,
    isRealAccount: false,
    accountBadgeEn: 'Guest Demo Mode · Synthetic Testnet Data',
    accountBadgeZh: '访客演示模式 · 合成测试数据',
  };
}
