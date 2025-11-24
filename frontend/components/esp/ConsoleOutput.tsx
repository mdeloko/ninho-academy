/**
 * Console Output - Exibe logs de comunicação com o ESP32
 * Baseado no componente Output do exemplo open source
 * Adaptado ao padrão visual do projeto
 */

import React, { useRef, useEffect } from 'react';

export interface ConsoleOutputProps {
  logs: string[];
  maxHeight?: string;
  autoScroll?: boolean;
}

export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
  logs,
  maxHeight = 'h-64',
  autoScroll = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para última mensagem
  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-100 px-4 py-2 border-b-2 border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <span className="font-bold text-sm text-gray-600 ml-2">Console</span>
        </div>
        <span className="text-xs text-gray-400">{logs.length} linhas</span>
      </div>

      {/* Console content */}
      <div
        ref={containerRef}
        className={`bg-gray-900 p-4 ${maxHeight} overflow-y-auto font-mono text-xs`}
      >
        {logs.length === 0 ? (
          <div className="text-gray-500 italic">
            Aguardando mensagens...
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="text-green-400 leading-relaxed">
              <span className="text-green-600 select-none">&gt;</span> {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
