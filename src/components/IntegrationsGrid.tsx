'use client';

import React from 'react';
import { motion } from 'framer-motion';

const integrations = [
  // Row 1 (6 icons)
  { name: 'WhatsApp', icon: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg' },
  { name: 'YouTube', icon: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg' },
  { name: 'Instagram', icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg' },
  { name: 'Spotify', icon: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg' },
  { name: 'Netflix', icon: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
  { name: 'Amazon', icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
  // Row 2 (6 icons) - Facebook removed, added Slack, Apple, X
  { name: 'Slack', icon: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg' },
  { name: 'X', icon: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg' },
  { name: 'Telegram', icon: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg' },
  { name: 'LinkedIn', icon: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png' },
  { name: 'Apple', icon: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
  { name: 'Messenger', icon: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Facebook_Messenger_logo_2020.svg' },
  // Row 3 (6 icons)
  { name: 'Snapchat', icon: 'https://www.vectorlogo.zone/logos/snapchat/snapchat-tile.svg' },
  { name: 'Discord', icon: 'https://cdn.simpleicons.org/discord/5865F2' },
  { name: 'Reddit', icon: 'https://www.vectorlogo.zone/logos/reddit/reddit-tile.svg' },
  { name: 'Pinterest', icon: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png' },
  { name: 'TikTok', icon: 'https://www.vectorlogo.zone/logos/tiktok/tiktok-icon.svg' },
  { name: 'Uber', icon: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png' },
];

const AppIcon = ({ icon, name, delay = 0 }: { icon: string; name: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className="bg-white border border-zinc-100 rounded-2xl p-4 md:p-6 flex items-center justify-center aspect-square shadow-sm hover:shadow-md transition-all group relative z-10 w-24 h-24 md:w-32 md:h-32"
  >
    <img 
      src={icon} 
      alt={name} 
      className="max-w-[75%] max-h-[75%] object-contain transition-transform duration-300 group-hover:scale-110"
      onError={(e) => {
        // Fallback for broken images
        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${name}&background=random`;
      }}
    />
  </motion.div>
);

export const IntegrationsGrid = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-white">
      {/* Grid Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-zinc-900 mb-4 tracking-tighter"
          >
            CONNECTS WITH EVERYTHING
          </motion.h2>
          <p className="text-zinc-500 font-medium italic">"Looca lives inside your computer and works with all your personal apps."</p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Row 1: 3 Left, 3 Right */}
          <div className="flex justify-center gap-4 md:gap-8">
            <div className="flex gap-4 md:gap-8">
              <AppIcon {...integrations[0]} delay={0.1} />
              <AppIcon {...integrations[1]} delay={0.2} />
              <AppIcon {...integrations[2]} delay={0.3} />
            </div>
            {/* Middle Spacer for Row 1 */}
            <div className="hidden md:block w-32 md:w-40" />
            <div className="flex gap-4 md:gap-8">
              <AppIcon {...integrations[3]} delay={0.4} />
              <AppIcon {...integrations[4]} delay={0.5} />
              <AppIcon {...integrations[5]} delay={0.6} />
            </div>
          </div>

          {/* Row 2: 3 Left, Center Logo, 3 Right */}
          <div className="flex justify-center items-center gap-4 md:gap-8">
            <div className="flex gap-4 md:gap-8">
              <AppIcon {...integrations[6]} delay={0.7} />
              <AppIcon {...integrations[7]} delay={0.8} />
              <AppIcon {...integrations[8]} delay={0.9} />
            </div>
            
            {/* Center Logo */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="w-28 h-28 md:w-44 md:h-44 bg-black rounded-[2.5rem] md:rounded-[3rem] flex items-center justify-center shadow-2xl relative z-20 shrink-0"
            >
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 bg-green-500 rounded-[2.5rem] md:rounded-[3rem] blur-2xl"
              />
              <img src="/l.png" alt="Looca" className="w-14 h-14 md:w-24 md:h-24 invert relative z-10" />
            </motion.div>

            <div className="flex gap-4 md:gap-8">
              <AppIcon {...integrations[9]} delay={1.1} />
              <AppIcon {...integrations[10]} delay={1.2} />
              <AppIcon {...integrations[11]} delay={1.3} />
            </div>
          </div>

          {/* Row 3: 3 Left, 3 Right */}
          <div className="flex justify-center gap-4 md:gap-8">
            <div className="flex gap-4 md:gap-8">
              <AppIcon {...integrations[12]} delay={1.4} />
              <AppIcon {...integrations[13]} delay={1.5} />
              <AppIcon {...integrations[14]} delay={1.6} />
            </div>
            {/* Middle Spacer for Row 3 */}
            <div className="hidden md:block w-32 md:w-40" />
            <div className="flex gap-4 md:gap-8">
              <AppIcon {...integrations[15]} delay={1.7} />
              <AppIcon {...integrations[16]} delay={1.8} />
              <AppIcon {...integrations[17]} delay={1.9} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
