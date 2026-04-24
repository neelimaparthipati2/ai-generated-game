import React from 'react';
import { motion } from 'motion/react';

export const Equalizer: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const bars = Array.from({ length: 20 }, (_, i) => i);
  
  return (
    <div className="flex items-end gap-1.5 h-12">
      {bars.map((bar) => (
        <motion.div
          key={bar}
          animate={{
            height: isPlaying ? [
              Math.random() * 48,
              Math.random() * 48,
              Math.random() * 48,
              Math.random() * 48,
            ].map(h => Math.max(8, h)) : 8
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: bar * 0.05
          }}
          className={`w-2 rounded-t-sm transition-colors ${
            isPlaying ? 'bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.4)]' : 'bg-slate-800'
          }`}
          style={{ opacity: 0.2 + (bar / 20) * 0.8 }}
        />
      ))}
    </div>
  );
};
