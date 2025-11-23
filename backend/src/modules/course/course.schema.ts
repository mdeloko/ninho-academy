import { z } from 'zod';

export enum TipoPergunta {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  ORDERING = 'ORDERING',
  CODE_FILL = 'CODE_FILL'
}

export enum TipoLicao {
  THEORY = 'THEORY',
  PRACTICE = 'PRACTICE',
  QUIZ = 'QUIZ'
}

export interface RegraValidacao {
  type: 'GPIO_STATE' | 'ADC_RANGE' | 'SEQUENCE';
  targetPin?: string;
  expectedValue?: number | string;
  min?: number;
  max?: number;
  durationMs?: number;
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
  alternativeMode?: 'SKIP' | 'THEORY_ONLY';
  validationRules?: RegraValidacao[];
}

export interface Unidade {
  id: string;
  title: string;
  description: string;
  color: string;
  lessons: Licao[];
}

export interface Trilha {
  id: 'BASIC' | 'INTERMEDIATE';
  title: string;
  description: string;
  units: Unidade[];
}

export const BuscarMapaCursoQuery = z.object({
  trackId: z.enum(['BASIC', 'INTERMEDIATE']).optional(),
  userId: z.string().optional()
});

// Manter compatibilidade com tipos originais para o frontend
export const QuestionType = TipoPergunta;
export const LessonType = TipoLicao;
export type Question = Pergunta;
export type Lesson = Licao;
export type Unit = Unidade;
export type Track = Trilha;
export type ValidationRule = RegraValidacao;
