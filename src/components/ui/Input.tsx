'use client';

import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#a7b4c8] mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a7b4c8]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-[rgba(3,7,18,0.5)] border border-[rgba(148,163,184,0.2)] rounded-xl px-4 py-3',
              'text-white placeholder-[#64748b]',
              'focus:outline-none focus:border-[#7cdbff]/50 focus:ring-1 focus:ring-[#7cdbff]/30',
              'transition-all duration-200',
              icon ? 'pl-12' : undefined,
              error ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/30' : undefined,
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
