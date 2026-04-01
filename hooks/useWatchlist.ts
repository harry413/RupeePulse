// hooks/useWatchlist.ts — Watchlist state with API sync

'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

interface WatchlistItem {
  symbol: string;
  coinName: string;
}

export function useWatchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const symbols = new Set(items.map((i) => i.symbol));

  useEffect(() => {
    fetch('/api/watchlist')
      .then((r) => r.json())
      .then((d) => { if (d.success) setItems(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const add = useCallback(async (symbol: string, coinName: string) => {
    if (symbols.has(symbol)) return;
    setItems((prev) => [...prev, { symbol, coinName }]);
    try {
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, coinName }),
      });
      const d = await res.json();
      if (d.success) toast.success(`${symbol} added to watchlist`);
    } catch {
      setItems((prev) => prev.filter((i) => i.symbol !== symbol));
      toast.error('Failed to update watchlist');
    }
  }, [symbols]);

  const remove = useCallback(async (symbol: string) => {
    setItems((prev) => prev.filter((i) => i.symbol !== symbol));
    try {
      await fetch(`/api/watchlist?symbol=${symbol}`, { method: 'DELETE' });
      toast.success(`${symbol} removed from watchlist`);
    } catch {
      toast.error('Failed to update watchlist');
    }
  }, []);

  const toggle = useCallback((symbol: string, coinName: string) => {
    if (symbols.has(symbol)) remove(symbol);
    else add(symbol, coinName);
  }, [symbols, add, remove]);

  return { items, symbols, loading, add, remove, toggle };
}
