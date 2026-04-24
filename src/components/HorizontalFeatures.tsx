'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { Brain, Shield, Mic, Globe, Heart, Wallet, BookOpen, Users, ChevronRight } from 'lucide-react';

const features = [
  {
    number: '01',
    title: 'Voice Mirror',
    subtitle: 'Looca remembers what was said',
    description: 'A child asks what the teacher said today. An elderly patient asks about medicines. Looca plays back exactly what matters medicine names, key decisions, next steps.',
    bullets: [
      'Separates each speaker\'s voice in group conversations',
      'Creates interactive Q&A quizzes for children',
      'Reads back only what matters in their dialect'
    ],
    icon: Brain,
    color: 'from-zinc-900 to-zinc-700',
    bgColor: 'bg-zinc-50',
    borderColor: 'border-zinc-200'
  },
  {
    number: '02',
    title: 'Emotional Fingerprint',
    subtitle: 'The 7th Sense',
    description: 'Looca detects fear, confusion, urgency, and grief from voice prosody in 50 milliseconds before a single word is processed. A child\'s voice shows distress Looca quietly alerts the trusted adult.',
    bullets: [
      '8-dimensional emotional fingerprint analysis',
      'Child safety protocol with silent guardian alerts',
      'Loneliness detection for elders living alone'
    ],
    icon: Heart,
    color: 'from-zinc-100 to-zinc-200',
    bgColor: 'bg-zinc-50',
    borderColor: 'border-zinc-200'
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
    color: 'from-zinc-400 to-zinc-600',
    bgColor: 'bg-zinc-50',
    borderColor: 'border-zinc-200'
  },
  {
    number: '04',
    title: 'Silent Guardian',
    subtitle: 'A child can always reach safety',
    description: 'A 7-year-old is home alone and falls. They say \'Looca, I\'m hurt.\' Looca calmly guides them to first-aid step by step, in their language and silently notifies their parent.',
    bullets: [
      'Complete first-aid voice guidance for emergencies',
      'Stranger danger protocol: silent GPS alert to parent + police',
      'Child speaks → Looca acts. Zero requirements from child'
    ],
    icon: Shield,
    color: 'from-zinc-950 to-zinc-800',
    bgColor: 'bg-zinc-50',
    borderColor: 'border-zinc-200'
  },
  {
    number: '05',
    title: 'Memory Palace',
    subtitle: 'Infinite patience for dementia care',
    description: 'For dementia patients, repetition is reality. Looca never says \'as I mentioned.\' It answers every question as if it\'s the first time, with the same gentleness. Families get weekly cognitive tracking.',
    bullets: [
      'Purpose-built dementia protocol: zero impatience',
      'Longitudinal cognitive tracking for neurologists',
      'Absorbs the repeating-question load for caregivers'
    ],
    icon: Brain,
    color: 'from-zinc-100 to-zinc-300',
    bgColor: 'bg-zinc-50',
    borderColor: 'border-zinc-200'
  },
  {
    number: '06',
    title: 'Voice Wallet',
    subtitle: 'Your money, accessible by speaking',
    description: 'Check balance. Send money. Pay bills. Entirely by voice. No screen needed. No app required. When someone calls claiming to be your bank asking for OTP Looca interrupts: \'This is a scam.\'',
    bullets: [
      'Full UPI transaction by voice: balance, transfer, bills',
      'Built-in fraud shield detects scam call patterns',
      'Micro-savings intelligence suggests saving schemes'
    ],
    icon: Wallet,
    color: 'from-zinc-800 to-zinc-950',
    bgColor: 'bg-zinc-50',
    borderColor: 'border-zinc-200'
  },
  {
    number: '07',
    title: 'Story Mode',
    subtitle: 'Education as folk tales',
    description: 'Why do we pay tax? What is hypertension? Looca explains anything as a 2-minute story with characters and conflict in local cultural settings. A child in Tamil Nadu hears a fisherman\'s story.',
    bullets: [
      'Civic concepts, health, science — all as oral folk tales',
      'Culturally adapted: fishermen, farmers, village elders',
      'Children comply with medication 3x more when they understand why'
    ],
    icon: BookOpen,
    color: 'from-zinc-400 to-zinc-500',
    bgColor: 'bg-zinc-50',
    borderColor: 'border-zinc-200'
  },
  {
    number: '08',
    title: 'Grief Companion',
    subtitle: 'Sits with you in silence',
    description: 'A widow calls Looca at 2am and doesn\'t say anything. She just wants to not be alone. Looca stays on the line. Says softly after 3 minutes: \'I\'m here. Take your time.\' It never hangs up until she does.',
    bullets: [
      'Grief-aware mode activates for 90 days after bereavement',
      'Loneliness detection triggers family alerts',
      'Weekly emotional signals: "She laughed on Tuesday"'
    ],
    icon: Heart,
    color: 'from-zinc-900 to-black',
    bgColor: 'bg-zinc-50',
    borderColor: 'border-zinc-200'
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
        // Trigger again after 2 seconds
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
    <div ref={containerRef} className="relative" style={{ height: `${(features.length + 1) * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-white">
        {/* Horizontal scroll container */}
        <motion.div
          className="flex h-full"
          style={{ x }}
        >
          {/* Hero Slide - Redesigned */}
          <div className="w-screen h-full flex-shrink-0 flex items-center justify-center px-8 md:px-16 bg-white relative overflow-hidden">
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
                  <div className="flex items-center justify-center gap-4 pt-4">
                    <div className="h-px w-12 bg-zinc-200" />
                    <div className="w-2 h-2 rounded-full border-2 border-zinc-300" />
                    <div className="h-px w-12 bg-zinc-200" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Feature Slides */}
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.number}
                className="w-screen h-full flex-shrink-0 flex items-center justify-center px-8 md:px-16"
              >
                <div className="max-w-6xl w-full">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Number & Content */}
                    <div className="order-2 lg:order-1">
                      <div className="flex items-start gap-6 mb-6">
                        <span className="text-8xl font-bold text-gray-200">{feature.number}</span>
                        <div>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${feature.bgColor} ${feature.borderColor} border`}>
                            {feature.subtitle}
                          </span>
                          <h3 className="text-3xl md:text-4xl font-bold text-gray-900">{feature.title}</h3>
                        </div>
                      </div>
                      <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                        {feature.description}
                      </p>
                      <ul className="space-y-3">
                        {feature.bullets.map((bullet, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-600">
                            <div className={`w-5 h-5 rounded-full ${feature.bgColor} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                              <ChevronRight className="w-3 h-3 text-gray-700" />
                            </div>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Right: Image */}
                    <div className="order-1 lg:order-2">
                      <div className={`relative aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br ${feature.color} p-1`}>
                        <div className="w-full h-full rounded-[22px] bg-white flex items-center justify-center">
                          <div className="text-center p-8">
                            <div className={`w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                              <Icon className="w-12 h-12 text-white" />
                            </div>
                            <p className="text-gray-500 text-sm">{feature.title}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
