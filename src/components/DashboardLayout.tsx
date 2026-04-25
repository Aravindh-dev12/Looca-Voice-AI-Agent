'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Bell,
  Brain,
  CheckCircle2,
  Download,
  FileText,
  Heart,
  Menu,
  Mic,
  Plus,
  Sliders,
  Sparkles,
  Type,
  Users,
  Wand2,
  X,
  LayoutGrid,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from './AuthProvider';
import { Badge, Button } from './ui';
import { personalApps } from '@/lib/constants';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const primaryNavItems = [
  { label: 'Talk', href: '/dashboard', icon: Mic },
  { label: 'What You Know', href: '/dashboard/memory', icon: Brain },
  { label: 'Things We Did', href: '/dashboard/actions', icon: CheckCircle2 },
  { label: 'Read & Simplify', href: '/dashboard/simplify', icon: Wand2 },
  { label: 'Settings', href: '/dashboard/settings', icon: Sliders },
];

const toolNavItems = [
  { label: 'Voice Isolator', href: '/dashboard/tools/isolator', icon: Users },
  { label: 'Text to Speech', href: '/dashboard/tools/tts', icon: Mic },
  { label: 'Sound Effects', href: '/dashboard/tools/vfx', icon: Sparkles },
  { label: 'Speech to Text', href: '/dashboard/tools/stt', icon: Type },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
  const [connectedApps, setConnectedApps] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [authApp, setAuthApp] = useState<any>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const filteredApps = personalApps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const storedApps = window.localStorage.getItem('looca-connected-apps');
    if (storedApps) {
      setConnectedApps(JSON.parse(storedApps));
    }
  }, []);

  const toggleApp = (app: any) => {
    const appId = app.id;
    if (connectedApps.includes(appId)) {
      const newApps = connectedApps.filter((id) => id !== appId);
      setConnectedApps(newApps);
      window.localStorage.setItem('looca-connected-apps', JSON.stringify(newApps));
      window.dispatchEvent(new Event('looca-apps-changed'));
    } else {
      setAuthApp(app);
    }
  };

  const handleConfirmAuth = () => {
    setIsAuthenticating(true);
    window.setTimeout(() => {
      const newApps = [...connectedApps, authApp!.id];
      setConnectedApps(newApps);
      window.localStorage.setItem('looca-connected-apps', JSON.stringify(newApps));
      window.dispatchEvent(new Event('looca-apps-changed'));
      setIsAuthenticating(false);
      setAuthApp(null);
    }, 1800);
  };

  useEffect(() => {
    const handler = (event: any) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const renderNavItem = (item: { label: string; href: string; icon: React.ComponentType<{ className?: string }> }, mobile = false) => {
    const Icon = item.icon;
    const isActive = item.href === '/dashboard'
      ? pathname === '/dashboard'
      : pathname === item.href || pathname?.startsWith(item.href + '/');

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setSidebarOpen(false)}
        className={cn(
          'group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-all',
          isActive
            ? 'bg-slate-950 text-white shadow-[0_10px_30px_rgba(15,23,42,0.18)]'
            : 'text-slate-500 hover:bg-white hover:text-slate-950'
        )}
      >
        <div className={cn(
          'flex h-8 w-8 items-center justify-center rounded-xl transition-all',
          isActive ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-950 group-hover:text-white'
        )}>
          <Icon className="h-4 w-4" />
        </div>
        <span className={cn(mobile ? 'text-base' : 'text-sm')}>{item.label}</span>

      </Link>
    );
  };

  const currentLabel =
    primaryNavItems.find((item) => pathname === item.href || pathname?.startsWith(item.href + '/'))?.label ||
    toolNavItems.find((item) => pathname === item.href || pathname?.startsWith(item.href + '/'))?.label ||
    'Dashboard';

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f6fb] text-slate-950">
      <aside className="hidden h-screen w-[220px] shrink-0 flex-col border-r border-slate-200/80 bg-[#f8fafc] lg:flex">
        <div className="px-4 pb-4 pt-4">
          <Link href="/" className="flex items-center gap-2.5 rounded-2xl px-2 py-1">
            <img src="/l.png" alt="Looca" className="h-7 w-7 object-contain" />
            <div>
              <p className="text-lg font-bold tracking-tight text-slate-950">Looca</p>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6">

          <div className="space-y-1">
            {primaryNavItems.map((item) => renderNavItem(item))}
          </div>

          <div className="mt-8">
            <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Voice studio</p>
            <div className="space-y-1">
              {toolNavItems.map((item) => renderNavItem(item))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200/80 bg-[#f8fafc] p-3">
          <div className="space-y-2">
            {deferredPrompt ? (
              <button
                onClick={handleInstall}
                className="flex h-10 w-full items-center justify-between rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white transition hover:bg-black"
              >
                <div className="flex items-center gap-3">
                  <Download className="h-3.5 w-3.5" />
                  Download App
                </div>
                <ArrowRight className="h-3.5 w-3.5 -rotate-45" />
              </button>
            ) : null}

            <Link
              href="/upgrade"
              className="flex h-10 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-950 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-950 text-white">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                Upgrade
              </div>
              <ArrowRight className="h-3.5 w-3.5 -rotate-45" />
            </Link>
          </div>
        </div>
      </aside>

      <AnimatePresence>
        {sidebarOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed left-0 top-0 z-50 flex h-full w-[86vw] max-w-[320px] flex-col border-r border-slate-200 bg-[#f8fafc] lg:hidden"
            >
              <div className="flex items-center justify-between px-5 pb-4 pt-6">
                <Link href="/" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
                  <img src="/l.png" alt="Looca" className="h-8 w-8 object-contain" />
                  <span className="text-xl font-bold tracking-tight text-slate-950">Looca</span>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:text-slate-950"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 pb-6">
                <div className="space-y-1.5">
                  {primaryNavItems.map((item) => renderNavItem(item, true))}
                </div>
                <div className="mt-8">
                  <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Voice studio</p>
                  <div className="space-y-1.5">
                    {toolNavItems.map((item) => renderNavItem(item, true))}
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-[64px] items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-xl md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:text-slate-950 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Looca</p>
              <p className="text-lg font-semibold tracking-tight text-slate-950">{currentLabel}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/upgrade"
              className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white md:flex"
            >
              <Sparkles className="h-4 w-4" />
              Upgrade
            </Link>

            <button 
              onClick={() => setAppsOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:text-slate-950"
              title="Manage Apps"
            >
              <LayoutGrid className="h-4.5 w-4.5" />
            </button>

            <button 
              onClick={() => setNotificationsOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:text-slate-950"
            >
              <Bell className="h-4.5 w-4.5" />
            </button>

            <Link
              href="/dashboard/settings"
              className="ml-1 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white text-xs font-semibold uppercase text-slate-500 transition hover:border-slate-950 hover:text-slate-950"
            >
              {user?.image ? (
                <img src={user.image} alt={user.name || 'User'} className="h-full w-full object-cover" />
              ) : (
                <span>{user?.name?.[0]?.toUpperCase() || 'U'}</span>
              )}
            </Link>
          </div>
        </header>

        <div className="flex-1 overflow-auto px-4 py-5 md:px-6 md:py-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Notifications Sidebar */}
      <AnimatePresence>
        {notificationsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNotificationsOpen(false)}
              className="fixed inset-0 z-[100] bg-slate-950/20 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-[101] h-screen w-full max-w-[320px] bg-white shadow-2xl"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-slate-100 p-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-950">Notifications</h2>
                    <p className="text-xs font-medium text-slate-400">Updates and alerts</p>
                  </div>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="rounded-xl border border-slate-100 p-2 text-slate-400 hover:text-slate-950"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Today</p>
                      <div className="mt-4 space-y-4">
                        {[
                          { title: 'New voice generated', time: '2m ago', icon: Mic },
                          { title: 'App setup complete', time: '1h ago', icon: CheckCircle2 },
                        ].map((notif, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                              <notif.icon className="h-4 w-4 text-slate-600" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-950">{notif.title}</p>
                              <p className="text-xs text-slate-500">{notif.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Apps Management Modal */}
      <AnimatePresence>
        {appsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.99 }}
              className="w-full max-w-3xl rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_25px_80px_rgba(15,23,42,0.2)]"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <Badge variant="accent" className="gap-2">
                    <Plus className="h-3 w-3" />
                    Personal app setup
                  </Badge>
                  <h2 className="text-xl font-bold tracking-tight text-slate-950">
                    Connect the apps Looca should act inside.
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setAppsOpen(false);
                    setSearchQuery('');
                  }}
                  className="rounded-xl border border-slate-100 p-1.5 text-slate-400 transition hover:text-slate-950"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative mb-5">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search apps (e.g. Gmail, Slack, Uber...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-100 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
                />
              </div>

              <div className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {filteredApps.map((app) => {
                    const isConnected = connectedApps.includes(app.id);

                    return (
                      <button
                        key={app.id}
                        onClick={() => toggleApp(app)}
                        className={`rounded-[20px] border p-3.5 text-left transition-all ${
                          isConnected ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isConnected ? 'bg-white/15' : app.accent}`}>
                            <img src={app.icon} alt={app.name} className="h-5 w-5 object-contain" />
                          </div>
                          <Badge variant={isConnected ? 'success' : 'warning'} className="text-[10px] px-1.5 py-0">
                            {isConnected ? 'Connected' : 'Not connected'}
                          </Badge>
                        </div>
                        <p className={`text-[15px] font-semibold ${isConnected ? 'text-white' : 'text-slate-950'}`}>{app.name}</p>
                        <p className={`mt-1 text-xs leading-relaxed ${isConnected ? 'text-slate-300' : 'text-slate-500'}`}>{app.description}</p>
                      </button>
                    );
                  })}
                  {filteredApps.length === 0 && (
                    <div className="col-span-full py-10 text-center">
                      <p className="text-sm text-slate-500">No apps found matching "{searchQuery}"</p>
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="mt-2 text-xs font-semibold text-slate-950 underline"
                      >
                        Clear search
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-[20px] border border-slate-100 bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-500">
                  {connectedApps.length > 0
                    ? `${connectedApps.length} apps selected.`
                    : 'Pick apps for Looca to act.'}
                </p>
                <div className="flex gap-2">
                  {searchQuery && (
                    <button 
                      onClick={() => {
                        const appsToConnect = filteredApps
                          .filter(a => !connectedApps.includes(a.id))
                          .map(a => a.id);
                        if (appsToConnect.length > 0) {
                          const newApps = [...connectedApps, ...appsToConnect];
                          setConnectedApps(newApps);
                          window.localStorage.setItem('looca-connected-apps', JSON.stringify(newApps));
                          window.dispatchEvent(new Event('looca-apps-changed'));
                        }
                      }}
                      className="h-9 px-4 text-xs font-semibold text-slate-600 transition hover:text-slate-950"
                    >
                      Connect all shown
                    </button>
                  )}
                  <Button onClick={() => {
                    setAppsOpen(false);
                    setSearchQuery('');
                  }} className="h-9 px-4 text-xs">
                    Done
                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Simulation Modal */}
      <AnimatePresence>
        {authApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-[0_32px_120px_rgba(15,23,42,0.3)]"
            >
              {isAuthenticating ? (
                <div className="py-10">
                  <div className="relative mx-auto mb-6 h-20 w-20">
                    <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-100 border-t-slate-950" />
                    <div className="flex h-full w-full items-center justify-center">
                      <img src={authApp.icon} alt={authApp.name} className="h-10 w-10 object-contain" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-950">Authenticating...</h3>
                  <p className="mt-2 text-sm text-slate-500">Connecting your Looca OS to {authApp.name}</p>
                </div>
              ) : (
                <>
                  <div className="mb-6 flex justify-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 shadow-inner">
                      <img src="/l.png" alt="Looca" className="h-8 w-8" />
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center">
                      <div className="h-1 w-8 rounded-full bg-slate-100" />
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 shadow-inner">
                      <img src={authApp.icon} alt={authApp.name} className="h-8 w-8 object-contain" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-950">Connect {authApp.name}?</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">
                    Allow Looca to securely access your {authApp.name} data to perform actions on your behalf via voice.
                  </p>
                  <div className="mt-8 space-y-3">
                    <button
                      onClick={handleConfirmAuth}
                      className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#4285F4] py-3.5 font-bold text-white transition hover:bg-[#3367d6] shadow-lg shadow-blue-500/20"
                    >
                      <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Sign in with Google
                    </button>
                    <button
                      onClick={() => setAuthApp(null)}
                      className="w-full py-3 text-sm font-semibold text-slate-400 transition hover:text-slate-950"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
