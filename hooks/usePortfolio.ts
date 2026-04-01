// hooks/usePortfolio.ts — Hook to fetch and manage portfolio state

'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePriceStore } from '@/store/usePriceStore';

interface Holding {
  symbol: string;
  name: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  currentValue: number;
  totalInvested: number;
  pnl: number;
  pnlPct: number;
}

interface PortfolioData {
  inrBalance: number;
  totalValue: number;
  totalHoldingsValue: number;
  totalInvested: number;
  totalPnL: number;
  totalPnLPct: number;
  dayChange: number;
  dayChangePct: number;
  holdings: Holding[];
}

const EMPTY_PORTFOLIO: PortfolioData = {
  inrBalance: 0,
  totalValue: 0,
  totalHoldingsValue: 0,
  totalInvested: 0,
  totalPnL: 0,
  totalPnLPct: 0,
  dayChange: 0,
  dayChangePct: 0,
  holdings: [],
};

export function usePortfolio() {
  const [data, setData] = useState<PortfolioData>(EMPTY_PORTFOLIO);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prices = usePriceStore((s) => s.prices);

  const fetchPortfolio = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/portfolio');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  // Recompute live value from price store updates
  const liveValue = data.inrBalance + data.holdings.reduce((sum, h) => {
    const livePrice = prices[h.symbol]?.price ?? h.currentPrice;
    return sum + h.quantity * livePrice;
  }, 0);

  return {
    ...data,
    totalValue: liveValue,
    loading,
    error,
    refresh: fetchPortfolio,
  };
}

// ── Hook: order history with pagination ──────────────────────────────────────
interface Order {
  _id: string;
  symbol: string;
  coinName: string;
  side: 'buy' | 'sell';
  type: string;
  quantity: number;
  price: number;
  total: number;
  fee: number;
  status: string;
  createdAt: string;
}

export function useOrders(limit = 20) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = useCallback(async (pg = 1) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders?page=${pg}&limit=${limit}`);
      const json = await res.json();
      if (json.success) {
        setOrders(json.data);
        setTotalPages(json.pagination?.pages ?? 1);
        setPage(pg);
      }
    } catch {
      // silently keep previous data
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => { fetchOrders(1); }, [fetchOrders]);

  return { orders, loading, page, totalPages, fetchPage: fetchOrders };
}
