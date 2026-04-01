'use client';
import { useState } from 'react';
import { Bell, Plus, Trash2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { formatINR, getCoinColor, cn } from '@/lib/utils';

interface Alert { id:string; symbol:string; coinName:string; condition:'above'|'below'; targetPrice:number; isActive:boolean; triggered:boolean; }

const INITIAL_ALERTS: Alert[] = [
  { id:'1', symbol:'BTC', coinName:'Bitcoin',   condition:'above', targetPrice:9000000, isActive:true,  triggered:false },
  { id:'2', symbol:'ETH', coinName:'Ethereum',  condition:'below', targetPrice:280000,  isActive:true,  triggered:false },
  { id:'3', symbol:'SOL', coinName:'Solana',    condition:'above', targetPrice:20000,   isActive:false, triggered:true  },
  { id:'4', symbol:'BNB', coinName:'BNB',       condition:'below', targetPrice:48000,   isActive:true,  triggered:false },
];

const COINS = ['BTC','ETH','SOL','BNB','XRP','ADA','AVAX','DOGE'];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ symbol:'BTC', condition:'above' as 'above'|'below', price:'' });

  function toggleAlert(id: string) {
    setAlerts((a) => a.map((al) => al.id === id ? { ...al, isActive: !al.isActive } : al));
  }
  function deleteAlert(id: string) {
    setAlerts((a) => a.filter((al) => al.id !== id));
    toast.success('Alert deleted');
  }
  function createAlert() {
    if (!form.price) { toast.error('Enter a target price'); return; }
    const newAlert: Alert = {
      id: Date.now().toString(),
      symbol: form.symbol,
      coinName: form.symbol,
      condition: form.condition,
      targetPrice: parseFloat(form.price),
      isActive: true,
      triggered: false,
    };
    setAlerts((a) => [newAlert, ...a]);
    toast.success(`Alert created for ${form.symbol}`);
    setShowForm(false);
    setForm({ symbol:'BTC', condition:'above', price:'' });
  }

  return (
    <div className="space-y-4 page-enter max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2"><Bell size={18} className="text-[#4F8EF7]" />Price Alerts</h1>
          <p className="text-xs text-[#9BA5BF] mt-0.5">{alerts.filter(a=>a.isActive).length} active alerts</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4F8EF7]/10 border border-[#4F8EF7]/30 text-[#4F8EF7] text-sm font-medium hover:bg-[#4F8EF7]/20 transition-all">
          <Plus size={15} />New Alert
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
          className="bg-[#1E2433] border border-[#4F8EF7]/20 rounded-xl p-5">
          <p className="text-sm font-semibold mb-4">Create Price Alert</p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#5C6882] uppercase tracking-wider mb-1.5">Coin</label>
              <select value={form.symbol} onChange={e => setForm({...form, symbol:e.target.value})}
                className="w-full px-3 py-2 rounded-lg text-sm bg-[#111318] border border-[#2A3348] text-[#E8EBF2] outline-none">
                {COINS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#5C6882] uppercase tracking-wider mb-1.5">Condition</label>
              <select value={form.condition} onChange={e => setForm({...form, condition:e.target.value as any})}
                className="w-full px-3 py-2 rounded-lg text-sm bg-[#111318] border border-[#2A3348] text-[#E8EBF2] outline-none">
                <option value="above">Goes Above</option>
                <option value="below">Goes Below</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#5C6882] uppercase tracking-wider mb-1.5">Target (₹)</label>
              <input type="number" value={form.price} onChange={e => setForm({...form, price:e.target.value})}
                placeholder="Enter price"
                className="w-full px-3 py-2 rounded-lg text-sm font-mono bg-[#111318] border border-[#2A3348] text-[#E8EBF2] placeholder-[#5C6882] outline-none focus:border-[#4F8EF7] transition-colors" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={createAlert}
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#2D6FD9] to-[#4F8EF7] text-white">
              Create Alert
            </button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-lg text-sm text-[#5C6882] hover:text-[#9BA5BF]">Cancel</button>
          </div>
        </motion.div>
      )}

      <div className="bg-[#1E2433] border border-[#2A3348] rounded-xl overflow-hidden">
        <AnimatePresence>
          {alerts.map((alert) => (
            <motion.div key={alert.id} layout exit={{ opacity:0, height:0 }}
              className="flex items-center gap-4 px-5 py-4 border-b border-[#2A3348]/50 last:border-0">
              <div className={cn('w-2.5 h-2.5 rounded-full flex-shrink-0',
                alert.triggered ? 'bg-[#FFB547]' : alert.isActive ? 'bg-[#00D4A0] animate-pulse' : 'bg-[#5C6882]')} />
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: getCoinColor(alert.symbol)+'22', color: getCoinColor(alert.symbol) }}>
                {alert.symbol.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{alert.coinName}</p>
                <p className="text-xs text-[#9BA5BF]">
                  {alert.condition === 'above' ? '↑ Goes above' : '↓ Goes below'}{' '}
                  <span className="font-mono text-[#E8EBF2]">{formatINR(alert.targetPrice)}</span>
                </p>
              </div>
              <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full',
                alert.triggered ? 'bg-[#FFB547]/15 text-[#FFB547]' :
                alert.isActive ? 'bg-[#00D4A0]/15 text-[#00D4A0]' : 'bg-[#5C6882]/20 text-[#5C6882]')}>
                {alert.triggered ? '⚡ Triggered' : alert.isActive ? 'Active' : 'Paused'}
              </span>
              <button onClick={() => toggleAlert(alert.id)}
                className={cn('w-10 h-5 rounded-full transition-all relative flex-shrink-0',
                  alert.isActive ? 'bg-[#00D4A0]' : 'bg-[#2A3348]')}>
                <span className={cn('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all',
                  alert.isActive ? 'left-5' : 'left-0.5')} />
              </button>
              <button onClick={() => deleteAlert(alert.id)} className="text-[#5C6882] hover:text-[#FF4757] transition-colors p-1">
                <Trash2 size={15} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
