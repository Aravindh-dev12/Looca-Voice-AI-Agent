'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, FileText, Link as LinkIcon, Sparkles, Volume2, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui';

export default function SimplifyDocumentPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSimplify = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setResult("This letter is from your bank. They are saying your account is safe, and you don't need to do anything right now. They just updated their internal rules for everyone.");
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      {/* Header - Simple & Calming */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[10px] font-black text-black uppercase tracking-widest">
          <Wand2 className="w-3 h-3" />
          Easy Read
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-black tracking-tight">
          Simplify a Document
        </h1>
        <p className="text-zinc-500 text-lg font-medium">
          Give VIOS something difficult to read, and it will explain it simply.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="input-stage"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            {/* Input Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-8 border-2 border-zinc-100 hover:border-black transition-all group flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center mb-6 group-hover:bg-black transition-all">
                  <FileText className="w-8 h-8 text-zinc-400 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-black text-black mb-2">Upload a Photo</h3>
                <p className="text-zinc-500 text-sm font-medium mb-8">
                  Take a picture of a letter, form, or document.
                </p>
                <Button className="w-full rounded-full">Choose Photo</Button>
              </Card>

              <Card className="p-8 border-2 border-zinc-100 hover:border-black transition-all group flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center mb-6 group-hover:bg-black transition-all">
                  <LinkIcon className="w-8 h-8 text-zinc-400 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-black text-black mb-2">Paste a Link</h3>
                <p className="text-zinc-500 text-sm font-medium mb-8">
                  Paste a link to a website or news article.
                </p>
                <div className="w-full space-y-3">
                  <input
                    type="text"
                    placeholder="https://..."
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-black text-sm"
                  />
                  <Button className="w-full rounded-full" onClick={handleSimplify} disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simplify Now"}
                  </Button>
                </div>
              </Card>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result-stage"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="p-10 border-2 border-black shadow-2xl bg-white relative overflow-hidden">
              <Sparkles className="absolute top-4 right-4 w-12 h-12 text-zinc-50" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                    <Volume2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">
                    VIOS Simplified Version
                  </span>
                </div>

                <p className="text-2xl md:text-3xl font-bold text-black leading-tight mb-10">
                  "{result}"
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="flex-1 h-14 rounded-full bg-black text-white hover:bg-zinc-800 text-lg font-black">
                    <Volume2 className="w-6 h-6 mr-3" /> Read Out Loud
                  </Button>
                  <Button variant="secondary" className="flex-1 h-14 rounded-full border-2 border-zinc-100 text-lg font-black" onClick={() => setResult(null)}>
                    Try Another
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-8 rounded-[2rem] bg-zinc-50 border-2 border-zinc-100 flex items-center gap-6">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
          <ShieldCheck className="w-6 h-6 text-emerald-500" />
        </div>
        <p className="text-zinc-600 font-medium text-sm">
          "VIOS removes the difficult words from government and bank letters so you can understand them easily."
        </p>
      </div>
    </div>
  );
}
