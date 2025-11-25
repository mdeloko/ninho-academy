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

  // Promises para rastrear fechamento dos streams
  private readableStreamClosed: Promise<void> | null = null;
  private writableStreamClosed: Promise<void> | null = null;

  private _status: ConnectionStatus = "disconnected";

  // Callbacks para eventos
  public onStatusChange?: (status: ConnectionStatus) => void;
  public onTelemetry?: (data: any) => void;

  private setStatus(status: ConnectionStatus) {
    this._status = status;
    if (this.onStatusChange) {
      this.onStatusChange(status);
    }
  }

  /**
   * Conecta ao ESP32 usando uma porta já aberta (ex: vinda do setup)
   */
  async conectarComPorta(portaExistente: any): Promise<void> {
    if (this.port) {
      // Se já tem porta, verifica se é a mesma
      if (this.port === portaExistente) return;
      await this.desconectar();
    }

    try {
      this.port = portaExistente;

      // Se a porta não estiver aberta, abre
      if (!this.port.readable) {
        await this.port.open({ baudRate: 115200 });
      }

      this.setStatus("connected");

      // Configura reader/writer para comunicação
      const decoder = new TextDecoderStream();
      this.readableStreamClosed = this.port.readable.pipeTo(decoder.writable);
      this.reader = decoder.readable.getReader();

      const encoder = new TextEncoderStream();
      this.writableStreamClosed = encoder.readable.pipeTo(this.port.writable);
      this.writer = encoder.writable.getWriter();

      // Inicia leitura em background
      this.lerSerial();
    } catch (erro) {
      this.setStatus("error");
      throw new Error(`Falha ao conectar com porta existente: ${erro}`);
    }
  }

  /**
   * Conecta ao ESP32 via Serial (para comunicação, não flash)
   */
  async conectar(): Promise<void> {
    if (this.port) {
      // Se já está conectado, apenas notifica sucesso
      if (this.port.readable) {
        this.setStatus("connected");
        return;
      }
      // Se tem objeto porta mas não está legível, tenta limpar
      await this.desconectar();
    }

    try {
      // Solicita porta serial
      this.port = await (navigator as any).serial.requestPort();

      await this.port.open({
        baudRate: 115200,
      });

      this.setStatus("connected");

      // Configura reader/writer para comunicação
      const decoder = new TextDecoderStream();
      this.readableStreamClosed = this.port.readable.pipeTo(decoder.writable);
      this.reader = decoder.readable.getReader();

      const encoder = new TextEncoderStream();
      this.writableStreamClosed = encoder.readable.pipeTo(this.port.writable);
      this.writer = encoder.writable.getWriter();

      // Inicia leitura em background
      this.lerSerial();
    } catch (erro) {
      this.setStatus("error");
      throw new Error(`Falha ao conectar: ${erro}`);
    }
  }

  /**
   * Loop de leitura da porta serial
   */
  private async lerSerial() {
    let buffer = "";

    while (this.port && this.port.readable && this.reader) {
      try {
        const { value, done } = await this.reader.read();
        if (done) {
          // Reader foi cancelado
          break;
        }
        if (value) {
          // Acumula no buffer
          buffer += value;

          // Processa linhas completas
          const lines = buffer.split("\n");

          // O último elemento é o resto (incompleto) ou vazio
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
              try {
                const data = JSON.parse(trimmed);
                console.log("[ESP32 JSON]", data);

                if (this.onTelemetry) {
                  this.onTelemetry(data);
                }
              } catch (e) {
                // Ignora erro de parse
              }
            }
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
    try {
      // 1. Cancel Reader
      if (this.reader) {
        await this.reader.cancel();
        this.reader = null;
      }

      // 2. Close Writer
      if (this.writer) {
        await this.writer.close();
        this.writer = null;
      }

      // 3. Wait for pipes to close
      if (this.readableStreamClosed) {
        await this.readableStreamClosed.catch(() => {}); // Ignore errors
        this.readableStreamClosed = null;
      }
      if (this.writableStreamClosed) {
        await this.writableStreamClosed.catch(() => {}); // Ignore errors
        this.writableStreamClosed = null;
      }

      // 4. Close Port
      if (this.port) {
        await this.port.close();
        this.port = null;
      }
    } catch (e) {
      console.warn("Erro ao desconectar:", e);
    } finally {
      this.setStatus("disconnected");
    }
  }

  /**
   * Envia comando genérico
   */
  async enviarComando(type: string, payload: any = {}): Promise<void> {
    await this.enviarJSON({ type, ...payload });
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
