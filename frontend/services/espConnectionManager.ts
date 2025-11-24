/**
 * ESP Connection Manager - Gerencia toda a comunicação com o ESP32
 * Orquestra: Conexão, Flash, Leitura/Escrita Serial, Estado
 */

import { ESPManager, fileToArrayBuffer, type FlashFile } from '../lib/esptool';
import {
  SerialReader,
  SerialWriter,
  type ParsedMessage,
  isTelemetryMessage,
  isAckMessage,
  isErrorMessage,
} from '../lib/serialParser';
import type { ConnectionStatus, EspTelemetry } from '../types';

export type ESPManagerStatus = ConnectionStatus;

export interface ESPConnectionCallbacks {
  onStatusChange?: (status: ESPManagerStatus) => void;
  onTelemetry?: (telemetry: EspTelemetry) => void;
  onLog?: (message: string, level?: 'info' | 'error' | 'debug') => void;
  onFlashProgress?: (progress: number) => void; // 0 a 100
}

/**
 * Classe principal que gerencia toda a conexão com o ESP32
 */
export class ESPConnectionManager {
  private espManager: ESPManager | null = null;
  private serialReader: SerialReader | null = null;
  private serialWriter: SerialWriter | null = null;
  private callbacks: ESPConnectionCallbacks = {};
  private currentStatus: ESPManagerStatus = 'disconnected';
  private port: any = null;

  constructor(callbacks: ESPConnectionCallbacks = {}) {
    this.callbacks = callbacks;
  }

  /**
   * Atualiza o status e notifica via callback
   */
  private updateStatus(status: ESPManagerStatus): void {
    this.currentStatus = status;
    if (this.callbacks.onStatusChange) {
      this.callbacks.onStatusChange(status);
    }
  }

  /**
   * Loga mensagem e notifica via callback
   */
  private log(message: string, level: 'info' | 'error' | 'debug' = 'info'): void {
    console.log(`[ESPConnectionManager] ${message}`);
    if (this.callbacks.onLog) {
      this.callbacks.onLog(message, level);
    }
  }

