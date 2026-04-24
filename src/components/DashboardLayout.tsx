'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Brain, Calendar, Heart, FileText, Mic, AppWindow,
  Settings, LogOut, Menu, X, Building2, Users, BarChart3,
  Database, Bot, Link2, Shield, CreditCard, Sparkles, Key,
  Users2, History, Wallet, GraduationCap, Lock, ChevronDown,
  Bell, MessageSquare, ArrowRight, Download, CheckCircle, Wand2, Sliders, Type
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from './AuthProvider';
import { ModeSwitcher } from './ModeSwitcher';

interface DashboardLayoutProps {
  children: React.ReactNode;
  type: 'user' | 'company';
}

const userNavItems = [
  { label: 'Talk', href: '/dashboard', icon: Mic },
  { label: 'What You Know', href: '/dashboard/memory', icon: Brain },
  { label: 'Things We Did', href: '/dashboard/actions', icon: CheckCircle },
  { label: 'Simplify Document', href: '/dashboard/simplify', icon: Wand2 },
  { label: 'Settings', href: '/dashboard/settings', icon: Sliders },
];

const companyNavItems = [
  { label: 'Overview', href: '/company/dashboard', icon: BarChart3 },
  { label: 'API Keys', href: '/company/api-keys', icon: Key },
  { label: 'Usage Analytics', href: '/company/usage', icon: History },
  { label: 'Team Management', href: '/company/team', icon: Users2 },
  { label: 'Billing & Credits', href: '/company/billing', icon: CreditCard },
  { label: 'Voice Agents', href: '/company/agents', icon: Bot },
  { label: 'Integrations', href: '/company/integrations', icon: Link2 },
  { label: 'Security', href: '/company/security', icon: Lock },
];

