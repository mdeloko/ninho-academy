export interface SnapshotTelemetria {
  gpio: Record<string, number>;
  adc: Record<string, number>;
}

export interface VerificarDesafioDTO {
  userId: string;
  lessonId: string;
  snapshots: SnapshotTelemetria[];
}

// Manter compatibilidade com nomes originais
export type TelemetrySnapshot = SnapshotTelemetria;
export type VerifyChallengeDTO = VerificarDesafioDTO;
