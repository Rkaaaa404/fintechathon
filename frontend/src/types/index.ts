export type AppPresentationState =
  | 'default'
  | 'waiting-approval'
  | 'payment-sent'
  | 'attack-blocked'
  | 'agent-paused'
  | 'model-offline'
  | 'empty-activity';

export type ViewMode = 'web' | 'app';

export type AppRoute =
  | '/'
  | '/tuition'
  | '/chat'
  | '/approve'
  | '/evidence'
  | '/evidence-packs'
  | '/safety'
  | '/safety-rules'
  | '/safety-logs'
  | '/planner'
  | '/payees'
  | '/rates'
  | '/login';

export type Locale = 'en' | 'zh';

export type ChopExpression = 'idle' | 'wave' | 'guard' | 'block' | 'paused' | 'inspect' | 'detective';
