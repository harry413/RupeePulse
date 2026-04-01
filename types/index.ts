// ============================================================
// RupeePulse — Global Type Definitions
// ============================================================

// ── Auth ──────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  provider: 'credentials' | 'google';
  createdAt: Date;
}

// ── Coin / Market ─────────────────────────────────────────
export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d?: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  circulating_supply: number;
  sparkline_in_7d?: { price: number[] };
  color?: string;   // UI only
}

export interface CoinPrice {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  timestamp: number;
}

export type Timeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w';

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// ── Wallet ────────────────────────────────────────────────
export interface Wallet {
  userId: string;
  inrBalance: number;   // Cash balance in INR (paise stored, displayed as rupees)
  holdings: Holding[];
  totalValue: number;   // Computed: inrBalance + sum(holdings * current price)
  totalPnL: number;
  totalPnLPct: number;
  updatedAt: Date;
}

export interface Holding {
  symbol: string;
  name: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  currentValue: number;
  totalInvested: number;
  pnl: number;
  pnlPct: number;
  color?: string;
}

// ── Orders / Transactions ─────────────────────────────────
export type OrderSide = 'buy' | 'sell';
export type OrderType = 'market' | 'limit' | 'stop-loss';
export type OrderStatus = 'pending' | 'filled' | 'cancelled' | 'rejected';

export interface Order {
  id: string;
  userId: string;
  symbol: string;
  coinName: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price: number;          // Execution price
  limitPrice?: number;    // For limit orders
  total: number;          // price * quantity
  fee: number;            // 0.1% of total
  status: OrderStatus;
  createdAt: Date;
  filledAt?: Date;
}

// ── Watchlist ─────────────────────────────────────────────
export interface WatchlistItem {
  userId: string;
  symbol: string;
  addedAt: Date;
}

// ── Alerts ────────────────────────────────────────────────
export type AlertCondition = 'above' | 'below';

export interface PriceAlert {
  id: string;
  userId: string;
  symbol: string;
  coinName: string;
  condition: AlertCondition;
  targetPrice: number;
  currentPrice: number;
  isActive: boolean;
  triggered: boolean;
  triggeredAt?: Date;
  createdAt: Date;
}

// ── Portfolio analytics ────────────────────────────────────
export interface PortfolioSnapshot {
  date: string;
  value: number;
}

export interface PortfolioStats {
  totalValue: number;
  inrBalance: number;
  invested: number;
  totalPnL: number;
  totalPnLPct: number;
  dayChange: number;
  dayChangePct: number;
  maxDrawdown: number;
  holdings: Holding[];
  history: PortfolioSnapshot[];
}

// ── API Response wrappers ─────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ── Store state types ─────────────────────────────────────
export interface PriceMap {
  [symbol: string]: CoinPrice;
}

export interface TradeState {
  side: OrderSide;
  orderType: OrderType;
  symbol: string;
  amount: string;        // INR amount
  quantity: string;      // Crypto quantity
  limitPrice: string;
}
