// lib/utils.ts — Shared utility functions

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ── Tailwind class merge helper ───────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Currency formatting ───────────────────────────────────
export function formatINR(amount: number, compact = false): string {
  if (compact) {
    if (amount >= 1_00_00_000) return `₹${(amount / 1_00_00_000).toFixed(2)}Cr`;
    if (amount >= 1_00_000) return `₹${(amount / 1_00_000).toFixed(2)}L`;
    if (amount >= 1_000) return `₹${(amount / 1_000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Format crypto quantity (BTC = 8 decimals, others = 4-6)
export function formatCrypto(amount: number, symbol: string): string {
  const highValue = ['BTC', 'ETH'].includes(symbol.toUpperCase());
  const decimals = highValue ? 8 : 4;
  if (amount < 0.0001) return amount.toFixed(8);
  return amount.toFixed(decimals);
}

// Format large numbers with Indian numbering (lakhs/crores)
export function formatLargeNumber(n: number): string {
  if (n >= 1_00_00_000) return `${(n / 1_00_00_000).toFixed(2)}Cr`;
  if (n >= 1_00_000) return `${(n / 1_00_000).toFixed(2)}L`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString('en-IN');
}

// ── Percentage helpers ────────────────────────────────────
export function formatPct(pct: number, showSign = true): string {
  const sign = showSign && pct > 0 ? '+' : '';
  return `${sign}${pct.toFixed(2)}%`;
}

export function isPriceUp(change: number): boolean {
  return change >= 0;
}

// ── Date helpers ──────────────────────────────────────────
export function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return `${formatDate(d)}, ${formatTime(d)}`;
}

export function timeAgo(date: Date | string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

// ── Validation ────────────────────────────────────────────
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

// ── Trading calculations ──────────────────────────────────
export const TRADING_FEE = 0.001; // 0.1%

export function calcFee(amount: number): number {
  return amount * TRADING_FEE;
}

export function calcTotal(amount: number, includeFee = true): number {
  return includeFee ? amount + calcFee(amount) : amount;
}

export function calcPnL(
  quantity: number,
  avgBuyPrice: number,
  currentPrice: number
): { pnl: number; pnlPct: number } {
  const costBasis = quantity * avgBuyPrice;
  const currentValue = quantity * currentPrice;
  const pnl = currentValue - costBasis;
  const pnlPct = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
  return { pnl, pnlPct };
}

// ── Coin metadata ─────────────────────────────────────────
export const COIN_COLORS: Record<string, string> = {
  BTC: '#F7931A',
  ETH: '#627EEA',
  SOL: '#9945FF',
  BNB: '#F3BA2F',
  XRP: '#00AAE4',
  ADA: '#3CC8C8',
  AVAX: '#E84142',
  DOGE: '#C2A633',
  MATIC: '#8247E5',
  DOT: '#E6007A',
  LINK: '#2A5ADA',
  UNI: '#FF007A',
  ATOM: '#6F4E87',
  LTC: '#BFBBBB',
  BCH: '#8DC351',
};

export const COIN_EMOJIS: Record<string, string> = {
  BTC: '₿',
  ETH: 'Ξ',
  SOL: '◎',
  BNB: '●',
  XRP: '✕',
  ADA: '◈',
  AVAX: '▲',
  DOGE: 'Ð',
  MATIC: '⬡',
  DOT: '●',
  LINK: '⬡',
  UNI: '🦄',
};

export function getCoinColor(symbol: string): string {
  return COIN_COLORS[symbol.toUpperCase()] ?? '#9BA5BF';
}

export function getCoinEmoji(symbol: string): string {
  return COIN_EMOJIS[symbol.toUpperCase()] ?? symbol.charAt(0);
}

// ── Mock price generator (used when API unavailable) ──────
export function mockPriceHistory(
  basePrice: number,
  count: number,
  volatility = 0.02
): number[] {
  const prices: number[] = [];
  let price = basePrice;
  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.48) * price * volatility;
    price = Math.max(1, price + change);
    prices.push(Math.round(price * 100) / 100);
  }
  return prices;
}

// Generate mock OHLC candle data
export function mockCandleData(basePrice: number, count: number) {
  const candles = [];
  let price = basePrice;
  const now = Date.now();
  const interval = 24 * 60 * 60 * 1000; // 1 day in ms

  for (let i = count; i >= 0; i--) {
    const open = price;
    const high = open * (1 + Math.random() * 0.03);
    const low = open * (1 - Math.random() * 0.03);
    const close = low + Math.random() * (high - low);
    const volume = Math.random() * 1000000 + 500000;

    candles.push({
      time: Math.floor((now - i * interval) / 1000),
      open: Math.round(open),
      high: Math.round(high),
      low: Math.round(low),
      close: Math.round(close),
      volume: Math.round(volume),
    });

    price = close;
  }
  return candles;
}
