'use client';

import { motion } from 'framer-motion';

export const GlowingOrb = () => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-64 h-64 bg-green-500 rounded-full blur-[80px]"
      />
      
      {/* Inner Orb */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative w-40 h-40 bg-gradient-to-br from-green-300 via-green-500 to-green-600 rounded-full shadow-[0_0_50px_rgba(34,197,94,0.5)] overflow-hidden"
      >
        {/* Animated noise/texture inside */}
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at center, transparent 30%, rgba(255,255,255,0.4) 100%)',
          }}
        />
        
        {/* Inner core pulse */}
        <motion.div
          animate={{
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-green-200 blur-xl scale-50 rounded-full"
        />
      </motion.div>
    </div>
  );
};
