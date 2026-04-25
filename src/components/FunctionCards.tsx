'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Link from 'next/link';

function ScrambleText({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState(text);
  const [trigger, setTrigger] = useState(0);
  const chars = "!@#$%^&*()_+{}:\"<>?,./;'[]-=";

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(prev => 
        text.split("")
          .map((char, index) => {
            if (index < iteration - 2) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length + 2) {
        clearInterval(interval);
        setTimeout(() => setTrigger(t => t + 1), 2000);
      }

      iteration += 1 / 4;
    }, 50);

    return () => clearInterval(interval);
  }, [text, trigger]);

  return <span>{displayText}</span>;
}
import { 
  Bot, 
  BarChart3, 
  MessageSquare, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

const functions = [
  {
    number: '01',
    title: 'Vocal Intelligence',
    description: 'Advanced voice analysis that detects emotional prosody, urgency, and grief in just 50 milliseconds of audio input.',
    image: '/1.jpg',
    color: 'from-zinc-900 to-zinc-700',
    bgGradient: 'from-zinc-100 to-zinc-50'
  },
  {
    number: '02',
    title: 'Contextual Awareness',
    description: 'A persistent intelligence layer that lives inside your computer, remembering every detail of your previous voice sessions.',
    image: '/2.jpg',
    color: 'from-zinc-800 to-zinc-600',
    bgGradient: 'from-zinc-50 to-zinc-100'
  },
  {
    number: '03',
    title: 'Persistent Companion',
    description: 'Always listening, always ready. Looca builds a long-term timeline of your life entirely from vocal interactions.',
    image: '/3.jpg',
    color: 'from-zinc-700 to-zinc-500',
    bgGradient: 'from-zinc-100 to-zinc-50'
  },
  {
    number: '04',
    title: 'Scam Shield',
    description: 'Real-time vocal pattern analysis during calls to identify potential fraud and scams before they impact you.',
    image: '/4.jpg',
    color: 'from-zinc-950 to-zinc-800',
    bgGradient: 'from-zinc-50 to-zinc-100'
  }
];

export function FunctionCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const cardsX = useTransform(scrollYProgress, [0, 1], ["100%", "-100%"]);
  
  // Text fades to background as cards come in
  const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.5], [1, 0.3, 0.1]);
  const textScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);

  return (
    <section ref={containerRef} className="relative bg-white" style={{ height: '300vh' }}>
      {/* Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        
        {/* Big text - starts prominent, fades to background when cards scroll */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        
        <motion.div 
          className="absolute inset-0 flex items-center justify-center z-0"
          style={{ opacity: textOpacity, scale: textScale }}
        >
          <div className="text-center px-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-zinc-200 text-[10px] font-black text-black uppercase tracking-[0.2em] mb-12 shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
              INTELLIGENCE AGENT
            </motion.div>
            
            <h2 className="text-[12vw] md:text-[10vw] font-black text-black leading-[0.75] mb-12 uppercase tracking-tighter">
              THE POWER
            </h2>
            <div className="flex items-center justify-center gap-4 mt-4">
              <span className="text-5xl md:text-7xl lg:text-[8vw] font-black text-black leading-none">OF</span>
              <span className="text-5xl md:text-7xl lg:text-[8vw] font-mono font-black text-black border-[6px] border-black px-10 py-2 rounded-full bg-zinc-50/50 backdrop-blur-sm">
                <ScrambleText text="VOICE" />
              </span>
              <span className="text-5xl md:text-7xl lg:text-[8vw] font-black text-black leading-none uppercase">AI</span>
            </div>
            
            <motion.div className="max-w-2xl mx-auto mt-16 space-y-6">
              <p className="text-zinc-500 text-base md:text-lg font-bold uppercase tracking-widest leading-relaxed">
                VOCAL EVOLUTION
              </p>
              <p className="text-zinc-400 text-sm md:text-base font-medium max-w-xl mx-auto leading-relaxed italic">
                "Not just an assistant, but a persistent intellectual companion that 
                understands the human condition through every syllable and silence."
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Cards - scroll horizontally from right over the text */}
        <div className="absolute inset-0 flex items-center z-10">
          <motion.div 
            className="flex gap-6 px-8"
            style={{ x: cardsX }}
          >
          {functions.map((func, index) => {
            return (
              <motion.div
                key={func.number}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-[320px] md:w-[380px] flex-shrink-0 group"
              >
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 h-full border border-gray-100">
                  {/* Image Area */}
                  <div className={`relative h-56 overflow-hidden`}>
                    <img 
                      src={func.image} 
                      alt={func.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl font-bold text-zinc-400">{func.number}</span>
                      <div className="h-px flex-1 bg-zinc-200" />
                    </div>
                    <h4 className="text-2xl font-bold text-zinc-900 mb-3">
                      {func.title}
                    </h4>
                    <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                      {func.description}
                    </p>
                    <Link 
                      href={`/learn-more#feature-${func.number}`}
                      className="flex items-center gap-2 text-sm font-semibold text-zinc-900 hover:text-zinc-600 transition-colors group/btn"
                    >
                      Learn more 
                      <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      </div>

      {/* Progress bar */}
      <div className="flex justify-center gap-3 mt-16">
        {functions.map((_, index) => (
          <div 
            key={index} 
            className="w-16 h-2 rounded-full bg-gray-300"
          />
        ))}
      </div>
    </section>
  );
}
