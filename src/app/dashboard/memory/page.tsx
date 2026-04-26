'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Brain, Building2, Globe, Heart, SearchIcon, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui';

const contextCards = [
  {
    id: 'health',
    title: 'Health',
    icon: Heart,
    color: 'text-rose-500',
    bgColor: 'bg-rose-50',
    description: 'Looca remembers your health preferences, medicines, and slower guidance needs.',
    lastUpdated: 'Updated 2 hours ago',
  },
  {
    id: 'government',
    title: 'Documents',
    icon: Building2,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    description: 'Looca keeps key document context ready so forms and services take fewer steps.',
    lastUpdated: 'Updated yesterday',
  },
  {
    id: 'language',
    title: 'Language',
    icon: Globe,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
    description: 'Looca is ready to listen and reply in the language and speed you prefer.',
    lastUpdated: 'Active now',
  },
  {
    id: 'general',
    title: 'Routine',
    icon: Brain,
    color: 'text-slate-500',
    bgColor: 'bg-slate-100',
    description: 'Looca keeps track of routines, contacts, and recurring tasks that matter.',
    lastUpdated: 'Learning daily',
  },
];

export default function WhatYouKnowPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-20">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          <Sparkles className="h-3.5 w-3.5" />
          Memory graph
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">What Looca Knows</h1>
        <p className="max-w-2xl text-base leading-7 text-slate-600">
          Personal memory that makes Looca feel continuous, useful, and less repetitive over time.
        </p>
      </div>

      <div className="group relative mx-auto max-w-lg">
        <div className="absolute inset-0 rounded-full bg-black/5 blur-xl transition-all group-focus-within:bg-black/10" />
        <div className="relative flex items-center">
          <SearchIcon className="absolute left-5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Ask Looca what it remembers..."
            className="w-full rounded-full border border-slate-200 bg-white py-3 pl-12 pr-6 text-base font-medium text-slate-950 placeholder-slate-300 shadow-sm transition-all focus:border-black focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {contextCards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <Card className="group relative cursor-pointer overflow-hidden border border-slate-200 bg-white p-7 transition-all hover:border-slate-300">
              <div className={`absolute right-0 top-0 h-24 w-24 rounded-bl-full ${card.bgColor} opacity-50 transition-transform group-hover:scale-110`} />

              <div className="relative z-10 flex h-full flex-col">
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${card.bgColor}`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>

                <h3 className="mb-3 text-2xl font-semibold text-slate-950">{card.title}</h3>
                <p className="mb-8 text-base leading-7 text-slate-600">{card.description}</p>

                <div className="mt-auto flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {card.lastUpdated}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 transition-all group-hover:border-black group-hover:bg-black">
                    <ArrowRight className="-rotate-45 h-4 w-4 text-slate-400 transition-all group-hover:text-white" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-8 text-center">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Private by design</p>
        <p className="text-sm leading-7 text-slate-600">
          Everything Looca knows stays tied to your personal workspace, so your memory layer feels useful without becoming noisy.
        </p>
      </div>
    </div>
  );
}
