// store/usePriceStore.ts — Zustand store for real-time prices & trading state

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { PriceMap, TradeState, OrderSide, OrderType } from '@/types';

// ── Price Store ────────────────────────────────────────────────────────────
interface PriceStoreState {
  prices: PriceMap;
  isConnected: boolean;
  lastUpdate: number;
  updatePrice: (symbol: string, data: Partial<PriceMap[string]>) => void;
  updatePrices: (data: PriceMap) => void;
  setConnected: (v: boolean) => void;
  getPrice: (symbol: string) => number;
}

export const usePriceStore = create<PriceStoreState>()(
  subscribeWithSelector((set, get) => ({
    prices: {},
    isConnected: false,
    lastUpdate: 0,

    updatePrice: (symbol, data) =>
      set((state) => ({
        prices: {
          ...state.prices,
          [symbol]: { ...state.prices[symbol], ...data },
        },
        lastUpdate: Date.now(),
      })),

    updatePrices: (data) =>
      set({ prices: data, lastUpdate: Date.now() }),

    setConnected: (v) => set({ isConnected: v }),

    getPrice: (symbol) => get().prices[symbol]?.price ?? 0,
  }))
);

// ── Trade Store ────────────────────────────────────────────────────────────
interface TradeStoreState extends TradeState {
  setSide: (side: OrderSide) => void;
  setOrderType: (type: OrderType) => void;
  setSymbol: (symbol: string) => void;
  setAmount: (amount: string) => void;
  setQuantity: (quantity: string) => void;
  setLimitPrice: (price: string) => void;
  reset: () => void;
}

const defaultTradeState: TradeState = {
  side: 'buy',
  orderType: 'market',
  symbol: 'BTC',
  amount: '',
  quantity: '',
  limitPrice: '',
};

export const useTradeStore = create<TradeStoreState>()((set) => ({
  ...defaultTradeState,
  setSide: (side) => set({ side }),
  setOrderType: (orderType) => set({ orderType }),
  setSymbol: (symbol) => set({ symbol }),
  setAmount: (amount) => set({ amount }),
  setQuantity: (quantity) => set({ quantity }),
  setLimitPrice: (limitPrice) => set({ limitPrice }),
  reset: () => set(defaultTradeState),
}));

// ── UI Store ───────────────────────────────────────────────────────────────
interface UIStoreState {
  sidebarCollapsed: boolean;
  activeTimeframe: string;
  selectedCoin: string;
  toggleSidebar: () => void;
  setTimeframe: (tf: string) => void;
  setSelectedCoin: (coin: string) => void;
}

export const useUIStore = create<UIStoreState>()((set) => ({
  sidebarCollapsed: false,
  activeTimeframe: '1d',
  selectedCoin: 'BTC',
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setTimeframe: (activeTimeframe) => set({ activeTimeframe }),
  setSelectedCoin: (selectedCoin) => set({ selectedCoin }),
}));

// ── Portfolio Store ────────────────────────────────────────────────────────
interface Holding {
  symbol: string;
  name: string;
  quantity: number;
  avgBuyPrice: number;
  totalInvested: number;
}

interface PortfolioStoreState {
  inrBalance: number;
  holdings: Holding[];
  isLoading: boolean;
  setBalance: (balance: number) => void;
  setHoldings: (holdings: Holding[]) => void;
  setLoading: (v: boolean) => void;
  addHolding: (holding: Holding) => void;
}

export const usePortfolioStore = create<PortfolioStoreState>()((set) => ({
  inrBalance: 0,
  holdings: [],
  isLoading: true,
  setBalance: (inrBalance) => set({ inrBalance }),
  setHoldings: (holdings) => set({ holdings }),
  setLoading: (isLoading) => set({ isLoading }),
  addHolding: (holding) =>
    set((state) => ({
      holdings: [...state.holdings.filter((h) => h.symbol !== holding.symbol), holding],
    })),
}));
