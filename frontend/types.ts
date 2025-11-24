export enum TipoPergunta {
  MULTIPLA_ESCOLHA = 'MULTIPLE_CHOICE',
  VERDADEIRO_FALSO = 'TRUE_FALSE',
  ORDENACAO = 'ORDERING',
  PREENCHER_CODIGO = 'CODE_FILL'
}

export enum TipoLicao {
  TEORIA = 'THEORY',
  PRATICA = 'PRACTICE',
  QUIZ = 'QUIZ'
}

export interface Pergunta {
  id: string;
  type: TipoPergunta;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  codeSnippet?: string;
  hints?: string[];
}

export interface Licao {
  id: string;
  unitId: string;
  title: string;
  type: TipoLicao;
  description: string;
  content?: string;
  questions: Pergunta[];
  xpReward: number;
  requiresKit: boolean;
  completed?: boolean;
  locked?: boolean;
  isAdaptation?: boolean;
}

export interface Unidade {
  id: string;
  title: string;
  description: string;
  color: string;
  lessons: Licao[];
}

export interface Trilha {
  id: string;
  title: string;
  description: string;
  units: Unidade[];
}

export interface Usuario {
  id: string;
  nome: string;
  email?: string;
  xp: number;
  sequenciaDias: number;
  temESP32: boolean;
  sincronizado: boolean;
  trilhaId?: string;
  licoesConcluidas: string[];
  conquistas: Conquista[];
}

export interface Conquista {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

export interface TelemetriaESP {
  type: 'TELEMETRY';
  userId: string;
  deviceId: string;
  timestamp: number;
  readings: {
    gpio: Record<string, { mode: string; value: number }>;
    adc: Record<string, number>;
  };
}

export type StatusConexao = 'disconnected' | 'connecting' | 'connected' | 'error';

// Manter compatibilidade com código existente
export const QuestionType = TipoPergunta;
export const LessonType = TipoLicao;
export type Question = Pergunta;
export type Lesson = Licao;
export type Unit = Unidade;
export type Track = Trilha;
export type User = Usuario;
export type Achievement = Conquista;
export type EspTelemetry = TelemetriaESP;
export type ConnectionStatus = StatusConexao;