  /**
   * Conecta ao ESP32 e inicializa comunicação Serial
   */
  async connect(): Promise<void> {
    if (this.currentStatus === 'connected') {
      this.log('Já está conectado.', 'debug');
      return;
    }

    try {
      this.updateStatus('connecting');

      // Inicializa ESP Manager
      this.espManager = new ESPManager({
        baudRate: 115200,
        log: (msg, level) => this.log(msg, level),
      });

      await this.espManager.connect();

      // Obtém a porta para leitura/escrita Serial
      if (this.espManager.isConnected()) {
        // A porta está acessível via esploader.port
        // Precisamos obter referência para usar Serial Reader/Writer
        // @ts-ignore - acesso interno ao esploader
        this.port = this.espManager['esploader']?.port;

        if (!this.port) {
          throw new Error('Não foi possível obter referência da porta serial.');
        }

        // Inicializa Serial Reader (leitura contínua)
        this.serialReader = new SerialReader(this.port);
        this.serialReader.startReading(
          (message) => this.handleSerialMessage(message),
          (line) => this.log(`< ${line}`, 'debug')
        );

        // Inicializa Serial Writer (envio de comandos)
        this.serialWriter = new SerialWriter(this.port);
        await this.serialWriter.initialize();

        this.updateStatus('connected');
        this.log('Conexão estabelecida e comunicação Serial ativa!', 'info');
      }
    } catch (error: any) {
      this.updateStatus('error');
      this.log(`Erro ao conectar: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Desconecta do ESP32
   */
  async disconnect(): Promise<void> {
    try {
      // Para leitura Serial
      if (this.serialReader) {
        this.serialReader.stopReading();
        this.serialReader = null;
      }

      // Fecha writer
      if (this.serialWriter) {
        await this.serialWriter.close();
        this.serialWriter = null;
      }

      // Desconecta ESP Manager
      if (this.espManager) {
        await this.espManager.disconnect();
        this.espManager = null;
      }

      this.port = null;
      this.updateStatus('disconnected');
      this.log('Desconectado com sucesso.', 'info');
    } catch (error: any) {
      this.log(`Erro ao desconectar: ${error.message}`, 'error');
    }
  }

  /**
   * Faz flash do firmware no ESP32
   */
  async flashFirmware(firmwareFile: File | ArrayBuffer, offset: string = '0x10000'): Promise<void> {
    if (!this.espManager || !this.espManager.isConnected()) {
      throw new Error('ESP32 não está conectado. Conecte primeiro.');
    }

    try {
      this.log('Iniciando gravação de firmware...', 'info');

      // Converte File para ArrayBuffer se necessário
      let data: ArrayBuffer;
      if (firmwareFile instanceof File) {
        data = await fileToArrayBuffer(firmwareFile);
      } else {
        data = firmwareFile;
      }

      // Prepara arquivo para flash
      const flashFile: FlashFile = {
        offset,
        data,
        fileName: firmwareFile instanceof File ? firmwareFile.name : 'firmware.bin',
      };

      // Apaga flash antes de gravar (opcional, mas recomendado)
      this.log('Apagando memória flash...', 'info');
      await this.espManager.eraseFlash();

      // Grava firmware com callback de progresso
      if (this.callbacks.onFlashProgress) {
        this.espManager['config'].onProgress = (bytesWritten: number, totalBytes: number) => {
          const progress = Math.floor((bytesWritten / totalBytes) * 100);
          if (this.callbacks.onFlashProgress) {
            this.callbacks.onFlashProgress(progress);
          }
        };
      }

      await this.espManager.flashFiles([flashFile]);

      this.log('Firmware gravado com sucesso!', 'info');
      this.log('Reinicie o ESP32 para executar o novo firmware.', 'info');
    } catch (error: any) {
      this.log(`Erro ao gravar firmware: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Envia comando para o ESP32
   */
  async sendCommand(type: string, payload: Record<string, any> = {}): Promise<void> {
    if (!this.serialWriter || !this.serialWriter.isReady()) {
      throw new Error('Serial Writer não está pronto. Conecte primeiro.');
    }

    try {
      await this.serialWriter.sendCommand(type, payload);
      this.log(`Comando enviado: ${type}`, 'debug');
    } catch (error: any) {
      this.log(`Erro ao enviar comando: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Processa mensagens recebidas via Serial
   */
  private handleSerialMessage(message: ParsedMessage): void {
    // TELEMETRIA
    if (isTelemetryMessage(message)) {
      this.log(`Telemetria recebida: LED=${message.readings.led} BTN=${message.readings.btn} POT=${message.readings.pot}`, 'debug');

      // Converte para formato EspTelemetry do frontend
      const telemetry: EspTelemetry = {
        type: 'TELEMETRY',
        userId: message.userId,
        deviceId: 'esp32', // TODO: obter deviceId real se necessário
        timestamp: Date.now(),
        readings: {
          gpio: {
            led: { mode: 'output', value: message.readings.led },
            btn: { mode: 'input', value: message.readings.btn },
          },
          adc: {
            pot: message.readings.pot,
          },
        },
      };

      if (this.callbacks.onTelemetry) {
        this.callbacks.onTelemetry(telemetry);
      }
    }
    // ACK
    else if (isAckMessage(message)) {
      this.log(`ACK recebido: ${message.command}`, 'info');
    }
    // ERRO
    else if (isErrorMessage(message)) {
      this.log(`Erro do ESP32: ${message.message}`, 'error');
    }
    // MENSAGEM DESCONHECIDA
    else {
      this.log(`Mensagem não reconhecida: ${message.raw}`, 'debug');
    }
  }

  /**
   * Obtém status atual
   */
  getStatus(): ESPManagerStatus {
    return this.currentStatus;
  }

  /**
   * Verifica se está conectado
   */
  isConnected(): boolean {
    return this.currentStatus === 'connected';
  }

  /**
   * Obtém informações do chip
   */
  getChipInfo(): { chipName: string; macAddr: string } | null {
    return this.espManager?.getChipInfo() || null;
  }

  /**
   * Atualiza callbacks
   */
  setCallbacks(callbacks: ESPConnectionCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }
}
