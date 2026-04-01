'use client';
import { useEffect, useRef } from 'react';
import { usePriceStore } from '@/store/usePriceStore';

export const USD_TO_INR_RATE = 83.5;

export const INITIAL_PRICES: Record<string, number> = {
  BTC:  8_542_300,
  ETH:    314_200,
  SOL:     18_400,
  BNB:     52_100,
  XRP:        980,
  ADA:         82,
  AVAX:     3_800,
  DOGE:        26,
  MATIC:      108,
  DOT:        620,
  LINK:     1_240,
  UNI:        930,
  ATOM:       820,
  LTC:      7_200,
  BCH:     28_600,
};

export function usePriceFeed() {
  const { prices, updatePrice, updatePrices, setConnected, isConnected } = usePriceStore();
  const wsRef = useRef<WebSocket | null>(null);
  const mockTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentPricesRef = useRef<Record<string, number>>({ ...INITIAL_PRICES });

  // Initialise with mock prices immediately
  useEffect(() => {
    const map: Record<string, any> = {};
    Object.entries(INITIAL_PRICES).forEach(([sym, price]) => {
      map[sym] = {
        symbol: sym, price,
        change24h: +(Math.random() * 8 - 3).toFixed(2),
        high24h: price * 1.03, low24h: price * 0.97,
        volume24h: price * (Math.random() * 500 + 100),
        timestamp: Date.now(),
      };
    });
    updatePrices(map);
  }, []);

  useEffect(() => {
    function startMock() {
      if (mockTimerRef.current) return;
      mockTimerRef.current = setInterval(() => {
        const syms = Object.keys(currentPricesRef.current);
        const sym = syms[Math.floor(Math.random() * syms.length)];
        const cur = currentPricesRef.current[sym];
        const delta = (Math.random() - 0.49) * cur * 0.003;
        const next = Math.max(1, cur + delta);
        currentPricesRef.current[sym] = next;
        updatePrice(sym, {
          symbol: sym,
          price: Math.round(next * 100) / 100,
          change24h: +(Math.random() * 8 - 3).toFixed(2),
          high24h: next * 1.025, low24h: next * 0.975,
          volume24h: next * (Math.random() * 500 + 100),
          timestamp: Date.now(),
        });
      }, 1500);
    }

    function stopMock() {
      if (mockTimerRef.current) { clearInterval(mockTimerRef.current); mockTimerRef.current = null; }
    }

    startMock(); // Always start mock — stops itself if WS connects

    const SYMBOLS = ['btcusdt','ethusdt','solusdt','bnbusdt','xrpusdt','adausdt','avaxusdt','dogeusdt','maticusdt','dotusdt'];
    const streams = SYMBOLS.map(s => `${s}@ticker`).join('/');

    let ws: WebSocket | undefined;
    try {
      ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);
      wsRef.current = ws;

      ws.onopen = () => { setConnected(true); stopMock(); };

      ws.onmessage = (ev) => {
        try {
          const tick = JSON.parse(ev.data)?.data;
          if (!tick?.s) return;
          const sym = (tick.s as string).replace('USDT','');
          const price = parseFloat(tick.c) * USD_TO_INR_RATE;
          currentPricesRef.current[sym] = price;
          updatePrice(sym, {
            symbol: sym,
            price: Math.round(price * 100) / 100,
            change24h: parseFloat(tick.P),
            high24h: parseFloat(tick.h) * USD_TO_INR_RATE,
            low24h:  parseFloat(tick.l) * USD_TO_INR_RATE,
            volume24h: parseFloat(tick.q) * USD_TO_INR_RATE,
            timestamp: Date.now(),
          });
        } catch {}
      };

      ws.onerror = () => { setConnected(false); startMock(); };
      ws.onclose = () => { setConnected(false); startMock(); };
    } catch {}

    return () => {
      stopMock();
      if (ws) { try { ws.close(); } catch {} }
    };
  }, []);

  return { prices, isConnected };
}

export function useCoinPrice(symbol: string) {
  return usePriceStore((s) => s.prices[symbol] ?? null);
}
