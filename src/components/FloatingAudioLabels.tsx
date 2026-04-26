'use client';

import { motion } from 'framer-motion';

const labels = [
  { 
    title: 'Healthcare', 
    phone: '(270) 555-03**', 
    status: 'Assigned To Specialist', 
    top: '15%', 
    left: '8%',
    delay: 0 
  },
  { 
    title: 'Education', 
    phone: '(480) 555-01**', 
    status: 'Curriculum & Fee Explained', 
    top: '20%', 
    right: '8%',
    delay: 1.5
  },
  { 
    title: 'Florist', 
    phone: '(239) 555-01**', 
    status: 'Bouquet Selection', 
    bottom: '35%', 
    left: '12%',
    delay: 0.8
  },
  { 
    title: 'Car Dealership', 
    phone: '(774) 317-01**', 
    status: 'Service Appointment Offered', 
    bottom: '40%', 
    right: '12%',
    delay: 2.2
  },
];

export const FloatingAudioLabels = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {labels.map((label, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ 
            opacity: [0.7, 1, 0.7], 
            y: [0, -20, 0],
            scale: [1, 1.02, 1]
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: label.delay
          }}
          className="absolute bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-white/50 min-w-[280px]"
          style={{
            top: label.top,
            left: label.left,
            right: label.right,
            bottom: label.bottom,
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <span className="font-extrabold text-gray-900 tracking-tight">{label.title}</span>
            <span className="text-[10px] font-medium text-gray-400 bg-gray-100/50 px-2 py-0.5 rounded-full">{label.phone}</span>
          </div>
          
          <div className="flex items-center gap-3 bg-white/50 border border-gray-100 p-2.5 rounded-xl">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
            </div>
            <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">{label.status}</span>
          </div>
          
          {/* Subtle Progress Bar like in the image */}
          <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              animate={{ width: ['20%', '80%', '20%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="h-full bg-green-500"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};
