"use client";

export const AnimatedBackground = () => {
  return (
    <>
      <style>{`
        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .premium-animated-bg {
          background: linear-gradient(
            -45deg, 
            rgba(255, 255, 255, 1) 0%, 
            var(--primary) 30%, 
            rgba(255, 255, 255, 1) 60%, 
            var(--secondary) 100%
          );
          background-size: 400% 400%;
          animation: gradientMove 20s ease-in-out infinite;
          opacity: 0.15; /* Keep it subtle and elegant */
        }
      `}</style>

      <div
        className="fixed inset-0 pointer-events-none z-0 bg-white"
      >
        <div className="absolute inset-0 premium-animated-bg w-full h-full" />
      </div>
    </>
  );
};
