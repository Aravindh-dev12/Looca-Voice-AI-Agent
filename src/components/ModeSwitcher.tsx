'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Building2, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ModeSwitcherProps {
  currentMode: 'personal' | 'company' | 'user';
  companyName?: string;
  hasCompanyAccess: boolean;
}

export function ModeSwitcher({ currentMode, companyName, hasCompanyAccess }: ModeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const switchMode = (mode: 'personal' | 'company') => {
    if (mode === currentMode) {
      setIsOpen(false);
      return;
    }
    
    // In real implementation, this would call an API to update user.mode
    // then redirect to appropriate dashboard
    if (mode === 'company') {
      router.push('/company/dashboard');
    } else {
      router.push('/dashboard');
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#f1f5f9] border border-[#e2e8f0] hover:bg-[#e2e8f0] transition-colors"
      >
        {currentMode === 'personal' || currentMode === 'user' ? (
          <>
            <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm text-[#0f172a] font-medium">Personal</span>
          </>
        ) : (
          <>
            <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
              <Building2 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm text-[#0f172a] font-medium truncate max-w-[100px]">
              {companyName || 'Company'}
            </span>
          </>
        )}
        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full right-0 mt-2 w-64 rounded-xl bg-white border border-[#e2e8f0] shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-2">
              {/* Personal Mode Option */}
              <button
                onClick={() => switchMode('personal')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  currentMode === 'personal' || currentMode === 'user'
                    ? 'bg-[#f0f9ff] border border-[#7cdbff]/30'
                    : 'hover:bg-[#f1f5f9]'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7cdbff] to-[#a78bfa] flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-[#0f172a]">Personal Mode</p>
                  <p className="text-xs text-[#64748b]">Your AI assistant</p>
                </div>
                {currentMode === 'personal' && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-[#7cdbff]" />
                )}
              </button>

              {/* Company Mode Option */}
              {hasCompanyAccess ? (
                <button
                  onClick={() => switchMode('company')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors mt-1 ${
                    currentMode === 'company'
                      ? 'bg-[rgba(52,211,153,0.15)] border border-[rgba(52,211,153,0.3)]'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-[#0f172a]">{companyName || 'Company Mode'}</p>
                    <p className="text-xs text-[#64748b]">Team dashboard & API</p>
                  </div>
                  {currentMode === 'company' && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-[#34d399]" />
                  )}
                </button>
              ) : (
                <div className="mt-2 pt-2 border-t border-[#f1f5f9]">
                  <p className="px-3 text-xs text-[#64748b] mb-2 uppercase tracking-wider font-semibold">Enterprise Plan</p>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      router.push('/upgrade');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gradient-to-r from-[rgba(251,191,36,0.15)] to-[rgba(251,191,36,0.05)] border border-[rgba(251,191,36,0.3)] hover:from-[rgba(251,191,36,0.25)] transition-colors"
                  >
                    <Building2 className="w-4 h-4 text-[#fbbf24]" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-[#d97706]">Upgrade to Enterprise</p>
                      <p className="text-xs text-[#b45309]">Get API keys & team features</p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
