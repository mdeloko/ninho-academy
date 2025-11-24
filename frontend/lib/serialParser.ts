/**
 * Serial Parser - Processa mensagens JSON recebidas do ESP32 via Serial
 * Adaptado para o protocolo do firmware Ninho Academy
 */

export interface SerialMessage {
  type: string;
  raw: string;
}

export interface TelemetryMessage extends SerialMessage {
  type: 'TELEMETRY';
  userId: string;
  missionId: string;
  readings: {
    led: number;
    btn: number;
    pot: number;
  };
}

export interface AckMessage extends SerialMessage {
  type: 'ACK';
  command: string;
}

export interface ErrorMessage extends SerialMessage {
  type: 'ERROR';
  message: string;
}

export type ParsedMessage = TelemetryMessage | AckMessage | ErrorMessage | SerialMessage;

/**
 * Processa uma linha recebida via Serial
 * Tenta fazer parse do JSON e retorna objeto tipado
 */
export const parseSerialLine = (line: string): ParsedMessage | null => {
  // Remove espaços em branco e quebras de linha
  const trimmedLine = line.trim();

  // Ignora linhas vazias
  if (!trimmedLine) {
    return null;
  }

  // Tenta fazer parse do JSON
  try {
    const parsed = JSON.parse(trimmedLine);

    // Valida que tem o campo 'type'
    if (!parsed.type) {
      console.warn('[SerialParser] Mensagem sem campo "type":', trimmedLine);
      return { type: 'UNKNOWN', raw: trimmedLine };
    }

    // Adiciona campo raw para debug
    parsed.raw = trimmedLine;

    return parsed as ParsedMessage;
  } catch (error) {
    // Não é JSON - pode ser log do Arduino ou outra mensagem
    // Retorna como mensagem genérica
    return {
      type: 'RAW',
      raw: trimmedLine,
    };
  }
};

/**
 * Classe SerialReader - Gerencia leitura contínua da porta Serial
 */
export class SerialReader {
  private port: any;
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  private decoder: TextDecoder = new TextDecoder();
  private buffer: string = '';
  private isReading: boolean = false;
  private onMessage: ((message: ParsedMessage) => void) | null = null;
  private onRawLine: ((line: string) => void) | null = null;

  constructor(port: any) {
    this.port = port;
  }

  /**
   * Inicia a leitura contínua da Serial
   */
  async startReading(
    onMessage: (message: ParsedMessage) => void,
    onRawLine?: (line: string) => void
  ): Promise<void> {
    if (this.isReading) {
      console.warn('[SerialReader] Já está lendo a porta serial.');
      return;
    }

    this.onMessage = onMessage;
    this.onRawLine = onRawLine || null;
    this.isReading = true;

    try {
      this.reader = this.port.readable.getReader();

      while (this.isReading) {
        const { value, done } = await this.reader.read();

        if (done) {
          console.log('[SerialReader] Porta serial fechada.');
          break;
        }

        // Decodifica bytes recebidos para string
        const chunk = this.decoder.decode(value, { stream: true });
        this.buffer += chunk;

        // Processa linhas completas (delimitadas por \n)
        this.processBuffer();
      }
    } catch (error: any) {
      if (error.name === 'NetworkError') {
        console.error('[SerialReader] Erro de rede - ESP32 pode ter sido desconectado.');
      } else {
        console.error('[SerialReader] Erro ao ler porta serial:', error);
      }
    } finally {
      this.stopReading();
    }
  }

  /**
   * Processa buffer acumulado e extrai linhas completas
   */
  private processBuffer(): void {
    const lines = this.buffer.split('\n');

    // Última "linha" pode estar incompleta, mantém no buffer
    this.buffer = lines.pop() || '';

    // Processa cada linha completa
    for (const line of lines) {
      this.processLine(line);
    }
  }

  /**
   * Processa uma linha individual
   */
  private processLine(line: string): void {
    const trimmedLine = line.trim();

    if (!trimmedLine) return;

    // Callback de linha raw (para console/debug)
    if (this.onRawLine) {
      this.onRawLine(trimmedLine);
    }

    // Parse e callback de mensagem estruturada
    const message = parseSerialLine(trimmedLine);

    if (message && this.onMessage) {
      this.onMessage(message);
    }
  }

  /**
   * Para a leitura da Serial
   */
  stopReading(): void {
    this.isReading = false;

    if (this.reader) {
      this.reader.releaseLock();
      this.reader = null;
    }
  }

  /**
   * Verifica se está lendo
   */
  isActive(): boolean {
    return this.isReading;
  }
}

/**
 * Classe SerialWriter - Gerencia escrita na porta Serial
 */
export class SerialWriter {
  private port: any;
  private writer: WritableStreamDefaultWriter<Uint8Array> | null = null;
  private encoder: TextEncoder = new TextEncoder();

  constructor(port: any) {
    this.port = port;
  }

  /**
   * Inicializa o writer
   */
  async initialize(): Promise<void> {
    this.writer = this.port.writable.getWriter();
  }

  /**
   * Envia um comando JSON para o ESP32
   */
  async sendCommand(type: string, payload: Record<string, any> = {}): Promise<void> {
    if (!this.writer) {
      throw new Error('Writer não inicializado. Chame initialize() primeiro.');
    }

    const command = {
      type,
      ...payload,
    };

    const jsonString = JSON.stringify(command) + '\n'; // \n indica fim de comando
    const encoded = this.encoder.encode(jsonString);

    await this.writer.write(encoded);
    console.log('[SerialWriter] Comando enviado:', command);
  }

  /**
   * Fecha o writer
   */
  async close(): Promise<void> {
    if (this.writer) {
      this.writer.releaseLock();
      this.writer = null;
    }
  }

  /**
   * Verifica se está pronto para escrever
   */
  isReady(): boolean {
    return this.writer !== null;
  }
}

/**
 * Utilitário: Valida se mensagem é de telemetria
 */
export const isTelemetryMessage = (message: ParsedMessage): message is TelemetryMessage => {
  return message.type === 'TELEMETRY';
};

/**
 * Utilitário: Valida se mensagem é ACK
 */
export const isAckMessage = (message: ParsedMessage): message is AckMessage => {
  return message.type === 'ACK';
};

/**
 * Utilitário: Valida se mensagem é erro
 */
export const isErrorMessage = (message: ParsedMessage): message is ErrorMessage => {
  return message.type === 'ERROR';
};
