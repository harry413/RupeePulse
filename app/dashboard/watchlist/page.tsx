'use client';
import { useState } from 'react';
import { Star, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { usePriceStore } from '@/store/usePriceStore';
import { INITIAL_PRICES } from '@/hooks/usePriceFeed';
import { getCoinColor, formatINR, cn } from '@/lib/utils';

const DEFAULT_WATCHLIST = [
  { symbol:'BTC', name:'Bitcoin'  },
  { symbol:'ETH', name:'Ethereum' },
  { symbol:'SOL', name:'Solana'   },
  { symbol:'BNB', name:'BNB'      },
];

const AVAILABLE_COINS = ['BTC','ETH','SOL','BNB','XRP','ADA','AVAX','DOGE','MATIC','DOT','LINK','UNI'];

export default function WatchlistPage() {
  const prices = usePriceStore((s) => s.prices);
  const [list, setList] = useState(DEFAULT_WATCHLIST);
  const [showAdd, setShowAdd] = useState(false);

  function remove(symbol: string) {
    setList((l) => l.filter(i => i.symbol !== symbol));
    toast.success(`${symbol} removed from watchlist`);
  }
  function add(symbol: string, name: string) {
    if (list.find(i => i.symbol === symbol)) { toast.error(`${symbol} already in watchlist`); return; }
    setList((l) => [...l, { symbol, name }]);
    toast.success(`${symbol} added to watchlist`);
    setShowAdd(false);
  }

  return (
    <div className="space-y-4 page-enter max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2"><Star size={18} className="text-[#FFB547]" />Watchlist</h1>
          <p className="text-xs text-[#9BA5BF] mt-0.5">{list.length} coins tracked</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4F8EF7]/10 border border-[#4F8EF7]/30 text-[#4F8EF7] text-sm font-medium hover:bg-[#4F8EF7]/20 transition-all">
          <Plus size={15} />Add coin
        </button>
      </div>

      {showAdd && (
        <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
          className="bg-[#1E2433] border border-[#2A3348] rounded-xl p-4">
          <p className="text-sm font-semibold mb-3">Add to watchlist</p>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_COINS.filter(s => !list.find(i => i.symbol === s)).map((sym) => (
              <button key={sym} onClick={() => add(sym, sym)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#2A3348] text-[#9BA5BF] hover:border-[#4F8EF7]/40 hover:text-[#4F8EF7] hover:bg-[#4F8EF7]/10 transition-all">
                {sym}
              </button>
            ))}
          </div>
          <button onClick={() => setShowAdd(false)} className="mt-3 text-xs text-[#5C6882] hover:text-[#9BA5BF]">Cancel</button>
        </motion.div>
      )}

      <div className="bg-[#1E2433] border border-[#2A3348] rounded-xl overflow-hidden">
        <AnimatePresence>
          {list.map((item) => {
            const p = prices[item.symbol]?.price ?? INITIAL_PRICES[item.symbol] ?? 0;
            const ch = prices[item.symbol]?.change24h ?? 0;
            const up = ch >= 0;
            return (
              <motion.div key={item.symbol} layout exit={{ opacity:0, x:-20 }}
                className="flex items-center gap-4 px-5 py-4 border-b border-[#2A3348]/50 last:border-0 hover:bg-[#252D3D] transition-colors">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold"
                  style={{ background: getCoinColor(item.symbol)+'22', color: getCoinColor(item.symbol) }}>
                  {item.symbol.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-xs text-[#5C6882]">{item.symbol}/INR</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-semibold text-sm">{formatINR(p)}</p>
                  <p className={cn('text-xs font-semibold', up ? 'text-[#00D4A0]' : 'text-[#FF4757]')}>
                    {up ? '▲' : '▼'} {Math.abs(ch).toFixed(2)}%
                  </p>
                </div>
                <a href="/dashboard/trade" className={cn('px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                  up ? 'border-[#00D4A0]/30 bg-[#00D4A0]/10 text-[#00D4A0]' : 'border-[#FF4757]/30 bg-[#FF4757]/10 text-[#FF4757]')}>
                  Trade
                </a>
                <button onClick={() => remove(item.symbol)} className="text-[#5C6882] hover:text-[#FF4757] transition-colors p-1">
                  <Trash2 size={15} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {list.length === 0 && (
          <div className="py-16 text-center text-[#5C6882]">
            <Star size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Your watchlist is empty</p>
          </div>
        )}
      </div>
    </div>
  );
}
