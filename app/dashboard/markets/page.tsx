'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { CoinRow } from '@/components/ui/CoinRow';
import { usePriceStore } from '@/store/usePriceStore';
import { INITIAL_PRICES } from '@/hooks/usePriceFeed';
import { cn } from '@/lib/utils';

const ALL_COINS = [
  { symbol:'BTC',   name:'Bitcoin',    change24h:2.34,  vol:280000000,  mcap:16700000000 },
  { symbol:'ETH',   name:'Ethereum',   change24h:1.87,  vol:120000000,  mcap:3800000000  },
  { symbol:'SOL',   name:'Solana',     change24h:4.21,  vol:45000000,   mcap:800000000   },
  { symbol:'BNB',   name:'BNB',        change24h:-1.23, vol:38000000,   mcap:900000000   },
  { symbol:'XRP',   name:'XRP',        change24h:-0.54, vol:62000000,   mcap:500000000   },
  { symbol:'ADA',   name:'Cardano',    change24h:3.12,  vol:18000000,   mcap:290000000   },
  { symbol:'AVAX',  name:'Avalanche',  change24h:-2.70, vol:22000000,   mcap:150000000   },
  { symbol:'DOGE',  name:'Dogecoin',   change24h:6.40,  vol:55000000,   mcap:340000000   },
  { symbol:'MATIC', name:'Polygon',    change24h:1.15,  vol:19000000,   mcap:110000000   },
  { symbol:'DOT',   name:'Polkadot',   change24h:-0.88, vol:14000000,   mcap:95000000    },
  { symbol:'LINK',  name:'Chainlink',  change24h:2.90,  vol:12000000,   mcap:78000000    },
  { symbol:'UNI',   name:'Uniswap',    change24h:0.45,  vol:8000000,    mcap:62000000    },
  { symbol:'ATOM',  name:'Cosmos',     change24h:-1.50, vol:9000000,    mcap:58000000    },
  { symbol:'LTC',   name:'Litecoin',   change24h:0.72,  vol:11000000,   mcap:72000000    },
  { symbol:'BCH',   name:'Bitcoin Cash',change24h:1.34, vol:7000000,    mcap:50000000    },
];

type Tab = 'all' | 'gainers' | 'losers' | 'new';

export default function MarketsPage() {
  const prices = usePriceStore((s) => s.prices);
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [watched, setWatched] = useState<Set<string>>(new Set(['BTC','ETH','SOL']));
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = ALL_COINS.filter((c) => {
    const q = search.toLowerCase();
    if (q && !c.name.toLowerCase().includes(q) && !c.symbol.toLowerCase().includes(q)) return false;
    if (tab === 'gainers') return c.change24h > 0;
    if (tab === 'losers') return c.change24h < 0;
    return true;
  });

  const paginated = filtered.slice(0, page * PER_PAGE);

  return (
    <div className="space-y-4 page-enter">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-lg font-bold">Markets</h1>
          <p className="text-xs text-[#9BA5BF] mt-0.5">Live prices for {ALL_COINS.length} cryptocurrencies</p>
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C6882]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search coin…"
            className="pl-8 pr-4 py-2 rounded-xl text-sm bg-[#1E2433] border border-[#2A3348] text-[#E8EBF2] placeholder-[#5C6882] outline-none focus:border-[#4F8EF7] transition-all w-52" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#1E2433] border border-[#2A3348] rounded-xl p-1 w-fit">
        {(['all','gainers','losers','new'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all',
              tab === t ? 'bg-[#252D3D] text-[#E8EBF2]' : 'text-[#5C6882] hover:text-[#9BA5BF]')}>
            {t === 'gainers' ? '▲ ' : t === 'losers' ? '▼ ' : ''}{t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#1E2433] border border-[#2A3348] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A3348]">
                {['#','Asset','Price','24h Change','Volume','Market Cap','7d','Watch'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-[#5C6882] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((c, i) => {
                const p = prices[c.symbol]?.price ?? INITIAL_PRICES[c.symbol] ?? 0;
                const ch = prices[c.symbol]?.change24h ?? c.change24h;
                return (
                  <CoinRow key={c.symbol} rank={i+1} symbol={c.symbol} name={c.name}
                    price={p} change24h={ch} volume={c.vol} marketCap={c.mcap}
                    isWatched={watched.has(c.symbol)}
                    onWatch={() => { const w = new Set(watched); w.has(c.symbol) ? w.delete(c.symbol) : w.add(c.symbol); setWatched(w); }}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
        {paginated.length < filtered.length && (
          <div className="p-4 text-center border-t border-[#2A3348]">
            <button onClick={() => setPage(p => p+1)}
              className="px-6 py-2 rounded-xl text-sm bg-[#252D3D] text-[#9BA5BF] hover:text-[#E8EBF2] hover:bg-[#2D3650] transition-all">
              Load more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
