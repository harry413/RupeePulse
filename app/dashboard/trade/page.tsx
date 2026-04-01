'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CandleChart } from '@/components/charts/CandleChart';
import { TradePanel } from '@/components/trading/TradePanel';
import { usePriceStore } from '@/store/usePriceStore';
import { INITIAL_PRICES } from '@/hooks/usePriceFeed';
import { getCoinColor, formatINR, cn } from '@/lib/utils';

const PAIRS = [
  { symbol:'BTC', name:'Bitcoin'   },
  { symbol:'ETH', name:'Ethereum'  },
  { symbol:'SOL', name:'Solana'    },
  { symbol:'BNB', name:'BNB'       },
  { symbol:'XRP', name:'XRP'       },
  { symbol:'ADA', name:'Cardano'   },
  { symbol:'AVAX',name:'Avalanche' },
  { symbol:'DOGE',name:'Dogecoin'  },
];

function OrderBookRow({ price, qty, side }: { price:number; qty:number; side:'bid'|'ask' }) {
  const maxQ = 3;
  const pct = Math.min((qty / maxQ) * 100, 100);
  return (
    <div className="relative flex items-center justify-between px-3 py-1 text-[11px] font-mono overflow-hidden group">
      <div className="absolute inset-y-0 right-0 opacity-10 transition-all group-hover:opacity-20"
        style={{ width: pct+'%', background: side === 'bid' ? '#00D4A0' : '#FF4757' }} />
      <span className={side === 'bid' ? 'text-[#00D4A0]' : 'text-[#FF4757]'}>{formatINR(price)}</span>
      <span className="text-[#9BA5BF]">{qty.toFixed(4)}</span>
    </div>
  );
}

export default function TradePage() {
  const prices = usePriceStore((s) => s.prices);
  const [symbol, setSymbol] = useState('BTC');
  const coinData = PAIRS.find(p => p.symbol === symbol)!;
  const price = prices[symbol]?.price ?? INITIAL_PRICES[symbol] ?? 0;
  const change = prices[symbol]?.change24h ?? 0;
  const up = change >= 0;

  const bids = Array.from({length:8},(_,i) => ({ price: price-(i+1)*price*0.001, qty: Math.random()*2+0.1 }));
  const asks = Array.from({length:8},(_,i) => ({ price: price+(i+1)*price*0.001, qty: Math.random()*2+0.1 }));

  return (
    <div className="space-y-4 page-enter">
      {/* Pair selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {PAIRS.map((p) => {
          const px = prices[p.symbol]?.price ?? INITIAL_PRICES[p.symbol] ?? 0;
          const ch = prices[p.symbol]?.change24h ?? 0;
          return (
            <button key={p.symbol} onClick={() => setSymbol(p.symbol)}
              className={cn('flex items-center gap-2 px-3 py-2 rounded-xl border text-xs whitespace-nowrap transition-all flex-shrink-0',
                symbol === p.symbol ? 'border-[#4F8EF7]/30 bg-[#4F8EF7]/10 text-[#4F8EF7]' : 'border-[#2A3348] bg-[#1E2433] text-[#9BA5BF] hover:border-[#3A4660]'
              )}>
              <span className="font-bold" style={{ color: getCoinColor(p.symbol) }}>●</span>
              <span className="font-semibold">{p.symbol}</span>
              <span className={ch >= 0 ? 'text-[#00D4A0]' : 'text-[#FF4757]'}>{ch >= 0 ? '+' : ''}{ch.toFixed(2)}%</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Chart area */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-[#1E2433] border border-[#2A3348] rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono">{formatINR(price)}</span>
                  <span className={cn('text-sm font-semibold', up ? 'text-[#00D4A0]' : 'text-[#FF4757]')}>
                    {up ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
                  </span>
                </div>
                <p className="text-xs text-[#5C6882] mt-0.5">{symbol}/INR • Spot</p>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-0.5 text-xs">
                <span className="text-[#5C6882]">24h High</span>
                <span className="font-mono text-[#00D4A0] text-right">{formatINR(price * 1.025)}</span>
                <span className="text-[#5C6882]">24h Low</span>
                <span className="font-mono text-[#FF4757] text-right">{formatINR(price * 0.975)}</span>
                <span className="text-[#5C6882]">Volume</span>
                <span className="font-mono text-right">{formatINR(price*850, true)}</span>
                <span className="text-[#5C6882]">Mkt Cap</span>
                <span className="font-mono text-right">{formatINR(price*19000000, true)}</span>
              </div>
            </div>
            <CandleChart symbol={symbol} height={300} showToolbar />
          </div>
        </div>

        {/* Right: trade + order book */}
        <div className="space-y-4">
          <div className="bg-[#1E2433] border border-[#2A3348] rounded-xl p-4">
            <TradePanel symbol={symbol} coinName={coinData.name} />
          </div>

          <div className="bg-[#1E2433] border border-[#2A3348] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#2A3348]">
              <span className="font-semibold text-sm">Order Book</span>
            </div>
            <div className="grid grid-cols-2 gap-0">
              <div>
                <div className="flex justify-between px-3 py-1.5 text-[10px] text-[#5C6882] font-semibold uppercase border-b border-[#2A3348]">
                  <span>Bid (₹)</span><span>Size</span>
                </div>
                {bids.map((b,i) => <OrderBookRow key={i} price={b.price} qty={b.qty} side="bid" />)}
              </div>
              <div className="border-l border-[#2A3348]">
                <div className="flex justify-between px-3 py-1.5 text-[10px] text-[#5C6882] font-semibold uppercase border-b border-[#2A3348]">
                  <span>Ask (₹)</span><span>Size</span>
                </div>
                {asks.map((a,i) => <OrderBookRow key={i} price={a.price} qty={a.qty} side="ask" />)}
              </div>
            </div>
            <div className="px-4 py-2 border-t border-[#2A3348] bg-[#161A22] text-center">
              <span className="text-sm font-bold font-mono">{formatINR(price)}</span>
              <span className={cn('ml-2 text-xs', up ? 'text-[#00D4A0]' : 'text-[#FF4757]')}>Spread: ₹{(price*0.002).toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
