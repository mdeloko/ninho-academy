/**
 * ESPTool - Wrapper para comunicação Web Serial API e flash de firmware
 * Baseado no exemplo open source (exemplo-esp32-opensource)
 * Adaptado para TypeScript e padrão do projeto
 */

// Tipos para o esptool-js (biblioteca externa)
// Em produção, seria instalado via npm: esptool-js
declare global {
  interface Window {
    esptoolPackage: any;
  }
}

export interface LogFunction {
  (message: string, level?: 'info' | 'error' | 'debug'): void;
}

export interface ESPToolConfig {
  baudRate: number;
  log: LogFunction;
  onProgress?: (bytesWritten: number, totalBytes: number) => void;
}

export interface FlashFile {
  offset: string; // ex: "0x1000"
  data: ArrayBuffer;
  fileName: string;
}

/**
 * Formata endereço MAC para formato legível
 * Ex: [170, 187, 204, 221, 238, 255] -> "AA:BB:CC:DD:EE:FF"
 */
export const formatMacAddr = (macAddr: number[]): string => {
  return macAddr
    .map((value) => value.toString(16).toUpperCase().padStart(2, '0'))
    .join(':');
};

/**
 * Sleep assíncrono
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Conecta ao ESP32 via Web Serial API
 */
export const connectESP = async (config: ESPToolConfig): Promise<any> => {
  const { baudRate, log } = config;

  try {
    // Verifica se Web Serial API está disponível
    if (!('serial' in navigator)) {
      throw new Error('Web Serial API não suportada neste navegador. Use Chrome, Edge ou Opera.');
    }

    // Solicita permissão para acessar porta serial
    log('Solicitando permissão para acessar porta serial...', 'info');
    const port = await (navigator as any).serial.requestPort();

    // Abre a porta com baud rate especificado
    log('Abrindo porta serial...', 'info');
    await port.open({ baudRate });

    log('Porta aberta com sucesso!', 'info');

    // Carrega esptool-js (assumindo que está disponível globalmente)
    // Em produção, isso seria: import { ESPLoader } from 'esptool-js';
    if (!window.esptoolPackage) {
      throw new Error('esptool-js não está carregado. Inclua o script na página.');
    }

    const esploaderMod = await window.esptoolPackage;

    // Inicializa ESP Loader
    log('Inicializando ESP Loader...', 'info');
    const esploader = new esploaderMod.ESPLoader(port, config);

    return esploader;
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      throw new Error('Nenhuma porta serial selecionada. Certifique-se de que o ESP32 está conectado.');
    } else if (error.name === 'SecurityError' || error.name === 'NotAllowedError') {
      throw new Error('Permissão negada para acessar porta serial.');
    } else {
      throw new Error(`Erro ao conectar: ${error.message}`);
    }
  }
};

/**
 * Detecta se Web Serial API é suportada
 */
export const isWebSerialSupported = (): boolean => {
  return 'serial' in navigator;
};

/**
 * Offsets padrão para flash do ESP32
 * Baseado na estrutura típica de partições do ESP32
 */
export const getDefaultFlashOffsets = (chipName: string): FlashFile[] => {
  if (chipName.includes('ESP32')) {
    return [
      { offset: '0x1000', data: new ArrayBuffer(0), fileName: 'bootloader.bin' },
      { offset: '0x8000', data: new ArrayBuffer(0), fileName: 'partitions.bin' },
      { offset: '0xE000', data: new ArrayBuffer(0), fileName: 'boot_app0.bin' },
      { offset: '0x10000', data: new ArrayBuffer(0), fileName: 'firmware.bin' },
    ];
  } else {
    // ESP8266 e outros
    return [{ offset: '0x0', data: new ArrayBuffer(0), fileName: 'firmware.bin' }];
  }
};

/**
 * Converte File para ArrayBuffer
 */
export const fileToArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reader.abort();
      reject(new Error('Erro ao ler arquivo.'));
    };

    reader.onload = () => {
      resolve(reader.result as ArrayBuffer);
    };

    reader.readAsArrayBuffer(file);
  });
};

