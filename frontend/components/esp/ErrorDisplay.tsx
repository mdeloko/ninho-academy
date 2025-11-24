/**
 * Error Display - Exibe erros de conexão/flash do ESP32 de forma amigável
 */

import React from 'react';
import { Button } from '../ui/Button';

export interface ESPError {
  type: 'connection' | 'flash' | 'protocol' | 'hardware' | 'unknown';
  message: string;
  suggestion: string;
  retryable: boolean;
}

export interface ErrorDisplayProps {
  error: ESPError;
  onRetry?: () => void;
  onViewGuide?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onViewGuide,
}) => {
  // Ícone baseado no tipo de erro
  const getErrorIcon = () => {
    switch (error.type) {
      case 'connection':
        return '🔌';
      case 'flash':
        return '⚠️';
      case 'protocol':
        return '📡';
      case 'hardware':
        return '🔧';
      default:
        return '❌';
    }
  };

  return (
    <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-6 space-y-4">
      {/* Header com ícone */}
      <div className="flex items-start gap-3">
        <span className="text-3xl">{getErrorIcon()}</span>
        <div className="flex-1">
          <h3 className="font-bold text-red-900 text-lg">{error.message}</h3>
          <p className="text-sm text-red-700 mt-1">{error.suggestion}</p>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="flex flex-wrap gap-3">
        {error.retryable && onRetry && (
          <Button variant="danger" size="sm" onClick={onRetry}>
            🔄 Tentar Novamente
          </Button>
        )}
        {onViewGuide && (
          <Button variant="outline" size="sm" onClick={onViewGuide}>
            📖 Ver Guia Completo
          </Button>
        )}
      </div>
    </div>
  );
};

/**
 * Mensagens de erro pré-definidas
 */
export const ESP_ERRORS: Record<string, ESPError> = {
  NO_DEVICE: {
    type: 'connection',
    message: 'ESP32 não encontrado',
    suggestion: 'Verifique se o cabo está conectado e se o LED do ESP32 acendeu.',
    retryable: true,
  },
  USER_CANCELLED: {
    type: 'connection',
    message: 'Conexão cancelada',
    suggestion: 'Você cancelou a seleção da porta. Clique em "Tentar Novamente" para escolher a porta.',
    retryable: true,
  },
  PERMISSION_DENIED: {
    type: 'connection',
    message: 'Permissão negada',
    suggestion: 'Habilite as permissões de Web Serial nas configurações do navegador e recarregue a página.',
    retryable: true,
  },
  NOT_SUPPORTED: {
    type: 'connection',
    message: 'Navegador não suportado',
    suggestion: 'Use Chrome, Edge ou Opera para acessar o ESP32. Firefox e Safari não suportam Web Serial API.',
    retryable: false,
  },
  FLASH_FAILED: {
    type: 'flash',
    message: 'Falha ao gravar firmware',
    suggestion: 'Tente segurar o botão BOOT no ESP32 durante a gravação. Se o problema persistir, verifique o cabo USB.',
    retryable: true,
  },
  FLASH_TIMEOUT: {
    type: 'flash',
    message: 'Timeout na gravação',
    suggestion: 'A gravação demorou muito. Verifique a conexão USB e tente novamente.',
    retryable: true,
  },
  DISCONNECTED: {
    type: 'connection',
    message: 'ESP32 foi desconectado',
    suggestion: 'O ESP32 foi removido ou perdeu conexão. Reconecte o cabo USB e tente novamente.',
    retryable: true,
  },
  INVALID_FIRMWARE: {
    type: 'flash',
    message: 'Arquivo de firmware inválido',
    suggestion: 'O arquivo .bin está corrompido ou não é compatível. Baixe o firmware novamente.',
    retryable: false,
  },
  COMMAND_TIMEOUT: {
    type: 'protocol',
    message: 'Timeout ao enviar comando',
    suggestion: 'O ESP32 não respondeu a tempo. Verifique se o firmware está correto e tente reconectar.',
    retryable: true,
  },
};
