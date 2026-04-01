'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { CandleChart } from '@/components/charts/CandleChart';
import { TradePanel } from '@/components/trading/TradePanel';
import { CoinRow } from '@/components/ui/CoinRow';
import { PortfolioDonut } from '@/components/portfolio/PortfolioDonut';
import { usePriceStore } from '@/store/usePriceStore';
import { INITIAL_PRICES } from '@/hooks/usePriceFeed';
import { getCoinColor, formatINR, formatPct, cn } from '@/lib/utils';

const COINS = [
  { symbol:'BTC', name:'Bitcoin',    change24h:2.34,  vol:280000000, mcap:16700000000 },
  { symbol:'ETH', name:'Ethereum',   change24h:1.87,  vol:120000000, mcap:3800000000  },
  { symbol:'SOL', name:'Solana',     change24h:4.21,  vol:45000000,  mcap:800000000   },
  { symbol:'BNB', name:'BNB',        change24h:-1.23, vol:38000000,  mcap:900000000   },
  { symbol:'XRP', name:'XRP',        change24h:-0.54, vol:62000000,  mcap:500000000   },
  { symbol:'ADA', name:'Cardano',    change24h:3.12,  vol:18000000,  mcap:290000000   },
  { symbol:'AVAX',name:'Avalanche',  change24h:-2.70, vol:22000000,  mcap:150000000   },
  { symbol:'DOGE',name:'Dogecoin',   change24h:6.40,  vol:55000000,  mcap:340000000   },
];

const HOLDINGS = [
  { symbol:'BTC', name:'Bitcoin',   quantity:0.12, avgBuyPrice:7800000, currentValue:1025076, pnlPct:14.2  },
  { symbol:'ETH', name:'Ethereum',  quantity:2.5,  avgBuyPrice:290000,  currentValue:785500,  pnlPct:8.4   },
  { symbol:'SOL', name:'Solana',    quantity:12,   avgBuyPrice:16000,   currentValue:220800,  pnlPct:15.0  },
  { symbol:'BNB', name:'BNB',       quantity:3,    avgBuyPrice:55000,   currentValue:156300,  pnlPct:-5.3  },
  { symbol:'XRP', name:'XRP',       quantity:500,  avgBuyPrice:1050,    currentValue:490000,  pnlPct:-6.7  },
];

const RECENT_ORDERS = [
  { side:'buy',  coin:'BTC', qty:'0.003 BTC', price:'₹84.2L', total:'₹25,260', time:'14:32', status:'Filled' },
  { side:'sell', coin:'ETH', qty:'0.5 ETH',  price:'₹3.10L', total:'₹1,55,000',time:'11:15', status:'Filled' },
  { side:'buy',  coin:'SOL', qty:'5 SOL',    price:'₹17,200',total:'₹86,000', time:'Yesterday', status:'Filled' },
  { side:'buy',  coin:'DOGE',qty:'2000 DOGE',price:'₹24',    total:'₹48,000', time:'Yesterday', status:'Filled' },
];

type Filter = 'all' | 'gain' | 'lose';

