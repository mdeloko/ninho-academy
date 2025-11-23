import { EspTelemetry, ConnectionStatus } from "../types";

interface SerialPort {
  open(options: { baudRate: number }): Promise<void>;
  close(): Promise<void>;
  readable: ReadableStream<Uint8Array> | null;
  writable: WritableStream<Uint8Array> | null;
}

declare global {
  interface Navigator {
    serial: {
      requestPort(options?: { filters: Array<{ usbVendorId?: number; usbProductId?: number }> }): Promise<SerialPort>;
    };
  }
}

let porta: SerialPort | null = null;
let leitor: ReadableStreamDefaultReader | null = null;
let escritor: WritableStreamDefaultWriter | null = null;
let manterLendo = false;
let aoReceberTelemetria: ((dados: EspTelemetry) => void) | null = null;
let aoMudarStatus: ((status: ConnectionStatus) => void) | null = null;
let processarLinha: (linha: string) => void;

const atualizarStatus = (status: ConnectionStatus) => {
  if (aoMudarStatus) aoMudarStatus(status);
};

const processarLinhaDefault = (linha: string) => {
  if (!linha.trim()) return;

  try {
    const dados = JSON.parse(linha);

    if (dados.type === "TELEMETRY" && aoReceberTelemetria) {
      aoReceberTelemetria(dados as EspTelemetry);
    }

    if (dados.type === "LOG" || dados.type === "STATUS") {
      console.log("[ESP32]", dados.msg);
    }
  } catch (e) {
    // Ignora linhas que não são JSON (mensagens de boot, etc)
  }
};

processarLinha = processarLinhaDefault;

const loopLeitura = async () => {
  if (!porta || !porta.readable) return;

  const decodificadorTexto = new TextDecoderStream();
  const streamFechado = porta.readable.pipeTo(decodificadorTexto.writable);
  leitor = decodificadorTexto.readable.getReader();

  let buffer = "";

  try {
    while (manterLendo) {
      const { value: valor, done: finalizado } = await leitor.read();

      if (finalizado) break;

      if (valor) {
        buffer += valor;
        const linhas = buffer.split("\n");
        buffer = linhas.pop() || "";

        for (const linha of linhas) {
          processarLinha(linha);
        }
      }
    }
  } catch (erro) {
    console.error("Erro de leitura do ESP32:", erro);
    atualizarStatus("error");
  } finally {
    if (leitor) leitor.releaseLock();
  }
};

const conectar = async () => {
  if (!("serial" in navigator)) {
    alert("Web Serial não é suportado neste navegador. Use Chrome ou Edge.");
    return;
  }

  try {
    atualizarStatus("connecting");
    porta = await navigator.serial.requestPort();
    await porta.open({ baudRate: 115200 });

    atualizarStatus("connected");
    manterLendo = true;
    loopLeitura();
  } catch (erro) {
    console.error("Erro ao conectar com ESP32:", erro);
    atualizarStatus("error");
  }
};

const desconectar = async () => {
  manterLendo = false;

  if (leitor) {
    await leitor.cancel();
    leitor = null;
  }

  if (escritor) {
    await escritor.close();
    escritor = null;
  }

  if (porta) {
    await porta.close();
    porta = null;
  }

  atualizarStatus("disconnected");
};

const enviarComando = async (comando: string, payload: any) => {
  if (!porta || !porta.writable) return;

  if (!escritor) {
    const codificadorTexto = new TextEncoderStream();
    const streamFechado = codificadorTexto.readable.pipeTo(porta.writable);
    escritor = codificadorTexto.writable.getWriter();
  }

  try {
    const mensagem = JSON.stringify({ type: comando, ...payload }) + "\n";
    await escritor.write(mensagem);
  } catch (erro) {
    console.error("Erro ao enviar comando:", erro);
  }
};

const definirIdentidade = async (userId: string): Promise<void> => {
  let estavaConectado = !!porta;

  if (!porta) {
    await conectar();
  }

  if (!porta) {
    throw new Error("Falha ao conectar com ESP32. Conexão cancelada ou dispositivo não encontrado.");
  }

  if (!estavaConectado) {
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log("Enviando identidade:", userId);

  return new Promise((resolver, rejeitar) => {
    const timeout = setTimeout(() => {
      limpar();
      rejeitar(new Error("Timeout: ESP32 não respondeu em 10 segundos. Verifique se o firmware está correto."));
    }, 10000);

    const parserOriginal = processarLinha;
    let respostaRecebida = false;

    const limpar = () => {
      clearTimeout(timeout);
      processarLinha = parserOriginal;
    };

    processarLinha = (linha: string) => {
      parserOriginal(linha);

      if (!linha.trim()) return;

      try {
        const dados = JSON.parse(linha);

        if (dados.type === "ACK" && dados.command === "SET_ID") {
          respostaRecebida = true;
          limpar();
          resolver();
        } else if (dados.type === "ID_SAVED" || (dados.type === "STATUS" && dados.msg?.includes("ID saved"))) {
          respostaRecebida = true;
          limpar();
          resolver();
        } else if (dados.type === "ERROR") {
          limpar();
          rejeitar(new Error(dados.msg || "ESP32 retornou um erro"));
        }
      } catch (e) {
        // Ignora linhas que não são JSON
      }
    };

    enviarComando("SET_ID", { userId }).catch((erro) => {
      limpar();
      rejeitar(new Error("Erro ao enviar comando para ESP32: " + erro.message));
    });
  });
};

export const espService = {
  conectar,
  desconectar,
  enviarComando,
  definirIdentidade,
  set onTelemetry(callback: ((dados: EspTelemetry) => void) | null) {
    aoReceberTelemetria = callback;
  },
  set onStatusChange(callback: ((status: ConnectionStatus) => void) | null) {
    aoMudarStatus = callback;
  },
};
