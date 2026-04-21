'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
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
    title: 'Marketing Automation',
    description: 'Marketing automation tools can help streamline marketing processes, automate repetitive tasks, and improve overall marketing efficiency.',
    icon: Bot,
    color: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50'
  },
  {
    number: '02',
    title: 'Analytics & Data',
    description: 'Analytics and data visualization tools can help extract insights from large sets of data quickly and make data-driven decisions.',
    icon: BarChart3,
    color: 'from-cyan-500 to-blue-500',
    bgGradient: 'from-cyan-50 to-blue-50'
  },
  {
    number: '03',
    title: 'Chatbots & Assistants',
    description: 'Chatbots and virtual assistants can help provide customer support and automate customer interactions efficiently.',
    icon: MessageSquare,
    color: 'from-orange-500 to-amber-500',
    bgGradient: 'from-orange-50 to-amber-50'
  },
  {
    number: '04',
    title: 'Fraud Protection',
    description: 'AI-powered fraud detection systems analyze patterns in real-time to identify suspicious activities and protect your business.',
    icon: ShieldCheck,
    color: 'from-emerald-500 to-teal-500',
    bgGradient: 'from-emerald-50 to-teal-50'
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
        <motion.div 
          className="absolute inset-0 flex items-center justify-center z-0"
          style={{ opacity: textOpacity, scale: textScale }}
        >
          <div className="text-center px-4">
            <span className="inline-block px-4 py-2 rounded-full border border-gray-400 text-sm text-gray-600 mb-8">
              BENEFITS OF AI TOOLS
            </span>
            
            <h2 className="text-7xl md:text-9xl lg:text-[10rem] font-bold text-gray-900 leading-none tracking-tight">
              BENEFITS
            </h2>
            <div className="flex items-center justify-center gap-4 mt-4">
              <span className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900">OF</span>
              <span className="text-5xl md:text-7xl lg:text-8xl font-mono font-bold text-gray-900 border-4 border-gray-900 px-6 py-2 rounded-3xl">
                AI
              </span>
              <span className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900">TOOLS</span>
            </div>
            
            <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto mt-8">
              AI tools are useful for various tasks in marketing, design, programming, 
              and customer service. Here are some examples.
            </p>
          </div>
        </motion.div>

        {/* Cards - scroll horizontally from right over the text */}
        <div className="absolute inset-0 flex items-center z-10">
          <motion.div 
            className="flex gap-6 px-8"
            style={{ x: cardsX }}
          >
          {functions.map((func, index) => {
            const Icon = func.icon;
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
                  <div className={`relative h-56 bg-gradient-to-br ${func.bgGradient} overflow-hidden`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${func.color} flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-14 h-14 text-white" />
                      </div>
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/40" />
                    <div className="absolute bottom-6 left-6 w-16 h-16 rounded-full bg-white/30" />
                    <div className="absolute top-1/2 right-12 w-8 h-8 rounded-full bg-white/50" />
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl font-bold text-gray-400">{func.number}</span>
                      <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-3">
                      {func.title}
                    </h4>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                      {func.description}
                    </p>
                    <button className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors group/btn">
                      Learn more 
                      <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                    </button>
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
