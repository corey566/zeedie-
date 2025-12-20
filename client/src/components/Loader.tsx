import { motion } from 'framer-motion';
import { User } from 'lucide-react';

export default function Loader({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 3.5, duration: 0.5 }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-[60] bg-black flex items-center justify-center overflow-hidden"
    >
      <div className="relative flex items-center justify-center">
        {/* Animated Text */}
        <motion.div
          className="absolute text-white font-display text-4xl md:text-6xl font-bold tracking-widest whitespace-nowrap"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.span
            animate={{ 
              opacity: [1, 0],
              scale: [1, 0.5]
            }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            ZEEDIE
          </motion.span>
        </motion.div>

        {/* Circle Formation */}
        <motion.div
          className="absolute w-24 h-24 rounded-full border-2 border-white/20"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2, duration: 0.8, type: "spring" }}
        />

        {/* Profile Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.5 }}
          className="relative z-10 w-20 h-20 bg-white rounded-full flex items-center justify-center"
        >
          <User className="w-10 h-10 text-black" />
        </motion.div>
      </div>
    </motion.div>
  );
}
