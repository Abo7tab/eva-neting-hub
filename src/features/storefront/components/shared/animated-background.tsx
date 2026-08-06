"use client";

export const AnimatedBackground = () => {
  return (
    <>
      <style>{`
        @keyframes blob-float-1 {
          0%   { transform: translate(0px,    0px)    scale(1);    }
          20%  { transform: translate(60px,  -80px)   scale(1.08); }
          40%  { transform: translate(-40px, -120px)  scale(0.95); }
          60%  { transform: translate(-80px,  40px)   scale(1.05); }
          80%  { transform: translate(40px,   80px)   scale(0.98); }
          100% { transform: translate(0px,    0px)    scale(1);    }
        }
        @keyframes blob-float-2 {
          0%   { transform: translate(0px,   0px)    scale(1);    }
          25%  { transform: translate(-70px,  60px)   scale(1.1);  }
          50%  { transform: translate(50px,  100px)  scale(0.92); }
          75%  { transform: translate(80px,  -50px)  scale(1.06); }
          100% { transform: translate(0px,   0px)    scale(1);    }
        }
        @keyframes blob-float-3 {
          0%   { transform: translate(0px,  0px)    scale(1);    }
          33%  { transform: translate(-50px, -70px)  scale(1.12); }
          66%  { transform: translate(60px,   50px)  scale(0.94); }
          100% { transform: translate(0px,  0px)    scale(1);    }
        }
      `}</style>

      <div className="fixed inset-0 pointer-events-none z-0 bg-white overflow-hidden">
        {/* Blob 1 — primary color, top-left area */}
        <div
          style={{
            position: 'absolute',
            width: '55vw',
            height: '55vw',
            top: '-5%',
            left: '-10%',
            background: 'radial-gradient(circle at 40% 40%, var(--primary) 0%, transparent 68%)',
            opacity: 0.20,
            filter: 'blur(50px)',
            animation: 'blob-float-1 24s ease-in-out infinite',
          }}
        />
        {/* Blob 2 — secondary/primary color, bottom-right area */}
        <div
          style={{
            position: 'absolute',
            width: '60vw',
            height: '60vw',
            bottom: '-10%',
            right: '-15%',
            background: 'radial-gradient(circle at 60% 60%, var(--secondary, var(--primary)) 0%, transparent 68%)',
            opacity: 0.16,
            filter: 'blur(60px)',
            animation: 'blob-float-2 30s ease-in-out infinite',
            animationDelay: '-8s',
          }}
        />
        {/* Blob 3 — primary tint, center drift */}
        <div
          style={{
            position: 'absolute',
            width: '40vw',
            height: '40vw',
            top: '30%',
            left: '30%',
            background: 'radial-gradient(circle at 50% 50%, var(--primary) 0%, transparent 65%)',
            opacity: 0.08,
            filter: 'blur(70px)',
            animation: 'blob-float-3 20s ease-in-out infinite',
            animationDelay: '-14s',
          }}
        />
      </div>
    </>
  );
};