export function DashboardClient() {
  const prices = usePriceStore((s) => s.prices);
  const [selectedCoin, setSelectedCoin] = useState('BTC');
  const [marketFilter, setMarketFilter] = useState<Filter>('gain');
  const [watched, setWatched] = useState<Set<string>>(new Set(['BTC','ETH','SOL']));

  const coinPrice = prices[selectedCoin]?.price ?? INITIAL_PRICES[selectedCoin] ?? 0;
  const coinChange = prices[selectedCoin]?.change24h ?? COINS.find(c=>c.symbol===selectedCoin)?.change24h ?? 0;
  const coinUp = coinChange >= 0;

  const filteredCoins = COINS.filter(c => {
    if (marketFilter === 'gain') return c.change24h > 0;
    if (marketFilter === 'lose') return c.change24h < 0;
    return true;
  }).sort((a,b) => marketFilter === 'lose' ? a.change24h - b.change24h : b.change24h - a.change24h);

  const totalPortfolio = 842350;
  const totalPnL = 92430;

  return (
    <div className="space-y-4 page-enter">
      {/* Alert bar */}
      <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm"
        style={{ background:'rgba(0,212,160,0.05)', borderColor:'rgba(0,212,160,0.2)' }}>
        <span className="text-[#00D4A0] font-bold">⚡ BTC Alert:</span>
        <span className="text-[#9BA5BF]">Bitcoin crossed ₹85L — your price alert triggered!</span>
        <span className="ml-auto text-[#5C6882] cursor-pointer text-base leading-none">×</span>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Portfolio Value" value={formatINR(totalPortfolio)} change="3.24% today" changeUp icon="💰" accent="green" />
        <StatCard label="Available Balance" value="₹1,24,800" change="₹7,17,550 invested" icon="💵" accent="blue" />
        <StatCard label="Total P&L" value={'+'+formatINR(totalPnL)} change="14.78% all time" changeUp icon="📈" accent="green" />
        <StatCard label="24h Volume" value="₹3.2Cr" change="2.1% vs yesterday" changeUp={false} icon="⚡" accent="gold" />
      </div>

      {/* Chart + Trade panel */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-[#1E2433] border border-[#2A3348] rounded-xl p-4">
          {/* Chart header */}
          <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono">{formatINR(coinPrice)}</span>
                <span className={cn('text-sm font-semibold', coinUp ? 'text-[#00D4A0]' : 'text-[#FF4757]')}>
                  {coinUp ? '▲' : '▼'} {Math.abs(coinChange).toFixed(2)}%
                </span>
              </div>
              <p className="text-xs text-[#5C6882] mt-0.5">{selectedCoin} / INR • Live</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {COINS.slice(0,4).map((c) => (
                <button key={c.symbol} onClick={() => setSelectedCoin(c.symbol)}
                  className={cn('px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                    selectedCoin === c.symbol ? 'border-[#4F8EF7]/40 bg-[#4F8EF7]/10 text-[#4F8EF7]' : 'border-[#2A3348] text-[#9BA5BF] hover:border-[#3A4660]'
                  )}>
                  <span style={{ color: getCoinColor(c.symbol) }}>●</span> {c.symbol}
                </button>
              ))}
            </div>
          </div>
          <CandleChart symbol={selectedCoin} height={260} showToolbar />
        </div>

        <div className="flex flex-col gap-4">
          {/* Quick trade */}
          <div className="bg-[#1E2433] border border-[#2A3348] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-sm">Quick Trade</span>
              <span className="text-xs text-[#5C6882]">{selectedCoin}/INR</span>
            </div>
            <TradePanel symbol={selectedCoin} coinName={COINS.find(c=>c.symbol===selectedCoin)?.name ?? selectedCoin} compact />
          </div>

          {/* Watchlist mini */}
          <div className="bg-[#1E2433] border border-[#2A3348] rounded-xl overflow-hidden flex-1">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A3348]">
              <span className="font-semibold text-sm">Watchlist</span>
              <a href="/dashboard/watchlist" className="text-xs text-[#4F8EF7] hover:underline">View all</a>
            </div>
            {COINS.filter(c => watched.has(c.symbol)).map((c) => {
              const p = prices[c.symbol]?.price ?? INITIAL_PRICES[c.symbol] ?? 0;
              const ch = prices[c.symbol]?.change24h ?? c.change24h;
              return (
                <div key={c.symbol} onClick={() => setSelectedCoin(c.symbol)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#252D3D] cursor-pointer transition-colors border-b border-[#2A3348]/50 last:border-0">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: getCoinColor(c.symbol)+'22', color: getCoinColor(c.symbol) }}>
                    {c.symbol.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold">{c.symbol}</p>
                    <p className="text-[11px] text-[#5C6882] truncate">{c.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono font-medium">
                      {p > 100000 ? `₹${(p/100000).toFixed(2)}L` : `₹${p.toLocaleString('en-IN',{maximumFractionDigits:2})}`}
                    </p>
                    <p className={cn('text-[11px] font-semibold', ch >= 0 ? 'text-[#00D4A0]' : 'text-[#FF4757]')}>
                      {ch >= 0 ? '▲' : '▼'} {Math.abs(ch).toFixed(2)}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Market table + portfolio */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-[#1E2433] border border-[#2A3348] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A3348]">
            <span className="font-semibold text-sm">Top Markets</span>
            <div className="flex gap-1">
              {(['all','gain','lose'] as Filter[]).map((f) => (
                <button key={f} onClick={() => setMarketFilter(f)}
                  className={cn('px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all',
                    marketFilter === f ? 'bg-[#252D3D] text-[#E8EBF2]' : 'text-[#5C6882] hover:text-[#9BA5BF]'
                  )}>{f === 'all' ? 'All' : f === 'gain' ? 'Gainers' : 'Losers'}</button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2A3348]">
                  {['#','Asset','Price','24h','Volume','7d',''].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold text-[#5C6882] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCoins.map((c, i) => {
                  const p = prices[c.symbol]?.price ?? INITIAL_PRICES[c.symbol] ?? 0;
                  const ch = prices[c.symbol]?.change24h ?? c.change24h;
                  return (
                    <CoinRow key={c.symbol} rank={i+1} symbol={c.symbol} name={c.name} price={p}
                      change24h={ch} volume={c.vol} marketCap={c.mcap}
                      isWatched={watched.has(c.symbol)}
                      onWatch={() => { const w = new Set(watched); w.has(c.symbol) ? w.delete(c.symbol) : w.add(c.symbol); setWatched(w); }}
                      onClick={() => setSelectedCoin(c.symbol)}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          {/* Portfolio donut */}
          <div className="bg-[#1E2433] border border-[#2A3348] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-sm">Portfolio Allocation</span>
              <a href="/dashboard/portfolio" className="text-xs text-[#4F8EF7] hover:underline">Details</a>
            </div>
            <PortfolioDonut holdings={HOLDINGS} totalValue={totalPortfolio} />
          </div>

          {/* Recent orders */}
          <div className="bg-[#1E2433] border border-[#2A3348] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A3348]">
              <span className="font-semibold text-sm">Recent Orders</span>
              <a href="/dashboard/history" className="text-xs text-[#4F8EF7] hover:underline">All orders</a>
            </div>
            {RECENT_ORDERS.map((o, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b border-[#2A3348]/50 last:border-0">
                <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase',
                  o.side === 'buy' ? 'bg-[#00D4A0]/15 text-[#00D4A0]' : 'bg-[#FF4757]/15 text-[#FF4757]')}>
                  {o.side}
                </span>
                <span className="text-xs font-semibold flex-1">{o.coin}</span>
                <span className="text-[11px] text-[#9BA5BF] font-mono">{o.qty}</span>
                <span className="text-xs font-mono font-medium">{o.total}</span>
                <span className="text-[11px] text-[#00D4A0]">{o.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
