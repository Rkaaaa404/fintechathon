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
