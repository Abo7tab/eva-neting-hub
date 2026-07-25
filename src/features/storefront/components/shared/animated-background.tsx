'use client';

import { useState, useEffect } from 'react';
import { useStorefrontContext } from '../providers/storefront-provider';

export const AnimatedBackground = () => {
  const { themeConfig } = useStorefrontContext();

  const count = themeConfig?.background?.animation_blobs_count ?? 4;
  const blur = themeConfig?.background?.animation_blur ?? 80;
  const opacity = (themeConfig?.background?.animation_opacity ?? 30) / 100;
  const speed = themeConfig?.background?.animation_speed ?? 50;
  const duration = 30 - (speed / 100) * 25;

  const [blobs, setBlobs] = useState<any[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: count }).map((_, i) => ({
      id: i,
      color: i % 2 === 0 ? 'var(--eva-bg-1, var(--primary))' : 'var(--eva-bg-2, var(--secondary))',
      left: `${10 + (i * 25) % 70}%`,
      top: `${10 + (i * 30) % 60}%`,
      animationName: `blob-${i % 4}`,
      animationDuration: `${duration + (i * 2)}s`,
      animationDelay: `-${i * 4}s`,
    }));
    setBlobs(generated);
  }, [count, duration]);

  return (
    <>
      <style>{`
        @keyframes blob-0 {
          0%,100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.15); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
        }
        @keyframes blob-1 {
          0%,100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(-50px, 40px) scale(1.1); }
          66% { transform: translate(30px, -30px) scale(0.95); }
        }
        @keyframes blob-2 {
          0%,100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(50px, 50px) scale(1.2); }
          66% { transform: translate(-50px, -40px) scale(0.85); }
        }
        @keyframes blob-3 {
          0%,100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(-40px, -50px) scale(0.9); }
          66% { transform: translate(60px, 40px) scale(1.1); }
        }
      `}</style>

      {/* Fixed background: always white base + blobs on top */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0, backgroundColor: '#ffffff' }}
      >
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ filter: `blur(${blur}px)` }}
        >
          {blobs.map((blob) => (
            <div
              key={blob.id}
              className="absolute rounded-full"
              style={{
                width: '45vw',
                height: '45vw',
                minWidth: '320px',
                minHeight: '320px',
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
        {/* White overlay for readability */}
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(255,255,255,0.65)' }} />
      </div>
    </>
  );
};
