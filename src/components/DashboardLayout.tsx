'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, MemoryStick, Calendar, Heart, FileText, Mic, AppWindow, 
  Settings, LogOut, Menu, X, Building2, Users, BarChart3, 
  Database, Bot, Link2, Shield, CreditCard 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from './AuthProvider';

interface DashboardLayoutProps {
  children: React.ReactNode;
  type: 'user' | 'company';
}

const userNavItems = [
  { label: 'Home', href: '/dashboard', icon: Home },
  { label: 'Memory', href: '/dashboard/memory', icon: MemoryStick },
  { label: 'Meetings', href: '/dashboard/meetings', icon: Calendar },
  { label: 'Health', href: '/dashboard/health', icon: Heart },
  { label: 'My Files', href: '/dashboard/files', icon: FileText },
  { label: 'Voice', href: '/dashboard/voice', icon: Mic },
  { label: 'Apps', href: '/dashboard/apps', icon: AppWindow },
];

const companyNavItems = [
  { label: 'Home', href: '/company/dashboard', icon: Home },
  { label: 'Live Calls', href: '/company/calls', icon: Mic },
  { label: 'Users', href: '/company/users', icon: Users },
  { label: 'Demand Intel', href: '/company/demand', icon: BarChart3 },
  { label: 'Knowledge', href: '/company/knowledge', icon: Database },
  { label: 'Agents', href: '/company/agents', icon: Bot },
  { label: 'Integrations', href: '/company/integrations', icon: Link2 },
  { label: 'Compliance', href: '/company/compliance', icon: Shield },
  { label: 'Billing', href: '/company/billing', icon: CreditCard },
];

export function DashboardLayout({ children, type }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  const navItems = type === 'user' ? userNavItems : companyNavItems;
  const title = type === 'user' ? 'Looca Personal' : 'Looca for Companies';

  return (
    <div className="min-h-screen bg-[#07111f] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-[rgba(148,163,184,0.1)] bg-[#0d1729]">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7cdbff] to-[#8b5cf6] flex items-center justify-center shadow-lg shadow-[#7cdbff]/20">
              <span className="text-lg font-bold text-[#07111f]">L</span>
            </div>
            <div>
              <span className="text-lg font-bold text-white">Looca</span>
              <p className="text-xs text-[#a7b4c8]">{type === 'company' ? 'Enterprise' : 'Personal'}</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-[rgba(124,219,255,0.15)] to-[rgba(139,92,246,0.15)] text-white border border-[rgba(124,219,255,0.25)]'
                    : 'text-[#a7b4c8] hover:bg-white/5 hover:text-white'
                )}
              >
                <Icon className={cn('w-5 h-5', isActive ? 'text-[#7cdbff]' : '')} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[rgba(148,163,184,0.1)]">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#a7b4c8] hover:bg-white/5 hover:text-white transition-all mb-1"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
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
              className="lg:hidden fixed left-0 top-0 h-full w-72 bg-[#0d1729] border-r border-[rgba(148,163,184,0.1)] z-50 flex flex-col"
            >
              <div className="p-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7cdbff] to-[#8b5cf6] flex items-center justify-center">
                    <span className="text-lg font-bold text-[#07111f]">L</span>
                  </div>
                  <span className="text-lg font-bold text-white">Looca</span>
                </Link>
                <button onClick={() => setSidebarOpen(false)} className="p-2 text-white/70 hover:text-white">
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
                          ? 'bg-gradient-to-r from-[rgba(124,219,255,0.15)] to-[rgba(139,92,246,0.15)] text-white'
                          : 'text-[#a7b4c8] hover:bg-white/5 hover:text-white'
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
        <header className="h-16 border-b border-[rgba(148,163,184,0.1)] bg-[#0d1729]/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-white hidden sm:block">{title}</h1>
          </div>

          <div className="flex items-center gap-4">
            {type === 'company' && (
              <div className="hidden sm:flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm text-[#a7b4c8]">Live</span>
              </div>
            )}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7cdbff] to-[#8b5cf6] flex items-center justify-center text-sm font-bold text-[#07111f]">
                  {user?.name?.[0] || user?.email?.[0] || 'U'}
                </div>
                <span className="text-sm font-medium text-white hidden sm:block">
                  {user?.name || user?.email?.split('@')[0] || 'User'}
                </span>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-[#0d1729] border border-[rgba(148,163,184,0.2)] rounded-2xl shadow-xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-[rgba(148,163,184,0.1)]">
                      <p className="font-medium text-white">{user?.name || 'User'}</p>
                      <p className="text-sm text-[#a7b4c8]">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/dashboard/settings"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#a7b4c8] hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <button
                        onClick={() => { logout(); setProfileOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
