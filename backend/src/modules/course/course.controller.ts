import { courseService } from './course.service';
import { ErroBase, ErroValidacao } from '../../utils/erros';

export class CourseController {
  async buscarMapa(req: any, res: any) {
    try {
      const { trackId, userId } = req.query;

      if (!userId) {
        throw new ErroValidacao('O parâmetro userId é obrigatório.');
      }

      const mapa = await courseService.buscarMapaDeCurso(
        trackId as string || 'BASIC',
        userId as string
      );

      res.json(mapa);
    } catch (erro: any) {
      if (erro instanceof ErroBase) {
        res.status(erro.codigoHttp).json({
          erro: erro.mensagem,
          codigo: erro.codigo
        });
        return;
      }

      console.error('Erro ao buscar mapa de curso:', erro);
      res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
  }
}

export const courseController = new CourseController();
