'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Calendar, MessageSquare, Phone, FileCheck, ExternalLink, Sparkles } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';

const actions = [
  {
    id: 1,
    date: 'March 12, 2026',
    time: '10:30 AM',
    title: 'Sent message to clinic about knee pain',
    type: 'Healthcare',
    icon: Phone,
    color: 'bg-rose-50 text-rose-500',
    status: 'Completed'
  },
  {
    id: 2,
    date: 'March 10, 2026',
    time: '2:15 PM',
    title: 'Read the bank letter out loud',
    type: 'Finance',
    icon: MessageSquare,
    color: 'bg-amber-50 text-amber-500',
    status: 'Completed'
  },
  {
    id: 3,
    date: 'March 08, 2026',
    time: '11:00 AM',
    title: 'Filled out village subsidy form',
    type: 'Government',
    icon: FileCheck,
    color: 'bg-blue-50 text-blue-500',
    status: 'Completed'
  },
  {
    id: 4,
    date: 'March 05, 2026',
    time: '9:00 AM',
    title: 'Booked appointment with Dr. Patel',
    type: 'Healthcare',
    icon: Calendar,
    color: 'bg-rose-50 text-rose-500',
    status: 'Completed'
  }
];

export default function ThingsWeDidPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Header - Proof of Value */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-[9px] font-black text-black uppercase tracking-widest">
          <CheckCircle className="w-2.5 h-2.5" />
          Proof of Work
        </div>
        <h1 className="text-xl md:text-3xl font-black text-black tracking-tight">
          Things We Did
        </h1>
        <p className="text-zinc-500 text-sm font-medium">
          A list of every time VIOS helped you in the real world.
        </p>
      </div>

      {/* Timeline View */}
      <div className="relative space-y-6">
        {/* The Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-zinc-100 rounded-full" />

        {actions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-20"
          >
            {/* Action Dot */}
            <div className={`absolute left-[26px] top-8 w-4 h-4 rounded-full border-4 border-white z-10 ${action.color.split(' ')[1].replace('text', 'bg')}`} />
            
            <Card className="p-6 border-2 border-zinc-100 hover:border-black transition-all group bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${action.color}`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black text-zinc-400 uppercase tracking-tighter">
                        {action.date} · {action.time}
                      </span>
                      <Badge variant="secondary" className="text-[10px] uppercase font-black tracking-widest px-2 py-0">
                        {action.type}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-black leading-tight">
                      {action.title}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">
                      {action.status}
                    </span>
                  </div>
                  <button className="p-2 rounded-xl text-zinc-300 hover:text-black hover:bg-zinc-50 transition-all">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Encouragement Card */}
      <div className="p-8 rounded-[2rem] bg-black text-white text-center shadow-2xl relative overflow-hidden">
        <Sparkles className="absolute top-4 right-4 w-12 h-12 text-white/10" />
        <p className="text-white/40 text-sm font-bold uppercase tracking-widest mb-4 font-mono">
          Ready to do more?
        </p>
        <h3 className="text-2xl font-black mb-6 mt-2">
          "I am ready to help you with anything."
        </h3>
        <Button 
          variant="primary" 
          className="bg-white text-black hover:bg-zinc-100 rounded-full px-10 h-14 text-lg font-black"
          onClick={() => window.location.href = '/dashboard'}
        >
          Talk to VIOS
        </Button>
      </div>
    </div>
  );
}
