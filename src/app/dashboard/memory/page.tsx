'use client';

import { motion } from 'framer-motion';
import { Search, Heart, Building2, Globe, Sparkles, Brain, SearchIcon } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';

const contextCards = [
  {
    id: 'health',
    title: 'Health',
    icon: Heart,
    color: 'text-rose-500',
    bgColor: 'bg-rose-50',
    description: 'VIOS knows your knee hurts and you take blood pressure medicine.',
    lastUpdated: 'Updated 2 hours ago'
  },
  {
    id: 'government',
    title: 'Government',
    icon: Building2,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    description: 'VIOS knows your village ID and family ration card history.',
    lastUpdated: 'Updated yesterday'
  },
  {
    id: 'language',
    title: 'Language',
    icon: Globe,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
    description: 'VIOS is set to listen and speak in slow, clear Hindi.',
    lastUpdated: 'Active now'
  },
  {
    id: 'general',
    title: 'General',
    icon: Brain,
    color: 'text-zinc-500',
    bgColor: 'bg-zinc-50',
    description: 'VIOS remembers your daily routine and family names.',
    lastUpdated: 'Learning daily'
  }
];

export default function WhatYouKnowPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header - Simple & Calming */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-[9px] font-black text-black uppercase tracking-widest">
          <Sparkles className="w-2.5 h-2.5" />
          VIOS Memory
        </div>
        <h1 className="text-xl md:text-3xl font-black text-black tracking-tight">
          What You Know
        </h1>
        <p className="text-zinc-500 text-sm font-medium">
          VIOS learns who you are so it can help you better.
        </p>
      </div>

      {/* Simplified Search */}
      <div className="relative max-w-lg mx-auto group">
        <div className="absolute inset-0 bg-black/5 blur-xl group-focus-within:bg-black/10 transition-all rounded-full" />
        <div className="relative flex items-center">
          <SearchIcon className="absolute left-5 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Ask VIOS about your past..."
            className="w-full pl-12 pr-6 py-3 rounded-full bg-white border-2 border-zinc-100 text-base font-bold text-black placeholder-zinc-300 shadow-xl focus:outline-none focus:border-black transition-all"
          />
        </div>
      </div>

      {/* Context Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contextCards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-8 border-2 border-zinc-100 hover:border-black transition-all group cursor-pointer relative overflow-hidden bg-white">
              <div className={`absolute top-0 right-0 w-24 h-24 ${card.bgColor} rounded-bl-full opacity-50 group-hover:scale-110 transition-transform`} />
              
              <div className="flex flex-col h-full relative z-10">
                <div className={`w-14 h-14 rounded-2xl ${card.bgColor} flex items-center justify-center mb-6`}>
                  <card.icon className={`w-7 h-7 ${card.color}`} />
                </div>
                
                <h3 className="text-2xl font-black text-black mb-3">{card.title}</h3>
                <p className="text-zinc-500 text-lg font-medium leading-relaxed mb-8">
                  {card.description}
                </p>
                
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">
                    {card.lastUpdated}
                  </span>
                  <div className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center group-hover:bg-black group-hover:border-black transition-all">
                    <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-white transition-all -rotate-45" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Assurance Footer */}
      <div className="p-8 rounded-[2rem] bg-zinc-50 border-2 border-zinc-100 text-center">
        <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest mb-2 font-mono">
          Security Protocol
        </p>
        <p className="text-zinc-600 font-medium">
          "Everything VIOS knows stays on this device. No one else can see your life."
        </p>
      </div>
    </div>
  );
}

// Reuse the ArrowRight from lucide-react (imported above)
import { ArrowRight } from 'lucide-react';
