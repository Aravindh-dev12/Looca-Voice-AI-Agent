'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Mic, Brain, Shield, Zap, Globe,
  Sparkles, ArrowRight, User as UserIcon, LogOut, Download
} from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { useAuth } from '@/components/AuthProvider';
import { AuthModal } from '@/components/AuthModal';
import { HorizontalFeatures } from '@/components/HorizontalFeatures';
import { FunctionCards } from '@/components/FunctionCards';
import { ScrollingText } from '@/components/ScrollingText';

const features = [
  {
    icon: Brain,
    title: 'Episodic Memory',
    desc: 'Every conversation remembered. Looca builds a timeline of your life from voice interactions.',
    color: 'from-zinc-400 to-zinc-600',
  },
  {
    icon: Mic,
    title: 'Always Listening',
    desc: 'Say "Hey Looca" anywhere. Your AI assistant is always ready, even offline.',
    color: 'from-zinc-300 to-zinc-500',
  },
  {
    icon: Shield,
    title: 'Private & Local',
    desc: 'Your data never leaves your device. Run local AI models with optional cloud sync.',
    color: 'from-zinc-500 to-zinc-700',
  },
  {
    icon: Zap,
    title: '7th Sense AI',
    desc: 'Proactive intelligence that detects patterns and anticipates your needs.',
    color: 'from-zinc-200 to-zinc-400',
  },
];

const stats = [
  { value: '50K+', label: 'Voice Calls' },
  { value: '94%', label: 'Outcome Rate' },
  { value: '10+', label: 'Indian Languages' },
  { value: '24/7', label: 'Availability' },
];

export default function LandingPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showSplash, setShowSplash] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(checkStandalone);

    if (checkStandalone && !user) {
      setShowSplash(true);
      setTimeout(() => {
        setShowSplash(false);
        setAuthOpen(true);
      }, 3500);
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [user]);

  const handleInstall = async () => {
    if (user) {
      router.push('/dashboard');
      return;
    }

    if (!deferredPrompt) {
      setAuthOpen(true);
      return;
    }

    // Still allow public users who have been prompted but haven't logged in to install if they want 
    // OR we can just force them to Get Started (Auth)
    setAuthOpen(true);
  };

  const handleProtectedClick = (path: string) => {
    if (user) {
      router.push(path);
    } else {
      setAuthOpen(true);
    }
  };

  return (
    <div className="landing-page">
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center px-4"
          >
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <img src="/l.png" alt="Looca" className="w-20 h-20 mx-auto mb-8 invert" />
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">
                  LOOCA AI
                </h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                  className="text-zinc-400 text-lg md:text-xl font-medium tracking-tight"
                >
                  Your Voice Opinion Model
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Hero */}
      <section className="relative overflow-hidden">

        {/* Compact Glassmorphism Header */}
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
          <div className="flex items-center justify-between px-6 py-2.5 rounded-full bg-white/80 backdrop-blur-xl border border-gray-200 shadow-lg">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/l.png" alt="Looca" width={32} height={32} className="rounded-lg" />
              <span className="text-lg font-bold text-gray-900">Looca</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</Link>
              <Link href="#personal" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Personal</Link>
              <Link href="#enterprise" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Enterprise</Link>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-black text-gray-900 leading-none">{user.name}</span>
                  </div>
                  <Link href="/dashboard">
                    <div className="relative group">
                      <div className="w-10 h-10 rounded-full border-2 border-black overflow-hidden flex items-center justify-center text-black font-black text-lg uppercase transition-all group-hover:bg-black group-hover:text-white">
                        {user.name[0]}
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    </div>
                  </Link>
                </div>
              ) : (
                <Button size="sm" onClick={() => setAuthOpen(true)} className="rounded-full px-6">
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </nav>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 border border-gray-300 mb-8"
            >
              <Sparkles className="w-4 h-4 text-gray-900" />
              <span className="text-sm text-gray-900">GeeBfr Hack 2026</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Your AI that lives <span className="text-black">inside</span> your computer
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
            >
              Looca is not a website. It is a persistent intelligence layer that lives inside your computer,
              always aware, always helping like your personal AI companion.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-black text-white hover:bg-zinc-800 transition-all shadow-xl group" onClick={handleInstall}>
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Horizontal Scroll Features */}
      <HorizontalFeatures />

      {/* Function Cards */}
      <FunctionCards />

      {/* Scrolling Text Animation */}
      <ScrollingText />

      {/* CTA */}
      <section className="py-24 relative overflow-hidden bg-zinc-50">
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to experience the future of voice AI?
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Join thousands of users and organizations already using Looca to transform
            how they interact with technology.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-16 px-12 text-xl rounded-full bg-black text-white hover:bg-zinc-800 transition-all shadow-2xl group" onClick={handleInstall}>
              Get Started
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="overflow-hidden">
        {/* Footer Content - Centered */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            <div>
              <h4 className="font-bold text-gray-900 text-lg mb-5">Product</h4>
              <ul className="space-y-3 text-base text-gray-500">
                <li><Link href="/dashboard" className="hover:text-gray-900 transition-colors">Personal</Link></li>
                <li><Link href="/company/signup" className="hover:text-gray-900 transition-colors">Enterprise</Link></li>
                <li><Link href="#" className="hover:text-gray-900 transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg mb-5">Company</h4>
              <ul className="space-y-3 text-base text-gray-500">
                <li><Link href="#" className="hover:text-gray-900 transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-gray-900 transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-gray-900 transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg mb-5">Resources</h4>
              <ul className="space-y-3 text-base text-gray-500">
                <li><Link href="#" className="hover:text-gray-900 transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-gray-900 transition-colors">API Reference</Link></li>
                <li><Link href="#" className="hover:text-gray-900 transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg mb-5">Legal</h4>
              <ul className="space-y-3 text-base text-gray-500">
                <li><Link href="#" className="hover:text-gray-900 transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-gray-900 transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-gray-900 transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Giant LOOCA Text - Full Page Width */}
        <div className="relative w-full overflow-hidden mt-16">
          <div className="flex items-center justify-center overflow-hidden">
            <span
              className="text-[30vw] md:text-[26vw] font-black text-black whitespace-nowrap select-none leading-[0.75] w-full text-center"
              style={{ letterSpacing: '-0.08em' }}
            >
              LOOCA
            </span>
          </div>
          {/* Bottom strip with logo */}
          <div className="absolute bottom-0 left-0 right-0 py-4 px-8 bg-gradient-to-t from-white via-white/80 to-transparent">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/l.png" alt="Looca" className="w-5 h-5 rounded-md" />
                <span className="text-gray-900 font-semibold text-sm">Looca AI</span>
              </div>
              <p className="text-sm text-gray-500">
                © 2026 Persistent Voice Intelligence. Built for GeeBlr Hack.
              </p>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
