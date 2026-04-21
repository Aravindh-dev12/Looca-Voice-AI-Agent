'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Mic, Brain, Shield, Zap, Globe, Users, 
  ChevronRight, Sparkles, Phone, Building2, ArrowRight 
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
    color: 'from-[#7cdbff] to-[#a78bfa]',
  },
  {
    icon: Mic,
    title: 'Always Listening',
    desc: 'Say "Hey Looca" anywhere. Your AI assistant is always ready, even offline.',
    color: 'from-[#34d399] to-[#7cdbff]',
  },
  {
    icon: Shield,
    title: 'Private & Local',
    desc: 'Your data never leaves your device. Run local AI models with optional cloud sync.',
    color: 'from-[#a78bfa] to-[#f472b6]',
  },
  {
    icon: Zap,
    title: '7th Sense AI',
    desc: 'Proactive intelligence that detects patterns and anticipates your needs.',
    color: 'from-[#fbbf24] to-[#f97316]',
  },
];

const stats = [
  { value: '50K+', label: 'Voice Calls' },
  { value: '94%', label: 'Outcome Rate' },
  { value: '10+', label: 'Indian Languages' },
  { value: '24/7', label: 'Availability' },
];

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);

  const handleProtectedClick = (path: string) => {
    if (user) {
      router.push(path);
    } else {
      setAuthOpen(true);
    }
  };

  return (
    <div className="landing-page">
      {/* Hero */}
      <section className="relative overflow-hidden">

        {/* Compact Glassmorphism Header */}
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
          <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200 shadow-lg">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/l.png" alt="Looca" width={32} height={32} className="rounded-lg" />
              <span className="text-lg font-bold text-gray-900">Looca</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</Link>
              <Link href="#personal" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Personal</Link>
              <Link href="#enterprise" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Enterprise</Link>
            </div>
            <div className="flex items-center gap-2">
              {user ? (
                <Button size="sm" onClick={() => router.push('/dashboard')}>Dashboard</Button>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => setAuthOpen(true)}>Sign In</Button>
                  <Button size="sm" onClick={() => setAuthOpen(true)}>Get Started</Button>
                </>
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
              Your AI that lives <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">inside</span> your computer
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
            >
              Looca is not a website. It is a persistent intelligence layer that lives inside your computer,
              always aware, always helping — like your personal AI companion.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button size="lg" onClick={() => handleProtectedClick('/dashboard')}>Get Started Free</Button>
              <Button size="lg" variant="secondary" onClick={() => handleProtectedClick('/company/signup')}>
                <Building2 className="w-4 h-4 mr-2" /> For Companies
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

      {/* Two Paths */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal */}
            <motion.div
              id="personal"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <Card gradient className="p-8 h-full border-l-4 border-l-gray-900">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-gray-900" />
                  </div>
                  <div>
                    <Badge variant="info">For Individuals</Badge>
                    <h3 className="text-2xl font-bold text-gray-900">Looca Personal</h3>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    'Episodic memory of all conversations',
                    'Automatic meeting transcription',
                    'Health timeline & medicine tracking',
                    'File intelligence & document analysis',
                    'Works offline with local AI models',
                    'Wake word: "Hey Looca"',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-600">
                      <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                        <ChevronRight className="w-3 h-3 text-gray-900" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" onClick={() => handleProtectedClick('/dashboard')}>
                  Access Personal Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            </motion.div>

            {/* Enterprise */}
            <motion.div
              id="enterprise"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <Card gradient className="p-8 h-full border-l-4 border-l-gray-600">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <Badge variant="accent">For Organizations</Badge>
                    <h3 className="text-2xl font-bold text-gray-900">Looca for Companies</h3>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    '24/7 voice support in 10+ Indian languages',
                    'Live call monitoring & analytics',
                    'Unmet demand intelligence radar',
                    'Auto-ingestion from your website/docs',
                    'Integration with HIS, EMR, CRM systems',
                    'Compliance: ABDM, DPDP, NABH ready',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-600">
                      <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                        <ChevronRight className="w-3 h-3 text-gray-700" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button variant="secondary" className="w-full" onClick={() => handleProtectedClick('/company/signup')}>
                  Sign Up Your Company <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7cdbff]/5 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to experience the future of voice AI?
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Join thousands of users and organizations already using Looca to transform 
            how they interact with technology.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={() => handleProtectedClick('/dashboard')}>Get Started Free</Button>
            <Button size="lg" variant="secondary" onClick={() => handleProtectedClick('/company/signup')}>
              <Phone className="w-4 h-4 mr-2" /> Demo
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
              className="text-[30vw] md:text-[26vw] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#7cdbff] via-[#a78bfa] to-[#7cdbff] whitespace-nowrap select-none leading-[0.75] w-full text-center"
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
                <span className="text-gray-900 font-semibold text-sm">Looca</span>
              </div>
              <p className="text-sm text-gray-500">
                © 2026 Looca AGI. Built for GeeBlr Hack.
              </p>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
