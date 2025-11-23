import { db } from '../../infrastructure/database';
import { CompletarLicaoDTO } from './progress.schema';
import { ErroValidacao } from '../../utils/erros';

const completarLicao = async (dados: CompletarLicaoDTO) => {
  const jaCompletou = await db.progressoUsuario.findUnique({
    where: {
      usuarioId_licaoId: {
        usuarioId: dados.userId,
        licaoId: dados.lessonId,
      },
    },
  });

  if (jaCompletou) {
    throw new ErroValidacao('Esta lição já foi completada anteriormente.');
  }

  const resultado = await db.$transaction(async (tx) => {
    await tx.progressoUsuario.create({
      data: {
        usuarioId: dados.userId,
        licaoId: dados.lessonId,
      },
    });

    const usuarioAtualizado = await tx.usuario.update({
      where: { id: dados.userId },
      data: {
        xp: { increment: dados.xpEarned },
      },
    });

    return usuarioAtualizado;
  });

  return { novoXp: resultado.xp };
};

export const progressService = {
  completarLicao,
};
