/**
 * ESP Service - Serviço singleton para comunicação com ESP32
 * Usa ESPConnectionManager internamente
 */

import { ESPConnectionManager } from './espConnectionManager';
import type { EspTelemetry, ConnectionStatus } from '../types';
import { missions } from '../data/missions';

class ESPService {
  private connectionManager: ESPConnectionManager | null = null;
  private _onTelemetry: ((telemetry: EspTelemetry) => void) | null = null;
  private _onStatusChange: ((status: ConnectionStatus) => void) | null = null;
  private _onLog: ((message: string, level?: 'info' | 'error' | 'debug') => void) | null = null;

  constructor() {
    this.initializeManager();
  }

  /**
   * Inicializa o Connection Manager com callbacks
   */
  private initializeManager(): void {
    this.connectionManager = new ESPConnectionManager({
      onStatusChange: (status) => {
        if (this._onStatusChange) {
          this._onStatusChange(status);
        }
      },
      onTelemetry: (telemetry) => {
        if (this._onTelemetry) {
          this._onTelemetry(telemetry);
        }
      },
      onLog: (message, level) => {
        if (this._onLog) {
          this._onLog(message, level);
        }
      },
    });
  }

  /**
   * Conecta ao ESP32
   */
  async conectar(): Promise<void> {
    if (!this.connectionManager) {
      this.initializeManager();
    }
    await this.connectionManager!.connect();
  }

  /**
   * Desconecta do ESP32
   */
  async desconectar(): Promise<void> {
    if (this.connectionManager) {
      await this.connectionManager.disconnect();
    }
  }

  /**
   * Envia comando genérico
   */
  async enviarComando(tipo: string, payload: Record<string, any> = {}): Promise<void> {
    if (!this.connectionManager || !this.connectionManager.isConnected()) {
      throw new Error('ESP32 não está conectado. Conecte primeiro usando conectar().');
    }

    await this.connectionManager.sendCommand(tipo, payload);
  }

  /**
   * Define identidade do usuário no ESP32
   */
  async definirIdentidade(userId: string): Promise<void> {
    await this.enviarComando('SET_ID', { userId });
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

    await this.enviarComando('SET_MISSION', { missionId: firmwareCommand });
  }

  /**
   * Solicita status/telemetria imediata
   */
  async solicitarStatus(): Promise<void> {
    await this.enviarComando('GET_STATUS');
  }

  /**
   * Faz flash do firmware
   */
  async flashFirmware(file: File | ArrayBuffer): Promise<void> {
    if (!this.connectionManager) {
      throw new Error('Connection Manager não inicializado.');
    }

    await this.connectionManager.flashFirmware(file);
  }

  /**
   * Apaga a flash do ESP32
   */
  async apagarFlash(): Promise<void> {
    // Implementação direta via espManager se necessário
    throw new Error('Função apagarFlash ainda não implementada isoladamente.');
  }

  /**
   * Obtém status atual
   */
  getStatus(): ConnectionStatus {
    return this.connectionManager?.getStatus() || 'disconnected';
  }

  /**
   * Verifica se está conectado
   */
  isConnected(): boolean {
    return this.connectionManager?.isConnected() || false;
  }

  /**
   * Obtém informações do chip
   */
  getChipInfo(): { chipName: string; macAddr: string } | null {
    return this.connectionManager?.getChipInfo() || null;
  }

  /**
   * Setter para callback de telemetria
   */
  set onTelemetry(callback: ((telemetry: EspTelemetry) => void) | null) {
    this._onTelemetry = callback;
  }

  /**
   * Setter para callback de mudança de status
   */
  set onStatusChange(callback: ((status: ConnectionStatus) => void) | null) {
    this._onStatusChange = callback;
  }

  /**
   * Setter para callback de logs
   */
  set onLog(callback: ((message: string, level?: 'info' | 'error' | 'debug') => void) | null) {
    this._onLog = callback;
  }
}

// Exporta instância singleton
export const espService = new ESPService();
