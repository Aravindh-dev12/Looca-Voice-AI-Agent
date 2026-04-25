'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mic, MicOff, Sparkles } from 'lucide-react';
import { Badge, Button, Card } from '@/components/ui';

type VoiceStatus = 'idle' | 'listening' | 'thinking' | 'responding';

const statusConfig = {
  idle: { color: 'from-slate-100 via-white to-slate-200', text: 'Say "Hey Looca" or tap the orb to start', pulse: false },
  listening: { color: 'from-sky-200 via-cyan-100 to-sky-300', text: 'Listening to your request in real time.', pulse: true },
  thinking: { color: 'from-violet-200 via-fuchsia-100 to-violet-300', text: 'Checking memory, language, and the best next action.', pulse: true },
  responding: { color: 'from-emerald-200 via-teal-100 to-emerald-300', text: 'Responding with the next step and a clear recommendation.', pulse: false },
} satisfies Record<VoiceStatus, { color: string; text: string; pulse: boolean }>;

export default function VoicePage() {
  const [status, setStatus] = useState<VoiceStatus>('idle');

  const handleActivate = () => {
    setStatus('listening');
    window.setTimeout(() => setStatus('thinking'), 2200);
    window.setTimeout(() => setStatus('responding'), 4200);
  };

  const handleStop = () => setStatus('idle');

  const currentStatus = statusConfig[status];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="space-y-3 text-center">
        <Badge variant="accent" className="gap-2">
          <Sparkles className="h-3.5 w-3.5" />
          Live voice console
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">Talk with Looca</h1>
        <p className="mx-auto max-w-2xl text-base leading-7 text-slate-600">
          This is the core listening surface for your personal assistant. The interface stays calm while Looca listens,
          thinks, and responds with guided next steps.
        </p>
      </div>

      <Card className="relative min-h-[560px] overflow-hidden border-slate-200 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08),_transparent_28%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-8 md:p-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-100/30 blur-3xl" />
        </div>

        <div className="relative z-10 flex min-h-[460px] flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {status === 'idle' ? (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="text-center"
              >
                <button
                  onClick={handleActivate}
                  className="group flex h-44 w-44 flex-col items-center justify-center gap-3 rounded-full border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.10)] transition-all duration-500 hover:scale-[1.02] hover:border-slate-300"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-950 text-white transition-transform group-hover:scale-105">
                    <Mic className="h-7 w-7" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">Tap to talk</span>
                </button>
                <p className="mt-8 text-sm uppercase tracking-[0.24em] text-slate-400">Built for accessibility and real-world help</p>
              </motion.div>
            ) : (
              <motion.div
                key="active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full text-center"
              >
                <div className="relative mx-auto mb-8 h-52 w-52">
                  {currentStatus.pulse ? (
                    <>
                      <motion.div
                        className="absolute inset-0 rounded-full border border-sky-200"
                        animate={{ scale: [1, 1.8], opacity: [0.7, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-full border border-sky-100"
                        animate={{ scale: [1, 2.05], opacity: [0.55, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
                      />
                    </>
                  ) : null}

                  <motion.div
                    className={`absolute inset-4 rounded-full bg-gradient-to-br ${currentStatus.color} shadow-[0_24px_80px_rgba(15,23,42,0.14)]`}
                    animate={{ scale: currentStatus.pulse ? [1, 1.06, 1] : 1 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-950 text-white shadow-lg">
                      <Mic className="h-8 w-8" />
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-950">
                  {status === 'listening' ? 'Listening' : status === 'thinking' ? 'Thinking' : 'Responding'}
                </h2>
                <p className="mb-8 mt-2 text-slate-600">{currentStatus.text}</p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-auto max-w-xl"
                >
                  <Card className="mb-5 border-slate-200 bg-white p-5 text-left shadow-sm">
                    <div className="mb-3 flex items-center gap-2 text-sm text-slate-400">
                      <Sparkles className="h-4 w-4" />
                      Live context
                    </div>
                    <p className="text-sm leading-7 text-slate-700">
                      {status === 'listening' && "YOU: 'Book a doctor appointment for tomorrow morning near me.'"}
                      {status === 'thinking' && 'Checking past preferences, preferred language, nearby clinics, and likely available slots.'}
                      {status === 'responding' && "LOOCA: 'I found two nearby clinics with morning availability. I recommend the 10:00 AM slot because it matches your earlier preference.'"}
                    </p>
                  </Card>
                </motion.div>

                <Button variant="danger" onClick={handleStop}>
                  <MicOff className="mr-2 h-4 w-4" />
                  End Interaction
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Card className="relative z-10 mx-auto max-w-xl border-slate-200 bg-white/95 p-4 shadow-sm">
          <h4 className="mb-2 font-semibold text-slate-950">How this works</h4>
          <ul className="space-y-1 text-sm text-slate-600">
            <li>- Speak naturally about a task, question, or document.</li>
            <li>- Looca checks memory and context before suggesting the next step.</li>
            <li>- High-risk actions pause for confirmation instead of guessing.</li>
          </ul>
        </Card>
      </Card>
    </div>
  );
}
