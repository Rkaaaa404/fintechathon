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

export interface PlannerScenario {
  labelEn: string;
  labelZh: string;
  points: number[];
  safeStatus: string;
}

export interface PlannerWarningOption {
  labelEn: string;
  labelZh: string;
}

export interface PlannerSchedule {
  months: string[];
  scenarios: {
    on_time: PlannerScenario;
    delayed: PlannerScenario;
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
        labelEn: "Tuition paid on-time (Jan 15)",
        labelZh: "学费按时缴付 (1月15日)",
        points: [2450, 2700, 2900, 1365, 1700, 2100],
        safeStatus: "healthy"
      },
      delayed: {
        labelEn: "Tuition delayed (+30 days)",
        labelZh: "学费延后缴付 (+30天)",
        points: [2450, 2700, 2500, 950, 1200, 1600],
        safeStatus: "warning"
      }
    },
    warningOptions: [
      {
        labelEn: "Lock FX now (prevent RMB surge)",
        labelZh: "立即锁定汇率 (防人民币升值)"
      },
      {
        labelEn: "Request 14-day tuition grace buffer",
        labelZh: "向学校申请14天学费宽限期"
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
