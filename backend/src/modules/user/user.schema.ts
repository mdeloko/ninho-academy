import { z } from 'zod';

export interface Usuario {
  id: string;
  nome: string;
  xp: number;
  sequenciaDias: number;
  temEsp32: boolean;
  trilhaId?: string;
}

export interface AtualizarPerfilHardwareDTO {
  temEsp32: boolean;
}

export const AtualizarPerfilHardwareSchema = z.object({
  temEsp32: z.boolean()
});
