/**
 * ESP Service - Serviço para comunicação serial com ESP32
 * Usa a mesma lógica do open source, mas para comunicação serial após flash
 */

import { connectESP, formatMacAddr } from '../lib/esptool';
import type { EspTelemetry, ConnectionStatus } from '../types';
import { missions } from '../data/missions';

class ESPService {
  private port: any = null;
  private reader: ReadableStreamDefaultReader | null = null;
  private writer: WritableStreamDefaultWriter | null = null;
  private _status: ConnectionStatus = 'disconnected';

  /**
   * Conecta ao ESP32 via Serial (para comunicação, não flash)
   */
  async conectar(): Promise<void> {
    if (this.port) {
      throw new Error('ESP32 já está conectado.');
    }

    try {
      // Solicita porta serial
      this.port = await (navigator as any).serial.requestPort();

      await this.port.open({
        baudRate: 115200,
      });

      this._status = 'connected';

      // Configura reader/writer para comunicação
      const decoder = new TextDecoderStream();
      const inputDone = this.port.readable.pipeTo(decoder.writable);
      this.reader = decoder.readable.getReader();

      const encoder = new TextEncoderStream();
      const outputDone = encoder.readable.pipeTo(this.port.writable);
      this.writer = encoder.writable.getWriter();

    } catch (erro) {
      this._status = 'error';
      throw new Error(`Falha ao conectar: ${erro}`);
    }
  }

  /**
   * Desconecta do ESP32
   */
  async desconectar(): Promise<void> {
    if (this.reader) {
      await this.reader.cancel();
      this.reader = null;
    }

    if (this.writer) {
      await this.writer.close();
      this.writer = null;
    }

    if (this.port) {
      await this.port.close();
      this.port = null;
    }

    this._status = 'disconnected';
  }

  /**
   * Envia comando JSON para o ESP32
   */
  private async enviarJSON(comando: any): Promise<void> {
    if (!this.writer) {
      throw new Error('ESP32 não conectado.');
    }

    const json = JSON.stringify(comando) + '\n';
    await this.writer.write(json);
  }

  /**
   * Define identidade do usuário no ESP32
   */
  async definirIdentidade(userId: string): Promise<void> {
    await this.conectar();
    await this.enviarJSON({
      type: 'SET_ID',
      userId: userId,
    });
    await this.desconectar();
  }

  /**
   * Inicia uma missão específica (baseado no level)
   */
  async iniciarMissao(level: number): Promise<void> {
    const mission = missions[level];

    if (!mission) {
      throw new Error(`Missão com level ${level} não encontrada.`);
    }

    const firmwareCommand = mission.practice.firmwareCommand;

    await this.enviarJSON({
      type: 'SET_MISSION',
      missionId: firmwareCommand,
    });
  }

  /**
   * Solicita status/telemetria imediata
   */
  async solicitarStatus(): Promise<void> {
    await this.enviarJSON({ type: 'GET_STATUS' });
  }

  /**
   * Obtém status atual
   */
  getStatus(): ConnectionStatus {
    return this._status;
  }

  /**
   * Verifica se está conectado
   */
  isConnected(): boolean {
    return this._status === 'connected' && this.port !== null;
  }
}

// Exporta instância singleton
export const espService = new ESPService();
