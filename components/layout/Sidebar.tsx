// components/layout/Sidebar.tsx — Collapsible sidebar navigation

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ArrowLeftRight, PieChart, BarChart2,
  Star, Bell, History, Settings, ChevronLeft, LogOut, Zap,
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useUIStore } from '@/store/usePriceStore';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Dashboard',  href: '/dashboard',           icon: LayoutDashboard },
  { label: 'Trade',      href: '/dashboard/trade',      icon: ArrowLeftRight },
  { label: 'Portfolio',  href: '/dashboard/portfolio',  icon: PieChart },
  { label: 'Markets',    href: '/dashboard/markets',    icon: BarChart2 },
  { label: 'Watchlist',  href: '/dashboard/watchlist',  icon: Star },
  { label: 'Alerts',     href: '/dashboard/alerts',     icon: Bell, badge: 3 },
  { label: 'History',    href: '/dashboard/history',    icon: History },
  { label: 'Settings',   href: '/dashboard/settings',   icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const w = sidebarCollapsed ? 64 : 220;

  const initials = session?.user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? 'U';

  return (
    <motion.aside
      animate={{ width: w }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="flex flex-col bg-[#111318] border-r border-[#2A3348] h-screen overflow-hidden flex-shrink-0 z-20"
      style={{ width: w }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-[#2A3348] h-14 flex-shrink-0">
        <div
          className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-[#0A0B0E] text-base"
          style={{ background: 'linear-gradient(135deg, #00D4A0, #4F8EF7)' }}
        >
          R
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="font-bold text-base tracking-tight whitespace-nowrap"
            >
              Rupee<span className="text-[#00D4A0]">Pulse</span>
            </motion.span>
          )}
        </AnimatePresence>
        {!sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="ml-auto text-[#5C6882] hover:text-[#E8EBF2] transition-colors p-1 rounded-lg hover:bg-[#1E2433]"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {sidebarCollapsed && (
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center py-3 text-[#5C6882] hover:text-[#E8EBF2] transition-colors hover:bg-[#1E2433]"
        >
          <ChevronLeft size={16} className="rotate-180" />
        </button>
      )}

      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
        {!sidebarCollapsed && (
          <p className="px-3 pt-2 pb-1 text-[10px] font-semibold text-[#5C6882] uppercase tracking-widest">
            Navigation
          </p>
        )}
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 relative group',
                  active
                    ? 'bg-[#4F8EF7]/10 text-[#4F8EF7] border border-[#4F8EF7]/20'
                    : 'text-[#9BA5BF] hover:bg-[#1E2433] hover:text-[#E8EBF2] border border-transparent'
                )}
              >
                <Icon size={17} className="flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium whitespace-nowrap flex-1">{item.label}</span>
                )}
                {item.badge && !sidebarCollapsed && (
                  <span className="bg-[#FF4757] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-auto">
                    {item.badge}
                  </span>
                )}
                {item.badge && sidebarCollapsed && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF4757] rounded-full" />
                )}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-3 px-2 py-1 bg-[#252D3D] border border-[#2A3348] rounded-lg text-xs text-[#E8EBF2] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    {item.label}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {!sidebarCollapsed && (
        <div className="px-4 py-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#00D4A0]/5 border border-[#00D4A0]/15">
            <Zap size={12} className="text-[#00D4A0]" />
            <span className="text-xs text-[#00D4A0] font-medium">Live trading active</span>
            <span className="ml-auto live-dot" />
          </div>
        </div>
      )}

      <div className="p-3 border-t border-[#2A3348] flex-shrink-0">
        <div
          className={cn(
            'flex items-center gap-3 p-2.5 rounded-xl bg-[#161A22] cursor-pointer hover:bg-[#1E2433] transition-colors',
            sidebarCollapsed && 'justify-center'
          )}
        >
          <div
            className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #A78BFA, #4F8EF7)' }}
          >
            {initials}
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session?.user?.name ?? 'Trader'}</p>
              <p className="text-xs text-[#00D4A0]">● Pro Account</p>
            </div>
          )}
          {!sidebarCollapsed && (
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-[#5C6882] hover:text-[#FF4757] transition-colors p-1 flex-shrink-0"
              title="Sign out"
            >
              <LogOut size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
