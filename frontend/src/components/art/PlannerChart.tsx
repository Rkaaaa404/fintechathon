'use client';

import React from 'react';
import { SEED_DATA } from '@/lib/mockData';

interface PlannerChartProps {
  scenarioKey?: 'on_time' | 'delayed';
}

export const PlannerChart: React.FC<PlannerChartProps> = ({
  scenarioKey = 'on_time',
}) => {
  const schedule = SEED_DATA.plannerSchedule;
  const isDelayed = scenarioKey === 'delayed';
  const scenario = schedule.scenarios[scenarioKey] || schedule.scenarios.on_time;
  const months = schedule.months;

  const width = 330;
  const height = 180;
  const padLeft = 40;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 30;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const maxVal = 3500;
  const minVal = 0;

  const getY = (val: number) =>
    padTop + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
  const getX = (idx: number) =>
    padLeft + (idx / (months.length - 1)) * chartW;

  const safeY = getY(1000);
  const janX = getX(3);

  // Path generation
  let pathD = '';
  scenario.points.forEach((pt: number, i: number) => {
    const x = getX(i);
    const y = getY(pt);
    pathD += i === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Runway cashflow chart"
    >
      {/* Grid lines */}
      <line
        x1={padLeft}
        y1={getY(3000)}
        x2={width - padRight}
        y2={getY(3000)}
        stroke="#E6ECF8"
        strokeWidth="1"
      />
      <text
        x={padLeft - 6}
        y={getY(3000) + 4}
        textAnchor="end"
        fontSize="9"
        fill="#5B6B8C"
        fontFamily="'IBM Plex Sans', sans-serif"
      >
        $3k
      </text>

      <line
        x1={padLeft}
        y1={getY(2000)}
        x2={width - padRight}
        y2={getY(2000)}
        stroke="#E6ECF8"
        strokeWidth="1"
      />
      <text
        x={padLeft - 6}
        y={getY(2000) + 4}
        textAnchor="end"
        fontSize="9"
        fill="#5B6B8C"
        fontFamily="'IBM Plex Sans', sans-serif"
      >
        $2k
      </text>

      {/* Safe minimum line ($1,000) dashed amber */}
      <line
        x1={padLeft}
        y1={safeY}
        x2={width - padRight}
        y2={safeY}
        stroke="#F5A524"
        strokeWidth="1.6"
        strokeDasharray="4 3"
      />
      <text
        x={padLeft - 6}
        y={safeY + 4}
        textAnchor="end"
        fontSize="9"
        fill="#F5A524"
        fontWeight="700"
        fontFamily="'IBM Plex Sans', sans-serif"
      >
        $1k
      </text>
      <text
        x={width - padRight}
        y={safeY - 4}
        textAnchor="end"
        fontSize="8.5"
        fill="#B7791F"
        fontWeight="600"
      >
        Safe min 安全线
      </text>

      {/* Tuition vertical marker at Jan */}
      <line
        x1={janX}
        y1={padTop}
        x2={janX}
        y2={height - padBottom}
        stroke="#3D6BEA"
        strokeWidth="1.2"
        strokeDasharray="2 2"
        opacity="0.6"
      />
      <rect
        x={janX - 28}
        y={padTop - 8}
        width={56}
        height={15}
        rx={3}
        fill="#3D6BEA"
        opacity="0.9"
      />
      <text
        x={janX}
        y={padTop + 3}
        textAnchor="middle"
        fontSize="7.5"
        fill="#FFFFFF"
        fontWeight="700"
      >
        Tuition Jan 15
      </text>

      {/* Month labels on X axis */}
      {months.map((m: string, i: number) => (
        <text
          key={m}
          x={getX(i)}
          y={height - 10}
          textAnchor="middle"
          fontSize="10"
          fontWeight={i === 3 ? '700' : '500'}
          fill={i === 3 ? '#3D6BEA' : '#5B6B8C'}
          fontFamily="'IBM Plex Sans', sans-serif"
        >
          {m}
        </text>
      ))}

      {/* Main Path */}
      <path
        d={pathD}
        stroke={isDelayed ? '#E5484D' : '#3D6BEA'}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Data Dots */}
      {scenario.points.map((pt: number, i: number) => {
        const x = getX(i);
        const y = getY(pt);
        const isDip = pt < 1000;
        return (
          <g key={i}>
            <circle
              cx={x.toFixed(1)}
              cy={y.toFixed(1)}
              r={isDip ? 5 : 3.5}
              fill={isDip ? '#E5484D' : '#3D6BEA'}
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
            {isDip && (
              <text
                x={x.toFixed(1)}
                y={(y - 8).toFixed(1)}
                textAnchor="middle"
                fontSize="9"
                fontWeight="700"
                fill="#E5484D"
              >
                ${pt}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};
