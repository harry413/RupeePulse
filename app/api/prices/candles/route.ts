// app/api/prices/candles/route.ts — OHLC candlestick data for charts

import { NextRequest, NextResponse } from 'next/server';
import { getOHLC } from '@/lib/coingecko';
import { mockCandleData } from '@/lib/utils';
import { INITIAL_PRICES } from '@/hooks/usePriceFeed';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol')?.toUpperCase() ?? 'BTC';
  const days = parseInt(searchParams.get('days') ?? '30');

  try {
    const candles = await getOHLC(symbol, days);
    return NextResponse.json({ success: true, data: candles });
  } catch {
    // Return mock candle data if CoinGecko unavailable
    const basePrice = INITIAL_PRICES[symbol] ?? 1000;
    const count = days === 1 ? 24 : days <= 7 ? days * 6 : days;
    const mockCandles = mockCandleData(basePrice, count);
    return NextResponse.json({ success: true, data: mockCandles, mock: true });
  }
}
