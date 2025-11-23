import { db } from '../../infrastructure/database';
import { userService } from '../user/user.service';
import { Track, LessonType, QuestionType } from './course.schema';

const DADOS_CURSOS: Record<string, Track> = {
  BASIC: {
    id: 'BASIC',
    title: 'Trilha Básica: Primeiros Passos',
    description: 'Conceitos iniciais de eletrônica e IoT.',
    units: [
      {
        id: 'u_b_1',
        title: 'Introdução à Eletrônica',
        description: 'Entendendo a energia.',
        color: 'bg-brand-yellow',
        lessons: [
          {
            id: 'l_b_1_1',
            unitId: 'u_b_1',
            title: 'O Fluxo de Elétrons',
            type: LessonType.THEORY,
            description: 'Como a eletricidade se move.',
            xpReward: 10,
            requiresKit: false,
            questions: [
              {
                id: 'q_1',
                type: QuestionType.MULTIPLE_CHOICE,
                question: 'O que impulsiona os elétrons em um circuito?',
                options: ['Resistência', 'Tensão (Voltagem)', 'Capacitância', 'Indutância'],
                correctAnswer: 'Tensão (Voltagem)',
                explanation: 'A tensão é a força elétrica que "empurra" os elétrons.',
                hints: ['Pense nela como a "pressão" da água em um cano.', 'É medida em Volts.']
              }
            ]
          },
          {
            id: 'l_b_1_2',
            unitId: 'u_b_1',
            title: 'Olá, LED!',
            type: LessonType.PRACTICE,
            description: 'Acendendo seu primeiro LED.',
            xpReward: 50,
            requiresKit: true,
            alternativeMode: 'THEORY_ONLY',
            validationRules: [
              { type: 'GPIO_STATE', targetPin: '2', expectedValue: 1 }
            ],
            questions: []
          }
        ]
      }
    ]
  },
  INTERMEDIATE: {
    id: 'INTERMEDIATE',
    title: 'Trilha Intermediária: Automação',
    description: 'Sensores, lógica e código.',
    units: [
      {
        id: 'u_i_1',
        title: 'Lógica Digital',
        description: 'Inputs e Outputs.',
        color: 'bg-sky-400',
        lessons: [
          {
            id: 'l_i_1_1',
            unitId: 'u_i_1',
            title: 'Botões e Pull-ups',
            type: LessonType.PRACTICE,
            description: 'Lendo estados físicos.',
            xpReward: 60,
            requiresKit: true,
            alternativeMode: 'SKIP',
            validationRules: [
              { type: 'GPIO_STATE', targetPin: '0', expectedValue: 0 }
            ],
            questions: []
          }
        ]
      }
    ]
  }
};

const buscarMapaDeCurso = async (trackId: string, userId: string) => {
  const usuario = await userService.buscarUsuarioPorId(userId);
  const trilhaBruta = DADOS_CURSOS[trackId] || DADOS_CURSOS['BASIC'];
  const temKit = usuario ? usuario.temESP32 : false;

  const unidadesAdaptadas = trilhaBruta.units.map(unidade => ({
    ...unidade,
    lessons: unidade.lessons.map(licao => {
      const deveAdaptar = licao.requiresKit && !temKit && licao.alternativeMode === 'THEORY_ONLY';

      return {
        ...licao,
        type: deveAdaptar ? LessonType.THEORY : licao.type,
        isAdaptation: licao.requiresKit && !temKit
      };
    })
  }));

  return {
    ...trilhaBruta,
    units: unidadesAdaptadas
  };
};

const buscarRegrasValidacao = async (lessonId: string) => {
  for (const trackKey in DADOS_CURSOS) {
    for (const unidade of DADOS_CURSOS[trackKey].units) {
      const licao = unidade.lessons.find(l => l.id === lessonId);
      if (licao) return licao.validationRules || [];
    }
  }
  return [];
};

export const courseService = {
  buscarMapaDeCurso,
  buscarRegrasValidacao,
};