/**
 * Faz flash de um arquivo no ESP32
 */
export const flashFile = async (
  esploader: any,
  file: FlashFile,
  onProgress?: (bytesWritten: number, totalBytes: number) => void
): Promise<void> => {
  const offset = parseInt(file.offset, 16);

  await esploader.flashData(
    file.data,
    (bytesWritten: number, totalBytes: number) => {
      if (onProgress) {
        onProgress(bytesWritten, totalBytes);
      }
    },
    offset
  );
};

/**
 * Classe ESPManager - Gerencia conexão e operações do ESP32
 */
export class ESPManager {
  private esploader: any = null;
  private port: any = null;
  private config: ESPToolConfig;

  constructor(config: ESPToolConfig) {
    this.config = config;
  }

  /**
   * Conecta ao ESP32
   */
  async connect(): Promise<void> {
    this.config.log('Conectando ao ESP32...', 'info');

    this.esploader = await connectESP(this.config);

    // Inicializa o ESP32
    await this.esploader.initialize();

    const chipName = this.esploader.chipName;
    const macAddr = formatMacAddr(this.esploader.macAddr());

    this.config.log(`Conectado: ${chipName}`, 'info');
    this.config.log(`Endereço MAC: ${macAddr}`, 'info');

    // Executa stub (firmware auxiliar para operações)
    this.config.log('Carregando stub...', 'info');
    this.esploader = await this.esploader.runStub();

    this.config.log('ESP32 pronto para operações!', 'info');

    // Listener para desconexão
    this.esploader.port.addEventListener('disconnect', () => {
      this.config.log('ESP32 desconectado!', 'error');
      this.esploader = null;
    });
  }

  /**
   * Desconecta do ESP32
   */
  async disconnect(): Promise<void> {
    if (this.esploader) {
      await this.esploader.disconnect();
      await this.esploader.port.close();
      this.esploader = null;
      this.config.log('Desconectado do ESP32.', 'info');
    }
  }

  /**
   * Apaga a memória flash do ESP32
   */
  async eraseFlash(): Promise<void> {
    if (!this.esploader) {
      throw new Error('ESP32 não conectado.');
    }

    this.config.log('Apagando memória flash...', 'info');
    const startTime = Date.now();

    await this.esploader.eraseFlash();

    const elapsedTime = Date.now() - startTime;
    this.config.log(`Memória apagada em ${elapsedTime}ms`, 'info');
  }

  /**
   * Faz flash de múltiplos arquivos
   */
  async flashFiles(files: FlashFile[]): Promise<void> {
    if (!this.esploader) {
      throw new Error('ESP32 não conectado.');
    }

    for (const file of files) {
      if (!file.data || file.data.byteLength === 0) {
        this.config.log(`Pulando arquivo vazio: ${file.fileName}`, 'debug');
        continue;
      }

      this.config.log(`Gravando ${file.fileName} no offset ${file.offset}...`, 'info');

      await flashFile(this.esploader, file, (bytesWritten, totalBytes) => {
        const percentage = Math.floor((bytesWritten / totalBytes) * 100);

        if (this.config.onProgress) {
          this.config.onProgress(bytesWritten, totalBytes);
        }

        // Log a cada 25%
        if (percentage % 25 === 0) {
          this.config.log(`Progresso: ${percentage}%`, 'info');
        }
      });

      this.config.log(`${file.fileName} gravado com sucesso!`, 'info');
      await sleep(100); // Pequeno delay entre arquivos
    }

    this.config.log('Todos os arquivos foram gravados!', 'info');
    this.config.log('Reinicie o ESP32 para executar o novo firmware.', 'info');
  }

  /**
   * Obtém informações do chip
   */
  getChipInfo(): { chipName: string; macAddr: string } | null {
    if (!this.esploader) {
      return null;
    }

    return {
      chipName: this.esploader.chipName,
      macAddr: formatMacAddr(this.esploader.macAddr()),
    };
  }

  /**
   * Verifica se está conectado
   */
  isConnected(): boolean {
    return this.esploader !== null;
  }
}
