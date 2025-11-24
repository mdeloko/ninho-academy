/**
 * ESP32 Connection Page - BASEADO 100% NO exemplo-esp32-opensource/src/App.js
 * Mantém a mesma lógica de conexão e flash que funciona no exemplo
 */

import React, { useState } from "react";
import { Button } from "../components/ui/Button";
import { ConsoleOutput } from "../components/esp/ConsoleOutput";
import { ConnectionGuide } from "../components/esp/ConnectionGuide";
import { connectESP, connectESPWithPort, formatMacAddr, sleep, supported } from "../lib/esptool";
import { FIRMWARE_CONFIG } from "../config/firmware";

type PageState = "initial" | "checking_version" | "connecting" | "connected" | "flashing" | "complete" | "error" | "guide";

export interface ESP32ConnectionPageProps {
  onComplete?: () => void;
  onBack?: () => void;
}

export const ESP32ConnectionPage: React.FC<ESP32ConnectionPageProps> = ({ onComplete, onBack }) => {
  const [pageState, setPageState] = useState<PageState>("initial");
  const [logs, setLogs] = useState<string[]>([]);
  const [espStub, setEspStub] = useState<any>(undefined);
  const [chipName, setChipName] = useState<string>("");
  const [macAddr, setMacAddr] = useState<string>("");
  const [flashProgress, setFlashProgress] = useState<number>(0);
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);

  // Adiciona log (EXATO DO OPEN SOURCE)
  const addOutput = (msg: string) => {
    setLogs((prev) => [...prev, msg]);
  };

  // Conecta ao ESP32 - NOVO FLUXO: Solicita porta UMA VEZ e verifica versão
  const clickConnect = async () => {
    if (espStub) {
      await espStub.disconnect();
      await espStub.port.close();
      setEspStub(undefined);
      return;
    }

    let selectedPort: any = null;

    try {
      // PASSO 1: Solicita a porta UMA ÚNICA VEZ
      setPageState("checking_version");
      addOutput("Solicitando porta serial...");

      selectedPort = await (navigator as any).serial.requestPort();

      if (!selectedPort) {
        addOutput("Nenhuma porta selecionada.");
        setPageState("initial");
        return;
      }

      // PASSO 2: Verifica versão ANTES de fazer hard reset
      addOutput("Verificando versão do firmware...");

      const version = await checkFirmwareVersionWithPort(selectedPort);

      if (version) {
        addOutput(`Versão detectada: ${version}`);
        setCurrentVersion(version);

        // Se a versão for igual, pergunta se quer regravar
        if (version === FIRMWARE_CONFIG.version) {
          const shouldReflash = confirm(`✓ ESP32 já possui a versão ${version} do firmware.\n\nDeseja regravar mesmo assim?`);

          if (!shouldReflash) {
            addOutput("Gravação cancelada. Firmware já está atualizado.");
            setPageState("complete"); // Vai direto para tela de sucesso
            return;
          }

          addOutput("Usuário optou por regravar o firmware.");
        } else {
          addOutput(`→ Nova versão disponível: ${FIRMWARE_CONFIG.version}`);
          addOutput("Iniciando atualização...");
        }
      } else {
        addOutput("→ Nenhuma versão detectada (firmware novo ou não gravado).");
        addOutput("Prosseguindo com gravação...");
      }

      // PASSO 3: Agora sim conecta com ESPLoader usando a MESMA porta (faz hard reset)
      setPageState("connecting");
      addOutput("Preparando ESP32 para gravação...");

      const esploader = await connectESPWithPort(selectedPort, {
        log: (...args) => addOutput(`${args[0]}`),
        debug: (...args) => console.debug(...args),
        error: (...args) => console.error(...args),
        baudRate: 115200,
      });

      addOutput("Inicializando ESP32...");
      await esploader.initialize();

      addOutput(`Conectado: ${esploader.chipName}`);
      addOutput(`MAC Address: ${formatMacAddr(esploader.macAddr())}`);

      const newEspStub = await esploader.runStub();

      setConnected(true);
      setEspStub(newEspStub);
      setChipName(esploader.chipName);
      setMacAddr(formatMacAddr(esploader.macAddr()));
      setPageState("connected");

      // Listener de desconexão (EXATO DO OPEN SOURCE - linha 93)
      newEspStub.port.addEventListener("disconnect", () => {
        setEspStub(undefined);
        setPageState("error");
        addOutput("ESP32 desconectado!");
      });
    } catch (err: any) {
      const shortErrMsg = `${err}`.replace("Error: ", "");
      addOutput(`ERRO: ${shortErrMsg}`);
      setPageState("error");
    }
  };

  // Handler do botão "Gravar Firmware"
  const handleProgramFirmware = async () => {
    // Prossegue direto com a gravação
    // A verificação de versão será feita DEPOIS se o usuário quiser
    await programFirmware();
  };

  // Flash do firmware (LÓGICA EXATA DO OPEN SOURCE - App.js linha 150)
  const programFirmware = async () => {
    if (!espStub) {
      addOutput("ERRO: ESP32 não conectado");
      return;
    }

    setPageState("flashing");
    setFlashProgress(0);

    const toArrayBuffer = (inputFile: Blob): Promise<ArrayBuffer> => {
      const reader = new FileReader();

      return new Promise((resolve, reject) => {
        reader.onerror = () => {
          reader.abort();
          reject(new DOMException("Problema ao ler arquivo."));
        };

        reader.onload = () => {
          resolve(reader.result as ArrayBuffer);
        };
        reader.readAsArrayBuffer(inputFile);
      });
    };

    try {
      // Apaga flash PRIMEIRO
      addOutput("Apagando flash...");
      await espStub.eraseFlash();
      addOutput("Flash apagado!");

      // Arquivos a gravar (NA ORDEM CORRETA - bootloader, partitions, boot_app0, firmware)
      const filesToFlash = [
        { path: "/firmware/bootloader.bin", offset: 0x1000, name: "Bootloader" },
        { path: "/firmware/partitions.bin", offset: 0x8000, name: "Partições" },
        { path: "/firmware/boot_app0.bin", offset: 0xe000, name: "Boot App" },
        { path: "/firmware/ninho-academy.bin", offset: 0x10000, name: "Firmware" },
      ];

      let totalProgress = 0;
      const progressPerFile = 100 / filesToFlash.length;

      // Grava cada arquivo
      for (let i = 0; i < filesToFlash.length; i++) {
        const file = filesToFlash[i];

        addOutput(`Carregando ${file.name}...`);
        const response = await fetch(file.path);

        if (!response.ok) {
          throw new Error(`${file.name} não encontrado em ${file.path}`);
        }

        const blob = await response.blob();
        const contents = await toArrayBuffer(blob);

        addOutput(`Gravando ${file.name} (${contents.byteLength} bytes no offset 0x${file.offset.toString(16)})...`);

        await espStub.flashData(
          contents,
          (bytesWritten: number, totalBytes: number) => {
            const fileProgress = bytesWritten / totalBytes;
            const overallProgress = totalProgress + fileProgress * progressPerFile;
            const percentage = Math.floor(overallProgress);
            setFlashProgress(percentage);

            if (percentage % 10 === 0) {
              addOutput(`Progresso geral: ${percentage}%`);
            }
          },
          file.offset
        );

        totalProgress += progressPerFile;
        setFlashProgress(Math.floor(totalProgress));
        addOutput(`✓ ${file.name} gravado!`);
        await sleep(100);
      }

      addOutput("Firmware completo gravado com sucesso!");
      addOutput("Para executar o novo firmware, pressione o botão RESET no ESP32.");

      // SEGUINDO O OPEN SOURCE: NÃO faz hard reset automático
      // O usuário deve resetar manualmente pressionando o botão no ESP32

      setPageState("complete");
    } catch (e: any) {
      addOutput(`ERRO ao gravar firmware!`);
      addOutput(`${e}`);
      console.error(e);
      setPageState("error");
    }
  };

  const handleRetry = () => {
    setLogs([]);
    setPageState("initial");
  };

  const showGuide = () => {
    setPageState("guide");
  };

  // Verifica versão do firmware usando uma porta já selecionada
  const checkFirmwareVersionWithPort = async (port: any): Promise<string | null> => {
    let reader: ReadableStreamDefaultReader | null = null;
    let writer: WritableStreamDefaultWriter | null = null;
    let readableStreamClosed: Promise<void> | null = null;
    let writableStreamClosed: Promise<void> | null = null;

    try {
      // Abre a porta (se já não estiver aberta)
      if (!port.readable) {
        await port.open({ baudRate: 115200 });
      }

      // Aguarda um pouco para a porta estabilizar
      await sleep(500);

      // Configura reader/writer com pipeTo
      const textDecoder = new TextDecoderStream();
      readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
      reader = textDecoder.readable.getReader();

      const textEncoder = new TextEncoderStream();
      writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
      writer = textEncoder.writable.getWriter();

      let version: string | null = null;
      const MAX_ATTEMPTS = 3; // Tenta 3 vezes

      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        addOutput(`Tentativa ${attempt}/${MAX_ATTEMPTS} de verificar versão...`);

        // Envia comando GET_VERSION
        await writer.write(JSON.stringify({ type: "GET_VERSION" }) + "\n");

        // Aguarda resposta com timeout maior
        const startTime = Date.now();
        const TIMEOUT_MS = 3000; // 3 segundos por tentativa

        while (Date.now() - startTime < TIMEOUT_MS) {
          const readPromise = reader.read();
          const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve({ value: null, done: true }), 500));

          const result: any = await Promise.race([readPromise, timeoutPromise]);

          if (result.done || !result.value) {
            await sleep(100); // Pequena pausa antes de tentar ler novamente
            continue;
          }

          // Log do que recebemos (para debug)
          const receivedData = result.value;
          console.log("[DEBUG] Recebido:", receivedData);

          // Processa linhas recebidas
          const lines = receivedData.split("\n");
          for (const line of lines) {
            if (line.trim()) {
              try {
                const response = JSON.parse(line);
                console.log("[DEBUG] JSON parseado:", response);

                if (response.type === "VERSION") {
                  version = response.version;
                  addOutput(`✓ Versão encontrada: ${version}`);
                  break;
                }
              } catch (e) {
                // Não é JSON - pode ser mensagem de inicialização do ESP32
                console.log("[DEBUG] Linha não-JSON:", line);
              }
            }
          }

          if (version) break;
        }

        if (version) break;

        // Se não encontrou, aguarda um pouco antes da próxima tentativa
        if (attempt < MAX_ATTEMPTS) {
          addOutput("Aguardando firmware inicializar...");
          await sleep(1000);
        }
      }

      if (!version) {
        addOutput("Não foi possível detectar versão após 3 tentativas.");
      }

      return version;
    } catch (error: any) {
      console.error("Erro ao verificar versão:", error);
      return null;
    } finally {
      // ORDEM IMPORTANTE: Liberar readers/writers ANTES de fechar a porta

      // 1. Cancelar reader
      try {
        if (reader) {
          await reader.cancel();
        }
      } catch (e) {
        console.warn("Erro ao cancelar reader:", e);
      }

      // 2. Fechar writer
      try {
        if (writer) {
          await writer.close();
        }
      } catch (e) {
        console.warn("Erro ao fechar writer:", e);
      }

      // 3. Aguardar pipes terminarem
      try {
        if (readableStreamClosed) {
          await readableStreamClosed.catch(() => {}); // Ignora erros de cancelamento
        }
      } catch (e) {
        // Ignora
      }

      try {
        if (writableStreamClosed) {
          await writableStreamClosed.catch(() => {}); // Ignora erros de fechamento
        }
      } catch (e) {
        // Ignora
      }

      // 4. AGORA SIM fechar a porta (após liberar todos os streams)
      try {
        if (port && port.readable === null && port.writable === null) {
          await port.close();
        }
      } catch (e) {
        console.warn("Erro ao fechar porta:", e);
      }
    }
  };

  // RENDERIZAÇÃO

  if (!supported()) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-6">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-extrabold text-brand-brown">Navegador não suportado</h1>
          <p className="text-gray-600">Use Chrome, Edge ou Opera para acessar o ESP32. Firefox e Safari não suportam Web Serial API.</p>
          {onBack && (
            <Button variant="outline" size="lg" fullWidth onClick={onBack}>
              ← Voltar
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (pageState === "guide") {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-6">
        <ConnectionGuide onRetry={handleRetry} onClose={onBack} />
      </div>
    );
  }

  if (pageState === "initial") {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="text-6xl mb-4">🔌</div>
          <h1 className="text-3xl font-extrabold text-brand-brown">Conectar ESP32</h1>
          <p className="text-gray-600">Conecte seu ESP32 via USB e clique no botão para iniciar.</p>

          <Button size="lg" fullWidth onClick={clickConnect}>
            Conectar ESP32
          </Button>

          <Button variant="outline" size="sm" fullWidth onClick={showGuide}>
            📖 Ver guia de conexão
          </Button>

          {onBack && (
            <Button variant="outline" size="lg" fullWidth onClick={onBack}>
              ← Voltar
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (pageState === "checking_version") {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-pulse">🔍</div>
            <h1 className="text-3xl font-extrabold text-brand-brown">Verificando Versão...</h1>
            <p className="text-gray-600 mt-2">Selecione a porta do ESP32 no diálogo</p>
          </div>
          <ConsoleOutput logs={logs} maxHeight="h-64" />
        </div>
      </div>
    );
  }

  if (pageState === "connecting") {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-pulse">⏳</div>
            <h1 className="text-3xl font-extrabold text-brand-brown">Conectando...</h1>
            <p className="text-gray-600 mt-2">Preparando ESP32 para gravação</p>
          </div>
          <ConsoleOutput logs={logs} maxHeight="h-64" />
        </div>
      </div>
    );
  }

  if (pageState === "connected") {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-extrabold text-brand-brown">ESP32 Conectado!</h1>
            <p className="text-gray-600 mt-2">
              {chipName} • MAC: {macAddr}
            </p>
          </div>

          <ConsoleOutput logs={logs} maxHeight="h-48" />

          <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 space-y-4">
            <h2 className="font-bold text-brand-brown text-lg">Próximo passo:</h2>
            <p className="text-gray-600">Vamos gravar o firmware da plataforma Ninho Academy no seu ESP32.</p>
            <Button size="lg" fullWidth onClick={handleProgramFirmware}>
              📤 Gravar Firmware
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (pageState === "flashing") {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-extrabold text-brand-brown">Gravando firmware...</h1>

            {/* Barra de progresso */}
            <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-300">
              <div className="h-full bg-gradient-to-r from-brand-yellow to-brand-darkYellow transition-all duration-300 flex items-center justify-center" style={{ width: `${flashProgress}%` }}>
                {flashProgress > 10 && <span className="text-brand-brown font-bold text-sm">{flashProgress}%</span>}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-100">
              <p className="text-sm text-blue-900">
                <strong>⚠️ Não desconecte o ESP32</strong> durante a gravação.
              </p>
            </div>
          </div>

          <ConsoleOutput logs={logs} maxHeight="h-64" />
        </div>
      </div>
    );
  }

  if (pageState === "complete") {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-extrabold text-brand-brown">Firmware Gravado!</h1>

          <div className="bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-200 space-y-3">
            <p className="text-sm font-bold text-yellow-900">📌 IMPORTANTE: Pressione o botão RESET no ESP32</p>
            <p className="text-xs text-yellow-800">O botão RESET fica ao lado da porta USB. Pressione-o para iniciar o firmware.</p>
          </div>

          <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-100">
            <p className="text-sm text-green-900">✅ Após resetar, você já pode começar a fazer as missões práticas!</p>
          </div>

          <Button size="lg" fullWidth onClick={onComplete}>
            Ir para o Dashboard
          </Button>

          <details>
            <summary className="font-bold text-brand-brown cursor-pointer">Ver logs</summary>
            <div className="mt-4">
              <ConsoleOutput logs={logs} maxHeight="h-48" />
            </div>
          </details>
        </div>
      </div>
    );
  }

  if (pageState === "error") {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-3xl font-extrabold text-brand-brown">Erro de Conexão</h1>
          </div>

          <ConsoleOutput logs={logs} maxHeight="h-64" />

          <div className="flex gap-4">
            <Button size="lg" fullWidth onClick={handleRetry}>
              🔄 Tentar Novamente
            </Button>
            <Button variant="outline" size="lg" fullWidth onClick={showGuide}>
              📖 Ver Guia
            </Button>
          </div>

          {onBack && (
            <Button variant="outline" size="sm" fullWidth onClick={onBack}>
              ← Voltar
            </Button>
          )}
        </div>
      </div>
    );
  }

  return null;
};

// Helper (evita erro de referência antes de definir)
function setConnected(value: boolean) {
  // Mantido para compatibilidade com a lógica do open source
}
