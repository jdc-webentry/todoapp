"use client";

import { motion } from "framer-motion";

type Props = {
  total: number;
  completed: number;
};

const SIZE = 72;
const STROKE = 7;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ProgressChart({ total, completed }: Props) {
  const ratio = total === 0 ? 0 : completed / total;
  const percent = Math.round(ratio * 100);

  return (
    <div className="flex items-center gap-3">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="-rotate-90">
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--border)"
            strokeWidth={STROKE}
          />
          <motion.circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={false}
            animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - ratio) }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-accent-strong">
          {percent}%
        </div>
      </div>
      <div className="text-sm text-muted">
        <p className="font-medium text-foreground">完了率</p>
        <p>
          {completed} / {total} 件完了
        </p>
      </div>
    </div>
  );
}
