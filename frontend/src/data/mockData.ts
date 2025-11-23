import { Module, Achievement, TheoryModule, PracticeModule, User } from '@/types';

export const mockUser: User = {
  id: '1',
  name: 'Estudante',
  email: 'estudante@exemplo.com',
  level: 3,
  xp: 450,
  xpToNextLevel: 600,
};

export const mockModules: Module[] = [
  {
    id: '1',
    title: 'Introdução à Eletrônica',
    type: 'theory',
    description: 'Aprenda os conceitos básicos de eletrônica',
    isLocked: false,
    isCompleted: true,
    xpReward: 100,
    icon: 'Book',
    order: 1,
  },
  {
    id: '2',
    title: 'Primeiro Circuito: LED Piscante',
    type: 'practice',
    description: 'Monte seu primeiro circuito com ESP32',
    isLocked: false,
    isCompleted: true,
    xpReward: 150,
    icon: 'Lightbulb',
    order: 2,
  },
  {
    id: '3',
    title: 'Resistores e Lei de Ohm',
    type: 'theory',
    description: 'Entenda como funcionam os resistores',
    isLocked: false,
    isCompleted: false,
    xpReward: 100,
    icon: 'Book',
    order: 3,
  },
  {
    id: '4',
    title: 'Sensor de Temperatura',
    type: 'practice',
    description: 'Leia dados de um sensor digital',
    isLocked: true,
    isCompleted: false,
    xpReward: 150,
    icon: 'Thermometer',
    order: 4,
  },
  {
    id: '5',
    title: 'Programação Básica',
    type: 'theory',
    description: 'Conceitos fundamentais de programação',
    isLocked: true,
    isCompleted: false,
    xpReward: 100,
    icon: 'Code',
    order: 5,
  },
  {
    id: '6',
    title: 'Controle de Motor',
    type: 'practice',
    description: 'Controle um motor DC com ESP32',
    isLocked: true,
    isCompleted: false,
    xpReward: 200,
    icon: 'Zap',
    order: 6,
  },
];

export const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Primeiro Passo',
    description: 'Complete seu primeiro módulo',
    icon: 'Award',
    dateEarned: '2024-01-15',
    isUnlocked: true,
  },
  {
    id: '2',
    title: 'Mestre do LED',
    description: 'Monte seu primeiro circuito com LED',
    icon: 'Lightbulb',
    dateEarned: '2024-01-16',
    isUnlocked: true,
  },
  {
    id: '3',
    title: 'Estudante Dedicado',
    description: 'Complete 3 módulos teóricos',
    icon: 'BookOpen',
    isUnlocked: false,
  },
  {
    id: '4',
    title: 'Engenheiro Júnior',
    description: 'Complete 5 módulos práticos',
    icon: 'Cpu',
    isUnlocked: false,
  },
];

export const mockTheoryModule: TheoryModule = {
  id: '3',
  title: 'Resistores e Lei de Ohm',
  sections: [
    {
      id: '1',
      title: 'O que é um Resistor?',
      content: 'Um resistor é um componente eletrônico que limita ou regula o fluxo de corrente elétrica em um circuito. É um dos componentes mais básicos e importantes da eletrônica.',
    },
    {
      id: '2',
      title: 'Lei de Ohm',
      content: 'A Lei de Ohm estabelece a relação entre tensão (V), corrente (I) e resistência (R). A fórmula é: V = I × R. Isso significa que a tensão é igual à corrente multiplicada pela resistência.',
    },
    {
      id: '3',
      title: 'Código de Cores',
      content: 'Os resistores possuem faixas coloridas que indicam seu valor de resistência. Cada cor representa um número, e a combinação dessas cores nos dá o valor em Ohms.',
    },
  ],
  quiz: [
    {
      id: '1',
      question: 'Qual é a função principal de um resistor?',
      options: [
        'Armazenar energia',
        'Limitar a corrente elétrica',
        'Amplificar sinais',
        'Gerar eletricidade',
      ],
      correctAnswer: 1,
      explanation: 'O resistor limita ou regula o fluxo de corrente elétrica em um circuito.',
    },
    {
      id: '2',
      question: 'Segundo a Lei de Ohm, se a tensão é 12V e a resistência é 6Ω, qual é a corrente?',
      options: ['2A', '6A', '12A', '18A'],
      correctAnswer: 0,
      explanation: 'Usando V = I × R, temos: 12V = I × 6Ω, logo I = 2A',
    },
    {
      id: '3',
      question: 'O que as faixas coloridas em um resistor indicam?',
      options: [
        'O fabricante do resistor',
        'A data de fabricação',
        'O valor da resistência',
        'A tensão máxima',
      ],
      correctAnswer: 2,
      explanation: 'As faixas coloridas formam um código que indica o valor da resistência em Ohms.',
    },
  ],
};

export const mockPracticeModule: PracticeModule = {
  id: '2',
  title: 'Primeiro Circuito: LED Piscante',
  description: 'Neste módulo prático, você aprenderá a montar seu primeiro circuito com o ESP32, fazendo um LED piscar.',
  steps: [
    {
      id: '1',
      title: 'Componentes Necessários',
      description: 'Separe os seguintes componentes',
      instruction: '• ESP32\n• LED (qualquer cor)\n• Resistor de 220Ω\n• Protoboard\n• Jumpers',
    },
    {
      id: '2',
      title: 'Conectar o LED',
      description: 'Insira o LED na protoboard',
      instruction: 'Insira o LED na protoboard. Lembre-se: o terminal mais longo é o positivo (anodo) e o mais curto é o negativo (catodo).',
    },
    {
      id: '3',
      title: 'Conectar o Resistor',
      description: 'Adicione o resistor ao circuito',
      instruction: 'Conecte o resistor de 220Ω entre o terminal negativo do LED e o GND do ESP32.',
    },
    {
      id: '4',
      title: 'Conectar ao ESP32',
      description: 'Finalize as conexões',
      instruction: 'Conecte o terminal positivo do LED ao pino GPIO 2 do ESP32 usando um jumper.',
    },
    {
      id: '5',
      title: 'Programar o ESP32',
      description: 'Carregue o código no ESP32',
      instruction: 'Use o software no computador para carregar o código de piscar LED no ESP32. Clique em "Verificar Montagem" quando estiver pronto.',
    },
  ],
};
