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
    default: 'bg-zinc-100 border-zinc-200 text-zinc-900',
    success: 'bg-black border-black text-white',
    warning: 'bg-white border-zinc-200 text-zinc-600',
    danger: 'bg-zinc-800 border-zinc-800 text-zinc-100',
    info: 'bg-zinc-200 border-zinc-300 text-zinc-900',
    accent: 'bg-zinc-950 border-zinc-950 text-white',
  };

  const dotColors = {
    default: 'bg-zinc-400',
    success: 'bg-white',
    warning: 'bg-zinc-900',
    danger: 'bg-zinc-200',
    info: 'bg-black',
    accent: 'bg-black',
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
