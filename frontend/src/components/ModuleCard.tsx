import { motion } from 'framer-motion';
import { Lock, Check, Book, Lightbulb, Code, Thermometer, Zap, Cpu } from 'lucide-react';
import { Module } from '@/types';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ModuleCardProps {
  module: Module;
  index: number;
}

const iconMap: Record<string, any> = {
  Book,
  Lightbulb,
  Code,
  Thermometer,
  Zap,
  Cpu,
};

export const ModuleCard = ({ module, index }: ModuleCardProps) => {
  const navigate = useNavigate();
  const Icon = iconMap[module.icon] || Book;

  const handleClick = () => {
    if (!module.isLocked) {
      navigate(`/modulo/${module.id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={!module.isLocked ? { scale: 1.05 } : {}}
      className="relative"
    >
      <Button
        variant={module.isCompleted ? 'success' : module.isLocked ? 'outline' : 'gradient'}
        size="lg"
        onClick={handleClick}
        disabled={module.isLocked}
        className={`w-full h-32 flex-col gap-3 ${
          module.isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <div className="relative">
          <Icon className="w-10 h-10" strokeWidth={2.5} />
          {module.isCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center"
            >
              <Check className="w-4 h-4 text-success-foreground" strokeWidth={3} />
            </motion.div>
          )}
          {module.isLocked && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-muted rounded-full flex items-center justify-center">
              <Lock className="w-4 h-4 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="text-center space-y-1">
          <div className="font-bold text-sm line-clamp-2">{module.title}</div>
          <div className="text-xs opacity-90">
            {module.type === 'theory' ? '📘 Teoria' : '⚡ Prática'}
          </div>
          <div className="text-xs font-semibold opacity-80">+{module.xpReward} XP</div>
        </div>
      </Button>

      {/* Linha conectora para o próximo módulo */}
      {index < 5 && (
        <div className="absolute left-1/2 -bottom-8 w-1 h-8 bg-border -translate-x-1/2" />
      )}
    </motion.div>
  );
};
