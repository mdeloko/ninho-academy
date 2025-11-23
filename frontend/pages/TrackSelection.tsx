import React, { useState } from 'react';
import { Button } from '../components/ui/Button';

interface PropriedadesSelecaoTrilha {
  onConfirm: (trilhaId: string, temESP32: boolean) => void;
}

export const TrackSelection: React.FC<PropriedadesSelecaoTrilha> = ({ onConfirm }) => {
  const [trilhaSelecionada, setTrilhaSelecionada] = useState<'BASIC' | 'INTERMEDIATE'>('BASIC');
  const [temESP32, setTemESP32] = useState<boolean | null>(null);

  const aoConfirmar = () => {
    if (temESP32 !== null) {
      onConfirm(trilhaSelecionada, temESP32);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-8 border-b-4 border-brand-brown/10 shadow-lg">
        <h1 className="text-3xl font-extrabold text-brand-brown mb-6 text-center">
          Vamos configurar sua jornada
        </h1>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-700 mb-4">1. Escolha sua Trilha</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div
              onClick={() => setTrilhaSelecionada('BASIC')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                trilhaSelecionada === 'BASIC'
                  ? 'bg-brand-yellow/20 border-brand-yellow ring-2 ring-brand-yellow'
                  : 'border-gray-200 hover:border-brand-yellow'
              }`}
            >
              <div className="text-4xl mb-2">🌱</div>
              <h3 className="font-bold text-lg">Básica</h3>
              <p className="text-sm text-gray-600">
                Nunca toquei em um LED. Quero aprender do zero.
              </p>
            </div>

            <div
              onClick={() => setTrilhaSelecionada('INTERMEDIATE')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                trilhaSelecionada === 'INTERMEDIATE'
                  ? 'bg-sky-100 border-sky-400 ring-2 ring-sky-400'
                  : 'border-gray-200 hover:border-sky-400'
              }`}
            >
              <div className="text-4xl mb-2">🚀</div>
              <h3 className="font-bold text-lg">Intermediária</h3>
              <p className="text-sm text-gray-600">
                Já sei o básico de Arduino/ESP32. Quero desafios.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-700 mb-4">2. Você tem um ESP32?</h2>
          <p className="text-sm text-gray-500 mb-4">
            Se você não tiver ESP32, todas as práticas serão desabilitadas. Antes de cada missão
            prática, perguntaremos se você tem os componentes específicos (LED, potenciômetro,
            etc).
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => setTemESP32(true)}
              className={`flex-1 py-4 rounded-xl font-bold border-b-4 active:translate-y-1 active:border-b-0 transition-all ${
                temESP32 === true
                  ? 'bg-brand-green text-white border-brand-darkGreen'
                  : 'bg-gray-100 text-gray-600 border-gray-300'
              }`}
            >
              Sim, tenho! 🔌
            </button>
            <button
              onClick={() => setTemESP32(false)}
              className={`flex-1 py-4 rounded-xl font-bold border-b-4 active:translate-y-1 active:border-b-0 transition-all ${
                temESP32 === false
                  ? 'bg-brand-yellow text-brand-brown border-brand-darkYellow'
                  : 'bg-gray-100 text-gray-600 border-gray-300'
              }`}
            >
              Não tenho 😢
            </button>
          </div>
        </div>

        <Button fullWidth size="lg" onClick={aoConfirmar} disabled={temESP32 === null}>
          Começar Aventura!
        </Button>
      </div>
    </div>
  );
};
