'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function mockHistory(base: number) {
  let v = base * 0.7;
  return MONTHS.map((m) => {
    v = v * (1 + (Math.random() - 0.4) * 0.08);
    return { month: m, value: Math.round(v) };
  });
}

export function PerformanceChart({ totalValue }: { totalValue: number }) {
  const data = mockHistory(totalValue);
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4F8EF7" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#4F8EF7" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,51,72,0.5)" />
        <XAxis dataKey="month" tick={{ fill: '#5C6882', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#5C6882', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false}
          tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} />
        <Tooltip contentStyle={{ background: '#1E2433', border: '1px solid #2A3348', borderRadius: 8, fontSize: 12 }}
          formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Portfolio Value']} />
        <Area type="monotone" dataKey="value" stroke="#4F8EF7" strokeWidth={2} fill="url(#perfGrad)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
