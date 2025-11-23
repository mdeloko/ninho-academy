import { courseService } from '../course/course.service';
import { VerificarDesafioDTO, SnapshotTelemetria } from './telemetry.schema';
import { ValidationRule } from '../course/course.schema';

const verificarRegra = (regra: ValidationRule, snapshots: SnapshotTelemetria[]): boolean => {
  return snapshots.some(snapshot => {
    if (regra.type === 'GPIO_STATE') {
      const valorPino = snapshot.gpio[regra.targetPin!];
      return valorPino === Number(regra.expectedValue);
    }

    if (regra.type === 'ADC_RANGE') {
      const valor = snapshot.adc[regra.targetPin!];
      return valor >= (regra.min || 0) && valor <= (regra.max || 4096);
    }

    return false;
  });
};

const obterMensagemFalha = (regra: ValidationRule): string => {
  if (regra.type === 'GPIO_STATE') {
    return `Esperando que o pino ${regra.targetPin} esteja em ${regra.expectedValue}.`;
  }

  return 'Os critérios do desafio ainda não foram atingidos.';
};

const verificarSessao = async (dados: VerificarDesafioDTO): Promise<{ passou: boolean; mensagem?: string }> => {
  const regras = await courseService.buscarRegrasValidacao(dados.lessonId);

  if (!regras || regras.length === 0) {
    return { passou: true, mensagem: 'Conexão validada.' };
  }

  for (const regra of regras) {
    const regraPassou = verificarRegra(regra, dados.snapshots);

    if (!regraPassou) {
      return { passou: false, mensagem: obterMensagemFalha(regra) };
    }
  }

  return { passou: true, mensagem: 'Desafio completado!' };
};

export const telemetryService = {
  verificarSessao,
};
