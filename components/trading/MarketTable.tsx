'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { usePriceStore } from '@/store/usePriceStore';
import { formatINR, formatLargeNumber, getCoinColor, mockPriceHistory } from '@/lib/utils';
import { ChangePill, CoinLogo, Skeleton } from '@/components/ui';
import { MiniChart } from '@/components/charts/CandleChart';
import { cn } from '@/lib/utils';

interface MarketCoin {
  symbol: string;
  name: string;
  image?: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d?: number;
  market_cap: number;
  total_volume: number;
  sparkline_in_7d?: { price: number[] };
}

interface MarketTableProps {
  filter?: 'all' | 'gainers' | 'losers';
  limit?: number;
  showSearch?: boolean;
  watchlistSymbols?: string[];
  onWatchlistToggle?: (symbol: string, add: boolean) => void;
}

export function MarketTable({
  filter = 'all',
  limit,
  showSearch = false,
  watchlistSymbols = [],
  onWatchlistToggle,
}: MarketTableProps) {
  const router = useRouter();
  const prices = usePriceStore((s) => s.prices);
  const [coins, setCoins] = useState<MarketCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'rank' | 'price' | 'change' | 'volume'>('rank');
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    fetch('/api/prices')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setCoins(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Merge live prices into market data
  const enriched = coins.map((c) => ({
    ...c,
    current_price: prices[c.symbol]?.price ?? c.current_price,
    price_change_percentage_24h: prices[c.symbol]?.change24h ?? c.price_change_percentage_24h,
  }));

  let displayed = [...enriched];

  // Filter
  if (filter === 'gainers') displayed = displayed.filter((c) => c.price_change_percentage_24h > 0);
  if (filter === 'losers')  displayed = displayed.filter((c) => c.price_change_percentage_24h < 0);

  // Search
  if (search) {
    const q = search.toLowerCase();
    displayed = displayed.filter(
      (c) => c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
    );
  }

  // Sort
  displayed.sort((a, b) => {
    let va = 0, vb = 0;
    if (sortBy === 'price') { va = a.current_price; vb = b.current_price; }
    else if (sortBy === 'change') { va = a.price_change_percentage_24h; vb = b.price_change_percentage_24h; }
    else if (sortBy === 'volume') { va = a.total_volume; vb = b.total_volume; }
    else { va = a.market_cap; vb = b.market_cap; } // rank by market cap
    return sortAsc ? va - vb : vb - va;
  });

  if (limit) displayed = displayed.slice(0, limit);

  function toggleSort(col: typeof sortBy) {
    if (sortBy === col) setSortAsc(!sortAsc);
    else { setSortBy(col); setSortAsc(false); }
  }

  const SortHeader = ({ col, label }: { col: typeof sortBy; label: string }) => (
    <th
      className="text-left px-4 py-3 text-[10px] font-semibold text-[#5C6882] uppercase tracking-wider cursor-pointer hover:text-[#9BA5BF] select-none"
      onClick={() => toggleSort(col)}
    >
      {label} {sortBy === col ? (sortAsc ? '↑' : '↓') : ''}
    </th>
  );

  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="w-7 h-7 rounded-full" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="ml-auto h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {showSearch && (
        <div className="px-4 py-3 border-b border-[#2A3348]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or symbol..."
            className="w-full max-w-xs bg-[#111318] border border-[#2A3348] rounded-lg
              px-3 py-2 text-sm text-[#E8EBF2] placeholder-[#5C6882] outline-none
              focus:border-[#4F8EF7] transition-all"
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2A3348]">
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#5C6882] uppercase tracking-wider w-8">#</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#5C6882] uppercase tracking-wider">Asset</th>
              <SortHeader col="price" label="Price" />
              <SortHeader col="change" label="24h Change" />
              <SortHeader col="volume" label="24h Volume" />
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#5C6882] uppercase tracking-wider hidden lg:table-cell">7d Trend</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {displayed.map((coin, i) => {
              const color = getCoinColor(coin.symbol);
              const sparkData = coin.sparkline_in_7d?.price?.slice(-40) ??
                mockPriceHistory(coin.current_price, 40);
              const inWatchlist = watchlistSymbols.includes(coin.symbol);

              return (
                <motion.tr
                  key={coin.symbol}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-[#2A3348]/50 hover:bg-[#161A22] transition-colors cursor-pointer group"
                  onClick={() => router.push(`/dashboard/trade?coin=${coin.symbol}`)}
                >
                  <td className="px-4 py-3 text-xs text-[#5C6882]">{i + 1}</td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <CoinLogo symbol={coin.symbol} color={color} size={32} />
                      <div>
                        <div className="text-sm font-semibold">{coin.name}</div>
                        <div className="text-[11px] text-[#5C6882]">{coin.symbol}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 font-mono text-sm font-medium">
                    {formatINR(coin.current_price)}
                  </td>

                  <td className="px-4 py-3">
                    <ChangePill value={coin.price_change_percentage_24h} />
                  </td>

                  <td className="px-4 py-3 text-sm text-[#9BA5BF]">
                    {formatLargeNumber(coin.total_volume)}
                  </td>

                  <td className="px-4 py-3 hidden lg:table-cell" onClick={(e) => e.stopPropagation()}>
                    <MiniChart
                      data={sparkData}
                      color={coin.price_change_percentage_24h >= 0 ? '#00D4A0' : '#FF4757'}
                    />
                  </td>

                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    {onWatchlistToggle && (
                      <button
                        onClick={() => onWatchlistToggle(coin.symbol, !inWatchlist)}
                        className={cn(
                          'p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100',
                          inWatchlist
                            ? 'text-[#FFB547] opacity-100'
                            : 'text-[#5C6882] hover:text-[#FFB547] hover:bg-[#FFB547]/10'
                        )}
                      >
                        <Star size={14} fill={inWatchlist ? 'currentColor' : 'none'} />
                      </button>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
