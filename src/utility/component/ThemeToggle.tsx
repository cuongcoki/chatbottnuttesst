import { FC } from 'react';
import { Sun, Moon, Sparkles, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { useThemeStore } from '@/utility/stores/themeStore';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

const ThemeToggle: FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  const handleToggle = () => {
    toggleTheme();
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Switch Container */}
      <motion.button
        onClick={handleToggle}
        className="relative w-20 h-10 rounded-full cursor-pointer overflow-hidden shadow-lg"
        style={{
          background: isDark 
            ? 'linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)'
            : 'linear-gradient(135deg, #38bdf8 0%, #60a5fa 50%, #93c5fd 100%)'
        }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle theme"
      >
        {/* Dark Mode - Stars */}
        {isDark && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${15 + i * 10}%`,
                  top: `${20 + (i % 3) * 20}%`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2 + i * 0.3,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
            
            {/* Neon Sparkles */}
            <motion.div
              className="absolute"
              style={{ left: '25%', top: '25%' }}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              <Sparkles className="w-3 h-3 text-cyan-300" style={{ filter: 'drop-shadow(0 0 4px #67e8f9)' }} />
            </motion.div>
            
            <motion.div
              className="absolute"
              style={{ right: '20%', bottom: '30%' }}
              animate={{
                rotate: [360, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: 0.5,
              }}
            >
              <Sparkles className="w-2 h-2 text-purple-300" style={{ filter: 'drop-shadow(0 0 3px #d8b4fe)' }} />
            </motion.div>
          </>
        )}

        {/* Light Mode - Floating Clouds */}
        {!isDark && (
          <>
            {/* Cloud 1 */}
            <motion.div
              className="absolute"
              style={{ left: '-10%', top: '15%' }}
              animate={{
                x: [0, 90, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Cloud className="w-4 h-4 text-white/60" />
            </motion.div>

            {/* Cloud 2 */}
            <motion.div
              className="absolute"
              style={{ right: '-15%', top: '55%' }}
              animate={{
                x: [0, -100, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
                delay: 1
              }}
            >
              <Cloud className="w-3 h-3 text-white/50" />
            </motion.div>

            {/* Cloud 3 - Small */}
            <motion.div
              className="absolute"
              style={{ left: '30%', top: '10%' }}
              animate={{
                x: [0, 20, 0],
                y: [0, -5, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            >
              <Cloud className="w-2 h-2 text-white/40" />
            </motion.div>

            {/* Additional floating white dots (cloud particles) */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={`cloud-dot-${i}`}
                className="absolute w-1.5 h-1.5 bg-white/30 rounded-full"
                style={{
                  left: `${20 + i * 20}%`,
                  top: `${30 + (i % 2) * 30}%`,
                }}
                animate={{
                  x: [0, 15, 0],
                  y: [0, -8, 0],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut"
                }}
              />
            ))}
          </>
        )}

        {/* Sliding Toggle */}
        <motion.div
          className="absolute top-1 w-8 h-8 rounded-full shadow-md flex items-center justify-center"
          animate={{
            x: isDark ? 44 : 4,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 25,
          }}
          style={{
            background: isDark ? '#1e293b' : '#ffffff',
          }}
        >
          {/* Sun Icon */}
          <motion.div
            className="absolute"
            initial={false}
            animate={{
              scale: isDark ? 0 : 1,
              rotate: isDark ? -180 : 0,
              opacity: isDark ? 0 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Sun 
                className="w-5 h-5 text-yellow-400" 
                style={{ 
                  filter: 'drop-shadow(0 0 8px rgba(250, 204, 21, 0.7))' 
                }}
              />
            </motion.div>
          </motion.div>

          {/* Moon Icon with glow */}
          <motion.div
            className="absolute"
            initial={false}
            animate={{
              scale: isDark ? 1 : 0,
              rotate: isDark ? 0 : 180,
              opacity: isDark ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <Moon 
              className="w-5 h-5 text-yellow-200" 
              style={{ 
                filter: 'drop-shadow(0 0 8px rgba(254, 240, 138, 0.6))' 
              }} 
            />
          </motion.div>
        </motion.div>
      </motion.button>

      {/* Optional Label with animation */}
      {showLabel && (
        <motion.span
          key={isDark ? 'dark' : 'light'}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-semibold"
          style={{
            color: isDark ? '#e0e7ff' : '#0c4a6e',
            textShadow: isDark ? '0 0 10px rgba(129, 140, 248, 0.5)' : 'none'
          }}
        >
          {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </motion.span>
      )}
    </div>
  );
};

export default ThemeToggle;