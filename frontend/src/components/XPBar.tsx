import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

interface XPBarProps {
  currentXP: number;
  xpToNextLevel: number;
  level: number;
}

export const XPBar = ({ currentXP, xpToNextLevel, level }: XPBarProps) => {
  const progress = (currentXP / xpToNextLevel) * 100;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success text-success-foreground font-bold">
            {level}
          </div>
          <span className="text-sm font-semibold text-foreground">Nível {level}</span>
        </div>
        <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
          <Trophy className="w-4 h-4 text-success" />
          <span>{currentXP} / {xpToNextLevel} XP</span>
        </div>
      </div>

      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full gradient-success rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
      </div>
    </div>
  );
};
