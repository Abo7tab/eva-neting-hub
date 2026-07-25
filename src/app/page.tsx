"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/stores/auth.store';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function HomePage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [message, setMessage] = useState('جاري التحويل...');

  useEffect(() => {
    // Wait for Zustand hydration
    const timeoutId = setTimeout(() => {
      if (isAuthenticated) {
        setMessage('مرحباً بعودتك...');
        router.replace('/admin/dashboard');
      } else {
        router.replace('/admin/login');
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <Image
          src="/logos/main.svg"
          alt="Eva Neting Hub"
          width={100}
          height={100}
          priority
          className="w-auto h-[40px] object-contain"
        />
        <p className="text-slate-500 text-sm">{message}</p>
      </motion.div>
    </div>
  );
}
