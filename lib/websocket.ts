// lib/websocket.ts — Binance WebSocket price feed
// Provides real-time price updates via Binance public streams

// Symbols to subscribe to (Binance uses USDT pairs, we convert to INR)
const SYMBOLS = ['btcusdt', 'ethusdt', 'solusdt', 'bnbusdt', 'xrpusdt', 
                 'adausdt', 'avaxusdt', 'dogeusdt', 'maticusdt', 'dotusdt'];

const BINANCE_WS = 'wss://stream.binance.com:9443/stream';

// Approximate USD to INR rate — in production, fetch this from an FX API
export const USD_TO_INR = 83.5;

export interface TickerData {
  symbol: string;   // e.g. "BTC"
  price: number;    // In INR
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
}

type PriceCallback = (data: TickerData) => void;

// Client-side WebSocket manager (singleton)
class PriceFeed {
  private ws: WebSocket | null = null;
  private callbacks: Set<PriceCallback> = new Set();
  private reconnectTimer: NodeJS.Timeout | null = null;
  private reconnectDelay = 2000;
  private isConnecting = false;

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) return;
    this.isConnecting = true;

    // Build multi-stream URL: combine all tickers into one connection
    const streams = SYMBOLS.map(s => `${s}@ticker`).join('/');
    const url = `${BINANCE_WS}?streams=${streams}`;

    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log('🟢 Binance WS connected');
        this.isConnecting = false;
        this.reconnectDelay = 2000; // Reset backoff
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          const tick = msg.data;
          if (!tick) return;

          // Parse symbol: "BTCUSDT" → "BTC"
          const rawSymbol = tick.s as string;
          const symbol = rawSymbol.replace('USDT', '');

          const data: TickerData = {
            symbol,
            price: parseFloat(tick.c) * USD_TO_INR,        // Last price → INR
            change24h: parseFloat(tick.P),                  // 24h change %
            high24h: parseFloat(tick.h) * USD_TO_INR,
            low24h: parseFloat(tick.l) * USD_TO_INR,
            volume24h: parseFloat(tick.q) * USD_TO_INR,     // Quote volume
          };

          // Notify all subscribers
          this.callbacks.forEach(cb => cb(data));
        } catch (err) {
          // Silently ignore parse errors
        }
      };

      this.ws.onerror = (err) => {
        console.warn('Binance WS error:', err);
      };

      this.ws.onclose = () => {
        this.isConnecting = false;
        console.log('🔴 Binance WS disconnected — reconnecting...');
        this.scheduleReconnect();
      };
    } catch (err) {
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000);
      this.connect();
    }, this.reconnectDelay);
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  subscribe(cb: PriceCallback) {
    this.callbacks.add(cb);
    if (this.callbacks.size === 1) this.connect(); // Auto-connect on first subscriber
    return () => this.unsubscribe(cb);
  }

  unsubscribe(cb: PriceCallback) {
    this.callbacks.delete(cb);
    if (this.callbacks.size === 0) this.disconnect(); // Auto-disconnect when no subscribers
  }

  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Singleton instance — shared across all components
export const priceFeed = new PriceFeed();
