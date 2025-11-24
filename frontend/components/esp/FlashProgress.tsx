/**
 * Flash Progress - Exibe progresso da gravação de firmware no ESP32
 */

import React from 'react';

export interface FlashProgressProps {
  progress: number; // 0 a 100
  status?: string;
  currentFile?: string;
}

export const FlashProgress: React.FC<FlashProgressProps> = ({
  progress,
  status = 'Gravando firmware...',
  currentFile,
}) => {
  return (
    <div className="space-y-4">
      {/* Status text */}
      <div className="text-center">
        <h3 className="font-bold text-brand-brown text-lg">{status}</h3>
        {currentFile && (
          <p className="text-sm text-gray-600 mt-1">
            Arquivo: {currentFile}
          </p>
        )}
      </div>

      {/* Progress bar */}
      <div className="relative">
        {/* Background bar */}
        <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-300">
          {/* Filled bar */}
          <div
            className="h-full bg-gradient-to-r from-brand-yellow to-brand-darkYellow transition-all duration-300 ease-out flex items-center justify-center"
            style={{ width: `${progress}%` }}
          >
            {/* Percentage text */}
            {progress > 10 && (
              <span className="text-brand-brown font-bold text-sm">
                {Math.floor(progress)}%
              </span>
            )}
          </div>
        </div>

        {/* Percentage text outside bar (when bar is too small) */}
        {progress <= 10 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span className="text-brand-brown font-bold text-sm">
              {Math.floor(progress)}%
            </span>
          </div>
        )}
      </div>

      {/* Loading animation */}
      <div className="flex items-center justify-center gap-2">
        <div className="w-2 h-2 bg-brand-yellow rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-brand-yellow rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-brand-yellow rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>

      {/* Helper text */}
      <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-100">
        <p className="text-sm text-blue-900 text-center">
          <strong>Não desconecte o ESP32</strong> durante a gravação.
          <br />
          O processo pode levar até 2 minutos.
        </p>
      </div>
    </div>
  );
};
