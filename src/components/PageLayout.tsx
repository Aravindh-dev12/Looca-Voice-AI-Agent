'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';

interface PageLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function PageLayout({ title, subtitle, children, icon }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Premium Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-black flex items-center justify-center transition-transform group-hover:-translate-x-1">
              <ArrowLeft className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">Back to Looca</span>
          </Link>
          <div className="flex items-center gap-3">
             <Image src="/l.png" alt="Looca" width={28} height={28} />
             <span className="font-black tracking-tighter text-lg uppercase">Looca Intelligence</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-8"
          >
            <Sparkles className="h-3 w-3" />
            Vocal Evolution 2026
          </motion.div>
          
          <div className="flex items-start justify-between gap-12">
            <div className="max-w-2xl">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-6 leading-[0.9]"
              >
                {title.toUpperCase()}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed"
              >
                {subtitle}
              </motion.p>
            </div>
            {icon && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="hidden lg:flex h-40 w-40 rounded-[48px] bg-zinc-50 border border-zinc-100 items-center justify-center text-zinc-900"
              >
                {icon}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Content Area */}
      <main className="pb-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="prose prose-zinc lg:prose-xl"
          >
            {children}
          </motion.div>
        </div>
      </main>

      {/* Giant LOOCA Text - Scrolling Marquee */}
      <footer className="relative w-full overflow-hidden mt-16 pt-20 pb-8 border-t border-gray-100">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ 
            duration: 40, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="flex whitespace-nowrap pointer-events-none mb-12 gap-80"
        >
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-80">
              <span
                className="text-[20vw] font-black text-gray-200/80 whitespace-nowrap select-none leading-none"
                style={{ letterSpacing: '-0.08em' }}
              >
                LOOCA
              </span>
              <Image 
                src="/l.png" 
                alt="" 
                width={160}
                height={160}
                className="opacity-[0.05] grayscale" 
              />
            </div>
          ))}
        </motion.div>

        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <Image src="/l.png" alt="Looca" width={24} height={24} className="rounded-lg" />
            <span className="text-gray-900 font-bold text-sm tracking-tight">Looca AI</span>
          </div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
            © 2026 Persistent Voice Intelligence • Built for GeeBlr Hack
          </p>
        </div>
      </footer>
    </div>
  );
}
