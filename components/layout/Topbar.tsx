// components/layout/Topbar.tsx — Top navigation bar with live ticker
'use client';

import { useState } from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { useUIStore, usePriceStore } from '@/store/usePriceStore';
import { getCoinColor } from '@/lib/utils';
import { INITIAL_PRICES } from '@/hooks/usePriceFeed';
import { cn } from '@/lib/utils';

const TICKER_COINS = ['BTC','ETH','SOL','BNB','XRP','ADA','AVAX','DOGE','MATIC','DOT'];

interface TopbarProps {
  user?: { name?: string | null; email?: string | null; image?: string | null };
}

export function Topbar({ user }: TopbarProps) {
  const { toggleSidebar } = useUIStore();
  const prices = usePriceStore((s) => s.prices);
  const isConnected = usePriceStore((s) => s.isConnected);
  const [search, setSearch] = useState('');
  const [showNotif, setShowNotif] = useState(false);

  const tickerItems = [...TICKER_COINS, ...TICKER_COINS].map((sym) => {
    const p = prices[sym];
    const price = p?.price ?? INITIAL_PRICES[sym] ?? 0;
    const change = p?.change24h ?? 0;
    return { sym, price, change, up: change >= 0 };
  });

  return (
    <header className="h-14 flex items-center gap-3 px-4 bg-[#111318] border-b border-[#2A3348] flex-shrink-0 z-10">
      <button onClick={toggleSidebar} className="lg:hidden text-[#9BA5BF] hover:text-[#E8EBF2] p-1">
        <Menu size={18} />
      </button>

      <div className="flex-1 overflow-hidden ticker-strip min-w-0">
        <div className="ticker-inner select-none">
          {tickerItems.map((item, i) => (
            <span key={`${item.sym}-${i}`} className="flex items-center gap-1.5 text-[11px]">
              <span className="font-bold" style={{ color: getCoinColor(item.sym) }}>{item.sym}</span>
              <span className="font-mono text-[#E8EBF2]">
                {item.price > 10000
                  ? `₹${(item.price / 100000).toFixed(2)}L`
                  : `₹${item.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
              </span>
              <span className={cn('font-semibold', item.up ? 'text-[#00D4A0]' : 'text-[#FF4757]')}>
                {item.up ? '▲' : '▼'} {Math.abs(item.change).toFixed(2)}%
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="relative hidden sm:block">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C6882]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search coins…"
          className="w-44 pl-8 pr-3 py-1.5 rounded-lg text-xs outline-none bg-[#161A22] border border-[#2A3348] text-[#E8EBF2] placeholder-[#5C6882] focus:border-[#4F8EF7] transition-all"
        />
      </div>

      <div className="hidden sm:flex items-center gap-1.5 text-[10px]">
        <span className={cn('w-1.5 h-1.5 rounded-full', isConnected ? 'bg-[#00D4A0] animate-pulse' : 'bg-[#FFB547]')} />
        <span className={isConnected ? 'text-[#00D4A0]' : 'text-[#FFB547]'}>{isConnected ? 'Live' : 'Simulated'}</span>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowNotif(!showNotif)}
          className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-[#161A22] border border-[#2A3348] text-[#9BA5BF] hover:text-[#E8EBF2] hover:border-[#3A4660] transition-all"
        >
          <Bell size={15} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#FF4757] rounded-full" />
        </button>
        {showNotif && (
          <div className="absolute right-0 top-10 w-72 bg-[#1E2433] border border-[#2A3348] rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="p-3 border-b border-[#2A3348] flex items-center justify-between">
              <span className="text-sm font-semibold">Notifications</span>
              <span className="text-xs text-[#4F8EF7] cursor-pointer">Mark all read</span>
            </div>
            {[
              { title: 'BTC crossed ₹85L', body: 'Your price alert triggered', time: '2m ago', icon: '⚡', color: '#FFB547' },
              { title: 'Order filled', body: 'Bought 0.003 BTC at ₹84.2L', time: '1h ago', icon: '✓', color: '#00D4A0' },
              { title: 'ETH up 4.2%', body: 'Strong momentum last hour', time: '3h ago', icon: '↑', color: '#4F8EF7' },
            ].map((n, i) => (
              <div key={i} className="flex gap-3 p-3 hover:bg-[#252D3D] cursor-pointer transition-colors">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ background: n.color + '22', color: n.color }}>{n.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold">{n.title}</p>
                  <p className="text-[11px] text-[#9BA5BF] truncate">{n.body}</p>
                </div>
                <span className="text-[10px] text-[#5C6882] flex-shrink-0">{n.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #A78BFA, #4F8EF7)' }}>
        {user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) ?? 'U'}
      </div>
    </header>
  );
}
