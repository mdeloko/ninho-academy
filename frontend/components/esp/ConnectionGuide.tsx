/**
 * Connection Guide - Guia passo a passo para conectar o ESP32
 * Exibido quando há erro de conexão ou dispositivo não encontrado
 */

import React from 'react';
import { Button } from '../ui/Button';

export interface ConnectionGuideProps {
  onRetry: () => void;
  onClose?: () => void;
}

export const ConnectionGuide: React.FC<ConnectionGuideProps> = ({
  onRetry,
  onClose,
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-brand-brown mb-2">
          Como conectar o ESP32
        </h2>
        <p className="text-gray-600">
          Siga este guia passo a passo para conectar seu ESP32 ao computador
        </p>
      </div>

      {/* Guia com passos */}
      <div className="bg-yellow-50 p-8 rounded-3xl border-4 border-yellow-100 space-y-8">
        {/* Passo 1: Conectar cabo */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-yellow flex items-center justify-center font-extrabold text-brand-brown text-xl">
              1
            </div>
            <h3 className="text-xl font-bold text-brand-brown">
              Conecte o cabo USB
            </h3>
          </div>

          {/* Imagem ou placeholder */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
            <img
              src="/assets/guides/cabo-conectado.png"
              alt="Cabo USB conectado ao ESP32"
              className="w-full h-auto"
              onError={(e) => {
                // Fallback caso a imagem não exista
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden p-8 text-center">
              <div className="text-6xl mb-4">🔌</div>
              <p className="text-gray-600">
                Conecte o cabo USB no ESP32 e no computador
              </p>
            </div>
          </div>

          <p className="text-gray-700">
            Conecte uma ponta do cabo USB no ESP32 e a outra no seu computador.
          </p>
        </div>

        {/* Passo 2: Verificar LED */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-yellow flex items-center justify-center font-extrabold text-brand-brown text-xl">
              2
            </div>
            <h3 className="text-xl font-bold text-brand-brown">
              Verifique se o LED acendeu
            </h3>
          </div>

          <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
            <img
              src="/assets/guides/cabo-conectado-ligado.png"
              alt="LED do ESP32 aceso"
              className="w-full h-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden p-8 text-center">
              <div className="text-6xl mb-4">💡</div>
              <p className="text-gray-600">
                O LED vermelho do ESP32 deve estar aceso
              </p>
            </div>
          </div>

          <p className="text-gray-700">
            Um <strong>LED vermelho</strong> deve acender no ESP32, indicando que está recebendo energia.
            Se o LED não acender, verifique o cabo ou tente outra porta USB.
          </p>
        </div>

        {/* Passo 3: Drivers (caso necessário) */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-yellow flex items-center justify-center font-extrabold text-brand-brown text-xl">
              3
            </div>
            <h3 className="text-xl font-bold text-brand-brown">
              Instale o driver (se necessário)
            </h3>
          </div>

          <p className="text-gray-700">
            Se o ESP32 ainda não aparecer, você pode precisar instalar o driver do chip conversor USB-Serial.
            Identifique qual chip sua placa usa:
          </p>

          {/* Drivers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CH340G */}
            <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 space-y-3">
              <div className="h-32 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                <img
                  src="/assets/guides/CH340G.png"
                  alt="Chip CH340G"
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden text-4xl">🔧</div>
              </div>

              <h4 className="font-bold text-brand-brown">CH340G</h4>
              <p className="text-sm text-gray-600">
                Chip conversor USB-Serial comum em placas chinesas
              </p>
              <a
                href="https://www.wch.cn/downloads/CH341SER_ZIP.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-blue-600 font-bold text-sm underline hover:text-blue-800"
              >
                📥 Baixar driver CH340G →
              </a>
            </div>

            {/* CP210X */}
            <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 space-y-3">
              <div className="h-32 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                <img
                  src="/assets/guides/CP210X.png"
                  alt="Chip CP210X"
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden text-4xl">🔧</div>
              </div>

              <h4 className="font-bold text-brand-brown">CP210X (CP2102)</h4>
              <p className="text-sm text-gray-600">
                Chip conversor da Silicon Labs, comum em placas oficiais
              </p>
              <a
                href="https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-blue-600 font-bold text-sm underline hover:text-blue-800"
              >
                📥 Baixar driver CP210X →
              </a>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-100">
            <p className="text-sm text-blue-900">
              <strong>💡 Dica:</strong> Após instalar o driver, reinicie o computador
              e tente conectar novamente.
            </p>
          </div>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" onClick={onRetry}>
          🔄 Tentar Conectar Novamente
        </Button>
        {onClose && (
          <Button variant="outline" size="lg" onClick={onClose}>
            ← Voltar
          </Button>
        )}
      </div>
    </div>
  );
};
