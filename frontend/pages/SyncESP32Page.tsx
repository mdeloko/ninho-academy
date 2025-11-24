import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { espService } from '../services/espService';

interface SyncESP32PageProps {
  userId: string;
  onSyncComplete: () => void;
  onSkip: () => void;
}

type SyncStep =
  | 'intro'           // Página inicial com instruções
  | 'prepare'         // Checklist de preparação
  | 'connecting'      // Conectando à porta serial
  | 'syncing'         // Enviando dados
  | 'verifying'       // Aguardando confirmação do ESP32
  | 'success'         // Sucesso!
  | 'error';          // Erro

export const SyncESP32Page: React.FC<SyncESP32PageProps> = ({ userId, onSyncComplete, onSkip }) => {
  const [step, setStep] = useState<SyncStep>('intro');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [checklist, setChecklist] = useState({
    cable: false,
    device: false,
    ready: false,
  });

  const allChecklistDone = checklist.cable && checklist.device && checklist.ready;

  const aoSincronizar = async () => {
    try {
      setStep('connecting');
      setErrorMessage('');

      await new Promise(resolve => setTimeout(resolve, 500));

      await espService.definirIdentidade(userId);

      setStep('success');
      setTimeout(() => {
        onSyncComplete();
      }, 2500);
    } catch (erro: any) {
      setStep('error');
      setErrorMessage(erro.message || 'Erro ao conectar com ESP32');
    }
  };

  return (
    <div className="min-h-screen bg-brand-light p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-8 border-b-4 border-brand-brown/10 shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📡</div>
          <h1 className="text-3xl font-extrabold text-brand-brown mb-2">Conectar ESP32</h1>
          <p className="text-gray-600">
            Siga os passos para sincronizar seu ESP32 com sua conta
          </p>
        </div>

        {/* Step: Intro */}
        {step === 'intro' && (
          <>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <span>ℹ️</span> Por que sincronizar?
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Grava seu ID único no ESP32</li>
                <li>• Permite enviar telemetria das práticas</li>
                <li>• Valida automaticamente exercícios físicos</li>
                <li>• Você pode pular agora, mas precisará sincronizar antes das práticas</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button
                fullWidth
                size="lg"
                onClick={() => setStep('prepare')}
                variant="primary"
              >
                Começar Sincronização
              </Button>
              <Button
                fullWidth
                size="lg"
                onClick={onSkip}
                variant="secondary"
              >
                Pular por Agora
              </Button>
            </div>
          </>
        )}

        {/* Step: Prepare (Checklist) */}
        {step === 'prepare' && (
          <>
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-yellow-900 mb-4 flex items-center gap-2">
                <span>📋</span> Checklist de Preparação
              </h3>
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={checklist.cable}
                    onChange={(e) => setChecklist({ ...checklist, cable: e.target.checked })}
                    className="mt-1 w-5 h-5 rounded border-2 border-yellow-600"
                  />
                  <div>
                    <div className="font-bold text-yellow-900 group-hover:text-yellow-700">
                      1. Cabo USB conectado
                    </div>
                    <div className="text-sm text-yellow-700">
                      Conecte o ESP32 ao computador usando um cabo USB (Micro-USB ou USB-C, dependendo do modelo)
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={checklist.device}
                    onChange={(e) => setChecklist({ ...checklist, device: e.target.checked })}
                    className="mt-1 w-5 h-5 rounded border-2 border-yellow-600"
                  />
                  <div>
                    <div className="font-bold text-yellow-900 group-hover:text-yellow-700">
                      2. ESP32 ligado (LED aceso)
                    </div>
                    <div className="text-sm text-yellow-700">
                      Verifique se o LED de alimentação do ESP32 está aceso. Se não estiver, tente outro cabo USB.
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={checklist.ready}
                    onChange={(e) => setChecklist({ ...checklist, ready: e.target.checked })}
                    className="mt-1 w-5 h-5 rounded border-2 border-yellow-600"
                  />
                  <div>
                    <div className="font-bold text-yellow-900 group-hover:text-yellow-700">
                      3. Pronto para conectar
                    </div>
                    <div className="text-sm text-yellow-700">
                      Quando clicar em "Conectar", uma janela vai abrir para você selecionar a porta USB do ESP32
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                fullWidth
                size="lg"
                onClick={aoSincronizar}
                variant="primary"
                disabled={!allChecklistDone}
              >
                {allChecklistDone ? '🔌 Conectar ESP32' : '⏳ Complete o checklist'}
              </Button>
              <Button
                size="lg"
                onClick={() => setStep('intro')}
                variant="secondary"
              >
                Voltar
              </Button>
            </div>
          </>
        )}

        {/* Step: Connecting */}
        {step === 'connecting' && (
          <div className="text-center py-8">
            <div className="animate-spin text-6xl mb-4">⚙️</div>
            <p className="text-2xl font-bold text-brand-brown mb-2">Conectando...</p>
            <p className="text-sm text-gray-600 mt-2">
              Uma janela deve ter aberto. Selecione a porta USB do ESP32 (geralmente aparece como "CP210x" ou "CH340")
            </p>
            <div className="mt-6 bg-gray-100 rounded-xl p-4 text-left text-xs text-gray-700">
              <p className="font-bold mb-1">💡 Dica:</p>
              <p>Se a janela não abrir ou você cancelou por engano, clique em "Tentar Novamente" abaixo</p>
            </div>
          </div>
        )}

        {/* Step: Success */}
        {step === 'success' && (
          <div className="text-center py-8">
            <div className="text-7xl mb-4 animate-bounce">✅</div>
            <p className="text-3xl font-bold text-green-600 mb-2">Sincronizado com sucesso!</p>
            <p className="text-gray-600 mb-4">Seu ID foi gravado no ESP32</p>
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-sm text-green-800">
              <p className="font-bold mb-1">🎉 Tudo certo!</p>
              <p>Agora você pode usar o ESP32 em todas as práticas. Redirecionando...</p>
            </div>
          </div>
        )}

        {/* Step: Error */}
        {step === 'error' && (
          <>
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
              <div className="text-center mb-4">
                <div className="text-6xl mb-3">❌</div>
                <h3 className="font-bold text-red-900 mb-2 text-xl">Erro ao Conectar</h3>
                <p className="text-sm text-red-700 bg-red-100 rounded p-3 mt-3 font-mono">
                  {errorMessage}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 text-sm text-gray-700 mt-4">
                <p className="font-bold mb-2">🔧 Possíveis soluções:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Verifique se o cabo USB está bem conectado</li>
                  <li>• Tente usar outro cabo USB (alguns cabos são apenas para carregamento)</li>
                  <li>• Feche outros programas que possam estar usando a porta serial (Arduino IDE, etc)</li>
                  <li>• Verifique se o ESP32 tem o firmware correto instalado</li>
                  <li>• Reinicie o navegador se o problema persistir</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                fullWidth
                size="lg"
                onClick={() => setStep('prepare')}
                variant="primary"
              >
                Tentar Novamente
              </Button>
              <Button
                fullWidth
                size="lg"
                onClick={onSkip}
                variant="secondary"
              >
                Pular por Agora
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
