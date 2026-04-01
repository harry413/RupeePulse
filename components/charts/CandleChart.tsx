'use client';
import { useEffect, useRef, useState } from 'react';
import { cn, mockCandleData } from '@/lib/utils';
import { usePriceStore } from '@/store/usePriceStore';
import { INITIAL_PRICES } from '@/hooks/usePriceFeed';

const TIMEFRAMES = [
  { label: '1m', value: '1m', candles: 60 },
  { label: '5m', value: '5m', candles: 60 },
  { label: '1h', value: '1h', candles: 72 },
  { label: '4h', value: '4h', candles: 60 },
  { label: '1D', value: '1d', candles: 90 },
  { label: '1W', value: '1w', candles: 52 },
];

interface CandleChartProps { symbol: string; height?: number; className?: string; showToolbar?: boolean; }

export function CandleChart({ symbol, height = 300, className, showToolbar = true }: CandleChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const [activeTimeframe, setActiveTimeframe] = useState('1d');
  const [chartReady, setChartReady] = useState(false);
  const prices = usePriceStore((s) => s.prices);

  useEffect(() => {
    if (!containerRef.current) return;
    let cleanup: (() => void) | undefined;

    async function init() {
      try {
        const { createChart, CrosshairMode, LineStyle } = await import('lightweight-charts');
        if (!containerRef.current) return;
        const chart = createChart(containerRef.current, {
          width: containerRef.current.clientWidth, height,
          layout: { background: { color: 'transparent' }, textColor: '#9BA5BF', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' },
          grid: { vertLines: { color: 'rgba(42,51,72,0.5)' }, horzLines: { color: 'rgba(42,51,72,0.5)' } },
          crosshair: { mode: CrosshairMode.Normal },
          rightPriceScale: { borderColor: '#2A3348', scaleMargins: { top: 0.1, bottom: 0.15 } },
          timeScale: { borderColor: '#2A3348', timeVisible: true },
        });
        const candleSeries = chart.addCandlestickSeries({
          upColor: '#00D4A0', downColor: '#FF4757',
          borderUpColor: '#00D4A0', borderDownColor: '#FF4757',
          wickUpColor: '#00A87D', wickDownColor: '#CC3344',
        });
        const volSeries = chart.addHistogramSeries({
          priceFormat: { type: 'volume' }, priceScaleId: '',
          scaleMargins: { top: 0.85, bottom: 0 },
        });
        const base = prices[symbol]?.price ?? INITIAL_PRICES[symbol] ?? 1000;
        const candles = mockCandleData(base, 90);
        candleSeries.setData(candles);
        volSeries.setData(candles.map((c: any) => ({ time: c.time, value: c.volume, color: c.close >= c.open ? 'rgba(0,212,160,0.3)' : 'rgba(255,71,87,0.3)' })));
        chart.timeScale().fitContent();
        chartRef.current = chart;
        seriesRef.current = candleSeries;
        setChartReady(true);
        const ro = new ResizeObserver(() => { if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth }); });
        ro.observe(containerRef.current);
        cleanup = () => { ro.disconnect(); try { chart.remove(); } catch {} };
      } catch (e) { console.warn('chart init error', e); }
    }
    init();
    return () => { cleanup?.(); chartRef.current = null; seriesRef.current = null; };
  }, [symbol, height]);

  useEffect(() => {
    if (!seriesRef.current) return;
    const base = prices[symbol]?.price ?? INITIAL_PRICES[symbol] ?? 1000;
    const tf = TIMEFRAMES.find((t) => t.value === activeTimeframe);
    const candles = mockCandleData(base, tf?.candles ?? 90);
    seriesRef.current.setData(candles);
    chartRef.current?.timeScale().fitContent();
  }, [activeTimeframe, symbol]);

  const livePriceData = prices[symbol]?.price;
  useEffect(() => {
    if (!seriesRef.current || !chartReady || !livePriceData) return;
    const p = prices[symbol]!;
    seriesRef.current.update({ time: Math.floor(Date.now() / 1000), open: p.price * 0.9998, high: p.high24h || p.price * 1.02, low: p.low24h || p.price * 0.98, close: p.price });
  }, [livePriceData, chartReady]);

  return (
    <div className={cn('flex flex-col', className)}>
      {showToolbar && (
        <div className="flex items-center gap-1 mb-3 flex-wrap">
          {TIMEFRAMES.map((tf) => (
            <button key={tf.value} onClick={() => setActiveTimeframe(tf.value)}
              className={cn('px-2.5 py-1 rounded-md text-xs font-medium transition-all',
                activeTimeframe === tf.value ? 'bg-[#4F8EF7]/15 text-[#4F8EF7] border border-[#4F8EF7]/30' : 'text-[#5C6882] hover:text-[#9BA5BF] hover:bg-[#252D3D]'
              )}>
              {tf.label}
            </button>
          ))}
          <div className="flex items-center gap-3 ml-auto text-[11px] text-[#5C6882]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#00D4A0] inline-block" />Bullish</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#FF4757] inline-block" />Bearish</span>
          </div>
        </div>
      )}
      <div ref={containerRef} style={{ height }} className="w-full" />
    </div>
  );
}

// ── MiniChart — sparkline for market tables ─────────────────────────────────
// Accepts either { prices, up } or { data, color } for backward compat
export function MiniChart({
  prices,
  data,
  up,
  color,
  width = 80,
  height = 32,
}: {
  prices?: number[];
  data?: number[];
  up?: boolean;
  color?: string;
  width?: number;
  height?: number;
}) {
  const pts_data = prices ?? data ?? [];
  if (pts_data.length < 2) return null;
  const min = Math.min(...pts_data);
  const max = Math.max(...pts_data);
  const range = max - min || 1;
  const pts = pts_data.map((p, i) => {
    const x = (i / (pts_data.length - 1)) * width;
    const y = height - ((p - min) / range) * (height - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const strokeColor = color ?? (up ? '#00D4A0' : '#FF4757');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
