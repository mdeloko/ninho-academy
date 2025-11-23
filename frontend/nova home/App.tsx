import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Zap, 
  Code, 
  Settings, 
  Activity, 
  Layout, 
  CheckCircle, 
  Play, 
  BookOpen,
  Users,
  Award,
  ChevronDown,
  ChevronUp,
  Bird,
  Menu,
  X,
  HelpCircle,
  Smartphone
} from 'lucide-react';

import { Button } from './components/Button';
import { Section } from './components/Section';
import { Card } from './components/Card';
import { FAQItem, RoadmapStep } from './types';

// Mock Data
const FEATURES = [
  { icon: Zap, title: 'Circuitos e GPIO', description: 'Aprenda a montar e controlar seus primeiros circuitos com LEDs e botões.' },
  { icon: Code, title: 'Algoritmos e Lógica', description: 'Desenvolva o pensamento computacional criando projetos reais.' },
  { icon: Activity, title: 'Sensores Diversos', description: 'Conecte o mundo real ao digital com sensores de temperatura, luz e mais.' },
  { icon: Settings, title: 'PWM e Controle', description: 'Domine o controle de potência para motores e brilho de LEDs.' },
  { icon: Layout, title: 'Máquina de Estados', description: 'Conceitos avançados de engenharia simplificados para crianças.' },
  { icon: Smartphone, title: 'IoT e WiFi', description: 'Conecte seus projetos à internet e controle tudo pelo celular.' },
];

const ROADMAP: RoadmapStep[] = [
  { id: 1, title: 'Login & Perfil', isCompleted: true, isCurrent: false },
  { id: 2, title: 'Escolha seu Módulo', isCompleted: true, isCurrent: false },
  { id: 3, title: 'Vídeo Aulas e Quizzes', isCompleted: false, isCurrent: true },
  { id: 4, title: 'Conecte seu ESP32', isCompleted: false, isCurrent: false },
  { id: 5, title: 'Monte o Circuito', isCompleted: false, isCurrent: false },
  { id: 6, title: 'Ganhe Pontos', isCompleted: false, isCurrent: false },
];

const FAQS: FAQItem[] = [
  { question: 'Preciso de um kit físico?', answer: 'Sim! Embora tenhamos um simulador básico, a experiência completa requer um ESP32, uma protoboard e alguns componentes básicos.' },
  { question: 'Para qual idade é recomendado?', answer: 'Nossa metodologia é otimizada para jovens a partir de 10 anos, mas adultos iniciantes também adoram!' },
  { question: 'Funciona em qualquer navegador?', answer: 'Sim! Nossa plataforma roda diretamente no Chrome, Edge ou Firefox, sem necessidade de instalar nada no PC.' },
  { question: 'É gratuito?', answer: 'Temos uma trilha gratuita de introdução. O curso completo e o certificado exigem uma assinatura premium.' },
];

