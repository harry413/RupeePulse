'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePriceStore } from '@/store/usePriceStore';
import { INITIAL_PRICES } from '@/hooks/usePriceFeed';
import { formatINR, formatCrypto, calcFee, cn } from '@/lib/utils';

type Side = 'buy' | 'sell';
type OrderType = 'market' | 'limit' | 'stop-loss';

interface TradePanelProps { symbol: string; coinName: string; compact?: boolean; onSuccess?: () => void; }

export function TradePanel({ symbol, coinName, compact = false, onSuccess }: TradePanelProps) {
  const { data: session } = useSession();
  const prices = usePriceStore((s) => s.prices);
  const [side, setSide] = useState<Side>('buy');
  const [orderType, setOrderType] = useState<OrderType>('market');
  const [amountINR, setAmountINR] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [balance] = useState(1_000_000);

  const currentPrice = prices[symbol]?.price ?? INITIAL_PRICES[symbol] ?? 0;
  const execPrice = orderType === 'market' ? currentPrice : (parseFloat(limitPrice) || currentPrice);
  const amount = parseFloat(amountINR) || 0;
  const quantity = execPrice > 0 ? amount / execPrice : 0;
  const fee = calcFee(amount);
  const total = side === 'buy' ? amount + fee : amount - fee;

  function setPercent(pct: number) {
    setAmountINR(Math.floor(balance * pct / 100).toString());
  }

  async function executeTrade() {
    if (!session) { toast.error('Please sign in to trade'); return; }
    if (!amount || amount <= 0) { toast.error('Enter a valid amount'); return; }
    if (side === 'buy' && total > balance) { toast.error('Insufficient INR balance'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, coinName, side, type: orderType, quantity, price: execPrice, total: amount }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast.success(`${side === 'buy' ? '🟢 Bought' : '🔴 Sold'} ${formatCrypto(quantity, symbol)} ${symbol}`);
      setAmountINR('');
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message ?? 'Trade failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn('flex flex-col gap-4', compact && 'gap-3')}>
      <div className="flex bg-[#161A22] rounded-xl p-1 gap-1">
        {(['buy', 'sell'] as Side[]).map((s) => (
          <button key={s} onClick={() => setSide(s)} className={cn(
            'flex-1 py-2 rounded-lg text-sm font-semibold transition-all',
            side === s && s === 'buy'  && 'bg-gradient-to-r from-[#00A87D] to-[#00D4A0] text-[#0A0B0E]',
            side === s && s === 'sell' && 'bg-gradient-to-r from-[#CC3344] to-[#FF4757] text-white',
            side !== s && 'text-[#9BA5BF] hover:text-[#E8EBF2]'
          )}>
            {s === 'buy' ? '▲ Buy' : '▼ Sell'}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        {(['market', 'limit', 'stop-loss'] as OrderType[]).map((t) => (
          <button key={t} onClick={() => setOrderType(t)} className={cn(
            'flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize',
            orderType === t ? 'border-[#FFB547]/40 bg-[#FFB547]/10 text-[#FFB547]' : 'border-[#2A3348] text-[#5C6882] hover:text-[#9BA5BF]'
          )}>{t}</button>
        ))}
      </div>

      <AnimatePresence>
        {orderType !== 'market' && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}>
            <label className="block text-[11px] font-semibold text-[#5C6882] uppercase tracking-wider mb-1.5">
              {orderType === 'limit' ? 'Limit Price' : 'Stop Price'} (INR)
            </label>
            <div className="relative">
              <input type="number" value={limitPrice} onChange={(e) => setLimitPrice(e.target.value)}
                placeholder={currentPrice.toFixed(0)}
                className="w-full px-3 py-2.5 rounded-lg text-sm font-mono bg-[#111318] border border-[#2A3348] text-[#E8EBF2] placeholder-[#5C6882] outline-none focus:border-[#FFB547] transition-colors" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#5C6882]">₹</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <label className="block text-[11px] font-semibold text-[#5C6882] uppercase tracking-wider mb-1.5">Amount (INR)</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#5C6882] font-mono">₹</span>
          <input type="number" value={amountINR} onChange={(e) => setAmountINR(e.target.value)} placeholder="0.00"
            className="w-full pl-7 pr-3 py-2.5 rounded-lg text-sm font-mono bg-[#111318] border border-[#2A3348] text-[#E8EBF2] placeholder-[#5C6882] outline-none focus:border-[#4F8EF7] transition-colors" />
        </div>
        <div className="flex gap-1.5 mt-2">
          {[25,50,75,100].map((pct) => (
            <button key={pct} onClick={() => setPercent(pct)}
              className="flex-1 py-1 rounded text-[11px] font-medium text-[#5C6882] bg-[#161A22] hover:bg-[#252D3D] hover:text-[#E8EBF2] transition-all border border-[#2A3348]">
              {pct}%
            </button>
          ))}
        </div>
      </div>

      {amount > 0 && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="bg-[#111318] rounded-xl p-3 space-y-2 text-xs">
          <div className="flex justify-between text-[#9BA5BF]">
            <span>You {side === 'buy' ? 'receive' : 'sell'}</span>
            <span className="font-mono font-semibold text-[#E8EBF2]">{formatCrypto(quantity, symbol)} {symbol}</span>
          </div>
          <div className="flex justify-between text-[#9BA5BF]">
            <span>Price</span><span className="font-mono">{formatINR(execPrice)}</span>
          </div>
          <div className="flex justify-between text-[#9BA5BF]">
            <span>Fee (0.1%)</span><span className="font-mono text-[#FFB547]">{formatINR(fee)}</span>
          </div>
          <div className="flex justify-between border-t border-[#2A3348] pt-2 font-semibold">
            <span>Total</span>
            <span className={cn('font-mono', side === 'buy' ? 'text-[#FF4757]' : 'text-[#00D4A0]')}>
              {side === 'buy' ? '-' : '+'}{formatINR(total)}
            </span>
          </div>
        </motion.div>
      )}

      <div className="flex justify-between text-[11px] text-[#5C6882]">
        <span>Available</span>
        <span className="font-mono text-[#9BA5BF]">{formatINR(balance)}</span>
      </div>

      <motion.button whileTap={{ scale: 0.98 }} onClick={executeTrade} disabled={loading || !amount || (side === 'buy' && total > balance)}
        className={cn('w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed',
          side === 'buy' ? 'bg-gradient-to-r from-[#00A87D] to-[#00D4A0] text-[#0A0B0E]' : 'bg-gradient-to-r from-[#CC3344] to-[#FF4757] text-white'
        )}>
        {loading ? <><span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />Processing…</> : <><Zap size={15} />{side === 'buy' ? `Buy ${symbol}` : `Sell ${symbol}`}</>}
      </motion.button>
    </div>
  );
}
