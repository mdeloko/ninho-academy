import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Target, Clock, TrendingUp, Award as AwardIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Mascot } from '@/components/Mascot';
import { mockModules, mockAchievements } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const completedModules = mockModules.filter((m) => m.isCompleted).length;
  const totalModules = mockModules.length;
  const completionRate = Math.round((completedModules / totalModules) * 100);
  
  const theoryModules = mockModules.filter((m) => m.type === 'theory' && m.isCompleted).length;
  const practiceModules = mockModules.filter((m) => m.type === 'practice' && m.isCompleted).length;
  
  const unlockedAchievements = mockAchievements.filter((a) => a.isUnlocked).length;
  const totalAchievements = mockAchievements.length;

  const stats = [
    {
      icon: Target,
      label: 'Módulos Concluídos',
      value: `${completedModules}/${totalModules}`,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Trophy,
      label: 'XP Total',
      value: user?.xp || 0,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      icon: TrendingUp,
      label: 'Nível Atual',
      value: Math.floor((user?.xp || 0) / 100) + 1,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      icon: AwardIcon,
      label: 'Conquistas',
      value: `${unlockedAchievements}/${totalAchievements}`,
      color: 'text-special',
      bgColor: 'bg-special/10',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" onClick={() => navigate('/trilha')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Trilha
          </Button>
          
          <div className="flex items-center gap-4">
            <Mascot size="md" animated={false} />
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">{user?.nome}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center mb-4`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Progresso Geral */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Progresso Geral
              </h2>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Conclusão Total</span>
                    <span className="text-sm font-bold text-primary">{completionRate}%</span>
                  </div>
                  <Progress value={completionRate} className="h-3" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Módulos Teóricos</span>
                    <span className="text-sm font-bold">{theoryModules}/3</span>
                  </div>
                  <Progress value={(theoryModules / 3) * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Módulos Práticos</span>
                    <span className="text-sm font-bold">{practiceModules}/3</span>
                  </div>
                  <Progress value={(practiceModules / 3) * 100} className="h-2" />
                </div>

                <div className="pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {500 - (user?.xp || 0) % 100} XP
                    </div>
                    <div className="text-sm text-muted-foreground">
                      para o próximo nível
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Conquistas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <AwardIcon className="w-5 h-5 text-success" />
                Conquistas
              </h2>

              <div className="space-y-3">
                {mockAchievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-xl border-2 ${
                      achievement.isUnlocked
                        ? 'border-success bg-success/5'
                        : 'border-border bg-muted/30 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          achievement.isUnlocked ? 'bg-success text-success-foreground' : 'bg-muted'
                        }`}
                      >
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-sm mb-1">{achievement.title}</div>
                        <div className="text-xs text-muted-foreground mb-1">
                          {achievement.description}
                        </div>
                        {achievement.dateEarned && (
                          <div className="text-xs text-success font-medium">
                            Conquistado em {new Date(achievement.dateEarned).toLocaleDateString('pt-BR')}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Histórico Recente */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-secondary" />
              Atividade Recente
            </h2>

            <div className="space-y-3">
              {mockModules
                .filter((m) => m.isCompleted)
                .map((module) => (
                  <div
                    key={module.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                        ✓
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{module.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {module.type === 'theory' ? 'Módulo Teórico' : 'Módulo Prático'}
                        </div>
                      </div>
                    </div>
                    <div className="text-success font-bold">+{module.xpReward} XP</div>
                  </div>
                ))}
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

const xpToNextLevel = mockUser.xpToNextLevel;

export default Dashboard;
