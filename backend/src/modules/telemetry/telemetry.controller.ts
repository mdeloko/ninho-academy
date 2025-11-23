import { telemetryService } from './telemetry.service';
import { ErroBase } from '../../utils/erros';

export class TelemetryController {
  async verificar(req: any, res: any) {
    try {
      const resultado = await telemetryService.verificarSessao(req.body);
      res.json(resultado);
    } catch (erro: any) {
      if (erro instanceof ErroBase) {
        res.status(erro.codigoHttp).json({
          erro: erro.mensagem,
          codigo: erro.codigo
        });
        return;
      }

      console.error('Erro ao verificar telemetria:', erro);
      res.status(500).json({ erro: 'Falha na verificação.' });
    }
  }
}

export const telemetryController = new TelemetryController();
