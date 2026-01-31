import { motion } from 'motion/react';
import { useEffect } from 'react';

interface FocusModeProps {
  isActive: boolean;
}

export function FocusMode({ isActive }: FocusModeProps) {
  useEffect(() => {
    if (isActive) {
      // Add blur to the webpage body
      document.body.style.filter = 'blur(3px)';
      document.body.style.transition = 'filter 0.3s ease-in-out';
    } else {
      // Remove blur when focus mode is disabled
      document.body.style.filter = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.filter = '';
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <>
      {/* Vignette Overlay */}
      <div className="fixed inset-0 pointer-events-none z-40">
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-pink-900/20" />
      </div>

      {/* Floating Bubbles */}
      <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full backdrop-blur-sm ${
              i % 2 === 0 ? 'bg-pink-200/20' : 'bg-orange-200/20'
            }`}
            style={{
              width: Math.random() * 80 + 40,
              height: Math.random() * 80 + 40,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Subtle Glow Around Content */}
      <div className="fixed inset-0 pointer-events-none z-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5">
          <motion.div
            className="w-full h-full rounded-3xl"
            style={{
              background:
                'radial-gradient(circle, rgba(244, 114, 182, 0.08) 0%, rgba(251, 146, 60, 0.06) 50%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </div>
    </>
  );
}