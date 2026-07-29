'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="relative flex flex-col items-center justify-center">
        {/* Animated Rings */}
        <div className="relative w-24 h-24">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border-4 border-transparent border-b-secondary border-l-secondary"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{ borderColor: 'var(--eva-secondary, #FB923C) transparent transparent transparent' }}
          />
          <motion.div
            className="absolute inset-4 rounded-full border-4 border-transparent border-t-primary/50"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          {/* Center Dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-4 h-4 rounded-full bg-primary"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
        
        {/* Loading Text */}
        <motion.p
          className="mt-6 text-lg font-bold text-primary tracking-widest"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          جاري التحميل...
        </motion.p>
      </div>
    </div>
  );
}
