import { db } from '../../infrastructure/database';
import { ErroNaoEncontrado } from '../../utils/erros';

const mapearUsuarioParaResposta = (usuario: any) => {
  const { progresso, ...dados } = usuario;

  return {
    id: dados.id,
    nome: dados.nome,
    email: dados.email,
    xp: dados.xp,
    temESP32: dados.temEsp32,
    sincronizado: dados.sincronizado,
    sequenciaDias: dados.sequenciaDias || 0,
    trilhaId: dados.trilhaId,
    conquistas: [],
    licoesConcluidas: progresso?.map((p: any) => p.licaoId) || [],
  };
};

const buscarUsuarioPorId = async (id: string): Promise<any> => {
  const usuario = await db.usuario.findUnique({
    where: { id },
    include: {
      progresso: {
        select: { licaoId: true },
      },
    },
  });

  if (!usuario) {
    throw new ErroNaoEncontrado('Usuário');
  }

  return mapearUsuarioParaResposta(usuario);
};

const atualizarStatusESP32 = async (userId: string, temESP32: boolean): Promise<void> => {
  await db.usuario.update({
    where: { id: userId },
    data: { temEsp32: temESP32 },
  });
};

const marcarComoSincronizado = async (userId: string): Promise<void> => {
  await db.usuario.update({
    where: { id: userId },
    data: { sincronizado: true },
  });
};

export const userService = {
  buscarUsuarioPorId,
  atualizarStatusESP32,
  marcarComoSincronizado,
};
