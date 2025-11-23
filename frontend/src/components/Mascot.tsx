import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';

interface MascotProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const Mascot = ({ size = 'md', animated = true }: MascotProps) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} relative flex items-center justify-center`}
      animate={animated ? { y: [0, -10, 0] } : {}}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Corpo do passarinho robótico */}
      <div className="relative">
        {/* Corpo principal */}
        <motion.div
          className="w-full h-full rounded-full gradient-primary shadow-glow flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          <Cpu className="w-1/2 h-1/2 text-white" strokeWidth={2.5} />
        </motion.div>

        {/* Olhos */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-white rounded-full animate-pulse" />

        {/* Asas */}
        <motion.div
          className="absolute -left-2 top-1/2 w-6 h-3 bg-secondary rounded-full"
          animate={{ rotate: [0, -20, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
        <motion.div
          className="absolute -right-2 top-1/2 w-6 h-3 bg-secondary rounded-full"
          animate={{ rotate: [0, 20, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
};
