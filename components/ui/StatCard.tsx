// components/ui/StatCard.tsx — Metric summary card

'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  changeUp?: boolean;
  icon?: string;
  accent?: 'green' | 'blue' | 'red' | 'gold' | 'purple';
  className?: string;
}

const ACCENTS = {
  green:  { glow: '#00D4A0', border: 'rgba(0,212,160,0.15)'  },
  blue:   { glow: '#4F8EF7', border: 'rgba(79,142,247,0.15)' },
  red:    { glow: '#FF4757', border: 'rgba(255,71,87,0.15)'  },
  gold:   { glow: '#F5A623', border: 'rgba(245,166,35,0.15)' },
  purple: { glow: '#A78BFA', border: 'rgba(167,139,250,0.15)'},
};

export function StatCard({ label, value, change, changeUp, icon, accent = 'blue', className }: StatCardProps) {
  const colors = ACCENTS[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={cn(
        'relative bg-[#1E2433] rounded-xl p-4 border overflow-hidden cursor-default',
        className
      )}
      style={{ borderColor: colors.border }}
    >
      {/* Glow blob */}
      <div
        className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-10 translate-x-4 -translate-y-4 blur-xl"
        style={{ background: colors.glow }}
      />

      {/* Icon */}
      {icon && (
        <span className="absolute top-3 right-4 text-xl opacity-40">{icon}</span>
      )}

      {/* Content */}
      <p className="text-[11px] font-semibold text-[#5C6882] uppercase tracking-wider mb-1.5">
        {label}
      </p>
      <p className="text-xl font-bold font-mono tracking-tight text-[#E8EBF2] mb-1">
        {value}
      </p>
      {change && (
        <p className={cn('text-xs flex items-center gap-1 font-medium', changeUp ? 'text-[#00D4A0]' : 'text-[#FF4757]')}>
          {changeUp ? '▲' : '▼'} {change}
        </p>
      )}
    </motion.div>
  );
}
