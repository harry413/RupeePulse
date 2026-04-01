'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { User, Shield, Bell, Palette, Globe, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'profile'|'security'|'notifications'|'appearance'|'api';

const TABS = [
  { id:'profile',       label:'Profile',       icon:User       },
  { id:'security',      label:'Security',      icon:Shield      },
  { id:'notifications', label:'Notifications', icon:Bell        },
  { id:'appearance',    label:'Appearance',    icon:Palette     },
  { id:'api',           label:'API Keys',      icon:CreditCard  },
] as const;

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className={cn('w-10 h-5 rounded-full transition-all relative',
      checked ? 'bg-[#00D4A0]' : 'bg-[#2A3348]')}>
      <span className={cn('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all',
        checked ? 'left-5' : 'left-0.5')} />
    </button>
  );
}

function InputField({ label, value, type='text', disabled=false }: { label:string; value:string; type?:string; disabled?:boolean }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-[#5C6882] uppercase tracking-wider mb-1.5">{label}</label>
      <input type={type} defaultValue={value} disabled={disabled}
        className="w-full px-3 py-2.5 rounded-lg text-sm bg-[#111318] border border-[#2A3348] text-[#E8EBF2] outline-none focus:border-[#4F8EF7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed" />
    </div>
  );
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [notifs, setNotifs] = useState({ priceAlerts:true, orderFills:true, news:false, marketing:false });

  return (
    <div className="space-y-4 page-enter">
      <div>
        <h1 className="text-lg font-bold">Settings</h1>
        <p className="text-xs text-[#9BA5BF] mt-0.5">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Sidebar */}
        <div className="bg-[#1E2433] border border-[#2A3348] rounded-xl p-2 h-fit">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id as Tab)}
              className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left',
                activeTab === id ? 'bg-[#4F8EF7]/10 text-[#4F8EF7] border border-[#4F8EF7]/20' : 'text-[#9BA5BF] hover:bg-[#252D3D] hover:text-[#E8EBF2] border border-transparent'
              )}>
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3 bg-[#1E2433] border border-[#2A3348] rounded-xl p-5">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <h2 className="font-semibold">Profile Information</h2>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold"
                  style={{ background: 'linear-gradient(135deg,#A78BFA,#4F8EF7)' }}>
                  {session?.user?.name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) ?? 'U'}
                </div>
                <div>
                  <p className="font-semibold">{session?.user?.name ?? 'Trader'}</p>
                  <p className="text-xs text-[#9BA5BF]">Pro Account • Member since 2024</p>
                  <button className="text-xs text-[#4F8EF7] hover:underline mt-0.5">Change avatar</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Full Name" value={session?.user?.name ?? ''} />
                <InputField label="Email" value={session?.user?.email ?? ''} type="email" />
                <InputField label="Phone" value="+91 98765 43210" type="tel" />
                <div>
                  <label className="block text-[11px] font-semibold text-[#5C6882] uppercase tracking-wider mb-1.5">Currency</label>
                  <select className="w-full px-3 py-2.5 rounded-lg text-sm bg-[#111318] border border-[#2A3348] text-[#E8EBF2] outline-none focus:border-[#4F8EF7]">
                    <option>INR — Indian Rupee</option>
                    <option>USD — US Dollar</option>
                    <option>EUR — Euro</option>
                  </select>
                </div>
              </div>
              <button onClick={() => toast.success('Profile updated!')}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#2D6FD9] to-[#4F8EF7] text-white hover:shadow-[0_4px_20px_rgba(79,142,247,0.3)] transition-all">
                Save Changes
              </button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-5">
              <h2 className="font-semibold">Security</h2>
              <div className="space-y-3">
                <InputField label="Current Password" value="" type="password" />
                <InputField label="New Password" value="" type="password" />
                <InputField label="Confirm New Password" value="" type="password" />
              </div>
              <button onClick={() => toast.success('Password updated!')}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#2D6FD9] to-[#4F8EF7] text-white">
                Update Password
              </button>
              <div className="border-t border-[#2A3348] pt-4">
                <p className="font-medium text-sm mb-1">Two-Factor Authentication</p>
                <p className="text-xs text-[#9BA5BF] mb-3">Add an extra layer of security to your account</p>
                <button className="px-4 py-2 rounded-lg text-xs border border-[#2A3348] text-[#9BA5BF] hover:border-[#4F8EF7] hover:text-[#4F8EF7] transition-all">Enable 2FA</button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h2 className="font-semibold">Notification Preferences</h2>
              {[
                { key:'priceAlerts', label:'Price alerts', desc:'Get notified when your price alerts trigger' },
                { key:'orderFills',  label:'Order fills',  desc:'Notification when your orders are executed' },
                { key:'news',        label:'Market news',  desc:'Daily market updates and crypto news' },
                { key:'marketing',   label:'Promotions',   desc:'Product updates and special offers' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-[#2A3348] last:border-0">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-[#9BA5BF]">{item.desc}</p>
                  </div>
                  <Toggle checked={notifs[item.key as keyof typeof notifs]} onChange={() => setNotifs(n => ({...n, [item.key]:!n[item.key as keyof typeof n]}))} />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <h2 className="font-semibold">Appearance</h2>
              <div>
                <label className="block text-[11px] font-semibold text-[#5C6882] uppercase tracking-wider mb-3">Theme</label>
                <div className="flex gap-3">
                  {['Dark','Light','System'].map((t) => (
                    <button key={t} className={cn('flex-1 py-3 rounded-xl text-sm font-medium border transition-all',
                      t === 'Dark' ? 'border-[#4F8EF7]/40 bg-[#4F8EF7]/10 text-[#4F8EF7]' : 'border-[#2A3348] text-[#9BA5BF] hover:border-[#3A4660]')}>
                      {t === 'Dark' ? '🌙 ' : t === 'Light' ? '☀️ ' : '💻 '}{t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#5C6882] uppercase tracking-wider mb-3">Accent Color</label>
                <div className="flex gap-2">
                  {['#4F8EF7','#00D4A0','#A78BFA','#FF4757','#FFB547'].map((c) => (
                    <button key={c} className="w-8 h-8 rounded-full border-2 border-transparent hover:border-white/40 transition-all"
                      style={{ background:c }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-4">
              <h2 className="font-semibold">API Keys</h2>
              <div className="bg-[#111318] border border-[#FFB547]/30 rounded-xl p-4 text-xs text-[#FFB547]">
                ⚠️ Keep your API keys secret. Never share them or commit them to version control.
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#5C6882] uppercase tracking-wider mb-1.5">Your API Key</label>
                <div className="flex gap-2">
                  <input type="password" defaultValue="rp_live_••••••••••••••••••••••••••••••••"
                    className="flex-1 px-3 py-2.5 rounded-lg text-sm font-mono bg-[#111318] border border-[#2A3348] text-[#E8EBF2] outline-none" />
                  <button onClick={() => toast.success('Copied!')} className="px-4 py-2 rounded-lg text-xs bg-[#252D3D] text-[#9BA5BF] hover:text-[#E8EBF2] border border-[#2A3348]">Copy</button>
                </div>
              </div>
              <button className="px-4 py-2 rounded-lg text-xs bg-[#FF4757]/10 text-[#FF4757] border border-[#FF4757]/30 hover:bg-[#FF4757]/20 transition-all">
                Regenerate Key
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
