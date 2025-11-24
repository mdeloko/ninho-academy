/**
 * ESP32 Connection Page - BASEADO 100% NO exemplo-esp32-opensource/src/App.js
 * Mantém a mesma lógica de conexão e flash que funciona no exemplo
 */

import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { ConsoleOutput } from '../components/esp/ConsoleOutput';
import { ConnectionGuide } from '../components/esp/ConnectionGuide';
import { connectESP, formatMacAddr, sleep, supported } from '../lib/esptool';
import { FIRMWARE_CONFIG } from '../config/firmware';

type PageState = 'initial' | 'checking_version' | 'connecting' | 'connected' | 'flashing' | 'complete' | 'error' | 'guide';

export interface ESP32ConnectionPageProps {
  onComplete?: () => void;
  onBack?: () => void;
}

export const ESP32ConnectionPage: React.FC<ESP32ConnectionPageProps> = ({ onComplete, onBack }) => {
  const [pageState, setPageState] = useState<PageState>('initial');
  const [logs, setLogs] = useState<string[]>([]);
  const [espStub, setEspStub] = useState<any>(undefined);
  const [chipName, setChipName] = useState<string>('');
  const [macAddr, setMacAddr] = useState<string>('');
  const [flashProgress, setFlashProgress] = useState<number>(0);
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);

  // Adiciona log (EXATO DO OPEN SOURCE)
  const addOutput = (msg: string) => {
    setLogs((prev) => [...prev, msg]);
  };

  // Conecta ao ESP32 - NOVO FLUXO: Verifica versão ANTES do hard reset
  const clickConnect = async () => {
    if (espStub) {
      await espStub.disconnect();
      await espStub.port.close();
      setEspStub(undefined);
      return;
    }

    try {
      // PASSO 1: Verificar versão ANTES de fazer hard reset
      setPageState('checking_version');
      addOutput('Verificando versão do firmware...');

      let version: string | null = null;

      try {
        version = await checkFirmwareVersion();
      } catch (error: any) {
        // Se usuário cancelou o diálogo, volta para tela inicial
        if (error.name === 'NotFoundError') {
          addOutput('Seleção de porta cancelada.');
          setPageState('initial');
          return;
        }
        throw error;
      }

      if (version) {
        addOutput(`Versão detectada: ${version}`);
        setCurrentVersion(version);

        // Se a versão for igual, pergunta se quer regravar
        if (version === FIRMWARE_CONFIG.version) {
          const shouldReflash = confirm(
            `✓ ESP32 já possui a versão ${version} do firmware.\n\nDeseja regravar mesmo assim?`
          );

          if (!shouldReflash) {
            addOutput('Gravação cancelada. Firmware já está atualizado.');
            setPageState('complete'); // Vai direto para tela de sucesso
            return;
          }

          addOutput('Usuário optou por regravar o firmware.');
        } else {
          addOutput(`→ Nova versão disponível: ${FIRMWARE_CONFIG.version}`);
          addOutput('Iniciando atualização...');
        }
      } else {
        addOutput('→ Nenhuma versão detectada (firmware novo ou não gravado).');
        addOutput('Prosseguindo com gravação...');
      }

      // PASSO 2: Agora sim conecta com ESPLoader (faz hard reset)
      setPageState('connecting');
      addOutput('Solicitando porta serial...');

      const esploader = await connectESP({
        log: (...args) => addOutput(`${args[0]}`),
        debug: (...args) => console.debug(...args),
        error: (...args) => console.error(...args),
        baudRate: 115200,
      });

      addOutput('Inicializando ESP32...');
      await esploader.initialize();

      addOutput(`Conectado: ${esploader.chipName}`);
      addOutput(`MAC Address: ${formatMacAddr(esploader.macAddr())}`);

      const newEspStub = await esploader.runStub();

      setConnected(true);
      setEspStub(newEspStub);
      setChipName(esploader.chipName);
      setMacAddr(formatMacAddr(esploader.macAddr()));
      setPageState('connected');

      // Listener de desconexão (EXATO DO OPEN SOURCE - linha 93)
      newEspStub.port.addEventListener('disconnect', () => {
        setEspStub(undefined);
        setPageState('error');
        addOutput('ESP32 desconectado!');
      });
    } catch (err: any) {
      const shortErrMsg = `${err}`.replace('Error: ', '');
      addOutput(`ERRO: ${shortErrMsg}`);
      setPageState('error');
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
      addOutput('ERRO: ESP32 não conectado');
      return;
    }

    setPageState('flashing');
    setFlashProgress(0);

    const toArrayBuffer = (inputFile: Blob): Promise<ArrayBuffer> => {
      const reader = new FileReader();

      return new Promise((resolve, reject) => {
        reader.onerror = () => {
          reader.abort();
          reject(new DOMException('Problema ao ler arquivo.'));
        };

        reader.onload = () => {
          resolve(reader.result as ArrayBuffer);
        };
        reader.readAsArrayBuffer(inputFile);
      });
    };

    try {
      // Carrega firmware
      addOutput('Carregando firmware...');
      const response = await fetch('/firmware/ninho-academy.bin');

      if (!response.ok) {
        throw new Error('Firmware não encontrado em /firmware/ninho-academy.bin');
      }

      const firmwareBlob = await response.blob();
      const contents = await toArrayBuffer(firmwareBlob);

      addOutput(`Firmware carregado: ${contents.byteLength} bytes`);

      // Apaga flash (opcional mas recomendado)
      addOutput('Apagando flash...');
      await espStub.eraseFlash();
      addOutput('Flash apagado!');

      // Grava firmware (EXATO DO OPEN SOURCE - linha 181)
      addOutput('Gravando firmware...');

      await espStub.flashData(
        contents,
        (bytesWritten: number, totalBytes: number) => {
          const progress = (bytesWritten / totalBytes);
          const percentage = Math.floor(progress * 100);
          setFlashProgress(percentage);

          if (percentage % 10 === 0) {
            addOutput(`Progresso: ${percentage}%`);
          }
        },
        0x10000 // Offset padrão para firmware ESP32
      );

      await sleep(100);

      addOutput('Firmware gravado com sucesso!');
      addOutput('Reinicie o ESP32 para executar o novo firmware.');

      // Desconectar após flash para liberar a porta
      try {
        await espStub.disconnect();
        await espStub.port.close();
        addOutput('Porta serial liberada.');
      } catch (e) {
        console.warn('Erro ao fechar porta:', e);
      }

      setPageState('complete');
    } catch (e: any) {
      addOutput(`ERRO ao gravar firmware!`);
      addOutput(`${e}`);
      console.error(e);
      setPageState('error');
    }
  };

  const handleRetry = () => {
    setLogs([]);
    setPageState('initial');
  };

  const showGuide = () => {
    setPageState('guide');
  };

  // Verifica versão do firmware via Serial (após já estar gravado e rodando)
  const checkFirmwareVersion = async (): Promise<string | null> => {
    let port: any = null;
    let reader: ReadableStreamDefaultReader | null = null;
    let writer: WritableStreamDefaultWriter | null = null;

    try {
      // Solicita porta serial
      port = await (navigator as any).serial.requestPort();

      // Tenta abrir a porta
      await port.open({ baudRate: 115200 });

      // Configura reader/writer
      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
      reader = textDecoder.readable.getReader();

      const textEncoder = new TextEncoderStream();
      const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
      writer = textEncoder.writable.getWriter();

      // Envia comando GET_VERSION
      await writer.write(JSON.stringify({ type: 'GET_VERSION' }) + '\n');

      // Aguarda resposta com timeout
      let version: string | null = null;
      const startTime = Date.now();
      const TIMEOUT_MS = 2000;

      while (Date.now() - startTime < TIMEOUT_MS) {
        const readPromise = reader.read();
        const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve({ value: null, done: true }), 500));

        const result: any = await Promise.race([readPromise, timeoutPromise]);

        if (result.done || !result.value) break;

        // Processa linhas recebidas
        const lines = result.value.split('\n');
        for (const line of lines) {
          if (line.trim()) {
            try {
              const response = JSON.parse(line);
              if (response.type === 'VERSION') {
                version = response.version;
                break;
              }
            } catch (e) {
              // Ignora linhas que não são JSON válido
            }
          }
        }

        if (version) break;
      }

      return version;

    } catch (error: any) {
      // Se o usuário cancelou a seleção de porta
      if (error.name === 'NotFoundError') {
        throw error; // Re-lança para ser tratado no clickConnect
      }

      console.error('Erro ao verificar versão:', error);
      return null;

    } finally {
      // SEMPRE fecha a porta, mesmo se houver erro
      try {
        if (reader) {
          await reader.cancel();
        }
      } catch (e) {
        console.warn('Erro ao fechar reader:', e);
      }

      try {
        if (writer) {
          await writer.close();
        }
      } catch (e) {
        console.warn('Erro ao fechar writer:', e);
      }

      try {
        if (port) {
          await port.close();
        }
      } catch (e) {
        console.warn('Erro ao fechar porta:', e);
      }
    }
  };

  // RENDERIZAÇÃO

  if (!supported()) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-6">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-extrabold text-brand-brown">
            Navegador não suportado
          </h1>
          <p className="text-gray-600">
            Use Chrome, Edge ou Opera para acessar o ESP32.
            Firefox e Safari não suportam Web Serial API.
          </p>
          {onBack && (
            <Button variant="outline" size="lg" fullWidth onClick={onBack}>
              ← Voltar
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (pageState === 'guide') {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-6">
        <ConnectionGuide onRetry={handleRetry} onClose={onBack} />
      </div>
    );
  }

  if (pageState === 'initial') {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="text-6xl mb-4">🔌</div>
          <h1 className="text-3xl font-extrabold text-brand-brown">
            Conectar ESP32
          </h1>
          <p className="text-gray-600">
            Conecte seu ESP32 via USB e clique no botão para iniciar.
          </p>

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

  if (pageState === 'checking_version') {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-pulse">🔍</div>
            <h1 className="text-3xl font-extrabold text-brand-brown">
              Verificando Versão...
            </h1>
            <p className="text-gray-600 mt-2">
              Selecione a porta do ESP32 no diálogo
            </p>
          </div>
          <ConsoleOutput logs={logs} maxHeight="h-64" />
        </div>
      </div>
    );
  }

  if (pageState === 'connecting') {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-pulse">⏳</div>
            <h1 className="text-3xl font-extrabold text-brand-brown">
              Conectando...
            </h1>
            <p className="text-gray-600 mt-2">
              Preparando ESP32 para gravação
            </p>
          </div>
          <ConsoleOutput logs={logs} maxHeight="h-64" />
        </div>
      </div>
    );
  }

  if (pageState === 'connected') {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-extrabold text-brand-brown">
              ESP32 Conectado!
            </h1>
            <p className="text-gray-600 mt-2">
              {chipName} • MAC: {macAddr}
            </p>
          </div>

          <ConsoleOutput logs={logs} maxHeight="h-48" />

          <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 space-y-4">
            <h2 className="font-bold text-brand-brown text-lg">Próximo passo:</h2>
            <p className="text-gray-600">
              Vamos gravar o firmware da plataforma Ninho Academy no seu ESP32.
            </p>
            <Button size="lg" fullWidth onClick={handleProgramFirmware}>
              📤 Gravar Firmware
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (pageState === 'flashing') {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-extrabold text-brand-brown">
              Gravando firmware...
            </h1>

            {/* Barra de progresso */}
            <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-300">
              <div
                className="h-full bg-gradient-to-r from-brand-yellow to-brand-darkYellow transition-all duration-300 flex items-center justify-center"
                style={{ width: `${flashProgress}%` }}
              >
                {flashProgress > 10 && (
                  <span className="text-brand-brown font-bold text-sm">
                    {flashProgress}%
                  </span>
                )}
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

  if (pageState === 'complete') {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-extrabold text-brand-brown">
            Firmware Gravado!
          </h1>
          <p className="text-gray-600">
            Seu ESP32 está pronto para as missões práticas.
          </p>

          <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-100">
            <p className="text-sm text-green-900">
              ✅ Sucesso! Você já pode começar a fazer as missões práticas.
            </p>
          </div>

          <Button size="lg" fullWidth onClick={onComplete}>
            Ir para o Dashboard
          </Button>

          <details>
            <summary className="font-bold text-brand-brown cursor-pointer">
              Ver logs
            </summary>
            <div className="mt-4">
              <ConsoleOutput logs={logs} maxHeight="h-48" />
            </div>
          </details>
        </div>
      </div>
    );
  }

  if (pageState === 'error') {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-3xl font-extrabold text-brand-brown">
              Erro de Conexão
            </h1>
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
