import { userService } from './user.service';
import { ErroBase, ErroValidacao } from '../../utils/erros';

export class UserController {
  async buscarUsuario(req: any, res: any) {
    try {
      const usuario = await userService.buscarUsuarioPorId(req.params.id);
      res.json(usuario);
    } catch (erro: any) {
      if (erro instanceof ErroBase) {
        res.status(erro.codigoHttp).json({
          erro: erro.mensagem,
          codigo: erro.codigo,
        });
        return;
      }

      console.error('Erro ao buscar usuário:', erro);
      res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
  }

  async atualizarPerfilESP32(req: any, res: any) {
    try {
      const hasESP32Body = req.body.temESP32 ?? req.body.hasESP32;

      if (typeof hasESP32Body !== 'boolean') {
        throw new ErroValidacao('O campo temESP32 deve ser um valor booleano.');
      }

      await userService.atualizarStatusESP32(req.params.id, hasESP32Body);
      res.json({ sucesso: true });
    } catch (erro: any) {
      if (erro instanceof ErroBase) {
        res.status(erro.codigoHttp).json({
          erro: erro.mensagem,
          codigo: erro.codigo,
        });
        return;
      }

      console.error('Erro ao atualizar perfil ESP32:', erro);
      res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
  }

  async marcarComoSincronizado(req: any, res: any) {
    try {
      await userService.marcarComoSincronizado(req.params.id);
      res.json({ sucesso: true });
    } catch (erro: any) {
      if (erro instanceof ErroBase) {
        res.status(erro.codigoHttp).json({
          erro: erro.mensagem,
          codigo: erro.codigo,
        });
        return;
      }

      console.error('Erro ao marcar como sincronizado:', erro);
      res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
  }
}

export const userController = new UserController();
