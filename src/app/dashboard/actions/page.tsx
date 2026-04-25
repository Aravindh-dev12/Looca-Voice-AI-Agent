'use client';

import { motion } from 'framer-motion';
import { Calendar, CheckCircle, ExternalLink, FileCheck, MessageSquare, Phone, Sparkles } from 'lucide-react';
import { Badge, Button, Card } from '@/components/ui';

const actions = [
  {
    id: 1,
    date: 'March 12, 2026',
    time: '10:30 AM',
    title: 'Sent message to clinic about knee pain',
    type: 'Healthcare',
    icon: Phone,
    color: 'bg-rose-50 text-rose-500',
    status: 'Completed',
  },
  {
    id: 2,
    date: 'March 10, 2026',
    time: '2:15 PM',
    title: 'Read the bank letter out loud',
    type: 'Finance',
    icon: MessageSquare,
    color: 'bg-amber-50 text-amber-500',
    status: 'Completed',
  },
  {
    id: 3,
    date: 'March 08, 2026',
    time: '11:00 AM',
    title: 'Filled out village subsidy form',
    type: 'Government',
    icon: FileCheck,
    color: 'bg-blue-50 text-blue-500',
    status: 'Completed',
  },
  {
    id: 4,
    date: 'March 05, 2026',
    time: '9:00 AM',
    title: 'Booked appointment with Dr. Patel',
    type: 'Healthcare',
    icon: Calendar,
    color: 'bg-rose-50 text-rose-500',
    status: 'Completed',
  },
];

export default function ThingsWeDidPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-20">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          <CheckCircle className="h-3.5 w-3.5" />
          Action receipts
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">Things We Did</h1>
        <p className="max-w-2xl text-base leading-7 text-slate-600">
          Clear proof of work for the real-world tasks Looca completed, prepared, or paused for your confirmation.
        </p>
      </div>

      <div className="relative space-y-5">
        <div className="absolute bottom-0 left-7 top-0 w-px rounded-full bg-slate-200" />

        {actions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            className="relative pl-16 md:pl-20"
          >
            <div className={`absolute left-[21px] top-8 z-10 h-3.5 w-3.5 rounded-full border-4 border-white ${action.color.split(' ')[1].replace('text', 'bg')}`} />

            <Card className="overflow-hidden border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${action.color}`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {action.date} - {action.time}
                      </span>
                      <Badge variant="secondary" className="px-2 py-0 text-[10px] uppercase tracking-[0.2em]">
                        {action.type}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold leading-tight text-slate-950 md:text-xl">{action.title}</h3>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
                      {action.status}
                    </span>
                  </div>
                  <button className="rounded-xl p-2 text-slate-300 transition-all hover:bg-slate-50 hover:text-slate-950">
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950 p-8 text-center text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
        <Sparkles className="absolute right-4 top-4 h-12 w-12 text-white/10" />
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">Ready for the next task?</p>
        <h3 className="mt-2 text-2xl font-bold tracking-tight">Looca is ready to listen and act.</h3>
        <Button
          variant="primary"
          className="mt-6 h-12 rounded-full bg-white px-8 text-base font-semibold text-black hover:bg-zinc-100"
          onClick={() => window.location.href = '/dashboard'}
        >
          Talk to Looca
        </Button>
      </div>
    </div>
  );
}
