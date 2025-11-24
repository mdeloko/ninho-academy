/**
 * ESP Service - Serviço para comunicação serial com ESP32
 * Usa a mesma lógica do open source, mas para comunicação serial após flash
 */

import { connectESP, formatMacAddr } from "../lib/esptool";
import type { EspTelemetry, ConnectionStatus } from "../types";
import { missions } from "../data/missions";

class ESPService {
  private port: any = null;
  private reader: ReadableStreamDefaultReader | null = null;
  private writer: WritableStreamDefaultWriter | null = null;
  private _status: ConnectionStatus = "disconnected";

  /**
   * Conecta ao ESP32 via Serial (para comunicação, não flash)
   */
  async conectar(): Promise<void> {
    if (this.port) {
      throw new Error("ESP32 já está conectado.");
    }

    try {
      // Solicita porta serial
      this.port = await (navigator as any).serial.requestPort();

      await this.port.open({
        baudRate: 115200,
      });

      this._status = "connected";

      // Configura reader/writer para comunicação
      const decoder = new TextDecoderStream();
      const inputDone = this.port.readable.pipeTo(decoder.writable);
      this.reader = decoder.readable.getReader();

      const encoder = new TextEncoderStream();
      const outputDone = encoder.readable.pipeTo(this.port.writable);
      this.writer = encoder.writable.getWriter();

      // Inicia leitura em background
      this.lerSerial();
    } catch (erro) {
      this._status = "error";
      throw new Error(`Falha ao conectar: ${erro}`);
    }
  }

  /**
   * Loop de leitura da porta serial
   */
  private async lerSerial() {
    while (this.port && this.port.readable && this.reader) {
      try {
        const { value, done } = await this.reader.read();
        if (done) {
          // Reader foi cancelado
          break;
        }
        if (value) {
          // Processa dados recebidos (pode ser JSON ou logs)
          console.log("[ESP32 RX]", value);

          // Tenta parsear JSON se for uma linha completa
          // Nota: Em produção, precisaria de um buffer para juntar chunks
          try {
            const lines = value.split("\n");
            for (const line of lines) {
              if (line.trim().startsWith("{")) {
                const data = JSON.parse(line);
                console.log("[ESP32 JSON]", data);
                // Aqui você pode disparar eventos ou atualizar estado global
              }
            }
          } catch (e) {
            // Ignora erros de parse, pode ser apenas log de debug
          }
        }
      } catch (e) {
        console.error("[ESP32 Error]", e);
        break;
      }
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

    this._status = "disconnected";
  }

  /**
   * Envia comando JSON para o ESP32
   */
  private async enviarJSON(comando: any): Promise<void> {
    if (!this.writer) {
      throw new Error("ESP32 não conectado.");
    }

    const json = JSON.stringify(comando) + "\n";
    await this.writer.write(json);
  }

  /**
   * Define identidade do usuário no ESP32
   */
  async definirIdentidade(userId: string): Promise<void> {
    // Se não estiver conectado, conecta
    if (!this.isConnected()) {
      await this.conectar();
    }

    await this.enviarJSON({
      type: "SET_ID",
      userId: userId,
    });

    // NÃO desconecta automaticamente para manter o fluxo
    // await this.desconectar();
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
      type: "SET_MISSION",
      missionId: firmwareCommand,
    });
  }

  /**
   * Solicita status/telemetria imediata
   */
  async solicitarStatus(): Promise<void> {
    await this.enviarJSON({ type: "GET_STATUS" });
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
    return this._status === "connected" && this.port !== null;
  }
}

// Exporta instância singleton
export const espService = new ESPService();
