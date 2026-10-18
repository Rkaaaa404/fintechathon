'use client';

import React from 'react';

interface FiveSegmentBarProps {
  filledCount?: number;
  total?: number;
}

export const FiveSegmentBar: React.FC<FiveSegmentBarProps> = ({
  filledCount = 4,
  total = 5,
}) => {
  return (
    <div
      className="five-segment-bar"
      role="progressbar"
      aria-valuenow={filledCount}
      aria-valuemax={total}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`buffer-segment ${i < filledCount ? 'filled' : 'empty'}`}
        />
      ))}
    </div>
  );
};
