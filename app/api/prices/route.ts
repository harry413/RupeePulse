// app/api/prices/route.ts — Market prices endpoint (proxies CoinGecko)

import { NextRequest, NextResponse } from 'next/server';
import { getMarketPrices } from '@/lib/coingecko';
import { INITIAL_PRICES } from '@/hooks/usePriceFeed';
import { COIN_COLORS } from '@/lib/utils';

// Mock market data for when CoinGecko is unreachable
function getMockMarketData() {
  const coins = [
    { id: 'BTC', symbol: 'BTC', name: 'Bitcoin',    change24h:  2.34, vol: 28_00_000_000 },
    { id: 'ETH', symbol: 'ETH', name: 'Ethereum',   change24h:  1.87, vol: 12_00_000_000 },
    { id: 'SOL', symbol: 'SOL', name: 'Solana',     change24h:  4.21, vol:  4_50_000_000 },
    { id: 'BNB', symbol: 'BNB', name: 'BNB',        change24h: -1.23, vol:  3_80_000_000 },
    { id: 'XRP', symbol: 'XRP', name: 'XRP',        change24h: -0.54, vol:  6_20_000_000 },
    { id: 'ADA', symbol: 'ADA', name: 'Cardano',    change24h:  3.12, vol:  1_80_000_000 },
    { id: 'AVAX', symbol: 'AVAX', name: 'Avalanche',change24h: -2.70, vol:  2_20_000_000 },
    { id: 'DOGE', symbol: 'DOGE', name: 'Dogecoin', change24h:  6.40, vol:  5_50_000_000 },
    { id: 'MATIC', symbol: 'MATIC', name: 'Polygon',change24h:  1.15, vol:  9_00_000_000 },
    { id: 'DOT', symbol: 'DOT', name: 'Polkadot',   change24h: -0.88, vol:  1_40_000_000 },
    { id: 'LINK', symbol: 'LINK', name: 'Chainlink',change24h:  2.90, vol:  1_20_000_000 },
    { id: 'UNI', symbol: 'UNI', name: 'Uniswap',    change24h:  0.45, vol:    80_000_000 },
  ];

  return coins.map((c) => {
    const price = INITIAL_PRICES[c.symbol] ?? 100;
    return {
      id: c.id,
      symbol: c.symbol,
      name: c.name,
      image: `https://assets.coingecko.com/coins/images/1/thumb/${c.symbol.toLowerCase()}.png`,
      current_price: price,
      price_change_percentage_24h: c.change24h,
      price_change_percentage_7d: c.change24h * 2.3,
      market_cap: price * 1_000_000,
      total_volume: c.vol,
      high_24h: price * 1.03,
      low_24h: price * 0.97,
      circulating_supply: 21_000_000,
      color: COIN_COLORS[c.symbol] ?? '#9BA5BF',
      sparkline_in_7d: {
        price: Array.from({ length: 168 }, (_, i) =>
          price * (1 + (Math.random() - 0.49) * 0.04)
        ),
      },
    };
  });
}

export async function GET(_req: NextRequest) {
  try {
    const data = await getMarketPrices();
    // Attach color metadata
    const enriched = data.map((c: any) => ({
      ...c,
      color: COIN_COLORS[c.symbol] ?? '#9BA5BF',
    }));
    return NextResponse.json({ success: true, data: enriched });
  } catch (error) {
    // CoinGecko unavailable — return mock data so the app still works
    console.warn('CoinGecko unavailable, using mock data');
    return NextResponse.json({ success: true, data: getMockMarketData(), mock: true });
  }
}
