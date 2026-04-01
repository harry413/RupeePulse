'use client';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { getCoinColor, getCoinEmoji, formatINR, formatPct, cn } from '@/lib/utils';

interface CoinRowProps {
  rank: number;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
  sparkline?: number[];
  isWatched?: boolean;
  onWatch?: () => void;
  onClick?: () => void;
}

export function CoinRow({ rank, symbol, name, price, change24h, volume, marketCap, sparkline, isWatched, onWatch, onClick }: CoinRowProps) {
  const up = change24h >= 0;
  const color = getCoinColor(symbol);

  function sparkPath(prices: number[]) {
    if (!prices?.length) return '';
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;
    const w = 80; const h = 32;
    return prices.map((p, i) => {
      const x = (i / (prices.length - 1)) * w;
      const y = h - ((p - min) / range) * h;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  }

  return (
    <motion.tr
      whileHover={{ backgroundColor: 'rgba(37,45,61,0.5)' }}
      onClick={onClick}
      className="cursor-pointer transition-colors border-b border-[#2A3348]/50 last:border-0"
    >
      <td className="px-4 py-3 text-[#5C6882] text-xs font-mono">{rank}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: color + '22', color }}>
            {getCoinEmoji(symbol)}
          </div>
          <div>
            <div className="font-semibold text-sm">{name}</div>
            <div className="text-xs text-[#5C6882]">{symbol}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 font-mono font-medium text-sm text-right">{formatINR(price)}</td>
      <td className="px-4 py-3 text-right">
        <span className={cn('change-pill', up ? 'up' : 'down')}>
          {up ? '▲' : '▼'} {Math.abs(change24h).toFixed(2)}%
        </span>
      </td>
      <td className="px-4 py-3 text-right text-xs text-[#9BA5BF] font-mono hidden md:table-cell">
        {formatINR(volume, true)}
      </td>
      <td className="px-4 py-3 text-right text-xs text-[#9BA5BF] font-mono hidden lg:table-cell">
        {formatINR(marketCap, true)}
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        {sparkline && (
          <svg width="80" height="32" viewBox="0 0 80 32">
            <path d={sparkPath(sparkline)} fill="none" stroke={up ? '#00D4A0' : '#FF4757'} strokeWidth="1.5" />
          </svg>
        )}
      </td>
      <td className="px-4 py-3">
        <button onClick={(e) => { e.stopPropagation(); onWatch?.(); }}
          className={cn('p-1.5 rounded-lg transition-colors', isWatched ? 'text-[#FFB547]' : 'text-[#5C6882] hover:text-[#FFB547]')}>
          <Star size={14} fill={isWatched ? 'currentColor' : 'none'} />
        </button>
      </td>
    </motion.tr>
  );
}
