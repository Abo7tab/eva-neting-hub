'use client';

import { useMemo } from 'react';

interface AnimatedBackgroundPreviewProps {
  color1: string;
  color2: string;
  speed: number;
  blur: number;
  opacity: number;
  blobsCount: number;
}

export function AnimatedBackgroundPreview({
  color1,
  color2,
  speed,
  blur,
  opacity,
  blobsCount
}: AnimatedBackgroundPreviewProps) {
  
  const blurPx = 20 + (blur / 100) * 100; // 20 to 120px
  const opacityVal = opacity / 100;
  const durationSecs = Math.max(2, 20 - (speed / 100) * 15); // 20s down to 5s

  // Generate blobs based on count
  const blobs = useMemo(() => {
    return Array.from({ length: blobsCount }).map((_, i) => {
      // Alternate colors
      let blobColor = 'white';
      if (i % 3 === 0) blobColor = color1;
      else if (i % 3 === 1) blobColor = color2;
      
      // Randomize starting positions and sizes a bit deterministically
      const size = 300 + (i * 50) % 200; // Increased size for visibility
      const top = (i * 25) % 70;
      const left = (i * 35) % 70;
      const delay = (i * -2.5); // Stagger animations

      return {
        id: i,
        color: blobColor,
        size,
        top: `${top}%`,
        left: `${left}%`,
        delay: `${delay}s`,
        animationName: i % 2 === 0 ? 'blob-float-1' : 'blob-float-2'
      };
    });
  }, [blobsCount, color1, color2]);

  return (
    <div className="relative w-full h-full min-h-[300px] bg-white overflow-hidden rounded-lg">
      {/* We inject the keyframes globally just for this preview, or inline if possible. 
          Standard tailwind doesn't have custom keyframes out of the box without tailwind.config.js,
          so we use a style tag for the dynamic keyframes. */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blob-float-1 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30%, -30%) scale(1.1); }
          66% { transform: translate(-20%, 20%) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes blob-float-2 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30%, 30%) scale(1.1); }
          66% { transform: translate(20%, -20%) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
      `}} />

      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          filter: `blur(${blurPx}px)`,
          opacity: opacityVal,
        }}
      >
        {blobs.map((blob) => (
          <div
            key={blob.id}
            className="absolute rounded-full opacity-60"
            style={{
              width: blob.size,
              height: blob.size,
              top: blob.top,
              left: blob.left,
              backgroundColor: blob.color,
              animationName: blob.animationName,
              animationDuration: `${durationSecs}s`,
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              animationDirection: 'alternate',
              animationDelay: blob.delay,
            }}
          />
        ))}
      </div>
      
      {/* Glass overlay just to show it's a background layer */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="bg-white/40 backdrop-blur-sm border border-white/50 px-6 py-4 rounded-xl shadow-lg">
          <p className="font-semibold text-slate-800 text-lg">معاينة الخلفية الحية</p>
        </div>
      </div>
    </div>
  );
}
