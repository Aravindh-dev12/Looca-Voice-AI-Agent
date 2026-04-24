'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Sparkles, CheckCircle, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui';

type VoiceStatus = 'idle' | 'listening' | 'thinking' | 'responding' | 'done';

export default function TalkDashboard() {
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [lastAction, setLastAction] = useState<string | null>(null);

  const handleActivate = () => {
    setStatus('listening');
    setTimeout(() => setStatus('thinking'), 2500);
    setTimeout(() => setStatus('responding'), 4500);
  };

  const handleStop = () => {
    if (status === 'responding') {
      setStatus('done');
      setLastAction('Clinic Appointment Booked');
      setTimeout(() => setStatus('idle'), 5000);
    } else {
      setStatus('idle');
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background Calm Gradient */}
      <div className="absolute inset-0 bg-[#f9f9fb] transition-colors duration-1000" />
      
      {/* Animated Orb Container */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
        <AnimatePresence mode="wait">
          {status === 'idle' ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
              className="text-center"
            >
              <button
                onClick={handleActivate}
                className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-white border-2 border-zinc-100 shadow-xl flex flex-col items-center justify-center group hover:border-black transition-all duration-700"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-zinc-50 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-black transition-all duration-500">
                  <Mic className="w-8 h-8 md:w-10 md:h-10 text-zinc-400 group-hover:text-white" />
                </div>
                <span className="text-xs md:text-sm font-black text-black uppercase tracking-widest px-4">
                  Tap to Talk
                </span>
              </button>
              <p className="mt-8 text-zinc-400 text-sm font-bold uppercase tracking-[0.2em] animate-pulse">
                VIOS is listening
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center w-full"
            >
              {/* The 3D-ish Pulse Orb */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 mb-12">
                {/* Visual Feedback Rings */}
                <AnimatePresence>
                  {(status === 'listening' || status === 'responding') && (
                    <>
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-black/10"
                        initial={{ scale: 1, opacity: 0 }}
                        animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'circOut' }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-black/10"
                        initial={{ scale: 1, opacity: 0 }}
                        animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'circOut', delay: 0.6 }}
                      />
                    </>
                  )}
                </AnimatePresence>

                {/* Main Orb Body */}
                <motion.div
                  className="absolute inset-4 rounded-full shadow-2xl overflow-hidden"
                  animate={{ 
                    scale: status === 'listening' ? [1, 1.05, 1] : 1,
                    rotate: status === 'thinking' ? 360 : 0
                  }}
                  transition={{ 
                    scale: { duration: 1, repeat: Infinity },
                    rotate: { duration: 4, repeat: Infinity, ease: 'linear' }
                  }}
                  style={{
                    background: status === 'thinking' 
                      ? 'conic-gradient(from 0deg, #000, #fff, #000)'
                      : 'radial-gradient(circle at 35% 35%, #fff, #27272a, #000)',
                    boxShadow: status === 'listening' 
                      ? '0 0 80px rgba(0,0,0,0.15)' 
                      : '0 0 40px rgba(0,0,0,0.1)'
                  }}
                >
                  <div className="absolute inset-0 bg-black/10 mix-blend-overlay opacity-50" />
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" 
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                
                {/* Visualizer bars inside/above if responding */}
                {status === 'responding' && (
                   <div className="absolute inset-0 flex items-center justify-center gap-1.5 px-12">
                     {[...Array(8)].map((_, i) => (
                       <motion.div
                         key={i}
                         className="w-1.5 bg-white/20 rounded-full"
                         animate={{ height: [10, 40, 10] }}
                         transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                       />
                     ))}
                   </div>
                )}
              </div>

              {/* Live Transcript - Minimalist & Ghostly */}
              <div className="h-20 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={status}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-2xl md:text-3xl font-bold text-black text-center max-w-xl leading-snug tracking-tight"
                  >
                    {status === 'listening' && "I am listening to you..."}
                    {status === 'thinking' && "Checking your history..."}
                    {status === 'responding' && "Okay, I've booked that for you."}
                  </motion.p>
                </AnimatePresence>
              </div>

              <motion.button
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 onClick={handleStop}
                 className="mt-16 flex items-center gap-3 px-8 py-4 rounded-full bg-black text-white hover:bg-zinc-800 transition-all shadow-xl group"
              >
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-sm font-black uppercase tracking-widest">
                  {status === 'responding' ? 'Complete' : 'Cancel'}
                </span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Receipt - Bottom Right */}
      <AnimatePresence>
        {(lastAction || status === 'done') && (
          <motion.div
            initial={{ opacity: 0, y: 100, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className="fixed bottom-10 right-10 z-50"
          >
            <Card className="p-5 border-2 border-emerald-100 bg-emerald-50 shadow-2xl flex items-center gap-5 max-w-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-200">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Action Complete</span>
                </div>
                <h4 className="text-lg font-black text-black leading-tight">
                  {lastAction || 'Appointment Booked'}
                </h4>
              </div>
              <button 
                onClick={() => setLastAction(null)}
                className="p-2 ml-2 hover:bg-emerald-100 rounded-lg transition-colors"
              >
                <ArrowRight className="w-5 h-5 text-emerald-400 rotate-45" />
              </button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Safety Badge - Bottom Left */}
      <div className="fixed bottom-10 left-10 flex items-center gap-3 text-zinc-400">
        <ShieldCheck className="w-5 h-5" />
        <span className="text-[10px] font-black uppercase tracking-widest">Private & Secure</span>
      </div>
    </div>
  );
}
