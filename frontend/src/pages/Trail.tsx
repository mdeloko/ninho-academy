import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Award, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mascot } from '@/components/Mascot';
import { XPBar } from '@/components/XPBar';
import { ModuleCard } from '@/components/ModuleCard';
import { ESP32Status } from '@/components/ESP32Status';
import { mockModules } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const Trail = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const nextModule = mockModules.find((m) => !m.isCompleted && !m.isLocked);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Mascot size="sm" animated={false} />
              <div>
                <h2 className="font-bold text-lg">{user?.nome}</h2>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/dashboard')}
                title="Dashboard"
              >
                <BarChart3 className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <XPBar
              currentXP={user?.xp || 0}
              xpToNextLevel={500}
              level={Math.floor((user?.xp || 0) / 100) + 1}
            />
            {user?.temESP32 && (
              <div className="flex justify-center">
                <ESP32Status showConnectButton={true} compact={false} />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">
            Sua Trilha de Aprendizado
          </h1>
          <p className="text-muted-foreground">
            Continue progredindo para desbloquear novos módulos! 🏆
          </p>

          {nextModule && (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="mt-6"
            >
              <Button
                variant="gradient"
                size="lg"
                onClick={() => navigate(`/modulo/${nextModule.id}`)}
                className="shadow-lg"
              >
                🚀 Continuar Aprendendo
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Trail Map */}
        <div className="max-w-2xl mx-auto">
          <div className="grid gap-12">
            {mockModules.map((module, index) => (
              <ModuleCard key={module.id} module={module} index={index} />
            ))}
          </div>

          {/* Mensagem de conclusão */}
          {mockModules.every((m) => m.isCompleted) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 text-center"
            >
              <Card className="p-8 gradient-hero text-white">
                <Award className="w-16 h-16 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">
                  Parabéns! 🎉
                </h2>
                <p>
                  Você completou todos os módulos disponíveis!
                  Novos desafios em breve...
                </p>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Trail;
