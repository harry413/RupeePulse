'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { StatCard } from '@/components/ui/StatCard';
import { PortfolioDonut } from '@/components/portfolio/PortfolioDonut';
import { PerformanceChart } from '@/components/portfolio/PerformanceChart';
import { usePriceStore } from '@/store/usePriceStore';
import { INITIAL_PRICES } from '@/hooks/usePriceFeed';
import { getCoinColor, formatINR, cn } from '@/lib/utils';

const HOLDINGS = [
  { symbol:'BTC', name:'Bitcoin',   quantity:0.12, avgBuyPrice:7800000, totalInvested:936000,  currentValue:1025076, pnlPct:9.5  },
  { symbol:'ETH', name:'Ethereum',  quantity:2.5,  avgBuyPrice:290000,  totalInvested:725000,  currentValue:785500,  pnlPct:8.4  },
  { symbol:'SOL', name:'Solana',    quantity:12,   avgBuyPrice:16000,   totalInvested:192000,  currentValue:220800,  pnlPct:15.0 },
  { symbol:'BNB', name:'BNB',       quantity:3,    avgBuyPrice:55000,   totalInvested:165000,  currentValue:156300,  pnlPct:-5.3 },
  { symbol:'XRP', name:'XRP',       quantity:500,  avgBuyPrice:1050,    totalInvested:525000,  currentValue:490000,  pnlPct:-6.7 },
  { symbol:'ADA', name:'Cardano',   quantity:800,  avgBuyPrice:78,      totalInvested:62400,   currentValue:65600,   pnlPct:5.1  },
  { symbol:'AVAX',name:'Avalanche', quantity:10,   avgBuyPrice:4100,    totalInvested:41000,   currentValue:38000,   pnlPct:-7.3 },
  { symbol:'DOGE',name:'Dogecoin',  quantity:5000, avgBuyPrice:22,      totalInvested:110000,  currentValue:130000,  pnlPct:18.2 },
];

const TOTAL = 842350;
const INR_BALANCE = 124800;

export default function PortfolioPage() {
  const prices = usePriceStore((s) => s.prices);
  const [sortBy, setSortBy] = useState<'value'|'pnl'>('value');

  const sorted = [...HOLDINGS].sort((a,b) => sortBy === 'value' ? b.currentValue - a.currentValue : b.pnlPct - a.pnlPct);

  return (
    <div className="space-y-4 page-enter">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Value"   value={formatINR(TOTAL)}         change="3.24% today" changeUp  icon="💎" accent="green" />
        <StatCard label="Total P&L"     value="+₹92,430"                  change="14.78% ROI"  changeUp  icon="📈" accent="green" />
        <StatCard label="Invested"      value={formatINR(717550)}         change="Cost basis"           icon="💵" accent="blue"  />
        <StatCard label="Cash Balance"  value={formatINR(INR_BALANCE)}    change="Available"            icon="💰" accent="gold"  />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Holdings table */}
        <div className="xl:col-span-2 bg-[#1E2433] border border-[#2A3348] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A3348]">
            <span className="font-semibold text-sm">Holdings</span>
            <div className="flex gap-1">
              {(['value','pnl'] as const).map((s) => (
                <button key={s} onClick={() => setSortBy(s)}
                  className={cn('px-3 py-1 rounded-lg text-xs capitalize transition-all',
                    sortBy === s ? 'bg-[#252D3D] text-[#E8EBF2]' : 'text-[#5C6882] hover:text-[#9BA5BF]')}>
                  Sort by {s === 'pnl' ? 'P&L' : 'Value'}
                </button>
              ))}
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A3348]">
                {['Asset','Holdings','Avg Buy','Current','Value','P&L'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold text-[#5C6882] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((h) => {
                const curPrice = prices[h.symbol]?.price ?? INITIAL_PRICES[h.symbol] ?? h.avgBuyPrice;
                const curVal = h.quantity * curPrice;
                const pnl = curVal - h.totalInvested;
                const pnlPct = (pnl / h.totalInvested) * 100;
                return (
                  <motion.tr key={h.symbol} whileHover={{ backgroundColor:'rgba(37,45,61,0.5)' }}
                    className="border-b border-[#2A3348]/50 last:border-0 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: getCoinColor(h.symbol)+'22', color: getCoinColor(h.symbol) }}>
                          {h.symbol.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold">{h.symbol}</p>
                          <p className="text-[11px] text-[#5C6882]">{h.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono">{h.quantity} {h.symbol}</td>
                    <td className="px-4 py-3 text-xs font-mono text-[#9BA5BF]">{formatINR(h.avgBuyPrice)}</td>
                    <td className="px-4 py-3 text-xs font-mono">{formatINR(curPrice)}</td>
                    <td className="px-4 py-3 text-xs font-mono font-semibold">{formatINR(curVal)}</td>
                    <td className="px-4 py-3">
                      <div className={cn('text-xs font-mono font-semibold', pnl >= 0 ? 'text-[#00D4A0]' : 'text-[#FF4757]')}>
                        {pnl >= 0 ? '+' : ''}{formatINR(pnl)}
                      </div>
                      <div className={cn('text-[11px]', pnl >= 0 ? 'text-[#00D4A0]' : 'text-[#FF4757]')}>
                        {pnl >= 0 ? '▲' : '▼'} {Math.abs(pnlPct).toFixed(2)}%
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="space-y-4">
          <div className="bg-[#1E2433] border border-[#2A3348] rounded-xl p-4">
            <p className="font-semibold text-sm mb-3">Allocation</p>
            <PortfolioDonut holdings={HOLDINGS} totalValue={TOTAL} />
          </div>
          <div className="bg-[#1E2433] border border-[#2A3348] rounded-xl p-4">
            <p className="font-semibold text-sm mb-3">12-Month Performance</p>
            <PerformanceChart totalValue={TOTAL} />
          </div>
        </div>
      </div>
    </div>
  );
}
