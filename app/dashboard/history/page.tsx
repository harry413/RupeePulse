'use client';
import { useState } from 'react';
import { Download, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatINR, cn } from '@/lib/utils';

const ORDERS = [
  { id:'ORD001', time:'Today 14:32', side:'buy',  coin:'BTC', qty:'0.003 BTC', price:8420000,  total:25260,   fee:25,   status:'Filled'    },
  { id:'ORD002', time:'Today 11:15', side:'sell', coin:'ETH', qty:'0.5 ETH',  price:310000,   total:155000,  fee:155,  status:'Filled'    },
  { id:'ORD003', time:'Yesterday',   side:'buy',  coin:'SOL', qty:'5 SOL',    price:17200,    total:86000,   fee:86,   status:'Filled'    },
  { id:'ORD004', time:'Yesterday',   side:'buy',  coin:'DOGE',qty:'2000 DOGE',price:24,       total:48000,   fee:48,   status:'Filled'    },
  { id:'ORD005', time:'2d ago',       side:'sell', coin:'BNB', qty:'1 BNB',   price:54000,    total:54000,   fee:54,   status:'Filled'    },
  { id:'ORD006', time:'3d ago',       side:'buy',  coin:'XRP', qty:'200 XRP', price:900,      total:180000,  fee:180,  status:'Cancelled' },
  { id:'ORD007', time:'4d ago',       side:'buy',  coin:'ADA', qty:'500 ADA', price:80,       total:40000,   fee:40,   status:'Filled'    },
  { id:'ORD008', time:'5d ago',       side:'sell', coin:'BTC', qty:'0.001 BTC',price:8350000, total:8350,    fee:8,    status:'Filled'    },
  { id:'ORD009', time:'1w ago',       side:'buy',  coin:'AVAX',qty:'3 AVAX',  price:3900,     total:11700,   fee:12,   status:'Filled'    },
  { id:'ORD010', time:'1w ago',       side:'limit-buy',coin:'ETH',qty:'1 ETH',price:295000,  total:295000,  fee:295,  status:'Pending'   },
];

export default function HistoryPage() {
  const [filter, setFilter] = useState<'all'|'buy'|'sell'>('all');
  const [statusFilter, setStatusFilter] = useState<'all'|'filled'|'cancelled'|'pending'>('all');

  const filtered = ORDERS.filter((o) => {
    if (filter !== 'all' && !o.side.includes(filter)) return false;
    if (statusFilter !== 'all' && o.status.toLowerCase() !== statusFilter) return false;
    return true;
  });

  const totalBuy = ORDERS.filter(o => o.side.includes('buy') && o.status==='Filled').reduce((s,o) => s+o.total, 0);
  const totalSell = ORDERS.filter(o => o.side.includes('sell') && o.status==='Filled').reduce((s,o) => s+o.total, 0);
  const totalFees = ORDERS.filter(o => o.status==='Filled').reduce((s,o) => s+o.fee, 0);

  return (
    <div className="space-y-4 page-enter">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-bold">Order History</h1>
          <p className="text-xs text-[#9BA5BF] mt-0.5">{ORDERS.length} total orders</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E2433] border border-[#2A3348] text-sm text-[#9BA5BF] hover:text-[#E8EBF2] transition-all">
          <Download size={14} />Export CSV
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label:'Total Bought', value:formatINR(totalBuy), color:'#00D4A0' },
          { label:'Total Sold',   value:formatINR(totalSell),color:'#FF4757' },
          { label:'Fees Paid',    value:formatINR(totalFees), color:'#FFB547' },
        ].map((s) => (
          <div key={s.label} className="bg-[#1E2433] border border-[#2A3348] rounded-xl p-3">
            <p className="text-[11px] text-[#5C6882] uppercase tracking-wider">{s.label}</p>
            <p className="text-base font-bold font-mono mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        <div className="flex gap-1 bg-[#1E2433] border border-[#2A3348] rounded-xl p-1">
          {(['all','buy','sell'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all',
                filter === f ? 'bg-[#252D3D] text-[#E8EBF2]' : 'text-[#5C6882] hover:text-[#9BA5BF]')}>
              {f === 'buy' ? '▲ Buys' : f === 'sell' ? '▼ Sells' : 'All'}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-[#1E2433] border border-[#2A3348] rounded-xl p-1">
          {(['all','filled','cancelled','pending'] as const).map((f) => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all',
                statusFilter === f ? 'bg-[#252D3D] text-[#E8EBF2]' : 'text-[#5C6882] hover:text-[#9BA5BF]')}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#1E2433] border border-[#2A3348] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A3348]">
                {['Order ID','Time','Type','Asset','Qty','Price','Total','Fee','Status'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-[#5C6882] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => (
                <motion.tr key={o.id} initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.03 }}
                  className="border-b border-[#2A3348]/50 last:border-0 hover:bg-[#252D3D]/50 transition-colors">
                  <td className="px-4 py-3 text-[11px] font-mono text-[#5C6882]">{o.id}</td>
                  <td className="px-4 py-3 text-xs text-[#9BA5BF] whitespace-nowrap">{o.time}</td>
                  <td className="px-4 py-3">
                    <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase',
                      o.side.includes('buy') ? 'bg-[#00D4A0]/15 text-[#00D4A0]' : 'bg-[#FF4757]/15 text-[#FF4757]')}>
                      {o.side}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold">{o.coin}</td>
                  <td className="px-4 py-3 text-xs font-mono text-[#9BA5BF]">{o.qty}</td>
                  <td className="px-4 py-3 text-xs font-mono">{formatINR(o.price)}</td>
                  <td className="px-4 py-3 text-xs font-mono font-semibold">{formatINR(o.total)}</td>
                  <td className="px-4 py-3 text-xs font-mono text-[#FFB547]">{formatINR(o.fee)}</td>
                  <td className="px-4 py-3">
                    <span className={cn('text-xs font-medium',
                      o.status === 'Filled' ? 'text-[#00D4A0]' :
                      o.status === 'Cancelled' ? 'text-[#FF4757]' : 'text-[#FFB547]')}>
                      {o.status === 'Filled' ? '✓ ' : o.status === 'Pending' ? '⏳ ' : '✗ '}{o.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
