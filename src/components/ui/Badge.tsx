'use client';

import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

export function Badge({ children, variant = 'default', className, dot }: BadgeProps) {
  const variants = {
    default: 'bg-white/5 border-white/10 text-white/80',
    success: 'bg-[rgba(52,211,153,0.12)] border-[rgba(52,211,153,0.2)] text-[#a7f3d0]',
    warning: 'bg-[rgba(251,191,36,0.12)] border-[rgba(251,191,36,0.2)] text-[#fcd34d]',
    danger: 'bg-[rgba(251,113,133,0.12)] border-[rgba(251,113,133,0.2)] text-[#fda4af]',
    info: 'bg-[rgba(124,219,255,0.12)] border-[rgba(124,219,255,0.2)] text-[#7cdbff]',
    accent: 'bg-[rgba(139,92,246,0.12)] border-[rgba(139,92,246,0.2)] text-[#a78bfa]',
  };

  const dotColors = {
    default: 'bg-white/50',
    success: 'bg-[#34d399]',
    warning: 'bg-[#fbbf24]',
    danger: 'bg-[#fb7185]',
    info: 'bg-[#7cdbff]',
    accent: 'bg-[#a78bfa]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border',
        variants[variant],
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  );
}
