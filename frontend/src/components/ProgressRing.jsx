// ─────────────────────────────────────────────
//  ProgressRing — Animated SVG circular gauge
//  Props: percentage (0–100), size, stroke
// ─────────────────────────────────────────────
import { useEffect, useState } from 'react';

const getColor = (pct) => {
  if (pct >= 75) return { stroke: '#10b981', glow: 'rgba(16,185,129,0.3)' }; // emerald
  if (pct >= 50) return { stroke: '#f59e0b', glow: 'rgba(245,158,11,0.3)' }; // amber
  return           { stroke: '#ef4444', glow: 'rgba(239,68,68,0.3)' };        // red
};

export default function ProgressRing({ percentage = 0, size = 180, stroke = 14 }) {
  const [animatedPct, setAnimatedPct] = useState(0);
  const radius       = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset       = circumference - (animatedPct / 100) * circumference;
  const { stroke: strokeColor, glow } = getColor(percentage);

  // Animate from 0 to percentage
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedPct(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke}
        />
        {/* Progress */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)',
            filter: `drop-shadow(0 0 8px ${glow})`,
          }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute flex flex-col items-center">
        <span className="font-heading font-bold text-white" style={{ fontSize: size * 0.2 }}>
          {percentage}%
        </span>
        <span className="text-slate-400" style={{ fontSize: size * 0.08 }}>Attendance</span>
      </div>
    </div>
  );
}
