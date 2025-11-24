import { ENDPOINTS } from "../config/api";

export interface Progress {
  id: number;
  userId: string;
  totalXp: number;
  level: number;
  missionCompleted?: string[]; // Mantido apenas no frontend
}

export const progressService = {
  // Criar progresso para novo usuário
  async createProgress(userId: string): Promise<Progress> {
    try {
      const userIdNum = parseInt(userId);

      const resposta = await fetch(ENDPOINTS.progresso.criar, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: userIdNum,
        }),
      });

      if (!resposta.ok) {
        const errorData = await resposta.text();
        console.error("[PROGRESS] Erro ao criar progresso - Status:", resposta.status, "Body:", errorData);
        // Se falhar ao criar, tenta buscar o existente
        console.log("[PROGRESS] Tentando buscar progresso existente...");
        return await this.getProgressByUserId(userId);
      }

      const data = await resposta.json();
      console.log("[PROGRESS] Progresso criado:", data);

      return {
        id: data.id,
        userId,
        totalXp: data.totalXp || 0,
        level: data.level || 0,
      };
    } catch (erro) {
      console.error("[PROGRESS] Erro ao criar progresso:", erro);
      throw erro;
    }
  },

  // Buscar progresso do usuário
  async getProgressByUserId(userId: string): Promise<Progress | null> {
    try {
      const userIdNum = parseInt(userId);

      const resposta = await fetch(ENDPOINTS.progresso.buscarPorUsuario(userIdNum.toString()), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (resposta.status === 404) {
        // Criar novo progresso se não existir
        console.log("[PROGRESS] Progresso não encontrado (404), tentando criar novo...");
        return await this.createProgress(userId);
      }

      if (!resposta.ok) {
        const errorData = await resposta.text();
        console.error("[PROGRESS] Erro ao buscar progresso - Status:", resposta.status, "Body:", errorData);
        throw new Error("Erro ao buscar progresso");
      }

      const data = await resposta.json();
      console.log("[PROGRESS] Progresso encontrado:", data);

      return {
        id: data.id,
        userId,
        totalXp: data.totalXp || 0,
        level: data.level || 0,
      };
    } catch (erro) {
      console.error("[PROGRESS] Erro ao buscar progresso:", erro);
      throw erro;
    }
  },

  // Completar uma missão e adicionar XP
  async completeMission(userId: string, progressId: number, missionId: string, xpGanho: number): Promise<Progress> {
    try {
      const progressAtual = await this.getProgressByUserId(userId);
      if (!progressAtual) throw new Error("Progresso não encontrado");

      // Novo level é o nível atual + 1 (subir um nível a cada missão concluída)
      const novoLevel = progressAtual.level + 1;

      console.log("[PROGRESS] Completando missão:", { missionId, levelAtual: progressAtual.level, novoLevel, xpGanho });

      const resposta = await fetch(ENDPOINTS.progresso.atualizar(progressId.toString()), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          totalXp: progressAtual.totalXp + xpGanho,
          level: novoLevel,
        }),
      });

      if (!resposta.ok) {
        const errorData = await resposta.text();
        console.error("[PROGRESS] Erro ao atualizar - Status:", resposta.status, "Body:", errorData);
        throw new Error("Erro ao atualizar progresso");
      }

      const data = await resposta.json();
      const progressAtualizado = {
        id: data.id,
        userId,
        totalXp: data.totalXp || 0,
        level: data.level || novoLevel,
      };

      // Salvar no localStorage também
      localStorage.setItem("userProgress", JSON.stringify(progressAtualizado));

      console.log("[PROGRESS] Missão concluída com sucesso:", { missionId, xpGanho, novoLevel, progressAtualizado });
      return progressAtualizado;
    } catch (erro) {
      console.error("[PROGRESS] Erro ao completar missão:", erro);
      throw erro;
    }
  },

  // Calcular XP necessário para próximo level (linear por enquanto)
  getXpParaProximoLevel(nivelAtual: number): number {
    return nivelAtual * 100; // 100 XP por level
  },

  // Verificar se pode fazer a próxima missão (baseado no level)
  podeCompletar(missionIndex: number, level: number): boolean {
    // Level 0 pode fazer missão 0
    // Level 1 pode fazer missões 0 e 1
    // Level 2 pode fazer missões 0, 1 e 2, etc
    return level >= missionIndex;
  },
};
