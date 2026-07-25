"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { BorderBeam } from '@/shared/components/ui/border-beam';
import { LoginForm } from '@/features/auth/components/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Soft cream base */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50" />
      
      {/* Soft blur orbs for depth */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-100/30 rounded-full blur-3xl" />
      
      {/* Optional: subtle animated dots */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }} />
      
      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md z-10"
      >
        <Card className="relative overflow-hidden bg-white border-0 shadow-2xl shadow-rose-200/50">
          {/* Border Beam Effect */}
          <BorderBeam
            size={250}
            duration={12}
            colorFrom="#f43f5e"
            colorTo="#fbbf24"
            borderWidth={2}
          />
          
          <CardHeader className="space-y-4 text-center pb-2">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="mx-auto"
            >
              <Image
                src="/logos/main.svg"
                alt="Eva Neting Hub"
                width={80}
                height={80}
                priority
                className="mx-auto object-contain w-auto h-[40px]"
              />
            </motion.div>

            {/* Welcome text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-2xl font-bold text-slate-900">
                مرحباً بك
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                سجل دخولك للوحة تحكم إيفا نيتنج هاب
              </p>
            </motion.div>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            <LoginForm />
          </CardContent>
        </Card>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-slate-600 mt-6"
        >
          © 2026 Eva Neting Hub. جميع الحقوق محفوظة.
        </motion.p>
      </motion.div>
    </div>
  );
}
