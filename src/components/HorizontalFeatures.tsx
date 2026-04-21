'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { Brain, Shield, Mic, Globe, Heart, Wallet, BookOpen, Users, ChevronRight } from 'lucide-react';

const features = [
  {
    number: '01',
    title: 'Voice Mirror',
    subtitle: 'Looca remembers what was said',
    description: 'A child asks what the teacher said today. An elderly patient asks about medicines. Looca plays back exactly what matters — medicine names, key decisions, next steps.',
    bullets: [
      'Separates each speaker\'s voice in group conversations',
      'Creates interactive Q&A quizzes for children',
      'Reads back only what matters in their dialect'
    ],
    icon: Brain,
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200'
  },
  {
    number: '02',
    title: 'Emotional Fingerprint',
    subtitle: 'The 7th Sense',
    description: 'Looca detects fear, confusion, urgency, and grief from voice prosody in 50 milliseconds — before a single word is processed. A child\'s voice shows distress — Looca quietly alerts the trusted adult.',
    bullets: [
      '8-dimensional emotional fingerprint analysis',
      'Child safety protocol with silent guardian alerts',
      'Loneliness detection for elders living alone'
    ],
    icon: Heart,
    color: 'from-rose-500 to-pink-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200'
  },
  {
    number: '03',
    title: 'Spoken Newspaper',
    subtitle: 'The world delivered to your ears',
    description: '285 million Indians cannot read the news. Looca reads it to them — curated for their location, interests, and language. A farmer hears crop prices. An elder hears local health news.',
    bullets: [
      'Personalized to location, interests, and life situation',
      'Only verified sources — government, WHO, regional press',
      'Misinformation filter for fake WhatsApp forwards'
    ],
    icon: Mic,
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    number: '04',
    title: 'Silent Guardian',
    subtitle: 'A child can always reach safety',
    description: 'A 7-year-old is home alone and falls. They say \'Looca, I\'m hurt.\' Looca calmly guides them to first-aid — step by step, in their language — and silently notifies their parent.',
    bullets: [
      'Complete first-aid voice guidance for emergencies',
      'Stranger danger protocol: silent GPS alert to parent + police',
      'Child speaks → Looca acts. Zero requirements from child'
    ],
    icon: Shield,
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200'
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
    color: 'from-teal-500 to-emerald-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200'
  },
  {
    number: '06',
    title: 'Voice Wallet',
    subtitle: 'Your money, accessible by speaking',
    description: 'Check balance. Send money. Pay bills. Entirely by voice. No screen needed. No app required. When someone calls claiming to be your bank asking for OTP — Looca interrupts: \'This is a scam.\'',
    bullets: [
      'Full UPI transaction by voice: balance, transfer, bills',
      'Built-in fraud shield detects scam call patterns',
      'Micro-savings intelligence suggests saving schemes'
    ],
    icon: Wallet,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  {
    number: '07',
    title: 'Story Mode',
    subtitle: 'Education as folk tales',
    description: 'Why do we pay tax? What is hypertension? Looca explains anything as a 2-minute story with characters and conflict — in local cultural settings. A child in Tamil Nadu hears a fisherman\'s story.',
    bullets: [
      'Civic concepts, health, science — all as oral folk tales',
      'Culturally adapted: fishermen, farmers, village elders',
      'Children comply with medication 3x more when they understand why'
    ],
    icon: BookOpen,
    color: 'from-indigo-500 to-violet-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200'
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
    color: 'from-slate-500 to-gray-600',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200'
  }
];

export function HorizontalFeatures() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-800%"]);

  return (
    <div ref={containerRef} className="relative" style={{ height: `${(features.length + 1) * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-white">
        {/* Horizontal scroll container */}
        <motion.div 
          className="flex h-full"
          style={{ x }}
        >
          {/* Hero Slide */}
          <div className="w-screen h-full flex-shrink-0 flex items-center justify-center px-8 md:px-16">
            <div className="max-w-6xl w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <motion.span 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="inline-block px-4 py-2 rounded-full border border-gray-300 text-sm text-gray-600 mb-6"
                  >
                    FEATURES
                  </motion.span>
                  <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-6"
                  >
                    EXAMPLES<br />
                    OF MODERN<br />
                    <span className="inline-block px-6 py-2 rounded-full border-2 border-gray-900">
                      AI TOOLS
                    </span>
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-600 text-lg max-w-md"
                  >
                    Here are some of the most popular and useful modern AI tools 
                    for digital specialists, freelancers, and entrepreneurs.
                  </motion.p>
                </div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="relative aspect-square max-w-lg mx-auto"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                        <Brain className="w-16 h-16 text-white" />
                      </div>
                      <p className="text-gray-500 text-sm">Intelligence that works for everyone</p>
                    </div>
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
