'use client';

import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  gradient?: boolean;
}

export function Card({ children, className, noPadding, gradient }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-gray-200 backdrop-blur-xl',
        gradient
          ? 'bg-gradient-to-br from-white to-gray-50'
          : (!className?.includes('bg-') && 'bg-white'),
        'shadow-[0_22px_45px_rgba(0,0,0,0.08)]',
        !noPadding && 'p-6',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn('text-lg font-semibold text-gray-900', className)}>{children}</h3>;
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('text-sm text-gray-500 mt-1', className)}>{children}</p>;
}
