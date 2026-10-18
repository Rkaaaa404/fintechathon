'use client';

import React from 'react';

interface RubberStampProps {
  type?: 'SENT' | 'BLOCKED';
  textEn?: string;
  textZh?: string;
  rotated?: boolean;
}

export const RubberStamp: React.FC<RubberStampProps> = ({
  type = 'SENT',
  textEn = 'SENT',
  textZh = '已汇出',
  rotated = true,
}) => {
  const isSent = type === 'SENT';
  const borderClass = isSent ? 'stamp-sent' : 'stamp-blocked';

  return (
    <div className={`rubber-stamp ${borderClass} ${rotated ? 'rotated' : ''}`} role="status">
      <span className="stamp-en">{textEn}</span>
      <span className="stamp-zh">{textZh}</span>
    </div>
  );
};
