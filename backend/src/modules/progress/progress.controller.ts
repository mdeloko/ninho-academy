import { progressService } from './progress.service';
import { ErroBase, ErroValidacao } from '../../utils/erros';

export class ProgressController {
  async completarLicao(req: any, res: any) {
    try {
      const { userId, lessonId, xpEarned } = req.body;

      if (!userId || !lessonId || typeof xpEarned !== 'number') {
        throw new ErroValidacao('Dados inválidos. Verifique userId, lessonId e xpEarned.');
      }

      const resultado = await progressService.completarLicao({ userId, lessonId, xpEarned });
      res.json({ sucesso: true, ...resultado });
    } catch (erro: any) {
      if (erro instanceof ErroBase) {
        if (erro.mensagem.includes('já foi completada')) {
          res.json({ sucesso: true, jaCompletada: true });
          return;
        }

        res.status(erro.codigoHttp).json({
          erro: erro.mensagem,
          codigo: erro.codigo
        });
        return;
      }

      console.error('Erro ao completar lição:', erro);
      res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
  }
}

export const progressController = new ProgressController();
