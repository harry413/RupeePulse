'use client';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { getCoinColor } from '@/lib/utils';

interface HoldingItem { symbol: string; name: string; currentValue: number; pnlPct: number; }

export function PortfolioDonut({ holdings, totalValue }: { holdings: HoldingItem[]; totalValue: number }) {
  const data = holdings.slice(0, 6).map((h) => ({
    name: h.symbol, value: h.currentValue, color: getCoinColor(h.symbol),
  }));

  return (
    <div className="flex flex-col gap-4">
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
            paddingAngle={3} dataKey="value" strokeWidth={0}>
            {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#1E2433', border: '1px solid #2A3348', borderRadius: 8, fontSize: 12 }}
            formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, '']}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2">
        {data.map((d) => {
          const pct = totalValue > 0 ? (d.value / totalValue * 100) : 0;
          return (
            <div key={d.name} className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: d.color }} />
              <span className="text-xs font-medium flex-1">{d.name}</span>
              <span className="text-xs text-[#9BA5BF] font-mono">{pct.toFixed(1)}%</span>
              <span className="text-xs font-mono">₹{(d.value/100000).toFixed(1)}L</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
