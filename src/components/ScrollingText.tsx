'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const textLines = [
  { left: 'AI TOOLS', right: 'ARE TRANSFORMING', start: 0 },
  { center: 'THE DIGITAL LANDSCAPE', start: 0.15 },
  { left: '&', right: 'DIGITAL SPECIALISTS', start: 0.30 },
  { center: 'WHO EMBRACE', right: 'THEM', start: 0.45 },
  { left: 'CAN ACHIEVE', right: 'SIGNIFICANT', start: 0.60 },
  { left: 'COMPETITIVE', right: 'ADVANTAGES', start: 0.75 },
];

function AnimatedText({ text, progress, start }: { text: string; progress: any; start: number }) {
  const chars = text.split('');
  const groupSize = 3; // Show 3 characters at a time

  return (
    <span className="flex">
      {chars.map((char, i) => {
        const groupIndex = Math.floor(i / groupSize);
        const charStart = Math.min(start + (groupIndex * 0.02), 0.90);
        const charEnd = Math.min(charStart + 0.03, 0.95);

        const opacity = useTransform(
          progress,
          [charStart, charEnd],
          [0, 1]
        );

        const y = useTransform(
          progress,
          [charStart, charEnd],
          [20, 0]
        );

        return (
          <motion.span
            key={i}
            style={{ opacity, y }}
            className="inline-block text-4xl md:text-6xl lg:text-7xl font-semibold text-gray-900 tracking-tight"
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        );
      })}
    </span>
  );
}

export function ScrollingText() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={containerRef} className="relative bg-white" style={{ height: '300vh' }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4">
          {textLines.map((line, index) => (
            <div key={index} className="flex items-center justify-between py-1 md:py-2">
              {line.left && (
                <AnimatedText text={line.left} progress={scrollYProgress} start={line.start} />
              )}
              {line.center && (
                <div className="mx-auto">
                  <AnimatedText text={line.center} progress={scrollYProgress} start={line.start} />
                </div>
              )}
              {line.right && (
                <AnimatedText text={line.right} progress={scrollYProgress} start={line.start + 0.3} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
