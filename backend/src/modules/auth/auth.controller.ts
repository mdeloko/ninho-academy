import { authService } from './auth.service';
import { ErroBase } from '../../utils/erros';

export class AuthController {
  async autenticar(req: any, res: any) {
    try {
      const resultado = await authService.autenticar(req.body);
      res.json(resultado);
    } catch (erro: any) {
      if (erro instanceof ErroBase) {
        res.status(erro.codigoHttp).json({
          erro: erro.mensagem,
          codigo: erro.codigo
        });
        return;
      }

      console.error('Erro ao autenticar:', erro);
      res.status(500).json({ erro: 'Erro interno no servidor.' });
    }
  }

  async registrar(req: any, res: any) {
    try {
      const resultado = await authService.registrar(req.body);
      res.json(resultado);
    } catch (erro: any) {
      if (erro instanceof ErroBase) {
        res.status(erro.codigoHttp).json({
          erro: erro.mensagem,
          codigo: erro.codigo
        });
        return;
      }

      console.error('Erro ao registrar:', erro);
      res.status(500).json({ erro: 'Erro ao criar conta.' });
    }
  }
}

export const authController = new AuthController();
