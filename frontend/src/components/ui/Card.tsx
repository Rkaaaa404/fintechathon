import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'night' | 'elevated' | 'tinted';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white border-[rgba(15,23,42,0.08)] text-[#14213D] shadow-[0_1px_2px_rgba(15,23,42,0.04)]',
    night: 'bg-[#0B1536] border-[#1E3A8A] text-white shadow-[0_1px_2px_rgba(0,0,0,0.12)]',
    elevated: 'bg-white border-[rgba(15,23,42,0.08)] text-[#14213D] shadow-[0_1px_2px_rgba(15,23,42,0.04)]',
    tinted: 'bg-[#F8FAFC] border-[rgba(15,23,42,0.08)] text-[#14213D]',
  }[variant];

  return (
    <div
      className={`rounded-[16px] border p-4 md:p-5 transition-all box-border flex flex-col ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`flex items-center justify-between gap-3 pb-3 mb-3 border-b border-[rgba(15,23,42,0.06)] w-full ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span';
}

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className = '',
  as: Component = 'h3',
  ...props
}) => {
  return (
    <Component
      className={`font-semibold text-[15px] leading-[22px] tracking-tight text-[#14213D] ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

interface CardBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'green' | 'blue' | 'amber' | 'red' | 'neutral';
  className?: string;
}

export const CardBadge: React.FC<CardBadgeProps> = ({
  children,
  variant = 'blue',
  className = '',
  ...props
}) => {
  const badgeStyles = {
    green: 'bg-[#EBF7EE] text-[#0E6E43] border-[#0E6E43]/20',
    blue: 'bg-[#EEF4FF] text-[#1C3EAA] border-[#3D6BEA]/20',
    amber: 'bg-[#FFFBEB] text-[#8A5200] border-[#D97706]/25',
    red: 'bg-[#FEF2F2] text-[#B91C1C] border-[#B91C1C]/25',
    neutral: 'bg-[#F1F5F9] text-[#64748B] border-[rgba(15,23,42,0.08)]',
  }[variant];

  return (
    <span
      className={`inline-flex items-center justify-center h-6 px-2.5 rounded-full border text-[12px] font-medium leading-none whitespace-nowrap shrink-0 ${badgeStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

// Re-export Badge alias as requested by design system tokens
export const Badge = CardBadge;

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex-1 w-full ${className}`} {...props}>
      {children}
    </div>
  );
};

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`mt-auto pt-3 border-t border-[rgba(15,23,42,0.06)] text-[13px] font-semibold flex items-center justify-between gap-3 w-full shrink-0 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
