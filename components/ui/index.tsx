'use client';

import { cn } from '@/lib/utils';

// ── Card ──────────────────────────────────────────────────────────────────
export function Card({
  children, className, hover = false, ...props
}: React.HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div
      className={cn(
        'bg-[#1E2433] border border-[#2A3348] rounded-xl',
        hover && 'hover:border-[#3A4660] transition-colors cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ── CardHeader ────────────────────────────────────────────────────────────
export function CardHeader({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center justify-between px-4 py-3 border-b border-[#2A3348]', className)} {...props}>
      {children}
    </div>
  );
}

// ── CardTitle ─────────────────────────────────────────────────────────────
export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn('text-sm font-semibold text-[#E8EBF2]', className)}>{children}</h3>;
}

// ── StatCard — re-exported from canonical file ────────────────────────────
export { StatCard } from '@/components/ui/StatCard';

// ── ChangePill ────────────────────────────────────────────────────────────
export function ChangePill({ value, className }: { value: number; className?: string }) {
  const up = value >= 0;
  return (
    <span className={cn(
      'inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-semibold',
      up ? 'bg-[#00D4A0]/10 text-[#00D4A0]' : 'bg-[#FF4757]/10 text-[#FF4757]',
      className
    )}>
      {up ? '▲' : '▼'} {Math.abs(value).toFixed(2)}%
    </span>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────
type BadgeVariant = 'green' | 'red' | 'blue' | 'amber' | 'default';
const BADGE_STYLES: Record<BadgeVariant, string> = {
  green:   'bg-[#00D4A0]/10 text-[#00D4A0] border-[#00D4A0]/20',
  red:     'bg-[#FF4757]/10 text-[#FF4757] border-[#FF4757]/20',
  blue:    'bg-[#4F8EF7]/10 text-[#4F8EF7] border-[#4F8EF7]/20',
  amber:   'bg-[#FFB547]/10 text-[#FFB547] border-[#FFB547]/20',
  default: 'bg-[#2A3348] text-[#9BA5BF] border-[#3A4660]',
};

export function Badge({ children, variant = 'default', className }: {
  children: React.ReactNode; variant?: BadgeVariant; className?: string;
}) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border', BADGE_STYLES[variant], className)}>
      {children}
    </span>
  );
}

// ── Button ────────────────────────────────────────────────────────────────
type ButtonVariant = 'primary' | 'buy' | 'sell' | 'ghost' | 'outline';

const BUTTON_STYLES: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-[#2D6FD9] to-[#4F8EF7] text-white hover:opacity-90',
  buy:     'bg-gradient-to-r from-[#00A87D] to-[#00D4A0] text-[#0A0B0E] font-bold hover:opacity-90',
  sell:    'bg-gradient-to-r from-[#CC3344] to-[#FF4757] text-white font-bold hover:opacity-90',
  ghost:   'bg-transparent text-[#9BA5BF] hover:bg-[#1E2433] hover:text-[#E8EBF2]',
  outline: 'bg-transparent border border-[#2A3348] text-[#9BA5BF] hover:border-[#3A4660] hover:text-[#E8EBF2]',
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({ children, variant = 'primary', size = 'md', loading, className, disabled, ...props }: ButtonProps) {
  const sizeClass = size === 'sm' ? 'px-3 py-1.5 text-xs' : size === 'lg' ? 'px-6 py-3.5 text-sm' : 'px-4 py-2.5 text-sm';
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all active:scale-[0.98]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClass,
        BUTTON_STYLES[variant],
        className
      )}
      {...props}
    >
      {loading && <span className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />}
      {children}
    </button>
  );
}

// ── Skeleton loader — re-exported from canonical file ─────────────────────
export { Skeleton, SkeletonCard, SkeletonRow, StatCardSkeleton } from '@/components/ui/Skeleton';

// ── Tab strip ─────────────────────────────────────────────────────────────
interface TabsProps {
  tabs: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
}

export function Tabs({ tabs, value, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex bg-[#161A22] rounded-lg p-0.5', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            'flex-1 py-1.5 text-xs font-medium rounded-md transition-all',
            value === tab.value
              ? 'bg-[#1E2433] text-[#E8EBF2] shadow-sm'
              : 'text-[#5C6882] hover:text-[#9BA5BF]'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ── CoinLogo ──────────────────────────────────────────────────────────────
export function CoinLogo({ symbol, color, size = 28 }: { symbol: string; color?: string; size?: number }) {
  const bg = color ?? '#4F8EF7';
  return (
    <div
      className="flex items-center justify-center rounded-full font-bold text-[#E8EBF2] flex-shrink-0"
      style={{ width: size, height: size, background: `${bg}22`, color: bg, fontSize: size * 0.42 }}
    >
      {symbol.charAt(0)}
    </div>
  );
}

// ── Input ─────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  suffix?: string;
  prefix?: string;
  error?: string;
}

export function Input({ label, suffix, prefix, error, className, ...props }: InputProps) {
  return (
    <div>
      {label && <label className="block text-[10px] font-semibold text-[#5C6882] uppercase tracking-wider mb-1.5">{label}</label>}
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#5C6882]">{prefix}</span>}
        <input
          className={cn(
            'w-full bg-[#111318] border border-[#2A3348] rounded-lg px-3 py-2.5 text-sm',
            'text-[#E8EBF2] placeholder-[#5C6882] font-mono',
            'outline-none focus:border-[#4F8EF7] focus:ring-1 focus:ring-[#4F8EF7]/20 transition-all',
            prefix && 'pl-8',
            suffix && 'pr-16',
            error && 'border-[#FF4757]',
            className
          )}
          {...props}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#5C6882]">{suffix}</span>}
      </div>
      {error && <p className="mt-1 text-[11px] text-[#FF4757]">{error}</p>}
    </div>
  );
}

// ── Section header ────────────────────────────────────────────────────────
export function SectionHeader({ title, action, actionLabel = 'View all' }: {
  title: string; action?: () => void; actionLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A3348]">
      <h3 className="text-sm font-semibold">{title}</h3>
      {action && (
        <button onClick={action} className="text-xs text-[#4F8EF7] hover:underline">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
