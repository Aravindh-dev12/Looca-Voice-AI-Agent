'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Sparkles } from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui';

type VoiceStatus = 'idle' | 'listening' | 'thinking' | 'responding';

export default function VoicePage() {
  const [status, setStatus] = useState<VoiceStatus>('idle');

  const handleActivate = () => {
    setStatus('listening');
    setTimeout(() => setStatus('thinking'), 3000);
    setTimeout(() => setStatus('responding'), 5000);
  };

  const handleStop = () => setStatus('idle');

  const statusConfig = {
    idle: { color: 'bg-gray-500', text: 'Say "Hey Looca" or click to start', pulse: false },
    listening: { color: 'bg-[#7cdbff]', text: 'Listening...', pulse: true },
    thinking: { color: 'bg-[#a78bfa]', text: 'Thinking...', pulse: true },
    responding: { color: 'bg-[#34d399]', text: 'Responding...', pulse: false },
  };

  const currentStatus = statusConfig[status];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <Badge variant="accent" className="mb-4">Interactive Assistant</Badge>
        <h1 className="text-3xl font-bold text-white mb-2">Talk with Looca</h1>
        <p className="text-[#a7b4c8]">This is the primary interaction point. Speak clearly to the assistant.</p>
      </div>

      {/* Voice Interface */}
      <Card gradient className="p-12 min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7cdbff]/5 rounded-full blur-3xl" />
        </div>

        <AnimatePresence mode="wait">
          {status === 'idle' ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative z-10 text-center"
            >
              <button
                onClick={handleActivate}
                className="w-40 h-40 rounded-full bg-gradient-to-br from-[rgba(124,219,255,0.2)] to-[rgba(139,92,246,0.2)] border-2 border-[rgba(124,219,255,0.4)] flex flex-col items-center justify-center gap-3 hover:border-[#7cdbff] hover:shadow-[0_0_80px_rgba(124,219,255,0.3)] transition-all duration-500 group"
              >
                <Mic className="w-12 h-12 text-[#7cdbff] group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-white tracking-widest uppercase">Initialize</span>
              </button>
              <p className="mt-8 text-sm text-[#64748b] uppercase tracking-widest">Built for Accessibility & Impact</p>
            </motion.div>
          ) : (
            <motion.div
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 text-center w-full"
            >
              {/* Orb Animation */}
              <div className="relative w-48 h-48 mx-auto mb-8">
                {/* Ripple effects */}
                {currentStatus.pulse && (
                  <>
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-[#7cdbff]/30"
                      animate={{ scale: [1, 2], opacity: [0.8, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-[#7cdbff]/20"
                      animate={{ scale: [1, 2], opacity: [0.8, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 1 }}
                    />
                  </>
                )}
                
                {/* Main orb */}
                <motion.div
                  className={`absolute inset-4 rounded-full ${currentStatus.color} shadow-lg`}
                  animate={{ scale: currentStatus.pulse ? [1, 1.1, 1] : 1 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    background: `radial-gradient(circle at 30% 30%, #fff, ${status === 'listening' ? '#7cdbff' : status === 'thinking' ? '#a78bfa' : '#34d399'}, #8b5cf6)`,
                    boxShadow: `0 0 60px ${status === 'listening' ? 'rgba(124,219,255,0.6)' : status === 'thinking' ? 'rgba(139,92,246,0.6)' : 'rgba(52,211,153,0.6)'}`
                  }}
                />
              </div>

              {/* Status Text */}
              <h2 className="text-2xl font-bold text-white mb-2">
                {status === 'listening' ? '◉ Listening' : status === 'thinking' ? '◎ Thinking' : '● Responding'}
              </h2>
              <p className="text-[#a7b4c8] mb-8">{currentStatus.text}</p>

              {/* Live Transcript (demo) */}
              {status !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-md mx-auto"
                >
                  <Card className="p-4 mb-4 bg-white/5">
                    <div className="flex items-center gap-2 mb-2 text-sm text-[#64748b]">
                      <Sparkles className="w-4 h-4" />
                      Live Context
                    </div>
                    <p className="text-sm text-[#a7b4c8]">
                      {status === 'listening' && "YOU: 'Mujhe kal ke liye doctor appointment...'"}
                      {status === 'thinking' && 'Retrieving from Qdrant (42ms) • Detecting language: Hindi • Loading health context'}
                      {status === 'responding' && "LOOCA: 'Bilkul. Aapke nearest government hospital mein Thursday 10am aur 2pm ke slots hain.'"}
                    </p>
                  </Card>
                </motion.div>
              )}

              <Button variant="danger" onClick={handleStop}>
                <MicOff className="w-4 h-4 mr-2" /> End Interaction
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        <Card className="absolute bottom-6 left-6 right-6 p-4 max-w-md mx-auto">
          <h4 className="font-medium text-white mb-2">Instructions</h4>
          <ul className="text-sm text-[#a7b4c8] space-y-1">
            <li>• State your request clearly</li>
            <li>• Ask about specific services (e.g., "Healthcare")</li>
            <li>• The assistant will simplify complex steps for you</li>
          </ul>
        </Card>
      </Card>
    </div>
  );
}
