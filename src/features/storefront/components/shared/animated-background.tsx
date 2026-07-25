'use client';

import { useState, useEffect } from 'react';
import { useStorefrontContext } from '../providers/storefront-provider';

export const AnimatedBackground = () => {
  const { themeConfig } = useStorefrontContext();

  // Settings from theme (with defaults)
  const count = themeConfig?.background?.animation_blobs_count ?? 4;
  const blur = themeConfig?.background?.animation_blur ?? 80;
  const opacity = (themeConfig?.background?.animation_opacity ?? 40) / 100;
  const speed = themeConfig?.background?.animation_speed ?? 50;
  
  // Calculate duration (higher speed = lower duration)
  // Maps 0-100 speed to 30s-5s duration
  const duration = 30 - (speed / 100) * 25;

  const [blobs, setBlobs] = useState<any[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: count }).map((_, i) => ({
      id: i,
      color: i % 2 === 0 ? 'var(--eva-bg-1, #F97316)' : 'var(--eva-bg-2, #FB923C)',
      left: `${Math.random() * 80}%`,
      top: `${Math.random() * 80}%`,
      animationName: `blob-${i % 4}`,
      animationDuration: `${duration + (i * 2)}s`,
      animationDelay: `-${i * 3}s`,
    }));
    setBlobs(generated);
  }, [count, duration]);

  return (
    <>
      <style>{`
        @keyframes blob-0 {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes blob-1 {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(-30px, 30px) scale(1.1); }
          66% { transform: translate(20px, -20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes blob-2 {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, 40px) scale(1.15); }
          66% { transform: translate(-40px, -40px) scale(0.85); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes blob-3 {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(-40px, -40px) scale(0.85); }
          66% { transform: translate(40px, 40px) scale(1.15); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
      `}</style>
      
      <div 
        className="fixed inset-0 pointer-events-none" 
        style={{ zIndex: -1, backgroundColor: 'var(--eva-accent, #FFF7ED)' }}
      >
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ filter: `blur(${blur}px)` }}
        >
          {blobs.map((blob) => (
            <div
              key={blob.id}
              className="absolute rounded-full w-[40vw] h-[40vw] min-w-[300px] min-h-[300px]"
              style={{
                backgroundColor: blob.color,
                left: blob.left,
                top: blob.top,
                opacity: opacity,
                animation: `${blob.animationName} ${blob.animationDuration} infinite ease-in-out`,
                animationDelay: blob.animationDelay,
              }}
            />
          ))}
        </div>
        
        {/* Overlay for content readability */}
        <div className="absolute inset-0 bg-white/70" />
      </div>
    </>
  );
};
