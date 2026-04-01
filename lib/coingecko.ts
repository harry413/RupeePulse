// lib/coingecko.ts — CoinGecko API client
// Free tier supports ~10-50 calls/minute without an API key

const BASE_URL = 'https://api.coingecko.com/api/v3';
const API_KEY = process.env.COINGECKO_API_KEY;

// INR conversion rate (CoinGecko uses vs_currency=inr)
const DEFAULT_CURRENCY = 'inr';

// Supported coins — symbol to CoinGecko ID mapping
export const COIN_IDS: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  BNB: 'binancecoin',
  XRP: 'ripple',
  ADA: 'cardano',
  AVAX: 'avalanche-2',
  DOGE: 'dogecoin',
  MATIC: 'matic-network',
  DOT: 'polkadot',
  LINK: 'chainlink',
  UNI: 'uniswap',
  ATOM: 'cosmos',
  LTC: 'litecoin',
  BCH: 'bitcoin-cash',
};

// Reverse mapping: CoinGecko ID → symbol
const ID_TO_SYMBOL: Record<string, string> = Object.fromEntries(
  Object.entries(COIN_IDS).map(([sym, id]) => [id, sym])
);

// Shared fetch helper with auth header if API key provided
async function cgFetch(path: string) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(API_KEY ? { 'x-cg-demo-api-key': API_KEY } : {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    headers,
    next: { revalidate: 30 }, // Cache for 30s in Next.js
  });

  if (!res.ok) {
    throw new Error(`CoinGecko API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// ── Get current prices for all supported coins ────────────
export async function getMarketPrices() {
  const ids = Object.values(COIN_IDS).join(',');
  const data = await cgFetch(
    `/coins/markets?vs_currency=${DEFAULT_CURRENCY}&ids=${ids}` +
    `&order=market_cap_desc&per_page=20&page=1` +
    `&sparkline=true&price_change_percentage=24h,7d`
  );

  // Normalize to our format
  return data.map((coin: any) => ({
    id: ID_TO_SYMBOL[coin.id] || coin.symbol.toUpperCase(),
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    image: coin.image,
    current_price: coin.current_price,
    price_change_percentage_24h: coin.price_change_percentage_24h ?? 0,
    price_change_percentage_7d: coin.price_change_percentage_7d_in_currency ?? 0,
    market_cap: coin.market_cap,
    total_volume: coin.total_volume,
    high_24h: coin.high_24h,
    low_24h: coin.low_24h,
    circulating_supply: coin.circulating_supply,
    sparkline_in_7d: coin.sparkline_in_7d,
  }));
}

// ── Get OHLC candle data ──────────────────────────────────
export async function getOHLC(symbol: string, days: number = 30) {
  const coinId = COIN_IDS[symbol.toUpperCase()];
  if (!coinId) throw new Error(`Unknown coin: ${symbol}`);

  // CoinGecko OHLC endpoint — returns [timestamp, open, high, low, close]
  const data = await cgFetch(
    `/coins/${coinId}/ohlc?vs_currency=${DEFAULT_CURRENCY}&days=${days}`
  );

  return data.map((candle: number[]) => ({
    time: Math.floor(candle[0] / 1000),
    open: candle[1],
    high: candle[2],
    low: candle[3],
    close: candle[4],
  }));
}

// ── Get single coin details ───────────────────────────────
export async function getCoinDetails(symbol: string) {
  const coinId = COIN_IDS[symbol.toUpperCase()];
  if (!coinId) throw new Error(`Unknown coin: ${symbol}`);

  return await cgFetch(
    `/coins/${coinId}?localization=false&tickers=false` +
    `&market_data=true&community_data=false&developer_data=false`
  );
}

// ── Search coins ──────────────────────────────────────────
export async function searchCoins(query: string) {
  const data = await cgFetch(`/search?query=${encodeURIComponent(query)}`);
  return data.coins?.slice(0, 10) ?? [];
}

// ── Simple ping to check API availability ─────────────────
export async function pingCoinGecko(): Promise<boolean> {
  try {
    await cgFetch('/ping');
    return true;
  } catch {
    return false;
  }
}