export function DashboardLayout({ children, type }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [orgSwitcherOpen, setOrgSwitcherOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const navItems = type === 'user' ? userNavItems : companyNavItems;
  const title = type === 'user' ? 'Looca Personal' : 'Looca for Companies';

  // Real Org Data from Auth
  const hasCompanyAccess = user?.role === 'enterprise' || !!user?.organization;
  const companyName = user?.organization?.name || 'Your Company';
  const companyLogo = user?.organization?.logo_url;

  return (
    <div className="h-screen bg-[#f8fafc] flex text-[#0f172a] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[240px] flex-col border-r border-zinc-100 bg-[#f9f9fb] h-screen sticky top-0 overflow-hidden">
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2.5 px-1 mb-2">
            <img src="/l.png" alt="Looca Logo" className="w-6 h-6 object-contain" />
            <span className="font-semibold text-lg text-black tracking-tighter">Looca</span>
          </div>

          <div className="relative">
            <button 
              onClick={() => setOrgSwitcherOpen(!orgSwitcherOpen)}
              className="flex items-center justify-between w-full h-10 px-3 bg-white border border-zinc-200 rounded-xl hover:border-black transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center",
                  type === 'user' ? "bg-orange-100" : "bg-blue-100"
                )}>
                  <div className={cn(
                    "w-2.5 h-2.5 rounded-full",
                    type === 'user' ? "bg-orange-500" : "bg-blue-500"
                  )} />
                </div>
                <span className="text-xs font-bold text-zinc-700">
                  {type === 'user' ? 'Personal' : companyName}
                </span>
              </div>
              <div className="flex flex-col gap-0.5 opacity-40">
                <ChevronDown className={cn("w-2 h-2 transition-transform", orgSwitcherOpen ? "rotate-0" : "rotate-180")} />
                <ChevronDown className={cn("w-2 h-2 transition-transform", orgSwitcherOpen ? "rotate-180" : "rotate-0")} />
              </div>
            </button>

            <AnimatePresence>
              {orgSwitcherOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-100 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  <Link 
                    href="/upgrade"
                    onClick={() => setOrgSwitcherOpen(false)}
                    className="flex items-center gap-3 w-full p-3 hover:bg-zinc-50 transition-colors border-b border-zinc-50"
                  >
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-black" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-black leading-none">Enterprise</p>
                      <p className="text-[10px] text-zinc-400 mt-1">Upgrade to Enterprise</p>
                    </div>
                  </Link>
                  <button 
                    disabled
                    className="flex items-center justify-between w-full p-3 bg-[#f9f9fb] cursor-default"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-zinc-100 flex items-center justify-center">
                        <Users className="w-4 h-4 text-black" />
                      </div>
                      <div className="text-left">
                        <p className="text-[11px] font-bold text-black leading-none">Personal</p>
                        <p className="text-[10px] text-zinc-400 mt-1">Free Tier Plan</p>
                      </div>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-black mr-1" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-1 px-3 space-y-0.5 scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold transition-all duration-200 relative group',
                  isActive
                    ? 'bg-[#efeff3] text-black shadow-sm'
                    : 'text-zinc-500 hover:text-black hover:bg-zinc-50'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn('w-4 h-4', isActive ? 'text-black' : 'text-zinc-400 group-hover:text-black transition-colors')} />
                  {item.label}
                </div>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active-indicator"
                    className="absolute right-1 w-1 h-4 rounded-full bg-black shadow-[0_0_8px_rgba(0,0,0,0.1)]" 
                  />
                )}
              </Link>
            );
          })}

          <div className="pt-2 space-y-0.5">
            {[
              { label: 'Voice Isolator', icon: Users, href: '/dashboard/tools/isolator' },
              { label: 'Text to Speech', icon: Mic, href: '/dashboard/tools/tts' },
              { label: 'Sound Effects', icon: Sparkles, href: '/dashboard/tools/vfx' },
              { label: 'Speech to Text', icon: Type, href: '/dashboard/tools/stt' },
              { label: 'Voice Changer', icon: Heart, href: '/dashboard/tools/voice-changer' }
            ].map((item) => (
              <Link 
                key={item.label} 
                href={item.href}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold transition-all relative group",
                  pathname === item.href ? "bg-[#efeff3] text-black shadow-sm" : "text-zinc-500 hover:text-black hover:bg-zinc-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("w-4 h-4", pathname === item.href ? "text-black" : "text-zinc-400 group-hover:text-black transition-colors")} />
                  {item.label}
                </div>
                {pathname === item.href && (
                  <motion.div 
                    layoutId="sidebar-active-indicator-tools"
                    className="absolute right-1 w-1 h-4 rounded-full bg-black shadow-[0_0_8px_rgba(0,0,0,0.1)]" 
                  />
                )}
              </Link>
            ))}
          </div>
        </div>


        <div className="p-3 mt-auto space-y-2 bg-[#f9f9fb] border-t border-zinc-100">
          {deferredPrompt && (
            <button 
              onClick={handleInstall}
              className="flex items-center justify-between w-full h-10 px-3 bg-black border border-black rounded-lg hover:bg-zinc-800 transition-all group shadow-sm text-white"
            >
              <div className="flex items-center gap-2.5">
                <Download className="w-4 h-4 text-white" />
                <span className="text-[13px] font-bold">Download App</span>
              </div>
              <div className="w-4 h-4 rounded bg-white/10 flex items-center justify-center">
                <ArrowRight className="w-3 h-3 text-white -rotate-45" />
              </div>
            </button>
          )}

          <Link href="/upgrade" className="flex items-center justify-between w-full h-10 px-3 bg-white border-2 border-zinc-100 rounded-lg hover:border-black transition-all group shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded bg-black flex items-center justify-center transform rotate-45">
                <Sparkles className="w-3 h-3 text-white transform -rotate-45" />
              </div>
              <span className="text-[13px] font-bold text-black">Upgrade</span>
            </div>
            <div className="w-5 h-5 rounded bg-black flex items-center justify-center group-hover:scale-105 transition-transform">
              <ArrowRight className="w-3 h-3 text-white -rotate-45" />
            </div>
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 h-full w-72 bg-white border-r border-[#e2e8f0] z-50 flex flex-col"
            >
              <div className="p-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
                  <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
                    <span className="text-lg font-bold text-white">L</span>
                  </div>
                  <span className="text-lg font-bold text-[#0f172a]">Looca</span>
                </Link>
                <button onClick={() => setSidebarOpen(false)} className="p-2 text-[#64748b] hover:text-[#0f172a]">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 px-4 py-2 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                        isActive
                          ? 'bg-black text-white'
                          : 'text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-[52px] border-b border-zinc-100 bg-white flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-zinc-500 hover:text-black hover:bg-zinc-50 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="flex items-center gap-1.5 p-1 rounded-md transition-colors">
                <div className="w-4 h-4 rounded bg-zinc-100 flex items-center justify-center">
                  <div className="w-2 h-2 border border-zinc-400 rounded-sm" />
                </div>
                <span className="text-xs font-bold text-zinc-800 tracking-tight">
                  {pathname?.split('/').pop()?.charAt(0).toUpperCase() + (pathname?.split('/').pop()?.slice(1).replace('-', ' ') || 'Dashboard')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-black hover:bg-zinc-50 rounded-lg transition-colors">
                <FileText className="w-4.5 h-4.5" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-black hover:bg-zinc-50 rounded-lg transition-colors">
                <Bell className="w-4.5 h-4.5" />
              </button>
              <Link
                href={type === 'company' ? '/company/settings' : '/dashboard/settings'}
                className="w-8 h-8 rounded-full bg-[#f1f1f5] border border-zinc-200 flex items-center justify-center text-[10px] font-bold text-zinc-500 hover:border-black hover:text-black transition-all overflow-hidden ml-1 cursor-pointer"
              >
                {type === 'company' && companyLogo ? (
                  <img src={companyLogo} alt={companyName} className="w-full h-full object-cover" />
                ) : user?.image ? (
                  <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{type === 'company' ? companyName[0].toUpperCase() : (user?.name?.[0]?.toUpperCase() || 'U')}</span>
                )}
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 lg:p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
