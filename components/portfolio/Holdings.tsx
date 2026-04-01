// components/portfolio/Holdings.tsx — Holdings list with live P&L bars
'use client';

import { motion } from 'framer-motion';
import { usePriceStore } from '@/store/usePriceStore';
import { formatINR, formatCrypto, getCoinColor } from '@/lib/utils';
import { ChangePill, CoinLogo, Skeleton } from '@/components/ui';
import type { Holding } from '@/types';

export function HoldingsList({ holdings, loading }: { holdings: Holding[]; loading?: boolean }) {
  const prices = usePriceStore((s) => s.prices);
  const total = holdings.reduce((s, h) => s + h.currentValue, 0);

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-1.5 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!holdings.length) {
    return (
      <div className="py-10 text-center text-[#5C6882] text-sm">
        <div className="text-3xl mb-2">📦</div>
        No holdings yet. Start trading to build your portfolio!
      </div>
    );
  }

  return (
    <div className="divide-y divide-[#2A3348]/50">
      {holdings.map((h, i) => {
        const livePrice  = prices[h.symbol]?.price ?? h.currentPrice;
        const liveValue  = h.quantity * livePrice;
        const pct        = total > 0 ? (liveValue / total) * 100 : 0;
        const color      = getCoinColor(h.symbol);
        const pnl        = liveValue - h.totalInvested;
        const pnlPct     = h.totalInvested > 0 ? (pnl / h.totalInvested) * 100 : 0;

        return (
          <motion.div
            key={h.symbol}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="px-4 py-3"
          >
            <div className="flex items-center gap-3 mb-2">
              <CoinLogo symbol={h.symbol} color={color} size={32} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{h.symbol}</span>
                  <span className="text-sm font-mono font-semibold">{formatINR(liveValue)}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs text-[#5C6882]">
                    {formatCrypto(h.quantity, h.symbol)} {h.symbol}
                  </span>
                  <ChangePill value={pnlPct} />
                </div>
              </div>
            </div>

            <div className="h-1 bg-[#161A22] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, delay: i * 0.05 }}
                className="h-full rounded-full"
                style={{ background: color }}
              />
            </div>

            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-[#5C6882]">Avg. {formatINR(h.avgBuyPrice)}</span>
              <span className="text-[10px] text-[#5C6882]">{pct.toFixed(1)}% of portfolio</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
