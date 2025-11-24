/**
 * ESP32 Connection Page - Página para conectar e fazer flash do firmware no ESP32
 * Gerencia todo o fluxo: conexão, flash, erros e guias
 */

import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { ConsoleOutput } from '../components/esp/ConsoleOutput';
import { ErrorDisplay, ESP_ERRORS, type ESPError } from '../components/esp/ErrorDisplay';
import { FlashProgress } from '../components/esp/FlashProgress';
import { ConnectionGuide } from '../components/esp/ConnectionGuide';
import { espService } from '../services/espService';

type PageState =
  | 'initial'           // Tela inicial com botão conectar
  | 'connecting'        // Conectando ao ESP32
  | 'connected'         // Conectado, pronto para flash
  | 'flashing'          // Gravando firmware
  | 'flash-complete'    // Firmware gravado com sucesso
  | 'error'             // Erro ocorreu
  | 'guide';            // Exibindo guia de conexão

export interface ESP32ConnectionPageProps {
  onComplete?: () => void;
  onBack?: () => void;
  autoConnect?: boolean; // Se true, tenta conectar automaticamente ao carregar
}

export const ESP32ConnectionPage: React.FC<ESP32ConnectionPageProps> = ({
  onComplete,
  onBack,
  autoConnect = false,
}) => {
  const [pageState, setPageState] = useState<PageState>('initial');
  const [logs, setLogs] = useState<string[]>([]);
  const [flashProgress, setFlashProgress] = useState<number>(0);
  const [currentError, setCurrentError] = useState<ESPError | null>(null);
  const [chipInfo, setChipInfo] = useState<{ chipName: string; macAddr: string } | null>(null);

  // Configurar callbacks do espService
  useEffect(() => {
    espService.onLog = (message: string, level?: 'info' | 'error' | 'debug') => {
      const prefix = level === 'error' ? '❌' : level === 'debug' ? '🔍' : 'ℹ️';
      setLogs((prev) => [...prev, `${prefix} ${message}`]);
    };

    espService.onStatusChange = (status) => {
      if (status === 'error') {
        handleError('DISCONNECTED');
      }
    };

    // Auto-conectar se solicitado
    if (autoConnect) {
      handleConnect();
    }

    return () => {
      // Cleanup: desconectar ao desmontar componente
      espService.desconectar();
    };
  }, [autoConnect]);

  /**
   * Tenta conectar ao ESP32
   */
  const handleConnect = async () => {
    setPageState('connecting');
    setLogs([]);
    setCurrentError(null);

    try {
      await espService.conectar();

      // Obtém informações do chip
      const info = espService.getChipInfo();
      setChipInfo(info);

      setPageState('connected');
      addLog(`✅ Conectado: ${info?.chipName || 'ESP32'}`);
      addLog(`📍 MAC Address: ${info?.macAddr || 'Desconhecido'}`);
    } catch (error: any) {
      console.error('[ESP32ConnectionPage] Erro ao conectar:', error);

      // Identifica tipo de erro
      if (error.message.includes('Nenhuma porta')) {
        handleError('NO_DEVICE');
      } else if (error.message.includes('Permissão negada')) {
        handleError('PERMISSION_DENIED');
      } else if (error.message.includes('não suportada')) {
        handleError('NOT_SUPPORTED');
      } else {
        handleError('NO_DEVICE');
      }
    }
  };

  /**
   * Faz flash do firmware
   */
  const handleFlashFirmware = async () => {
    setPageState('flashing');
    setFlashProgress(0);

    try {
      // Carrega firmware do public
      const response = await fetch('/firmware/ninho-academy.bin');

      if (!response.ok) {
        throw new Error('Firmware não encontrado. Certifique-se de que o arquivo .bin está em /public/firmware/');
      }

      const firmwareBlob = await response.blob();
      const firmwareBuffer = await firmwareBlob.arrayBuffer();

      addLog('📦 Firmware carregado, iniciando gravação...');

      // Configura callback de progresso
      espService['connectionManager']['callbacks'].onFlashProgress = (progress: number) => {
        setFlashProgress(progress);
      };

      await espService.flashFirmware(firmwareBuffer);

      setPageState('flash-complete');
      addLog('🎉 Firmware gravado com sucesso!');
    } catch (error: any) {
      console.error('[ESP32ConnectionPage] Erro ao gravar firmware:', error);
      addLog(`❌ Erro: ${error.message}`);
      handleError('FLASH_FAILED');
    }
  };

  /**
   * Adiciona log à lista
   */
  const addLog = (message: string) => {
    setLogs((prev) => [...prev, message]);
  };

  /**
   * Trata erro e exibe mensagem apropriada
   */
  const handleError = (errorKey: string) => {
    const error = ESP_ERRORS[errorKey] || {
      type: 'unknown',
      message: 'Erro desconhecido',
      suggestion: 'Tente novamente ou consulte a documentação.',
      retryable: true,
    };

    setCurrentError(error);
    setPageState('error');
  };

  /**
   * Exibe o guia de conexão
   */
  const showGuide = () => {
    setPageState('guide');
  };

  /**
   * Tenta novamente após erro
   */
  const handleRetry = () => {
    setCurrentError(null);
    setPageState('initial');
    handleConnect();
  };

  /**
   * Finaliza e volta
   */
  const handleFinish = () => {
    if (onComplete) {
      onComplete();
    } else if (onBack) {
      onBack();
    }
  };

  // ========================================
  // RENDERIZAÇÃO DOS ESTADOS
  // ========================================

  // ESTADO: INITIAL
  if (pageState === 'initial') {
    return (
      <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="text-6xl mb-4">🔌</div>
          <h1 className="text-3xl font-extrabold text-brand-brown">
            Conectar ESP32
          </h1>
          <p className="text-gray-600">
            Conecte seu ESP32 via USB e clique no botão abaixo para iniciar a conexão e gravação do firmware.
          </p>

          <Button size="lg" fullWidth onClick={handleConnect}>
            Conectar ESP32
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

  // ESTADO: CONNECTING
  if (pageState === 'connecting') {
    return (
      <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="text-6xl mb-4 animate-pulse">⏳</div>
          <h1 className="text-3xl font-extrabold text-brand-brown">
            Conectando...
          </h1>
          <p className="text-gray-600">
            Selecione a porta do ESP32 no diálogo que apareceu.
          </p>

          {/* Console de logs */}
          <div className="text-left">
            <ConsoleOutput logs={logs} maxHeight="h-48" />
          </div>
        </div>
      </div>
    );
  }

  // ESTADO: CONNECTED
  if (pageState === 'connected') {
    return (
      <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-extrabold text-brand-brown">
              ESP32 Conectado!
            </h1>
            {chipInfo && (
              <p className="text-gray-600 mt-2">
                {chipInfo.chipName} • MAC: {chipInfo.macAddr}
              </p>
            )}
          </div>

          {/* Console de logs */}
          <ConsoleOutput logs={logs} maxHeight="h-48" />

          {/* Botão para gravar firmware */}
          <div className="bg-white p-6 rounded-2xl border-2 border-gray-200">
            <h2 className="font-bold text-brand-brown mb-4">Próximo passo:</h2>
            <p className="text-gray-600 mb-6">
              Vamos gravar o firmware da plataforma Ninho Academy no seu ESP32.
              Isso permite que ele execute todas as missões práticas.
            </p>

            <Button size="lg" fullWidth onClick={handleFlashFirmware}>
              📤 Gravar Firmware
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ESTADO: FLASHING
  if (pageState === 'flashing') {
    return (
      <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-8">
          <FlashProgress
            progress={flashProgress}
            status="Gravando firmware no ESP32..."
            currentFile="ninho-academy.bin"
          />

          {/* Console de logs */}
          <ConsoleOutput logs={logs} maxHeight="h-64" />
        </div>
      </div>
    );
  }

  // ESTADO: FLASH_COMPLETE
  if (pageState === 'flash-complete') {
    return (
      <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-extrabold text-brand-brown">
            Firmware Gravado!
          </h1>
          <p className="text-gray-600">
            Seu ESP32 está pronto para as missões práticas da plataforma.
          </p>

          <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-100">
            <p className="text-sm text-green-900">
              <strong>✅ Sucesso!</strong><br />
              O firmware foi gravado com sucesso. Você já pode começar a fazer as missões práticas!
            </p>
          </div>

          <Button size="lg" fullWidth onClick={handleFinish}>
            Ir para o Dashboard
          </Button>

          {/* Console de logs (colapsado) */}
          <details className="text-left">
            <summary className="font-bold text-brand-brown cursor-pointer mb-2">
              Ver logs da gravação
            </summary>
            <ConsoleOutput logs={logs} maxHeight="h-48" />
          </details>
        </div>
      </div>
    );
  }

  // ESTADO: ERROR
  if (pageState === 'error' && currentError) {
    return (
      <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-8">
          <ErrorDisplay
            error={currentError}
            onRetry={currentError.retryable ? handleRetry : undefined}
            onViewGuide={showGuide}
          />

          {/* Console de logs */}
          {logs.length > 0 && (
            <details>
              <summary className="font-bold text-brand-brown cursor-pointer mb-2">
                Ver logs de debug
              </summary>
              <ConsoleOutput logs={logs} maxHeight="h-48" />
            </details>
          )}

          {onBack && (
            <Button variant="outline" size="lg" fullWidth onClick={onBack}>
              ← Voltar
            </Button>
          )}
        </div>
      </div>
    );
  }

  // ESTADO: GUIDE
  if (pageState === 'guide') {
    return (
      <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center p-6">
        <ConnectionGuide
          onRetry={handleRetry}
          onClose={onBack}
        />
      </div>
    );
  }

  // Fallback
  return null;
};