const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-yellow border-b-2 border-brand-brown/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 text-brand-brown cursor-pointer">
            <div className="bg-brand-brown text-brand-yellow p-2 rounded-lg">
                <Bird size={24} strokeWidth={3} />
            </div>
            <span className="font-extrabold text-xl tracking-tight">Ninho de Pardais</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 font-bold text-brand-brown">
            <a href="#sobre" className="hover:text-white transition-colors">Sobre</a>
            <a href="#trilhas" className="hover:text-white transition-colors">Trilhas</a>
            <a href="#educadores" className="hover:text-white transition-colors">Educadores</a>
            <Button variant="secondary" size="sm">Entrar</Button>
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-brand-brown">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-brand-yellow border-t border-brand-brown/10 overflow-hidden"
            >
              <div className="flex flex-col p-4 gap-4 font-bold text-brand-brown">
                <a href="#sobre" onClick={() => setMobileMenuOpen(false)}>Sobre</a>
                <a href="#trilhas" onClick={() => setMobileMenuOpen(false)}>Trilhas</a>
                <a href="#educadores" onClick={() => setMobileMenuOpen(false)}>Educadores</a>
                <Button variant="secondary" className="w-full">Entrar</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <div className="pt-24 pb-12 px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto bg-brand-yellow rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden shadow-3d border-b-8 border-brand-brown/20"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-6">
              <motion.div 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-1 bg-white/30 backdrop-blur-sm rounded-full text-brand-brown font-bold text-sm uppercase tracking-wider mb-2"
              >
                Aprenda Brincando
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-black text-brand-brown leading-[1.1]">
                Domine a Eletrônica com ESP32. <br />
                <span className="text-white drop-shadow-md">Brincando!</span>
              </h1>
              <p className="text-lg md:text-xl font-bold text-brand-brown/80 max-w-md">
                Aprenda sinais, programação e IoT de forma divertida e autônoma. Projetos na prática para jovens exploradores.
              </p>
              <div className="pt-4">
                <Button size="lg" className="w-full md:w-auto shadow-xl">
                  Começar Agora
                </Button>
              </div>
            </div>

            {/* Hero Image / Illustration */}
            <div className="relative flex justify-center">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="relative z-10"
              >
                 {/* Abstract Mascot Representation using Divs and Icons */}
                 <div className="w-64 h-64 md:w-80 md:h-80 bg-brand-brown rounded-full flex items-center justify-center relative border-8 border-white shadow-2xl">
                    <Bird size={120} className="text-brand-yellow" strokeWidth={1.5} />
                    <div className="absolute -right-4 top-10 bg-white p-4 rounded-2xl shadow-lg rotate-12">
                        <Code size={32} className="text-brand-accent" />
                    </div>
                    <div className="absolute -left-4 bottom-10 bg-white p-4 rounded-2xl shadow-lg -rotate-12">
                        <Cpu size={32} className="text-brand-accent" />
                    </div>
                 </div>
              </motion.div>
              
              {/* Background decorative circles */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/20 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* What is this platform? */}
      <Section id="sobre">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-brand-brown mb-4">O que é essa plataforma?</h2>
          <div className="h-2 w-24 bg-brand-yellow rounded-full mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card 
            title="Eletrônica Básica" 
            description="Aprenda do simples ao avançado: circuitos, resistores e corrente. Projetos de 0 a 100% para jovens makers."
            icon={Zap}
            color="bg-blue-50"
          />
          <Card 
            title="Programe o ESP32" 
            description="Escreva códigos reais em C++ e MicroPython. Controle o hardware com suas próprias linhas de comando."
            icon={Code}
            color="bg-green-50"
          />
          <Card 
            title="Organizado em Trilhas" 
            description="O aprendizado é gamificado em fases, níveis e conquistas. Evolua seu personagem e ganhe recompensas."
            icon={Award}
            color="bg-purple-50"
          />
        </div>
      </Section>

      {/* How it works (Process) */}
      <Section className="bg-white rounded-[3rem] my-12 border-b-8 border-gray-100">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-brand-brown">Como funciona na prática</h2>
        </div>

        <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-2 bg-gray-100 -translate-y-1/2 z-0 rounded-full"></div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 relative z-10">
                {ROADMAP.map((step, index) => (
                    <motion.div 
                        key={step.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col items-center text-center group"
                    >
                        <div className={`
                            w-20 h-20 rounded-2xl flex items-center justify-center mb-4 border-b-4 transition-all
                            ${step.isCurrent 
                                ? 'bg-brand-yellow border-brand-brown/20 shadow-lg scale-110' 
                                : 'bg-white border-gray-200 shadow-sm group-hover:border-brand-yellow'}
                        `}>
                            {index === 0 && <Users size={32} className={step.isCurrent ? "text-brand-brown" : "text-gray-400"} />}
                            {index === 1 && <Layout size={32} className={step.isCurrent ? "text-brand-brown" : "text-gray-400"} />}
                            {index === 2 && <Play size={32} className={step.isCurrent ? "text-brand-brown" : "text-gray-400"} />}
                            {index === 3 && <Cpu size={32} className={step.isCurrent ? "text-brand-brown" : "text-gray-400"} />}
                            {index === 4 && <Zap size={32} className={step.isCurrent ? "text-brand-brown" : "text-gray-400"} />}
                        </div>
                        <h4 className="font-extrabold text-brand-brown text-sm md:text-base">{step.title}</h4>
                    </motion.div>
                ))}
            </div>
        </div>
      </Section>

      {/* Curriculum Grid */}
      <Section id="trilhas">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-brand-brown">O que dá para aprender</h2>
            <p className="text-brand-brown/60 font-bold mt-2">Dezenas de projetos práticos esperando por você</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {FEATURES.map((feature, idx) => (
                <motion.div 
                    key={idx}
                    whileHover={{ scale: 1.03 }}
                    className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border-b-4 border-gray-200 hover:border-brand-yellow transition-colors"
                >
                    <div className="mb-4 p-3 bg-orange-100 rounded-xl text-orange-600">
                        <feature.icon size={28} />
                    </div>
                    <h3 className="font-extrabold text-brand-brown mb-2">{feature.title}</h3>
                    <p className="text-sm font-semibold text-gray-500">{feature.description}</p>
                </motion.div>
            ))}
        </div>
      </Section>

      {/* Feedback/Error Handling Showcase */}
      <Section className="bg-brand-light">
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
                <h2 className="text-3xl md:text-4xl font-black text-brand-brown mb-6">Aprenda com erros.<br/>Feedback instantâneo.</h2>
                <p className="text-lg font-bold text-gray-600 mb-8 leading-relaxed">
                    Nossa plataforma detecta quando seu circuito virtual não vai funcionar ou quando seu código tem bugs. Receba dicas personalizadas em tempo real para corrigir e aprender.
                </p>
                <div className="bg-white p-6 rounded-2xl shadow-lg border-l-8 border-red-400 inline-block max-w-sm transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                    <div className="flex items-start gap-4">
                        <div className="bg-red-100 p-2 rounded-full text-red-500">
                            <Settings size={24} />
                        </div>
                        <div>
                            <h4 className="font-black text-brand-brown">Erro na linha 12</h4>
                            <p className="text-sm text-gray-500 font-semibold mt-1">Parece que você esqueceu o ponto e vírgula (;). O C++ é rigoroso com isso!</p>
                            <Button size="sm" className="mt-4 bg-red-500 text-white border-red-700">Corrigir</Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative flex justify-center">
                 {/* Simulated Browser Window */}
                 <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    className="w-full max-w-md bg-brand-brown rounded-t-xl rounded-b-3xl overflow-hidden shadow-2xl border-4 border-brand-brown"
                 >
                    <div className="bg-brand-brown p-3 flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="bg-gray-100 p-8 h-80 flex flex-col items-center justify-center text-center">
                         <div className="bg-red-100 p-6 rounded-full mb-4 animate-bounce">
                            <HelpCircle size={48} className="text-red-500" />
                         </div>
                         <h3 className="font-black text-xl text-brand-brown mb-2">Ops! Algo deu errado.</h3>
                         <p className="text-gray-500 font-bold">Seu LED está conectado na porta errada. Tente a GPIO 2.</p>
                         <Button className="mt-6 bg-brand-yellow text-brand-brown border-brand-brown/20">Tentar Novamente</Button>
                    </div>
                 </motion.div>
            </div>
        </div>
      </Section>

      {/* Gamification Path Visual */}
      <Section>
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-brand-brown mb-4">Gamificação e Progresso</h2>
            <div className="inline-block bg-brand-yellow px-6 py-2 rounded-full text-brand-brown font-black border-b-4 border-brand-brown/10">
                Jornada de Aprendizado
            </div>
        </div>
        
        <div className="relative max-w-3xl mx-auto h-96">
            {/* Winding Path SVG */}
            <svg className="absolute top-0 left-0 w-full h-full z-0" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50,200 Q200,50 400,200 T750,200" stroke="#E5E7EB" strokeWidth="12" strokeDasharray="20 20" strokeLinecap="round" />
                <motion.path 
                    d="M50,200 Q200,50 400,200 T750,200" 
                    stroke="#FACC15" 
                    strokeWidth="12" 
                    strokeDasharray="20 20" 
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 0.6 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                />
            </svg>

            {/* Nodes */}
            <div className="absolute top-1/2 left-[6%] -translate-y-1/2 -translate-x-1/2">
                <div className="bg-brand-yellow p-4 rounded-full border-4 border-white shadow-lg z-10 relative">
                    <Award size={32} className="text-brand-brown" />
                </div>
            </div>
            <div className="absolute top-[25%] left-[50%] -translate-y-1/2 -translate-x-1/2">
                 <div className="bg-white p-4 rounded-full border-4 border-gray-200 z-10 relative">
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                </div>
            </div>
            <div className="absolute top-1/2 right-[6%] -translate-y-1/2 translate-x-1/2">
                 <div className="bg-brand-brown p-4 rounded-full border-4 border-white shadow-lg z-10 relative">
                    <TrophyIcon />
                </div>
            </div>

            {/* Floating Points Bubble */}
            <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-[15%] right-[15%] bg-white px-4 py-2 rounded-xl shadow-lg border-2 border-brand-brown flex items-center gap-2 z-20"
            >
                <span className="font-black text-brand-brown">Points</span>
                <div className="w-4 h-4 rounded-full bg-brand-yellow"></div>
            </motion.div>
        </div>
      </Section>

      {/* Target Audience */}
      <Section className="bg-white rounded-3xl border-t-8 border-gray-100">
        <div className="grid md:grid-cols-2 gap-12">
            <div className="order-2 md:order-1">
                 <img 
                    src="https://picsum.photos/seed/kidscoding/600/400" 
                    alt="Crianças aprendendo" 
                    className="rounded-2xl shadow-card border-4 border-white transform -rotate-2 hover:rotate-0 transition-all duration-500"
                 />
            </div>
            <div className="order-1 md:order-2 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-black text-brand-brown mb-6">Para quem é?</h2>
                <ul className="space-y-4">
                    {[
                        'Iniciantes absolutos em eletrônica',
                        'Projetos de Robótica Escolar',
                        'Curiosos e Makers de fim de semana'
                    ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 font-bold text-lg text-gray-700">
                            <div className="w-2 h-2 bg-brand-yellow rounded-full"></div>
                            {item}
                        </li>
                    ))}
                </ul>

                <div className="mt-8">
                    <h3 className="font-extrabold text-xl text-brand-brown mb-4">Origem do Projeto</h3>
                    <div className="flex gap-4 items-center opacity-70 grayscale hover:grayscale-0 transition-all">
                         <div className="font-black text-2xl tracking-widest text-gray-800">UTFPR</div>
                         <div className="h-8 w-px bg-gray-300"></div>
                         <div className="text-xs font-bold leading-tight text-gray-500">Certificadora de<br/>Competências Digitais</div>
                    </div>
                </div>
            </div>
        </div>
      </Section>

      {/* Educators Section */}
      <Section id="educadores" className="bg-brand-yellow/10 rounded-3xl my-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
                <BookOpen size={64} className="text-brand-brown mb-6" />
                <h2 className="text-3xl font-black text-brand-brown mb-4">Espaço para Educadores</h2>
                <h3 className="text-xl font-bold text-brand-brown/80 mb-4">Valor Pedagógico e Uso em Sala de Aula</h3>
                <p className="font-semibold text-gray-700 leading-relaxed mb-6">
                    Professores podem criar turmas, acompanhar o progresso dos alunos em tempo real e utilizar nossos planos de aula alinhados à BNCC para ensino de tecnologia e pensamento computacional.
                </p>
                <Button variant="outline" className="bg-transparent border-brand-brown text-brand-brown">Saiba mais para Escolas</Button>
            </div>
            <div className="flex-1 flex justify-center">
                <div className="bg-white p-8 rounded-full border-8 border-brand-yellow/30 shadow-xl">
                    <Users size={80} className="text-brand-brown" />
                </div>
            </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <div className="text-center mb-12">
             <h2 className="text-3xl font-black text-brand-brown">FAQ</h2>
        </div>
        <div className="max-w-2xl mx-auto space-y-4">
            {FAQS.map((faq, idx) => (
                <div key={idx} className="bg-white rounded-2xl border-b-4 border-gray-200 overflow-hidden">
                    <button 
                        onClick={() => toggleFaq(idx)}
                        className="w-full flex items-center justify-between p-6 text-left font-extrabold text-brand-brown hover:bg-gray-50 transition-colors"
                    >
                        {faq.question}
                        {openFaqIndex === idx ? <ChevronUp className="text-brand-yellow" /> : <ChevronDown className="text-gray-400" />}
                    </button>
                    <AnimatePresence>
                        {openFaqIndex === idx && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="p-6 pt-0 text-gray-600 font-semibold leading-relaxed">
                                    {faq.answer}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
      </Section>

      {/* Footer CTA */}
      <div className="bg-brand-yellow py-16 px-4 mt-12 border-t-8 border-brand-brown/10">
        <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-8 animate-bounce">
                <Bird size={64} className="text-brand-brown" strokeWidth={2} />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-brand-brown mb-8">Pronto para começar a voar?</h2>
            <Button size="lg" className="text-xl px-12 shadow-2xl border-black/20">
                Acesse a Plataforma Agora
            </Button>

            <div className="grid md:grid-cols-4 gap-8 mt-20 text-left border-t-2 border-brand-brown/10 pt-12">
                <div>
                    <h4 className="font-black text-brand-brown mb-4">Social</h4>
                    <div className="flex gap-4 opacity-60">
                        <div className="w-8 h-8 bg-brand-brown rounded-full"></div>
                        <div className="w-8 h-8 bg-brand-brown rounded-full"></div>
                        <div className="w-8 h-8 bg-brand-brown rounded-full"></div>
                    </div>
                </div>
                <div>
                    <h4 className="font-black text-brand-brown mb-4">Rotinas</h4>
                    <ul className="space-y-2 font-bold text-brand-brown/60">
                        <li>Aulas</li>
                        <li>Vídeos</li>
                        <li>Versos</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-black text-brand-brown mb-4">Contato</h4>
                    <ul className="space-y-2 font-bold text-brand-brown/60">
                        <li>(41) 123-456</li>
                        <li>contato@ninhodepardais.br</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-black text-brand-brown mb-4">Política</h4>
                    <p className="text-xs font-bold text-brand-brown/50">© 2024 Ninho de Pardais. Todos os direitos reservados a UTFPR.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const TrophyIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
);

export default App;