import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
  secondaryColor?: string;
}

/**
 * Bespoke AegisPath Cyber-Shield
 * Multi-layered cryptographic shield with internal key kernel
 */
export const AegisShieldIcon: React.FC<IconProps> = ({
  size = 22,
  className = '',
  color = '#FFFFFF',
  secondaryColor = 'rgba(255, 255, 255, 0.45)',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="AegisPath Shield"
  >
    <path
      d="M12 2L4 5.5V11.5C4 16.5 7.4 21.1 12 22.5C16.6 21.1 20 16.5 20 11.5V5.5L12 2Z"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 6.5L6.5 9V11.8C6.5 15.2 8.8 18.3 12 19.3C15.2 18.3 17.5 15.2 17.5 11.8V9L12 6.5Z"
      fill={secondaryColor}
    />
    <circle cx="12" cy="12.5" r="2" fill={color} />
    <path d="M12 14.5V16.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/**
 * Bespoke Home Vault Icon
 * Digital treasury portal with secure archway
 */
export const HomeVaultIcon: React.FC<IconProps> = ({
  size = 18,
  className = '',
  color = 'currentColor',
  secondaryColor = 'rgba(61, 107, 234, 0.25)',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
  >
    <path
      d="M3 10.2L12 3L21 10.2V20C21 20.6 20.6 21 20 21H4C3.4 21 3 20.6 3 20V10.2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 21V12.5C9 11.7 9.7 11 10.5 11H13.5C14.3 11 15 11.7 15 12.5V21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="8" r="1.5" fill={color} />
  </svg>
);

/**
 * Bespoke Tuition & University Cap Icon
 * Mortarboard cap with academic scroll and degree tassel
 */
export const TuitionGradCapIcon: React.FC<IconProps> = ({
  size = 18,
  className = '',
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
  >
    {/* Cap Diamond */}
    <path
      d="M22 10L12 4.5L2 10L12 15.5L22 10Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Skull Cap Body */}
    <path
      d="M6 12.5V17C6 19.2 8.7 21 12 21C15.3 21 18 19.2 18 17V12.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Hanging Tassel */}
    <path
      d="M22 10V16.5C22 17.3 21.3 18 20.5 18C19.7 18 19 17.3 19 16.5V11.6"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle cx="20.5" cy="18" r="1.5" fill={color} />
  </svg>
);

/**
 * Bespoke Chop AI Companion Icon
 * Friendly agent robot head with antenna beacon and ocular sensor
 */
export const AskChopBotIcon: React.FC<IconProps> = ({
  size = 18,
  className = '',
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
  >
    {/* Antenna */}
    <path d="M12 2V5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="2.5" r="1.5" fill={color} />
    {/* Head Outline */}
    <rect
      x="3.5"
      y="5.5"
      width="17"
      height="14"
      rx="5"
      stroke={color}
      strokeWidth="2"
    />
    {/* Friendly Eyes */}
    <circle cx="8.5" cy="11.5" r="1.8" fill={color} />
    <circle cx="15.5" cy="11.5" r="1.8" fill={color} />
    {/* Smile line */}
    <path
      d="M9.5 15C10.2 15.8 11 16.2 12 16.2C13 16.2 13.8 15.8 14.5 15"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    {/* Ear bolts */}
    <path d="M2 11V14" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M22 11V14" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * Bespoke Evidence Proof Pack Icon
 * Cryptographic document with verified badge seal
 */
export const EvidenceDocIcon: React.FC<IconProps> = ({
  size = 18,
  className = '',
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
  >
    <path
      d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 2V8H20"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Document lines */}
    <line x1="8" y1="13" x2="16" y2="13" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <line x1="8" y1="17" x2="13" y2="17" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    {/* Shield Check Badge */}
    <circle cx="16" cy="17" r="3.5" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" />
    <path d="M14.8 17L15.6 17.8L17.2 16.2" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Bespoke Deterministic 3-Ring Safety Icon
 * Outer Privacy, Middle Rules, Inner Bank limit concentric rings
 */
export const SafetyRingsIcon: React.FC<IconProps> = ({
  size = 18,
  className = '',
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
  >
    {/* Outer Ring */}
    <circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="1.8" />
    {/* Middle Ring */}
    <circle cx="12" cy="12" r="6" stroke={color} strokeWidth="1.8" strokeDasharray="2.5 2" />
    {/* Inner Bank Kernel */}
    <circle cx="12" cy="12" r="2.8" fill={color} />
  </svg>
);

/**
 * Bespoke Buffer & Runway Planner Chart Icon
 * Dynamic timeline pillars with forward trajectory
 */
export const PlannerRunwayIcon: React.FC<IconProps> = ({
  size = 18,
  className = '',
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
  >
    {/* Pillar 1 */}
    <rect x="3" y="14" width="3.5" height="7" rx="1.5" fill={color} fillOpacity="0.35" stroke={color} strokeWidth="1.5" />
    {/* Pillar 2 */}
    <rect x="8.5" y="10" width="3.5" height="11" rx="1.5" fill={color} fillOpacity="0.5" stroke={color} strokeWidth="1.5" />
    {/* Pillar 3 */}
    <rect x="14" y="5" width="3.5" height="16" rx="1.5" fill={color} fillOpacity="0.8" stroke={color} strokeWidth="1.5" />
    {/* Pillar 4 (Future projection) */}
    <rect x="19.5" y="8" width="3.5" height="13" rx="1.5" fill={color} stroke={color} strokeWidth="1.5" />
    {/* Trend Line */}
    <path
      d="M4.5 12L10 8L15.5 3.5L21.5 6.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Bespoke P2P Send Remittance Icon
 * Instant cross-border transfer node
 */
export const SendRemitIcon: React.FC<IconProps> = ({
  size = 20,
  className = '',
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
  >
    <path
      d="M7 17L17 7M17 7H9M17 7V15"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="7" cy="17" r="2" fill={color} />
  </svg>
);

export const ArrowUpRightIcon = SendRemitIcon;


/**
 * Bespoke Whitelisted Payees Book Icon
 */
export const PayeesBookIcon: React.FC<IconProps> = ({
  size = 18,
  className = '',
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
  >
    <path
      d="M16 21V19C16 16.8 14.2 15 12 15H5C2.8 15 1 16.8 1 19V21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="8.5" cy="7" r="4" stroke={color} strokeWidth="2" />
    <path d="M19 8V14M22 11H16" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * Bespoke Live Rates Exchange Icon
 */
export const RatesExchangeIcon: React.FC<IconProps> = ({
  size = 18,
  className = '',
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
  >
    <circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="2" />
    <path
      d="M12 6.5V17.5M9.5 9H13.8C14.8 9 15.5 9.7 15.5 10.6C15.5 11.5 14.8 12.2 13.8 12.2H10.2C9.2 12.2 8.5 12.9 8.5 13.8C8.5 14.7 9.2 15.4 10.2 15.4H15"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Shield Check Icon (Verification badge)
 */
export const ShieldCheckIcon: React.FC<IconProps> = ({
  size = 18,
  className = '',
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
  >
    <path
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 12l2 2 4-4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Lock Keyhole Icon (Security & Privacy)
 */
export const LockKeyholeIcon: React.FC<IconProps> = ({
  size = 18,
  className = '',
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" stroke={color} strokeWidth="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="16" r="1.5" fill={color} />
  </svg>
);
