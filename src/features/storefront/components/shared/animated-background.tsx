"use client";

export const AnimatedBackground = () => {
  return (
    <>
      <style>{`
        @keyframes driftLeft {
          0%, 100% { transform: translateX(0%) scale(1); }
          50% { transform: translateX(-15%) scale(1.08); }
        }
        @keyframes driftRight {
          0%, 100% { transform: translateX(0%) scale(1); }
          50% { transform: translateX(15%) scale(1.08); }
        }
        .bg-blob-left {
          animation: driftLeft 18s ease-in-out infinite;
        }
        .bg-blob-right {
          animation: driftRight 22s ease-in-out infinite;
        }
      `}</style>

      <div className="fixed inset-0 pointer-events-none z-0 bg-white overflow-hidden">
        {/* Left blob - primary color */}
        <div
          className="bg-blob-left absolute rounded-full"
          style={{
            width: '70vw',
            height: '70vw',
            top: '-10%',
            left: '-25%',
            background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
            opacity: 0.12,
            filter: 'blur(40px)',
          }}
        />
        {/* Right blob - secondary color */}
        <div
          className="bg-blob-right absolute rounded-full"
          style={{
            width: '70vw',
            height: '70vw',
            bottom: '-10%',
            right: '-25%',
            background: 'radial-gradient(circle, var(--secondary, var(--primary)) 0%, transparent 70%)',
            opacity: 0.10,
            filter: 'blur(50px)',
          }}
        />
      </div>
    </>
  );
};
