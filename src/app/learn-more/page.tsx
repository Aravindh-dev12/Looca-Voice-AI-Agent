'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Brain, 
  Shield, 
  Heart, 
  MessageCircle, 
  Zap,
  Mic,
  Activity,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui';

const features = [
  {
    id: '01',
    title: 'Vocal Intelligence',
    subtitle: 'Understanding the human condition through sound.',
    description: 'Our proprietary Vocal Engine analyzes over 1,500 acoustic features in real-time. It doesn\'t just hear what you say; it understands how you feel.',
    details: [
      {
        icon: Activity,
        label: 'Emotional Prosody',
        desc: 'Detects subtle shifts in tone, pitch, and rhythm to identify emotions like joy, anxiety, or fatigue.'
      },
      {
        icon: Zap,
        label: '50ms Latency',
        desc: 'Processing happens at the edge, ensuring instant feedback and a natural conversational flow.'
      },
      {
        icon: Mic,
        label: 'Advanced Acoustics',
        desc: 'Filters background noise and focuses on the unique vocal signatures of the user.'
      }
    ],
    image: '/1.jpg',
    color: 'bg-zinc-50'
  },
  {
    id: '02',
    title: 'Contextual Awareness',
    subtitle: 'An intelligence that grows with you.',
    description: 'Looca doesn\'t forget. It builds a multi-dimensional graph of your interactions, allowing it to recall details from months ago as if they happened yesterday.',
    details: [
      {
        icon: Brain,
        label: 'Episodic Memory',
        desc: 'Organizes conversations into a chronological timeline of events, people, and topics.'
      },
      {
        icon: Lock,
        label: 'Privacy First',
        desc: 'Memory processing happens locally on your device. Your life story stays with you.'
      },
      {
        icon: MessageCircle,
        label: 'Cross-Session Recall',
        desc: 'Reference past discussions naturally without having to repeat yourself.'
      }
    ],
    image: '/2.jpg',
    color: 'bg-white'
  },
  {
    id: '03',
    title: 'Persistent Companion',
    subtitle: 'More than an assistant. A partner.',
    description: 'Designed to be proactive, Looca anticipates your needs based on your vocal history and daily patterns.',
    details: [
      {
        icon: Heart,
        label: 'Well-being Tracking',
        desc: 'Monitors vocal health and stress levels to suggest breaks or mindfulness exercises.'
      },
      {
        icon: Activity,
        label: 'Life Timeline',
        desc: 'Generates a "Vocal Journal" that captures the essence of your days through sound.'
      },
      {
        icon: Zap,
        label: 'Proactive Support',
        desc: 'Suggests reminders or provides context before you even realize you need it.'
      }
    ],
    image: '/3.jpg',
    color: 'bg-zinc-50'
  },
  {
    id: '04',
    title: 'Scam Shield',
    subtitle: 'Your vocal defense system.',
    description: 'Looca acts as a protective layer during your calls, analyzing incoming audio for patterns associated with known fraud and social engineering.',
    details: [
      {
        icon: Shield,
        label: 'Fraud Detection',
        desc: 'Identifies deepfakes and synthesized voices used in sophisticated scam attempts.'
      },
      {
        icon: Lock,
        label: 'Call Verification',
        desc: 'Matches vocal prints against verified identities to ensure you know who you\'re talking to.'
      },
      {
        icon: Zap,
        label: 'Instant Alerts',
        desc: 'Provides real-time visual and haptic warnings if suspicious patterns are detected.'
      }
    ],
    image: '/4.jpg',
    color: 'bg-white'
  }
];

export default function LearnMorePage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-black selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/l.png" alt="Looca" className="w-8 h-8 rounded-lg group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xl tracking-tight">Looca</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="rounded-full gap-2 hover:bg-zinc-100">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
              EVERY DETAIL,<br />
              <span className="text-zinc-300 uppercase">Explained.</span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-500 font-medium max-w-2xl mx-auto leading-relaxed">
              Looca isn't just software. It's a fundamental shift in how we interact with the digital world through our most natural interface: Voice.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature Sections */}
      <div className="space-y-0">
        {features.map((feature, index) => (
          <section 
            key={feature.id} 
            id={`feature-${feature.id}`}
            className={`py-32 px-6 ${feature.color} overflow-hidden`}
          >
            <div className="max-w-7xl mx-auto">
              <div className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-16 lg:gap-24 items-center`}>
                {/* Content */}
                <div className="flex-1 space-y-10">
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 1 ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-4xl font-black text-zinc-200">{feature.id}</span>
                      <div className="h-px w-12 bg-zinc-200" />
                      <span className="text-sm font-bold uppercase tracking-widest text-zinc-400">Advanced Feature</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
                      {feature.title}
                    </h2>
                    <h3 className="text-xl md:text-2xl font-bold text-zinc-400 mb-8">
                      {feature.subtitle}
                    </h3>
                    <p className="text-lg md:text-xl text-zinc-600 leading-relaxed max-w-xl">
                      {feature.description}
                    </p>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {feature.details.map((detail, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 * idx }}
                        className="space-y-4"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-900 shadow-sm border border-zinc-200">
                          <detail.icon className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-lg">{detail.label}</h4>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                          {detail.desc}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Visual */}
                <motion.div 
                  className="flex-1 relative"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] aspect-[4/5] lg:aspect-square">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    
                    {/* Decorative element */}
                    <div className="absolute top-8 right-8 w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                      <span className="text-white font-black text-2xl">{feature.id}</span>
                    </div>
                  </div>
                  
                  {/* Floating badge */}
                  <div className={`absolute -bottom-8 ${index % 2 === 1 ? '-left-8' : '-right-8'} p-6 bg-white rounded-3xl shadow-2xl border border-zinc-100 max-w-[200px] hidden md:block`}>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Performance</p>
                    <p className="text-sm font-medium text-zinc-900 leading-snug italic">
                      "Exceeding industry standards for real-time vocal analysis."
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* CTA Section */}
      <section className="py-40 px-6 bg-black text-white text-center">
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase">
            Start Your<br />
            <span className="text-zinc-600">Evolution.</span>
          </h2>
          <p className="text-xl md:text-2xl text-zinc-400 max-w-xl mx-auto">
            Experience the persistent intelligence that understands you better with every word.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/dashboard">
              <Button size="lg" className="h-16 px-12 text-xl rounded-full bg-white text-black hover:bg-zinc-200 transition-all font-bold">
                Get Started
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <img src="/l.png" alt="Looca" className="w-6 h-6 rounded" />
            <span className="font-bold text-sm tracking-tight text-zinc-400">© 2026 Looca AI. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="#" className="text-sm font-medium text-zinc-400 hover:text-black transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-sm font-medium text-zinc-400 hover:text-black transition-colors">Terms of Service</Link>
            <Link href="#" className="text-sm font-medium text-zinc-400 hover:text-black transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
