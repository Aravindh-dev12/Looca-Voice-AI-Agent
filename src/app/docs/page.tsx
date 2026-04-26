'use client';

import { PageLayout } from '@/components/PageLayout';
import {
  BookOpen,
  Code,
  Mic,
  Shield,
  CheckCircle2,
  Terminal,
  Layers,
  Play,
  Heart,
  FileText,
  Brain,
  Search,
  MessageSquare,
  Zap,
  Lock,
  Workflow,
  Globe,
  BellRing,
  History,
  Clock,
  Activity,
  UserCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DocsPage() {
  return (
    <PageLayout
      title="Documentation"
      subtitle="The complete guide to Looca's persistent voice intelligence and autonomous agentic workflows."
      icon={<BookOpen className="h-12 w-12 text-blue-600" />}
    >
      <div className="space-y-48 mt-10">

        {/* Section 1: Vocal Interface */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100">
              <Mic className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-4xl font-black tracking-tighter">1. Vocal Command Interface</h3>
            <p className="text-gray-500 text-lg leading-relaxed">
              Looca's custom **Vocal Intent Model** understands the underlying goal of your request and connects it to the appropriate system.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['Semantic Wake Word', 'Contextual Memory', 'Dialect Support', 'End-to-End Safety'].map((text, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-100 shadow-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-tight text-zinc-600">{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative p-8 bg-zinc-900 rounded-[48px] shadow-2xl overflow-hidden h-80 flex items-center justify-center border border-zinc-800">
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
            <div className="relative z-10 text-center space-y-6">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center blur-xl absolute -inset-4"
              />
              <Mic className="h-16 w-16 mx-auto text-blue-400 relative z-10" />
              <p className="text-xl font-bold tracking-tight text-white max-w-xs mx-auto">
                "Looca, play my favorite song on YouTube."
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Agentic Engine */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative aspect-video rounded-[48px] overflow-hidden bg-zinc-950 border border-zinc-800 shadow-2xl p-10 flex flex-col font-mono text-xs">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
              </div>
              <span className="text-[10px] text-zinc-600 uppercase tracking-[0.3em]">Runtime_Console</span>
            </div>
            <div className="space-y-3">
              <p className="text-emerald-400">&gt; Initializing Autonomous Browser...</p>
              <p className="text-zinc-500">&gt; Analyzing: youtube.com/results</p>
              <p className="text-blue-400">&gt; Decision: Selecting "Official Music Video"</p>
              <div className="h-px w-full bg-zinc-800 my-4" />
              <p className="text-white font-bold animate-pulse">&gt; Success: Media streaming active.</p>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100">
              <Terminal className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-4xl font-black tracking-tighter">2. Autonomous Agency</h3>
            <p className="text-gray-500 text-lg leading-relaxed">
              Looca acts as a **Digital Operator** that navigates, interprets, and clicks websites for you, removing the need for complex APIs.
            </p>
            <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-100 flex items-start gap-4">
              <Zap className="h-6 w-6 text-zinc-900 shrink-0" />
              <p className="text-sm text-zinc-500 leading-relaxed italic">
                "No APIs needed. Looca sees the web exactly as you do."
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Episodic Memory - HIGH FIDELITY */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 border border-purple-100">
              <History className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-4xl font-black tracking-tighter">3. Episodic Memory</h3>
            <p className="text-gray-500 text-lg leading-relaxed">
              Looca builds a lifetime timeline of your vocal interactions. It remembers what you said, who was there, and what was decided.
            </p>
          </div>
          <div className="relative p-10 bg-white rounded-[48px] border border-zinc-100 shadow-2xl h-80 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 to-transparent" />
            <div className="relative space-y-6">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-600">Memory Timeline</span>
                <Clock className="h-4 w-4 text-zinc-300" />
              </div>
              {[
                { time: 'Yesterday', text: '"Eye checkup at Apollo, 10:30 AM"', icon: Heart, active: true },
                { time: 'Last Tuesday', text: '"Discussed quarterly goals with Team"', icon: UserCheck, active: false },
                { time: 'Oct 12', text: '"Confirmed medication plan"', icon: Activity, active: false },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${item.active ? 'bg-white border-purple-200 shadow-lg' : 'bg-zinc-50/50 border-transparent opacity-40'}`}
                >
                  <item.icon className={`h-5 w-5 ${item.active ? 'text-purple-600' : 'text-zinc-400'}`} />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-tighter text-zinc-400">{item.time}</p>
                    <p className="text-sm font-bold text-zinc-900">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Universal Accessibility - HIGH FIDELITY */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative p-12 bg-zinc-950 rounded-[48px] shadow-2xl h-80 flex flex-col items-center justify-center text-center overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 opacity-10"
              style={{ backgroundImage: `conic-gradient(from 0deg, #10b981, transparent, #10b981)` }}
            />
            <Globe className="h-20 w-20 text-emerald-400 mb-8 relative z-10" />
            <div className="space-y-4 relative z-10">
              <div className="flex flex-wrap justify-center gap-2">
                {['தமிழ்', 'हिंदी', 'తెలుగు', 'English'].map((lang, i) => (
                  <span key={i} className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold backdrop-blur-sm">
                    {lang}
                  </span>
                ))}
              </div>
              <p className="text-zinc-500 text-xs font-medium tracking-wide">
                "Universal access for all Indian languages."
              </p>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100">
              <Globe className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-4xl font-black tracking-tighter">4. Universal Accessibility</h3>
            <p className="text-gray-500 text-lg leading-relaxed">
              Designed to bridge the digital divide. Looca empowers low-literacy users and the elderly to control technology through speech alone.
            </p>
          </div>
        </section>


      </div>
    </PageLayout>
  );
}
