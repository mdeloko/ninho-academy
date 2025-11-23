export interface CompletarLicaoDTO {
  userId: string;
  lessonId: string;
  xpEarned: number;
}

// Manter compatibilidade com nome original
export type CompleteLessonDTO = CompletarLicaoDTO;
