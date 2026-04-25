'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Brain, 
  Shield, 
  Mic, 
  Globe, 
  Heart, 
  Wallet, 
  BookOpen, 
  Users, 
  ChevronRight,
  Activity,
  AlertTriangle,
  History,
  Play,
  CheckCircle2,
  Lock,
  Smartphone,
  Star
} from 'lucide-react';

const features = [
  {
    number: '01',
    title: 'Voice Mirror',
    subtitle: 'Looca remembers what was said',
    description: 'A child asks what the teacher said today. An elderly patient asks about medicines. Looca plays back exactly what matters—medicine names, key decisions, next steps.',
    bullets: [
      'Separates each speaker\'s voice in group conversations',
      'Creates interactive Q&A quizzes for children',
      'Reads back only what matters in their dialect'
    ],
    icon: Brain,
    color: 'from-blue-600 to-indigo-600',
    viz: (
      <div className="space-y-4 w-full px-6">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100 shadow-sm">
           <Mic className="h-4 w-4 text-blue-600" />
           <div className="h-2 w-32 bg-blue-200 rounded-full" />
        </div>
        <div className="p-4 rounded-2xl bg-white border border-zinc-100 shadow-xl space-y-3">
           <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Looca Intelligence</p>
           <p className="text-sm font-bold text-zinc-900">"The doctor said take Paracetamol at 2 PM."</p>
           <div className="flex gap-2">
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">MEDICINE</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">2:00 PM</span>
           </div>
        </div>
      </div>
    )
  },
  {
    number: '02',
    title: 'Emotional Fingerprint',
    subtitle: 'The 7th Sense',
    description: 'Looca detects fear, confusion, urgency, and grief from voice prosody in 50 milliseconds. A child\'s voice shows distress? Looca quietly alerts the trusted adult.',
    bullets: [
      '8-dimensional emotional fingerprint analysis',
      'Child safety protocol with silent guardian alerts',
      'Loneliness detection for elders living alone'
    ],
    icon: Heart,
    color: 'from-rose-500 to-pink-600',
    viz: (
      <div className="relative h-40 w-full flex items-center justify-center">
         <motion.div 
           animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
           transition={{ duration: 2, repeat: Infinity }}
           className="absolute h-32 w-32 bg-rose-500 rounded-full blur-3xl"
         />
         <div className="relative z-10 flex gap-1 items-end h-16">
            {[1,2,3,4,5,4,3,2,1].map((h, i) => (
              <motion.div 
                key={i}
                animate={{ height: [10, h * 10, 10] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                className="w-1.5 bg-rose-500 rounded-full"
              />
            ))}
         </div>
         <div className="absolute bottom-0 text-[10px] font-black text-rose-600 uppercase tracking-widest">Urgency Detected: 92%</div>
      </div>
    )
  },
  {
    number: '03',
    title: 'Spoken Newspaper',
    subtitle: 'The world delivered to your ears',
    description: '285 million Indians cannot read the news. Looca reads it to them curated for their location, interests, and language. A farmer hears crop prices. An elder hears local health news.',
    bullets: [
      'Personalized to location, interests, and life situation',
      'Only verified sources — government, WHO, regional press',
      'Misinformation filter for fake WhatsApp forwards'
    ],
    icon: Mic,
    color: 'from-orange-500 to-amber-600',
    viz: (
      <div className="p-6 w-full space-y-4">
         <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <span className="text-[10px] font-black text-zinc-900 uppercase">Local News Hub</span>
            <Globe className="h-3 w-3 text-zinc-300" />
         </div>
         <div className="space-y-2">
            <h4 className="text-sm font-black leading-tight text-zinc-900 uppercase">New health center opens in Madurai tomorrow.</h4>
            <p className="text-[10px] text-zinc-500 line-clamp-2 leading-relaxed">Source: Regional Press • Verified by Looca</p>
         </div>
         <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
               <Play className="h-3 w-3 text-zinc-900" fill="currentColor" />
            </div>
            <div className="flex-1 h-2 bg-zinc-100 rounded-full self-center" />
         </div>
      </div>
    )
  },
  {
    number: '04',
    title: 'Silent Guardian',
    subtitle: 'A child can always reach safety',
    description: 'A 7-year-old is home alone and falls. They say "Looca, I\'m hurt." Looca calmly guides them to first-aid step by step and silently notifies their parent.',
    bullets: [
      'Complete first-aid voice guidance for emergencies',
      'Stranger danger protocol: silent GPS alert to parent',
      'Child speaks → Looca acts. Zero requirements from child'
    ],
    icon: Shield,
    color: 'from-red-600 to-rose-700',
    viz: (
      <div className="bg-red-50 p-6 rounded-3xl border border-red-100 w-full space-y-4">
         <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-[10px] font-black text-red-900 uppercase tracking-widest">Active Emergency</span>
         </div>
         <div className="space-y-1">
            <p className="text-xs font-bold text-red-900 uppercase">Parent Notified</p>
            <p className="text-[10px] text-red-600 font-medium">GPS: 13.0827° N, 80.2707° E</p>
         </div>
         <div className="p-3 rounded-xl bg-white border border-red-100 shadow-sm flex items-center gap-3">
            <Shield className="h-4 w-4 text-red-600" />
            <span className="text-[10px] font-bold text-zinc-900">"Apply pressure to the wound."</span>
         </div>
      </div>
    )
  },
  {
    number: '05',
    title: 'Memory Palace',
    subtitle: 'Infinite patience for dementia care',
    description: 'For dementia patients, repetition is reality. Looca never says "as I mentioned." It answers every question as if it\'s the first time, with the same gentleness.',
    bullets: [
      'Purpose-built dementia protocol: zero impatience',
      'Longitudinal cognitive tracking for neurologists',
      'Absorbs the repeating-question load for caregivers'
    ],
    icon: Brain,
    color: 'from-zinc-900 to-black',
    viz: (
      <div className="p-6 w-full space-y-4">
         <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Cognitive State</span>
            <Activity className="h-3 w-3 text-zinc-300" />
         </div>
         <div className="h-20 w-full bg-zinc-50 rounded-xl border border-zinc-100 flex items-end justify-between px-2 pb-2">
            {[30, 45, 40, 55, 50, 65, 60].map((h, i) => (
               <div key={i} className="w-4 bg-zinc-900 rounded-t-sm" style={{ height: `${h}%` }} />
            ))}
         </div>
         <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-tighter italic">Weekly Trend: Stable +4% Improvement</p>
      </div>
    )
  },
  {
    number: '06',
    title: 'Voice Wallet',
    subtitle: 'Your money, accessible by speaking',
    description: 'Check balance. Send money. Pay bills. Entirely by voice. No screen needed. When someone calls claiming to be your bank, Looca interrupts: "This is a scam."',
    bullets: [
      'Full UPI transaction by voice: balance, transfer, bills',
      'Built-in fraud shield detects scam call patterns',
      'Micro-savings intelligence suggests saving schemes'
    ],
    icon: Wallet,
    color: 'from-emerald-600 to-teal-700',
    viz: (
      <div className="p-6 w-full space-y-4">
         <div className="flex items-center justify-between">
            <Smartphone className="h-4 w-4 text-zinc-900" />
            <div className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase tracking-widest">Secure UPI</div>
         </div>
         <div className="p-4 rounded-2xl bg-white border border-zinc-100 shadow-xl text-center space-y-2">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
            <p className="text-xl font-black text-zinc-900">₹ 2,400</p>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Sent to Ramesh</p>
         </div>
         <div className="p-2 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2">
            <AlertTriangle className="h-3 w-3 text-red-600 shrink-0" />
            <span className="text-[8px] font-black text-red-900 uppercase">Scam Detected • Blocked</span>
         </div>
      </div>
    )
  },
  {
    number: '07',
    title: 'Story Mode',
    subtitle: 'Education as folk tales',
    description: 'Why do we pay tax? What is hypertension? Looca explains anything as a 2-minute story with characters and conflict in local cultural settings.',
    bullets: [
      'Civic concepts, health, science — all as oral folk tales',
      'Culturally adapted: fishermen, farmers, village elders',
      'Children comply with medication 3x more when they understand why'
    ],
    icon: BookOpen,
    color: 'from-purple-600 to-fuchsia-700',
    viz: (
      <div className="relative p-6 w-full flex flex-col items-center justify-center text-center space-y-4">
         <BookOpen className="h-16 w-16 text-purple-600 opacity-20 absolute" />
         <Star className="h-10 w-10 text-purple-600 relative animate-spin-slow" />
         <div className="space-y-1">
            <h4 className="text-xs font-black text-purple-900 uppercase tracking-widest">Chapter 1: The Magic Crop</h4>
            <p className="text-[9px] text-purple-600 italic">Explaining Fertilizer Balance through a fisherman's tale.</p>
         </div>
         <div className="flex gap-1">
            {[1,2,3].map(i => <div key={i} className="h-1 w-8 rounded-full bg-purple-100" />)}
         </div>
      </div>
    )
  },
  {
    number: '08',
    title: 'Grief Companion',
    subtitle: 'Sits with you in silence',
    description: 'A widow calls Looca at 2am and doesn\'t say anything. She just wants to not be alone. Looca stays on the line. Says softly: "I\'m here. Take your time."',
    bullets: [
      'Grief-aware mode activates for 90 days after bereavement',
      'Loneliness detection triggers family alerts',
      'Weekly emotional signals: "She laughed on Tuesday"'
    ],
    icon: Heart,
    color: 'from-zinc-100 to-zinc-200',
    viz: (
      <div className="p-8 w-full flex flex-col items-center justify-center space-y-6">
         <div className="flex gap-2">
            <motion.div 
               animate={{ scale: [1, 1.2, 1] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="h-12 w-12 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center"
            >
               <History className="h-6 w-6 text-zinc-400" />
            </motion.div>
         </div>
         <div className="p-4 rounded-[32px] bg-white border border-zinc-100 shadow-lg relative max-w-[200px]">
            <p className="text-xs text-zinc-500 italic leading-relaxed">"I'm here. Take your time."</p>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-white border-b border-l border-zinc-100 rotate-45" />
         </div>
         <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Companion Active</span>
         </div>
      </div>
    )
  }
];

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

export function HorizontalFeatures() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const x = useTransform(scrollYProgress, [0, 0.15, 1], ["0%", "0%", "-800%"]);

  return (
    <section ref={containerRef} className="relative" style={{ height: `${(features.length + 1) * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div className="flex h-full" style={{ x }}>
          {/* Hero Slide */}
          <div className="w-screen h-full flex-shrink-0 flex items-center justify-center px-8 md:px-16 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

            <div className="max-w-7xl w-full relative z-10">
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-50 border border-zinc-200 text-[10px] font-black text-black uppercase tracking-[0.2em] mb-12 shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                  PERSISTENCE LAYER
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.8, ease: "circOut" }}
                  className="text-[14vw] md:text-[11vw] font-black text-black leading-[0.75] mb-12 uppercase tracking-tighter"
                >
                  THE POWER<br />
                  OF <span className="inline-block px-10 py-2 rounded-full border-[6px] border-black text-black bg-zinc-50/50 backdrop-blur-sm">
                    <ScrambleText text="VOICE" />
                  </span> AI
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="max-w-2xl mx-auto space-y-6"
                >
                  <p className="text-zinc-500 text-base md:text-lg font-bold uppercase tracking-widest leading-relaxed">
                    A VOCAL EVOLUTION
                  </p>
                  <p className="text-zinc-400 text-sm md:text-base font-medium max-w-xl mx-auto leading-relaxed italic">
                    "Not just an assistant, but a persistent intellectual companion that
                    understands the human condition through every syllable and silence."
                  </p>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Feature Slides */}
          {features.map((feature, index) => {
            return (
              <div
                key={feature.number}
                className="w-screen h-full flex-shrink-0 flex items-center justify-center px-8 md:px-16"
              >
                <div className="max-w-6xl w-full">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    {/* Left: Content */}
                    <div className="order-2 lg:order-1 space-y-8">
                      <div className="flex items-center gap-6">
                        <span className="text-8xl font-black text-zinc-100 leading-none">{feature.number}</span>
                        <div className="h-12 w-px bg-zinc-200" />
                        <div className="space-y-1">
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{feature.subtitle}</span>
                           <h3 className="text-4xl font-black text-zinc-900 tracking-tighter uppercase italic">{feature.title}</h3>
                        </div>
                      </div>
                      <p className="text-zinc-500 text-lg leading-relaxed font-medium">
                        {feature.description}
                      </p>
                      <div className="grid grid-cols-1 gap-3">
                        {feature.bullets.map((bullet, i) => (
                          <div key={i} className="flex items-center gap-3 text-sm font-bold text-zinc-700">
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                            {bullet}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Custom Visualizations */}
                    <div className="order-1 lg:order-2">
                       <motion.div 
                         whileHover={{ scale: 1.02 }}
                         className={`relative aspect-square rounded-[64px] overflow-hidden bg-white border border-zinc-100 shadow-2xl flex items-center justify-center p-1`}
                       >
                          <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-[0.03]`} />
                          <div className="relative z-10 w-full">
                             {feature.viz}
                          </div>
                       </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
