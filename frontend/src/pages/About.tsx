import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Cpu, Users, Target, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mascot } from '@/components/Mascot';
import aboutImage from '@/assets/about-learning.jpg';

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Target,
      title: 'Aprendizado Gamificado',
      description: 'Sistema de níveis, XP e medalhas que tornam o aprendizado mais motivador e divertido.',
    },
    {
      icon: Lightbulb,
      title: 'Teoria e Prática',
      description: 'Módulos teóricos com quizzes interativos e módulos práticos com montagem real de circuitos.',
    },
    {
      icon: Cpu,
      title: 'Integração com ESP32',
      description: 'Aprenda programação embarcada na prática, com projetos reais usando microcontroladores.',
    },
    {
      icon: Users,
      title: 'Projeto Educacional',
      description: 'Desenvolvido na UTFPR para democratizar o ensino de eletrônica e programação.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="gradient-hero py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-8 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <Mascot size="lg" />
            <h1 className="text-5xl font-bold mt-6 mb-4">
              Ninho de Pardais
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Uma plataforma gamificada de ensino de eletrônica, circuitos e programação com ESP32
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* O Projeto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <Card className="p-8 overflow-hidden">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/2">
                  <img
                    src={aboutImage}
                    alt="Estudantes aprendendo eletrônica"
                    className="rounded-xl shadow-lg w-full"
                  />
                </div>
                <div className="md:w-1/2">
                  <h2 className="text-3xl font-bold mb-6">Sobre o Projeto</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      O <strong className="text-foreground">Ninho de Pardais</strong> é um projeto educacional
                      desenvolvido na <strong className="text-foreground">UTFPR (Universidade Tecnológica Federal do Paraná)</strong> com
                      o objetivo de tornar o aprendizado de eletrônica e programação mais acessível e divertido.
                    </p>
                    <p>
                      Inspirado no sucesso de plataformas como o Duolingo, criamos uma experiência gamificada
                      que combina teoria e prática, permitindo que estudantes aprendam fazendo - desde conceitos
                      básicos de eletrônica até projetos avançados com microcontroladores ESP32.
                    </p>
                    <p>
                      A plataforma integra-se com um software de computador e com o próprio ESP32, possibilitando
                      verificação automática de montagens, leitura de sensores em tempo real e uma experiência
                      de aprendizado verdadeiramente hands-on.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Como Funciona</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                    <feature.icon className="w-12 h-12 text-primary mb-4" />
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16 text-center"
          >
            <Card className="p-8 gradient-hero text-white">
              <h2 className="text-2xl font-bold mb-4">
                Pronto para começar sua jornada?
              </h2>
              <p className="mb-6 opacity-90">
                Junte-se a centenas de estudantes que já estão aprendendo eletrônica de forma divertida!
              </p>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/')}
                className="shadow-lg"
              >
                Começar Agora
              </Button>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
