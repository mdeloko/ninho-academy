import { useState, useEffect, useCallback } from 'react';
import { espService, ConnectionStatus, EspTelemetry } from '@/lib/espService';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

export const useESP32 = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [telemetry, setTelemetry] = useState<EspTelemetry | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    espService.onStatusChange = setStatus;
    espService.onTelemetry = setTelemetry;

    return () => {
      espService.onStatusChange = null;
      espService.onTelemetry = null;
    };
  }, []);

  const conectar = useCallback(async () => {
    try {
      setError(null);
      await espService.conectar();
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar');
      throw err;
    }
  }, []);

  const desconectar = useCallback(async () => {
    try {
      setError(null);
      await espService.desconectar();
    } catch (err: any) {
      setError(err.message || 'Erro ao desconectar');
      throw err;
    }
  }, []);

  const sincronizarComBackend = useCallback(async () => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      setError(null);

      // Primeiro conecta se não estiver conectado
      if (!espService.estaConectado()) {
        await conectar();
      }

      // Envia o ID do usuário para o ESP32
      await espService.definirIdentidade(user.id);

      // Notifica o backend que o ESP32 foi conectado
      await api.post(`/users/${user.id}/esp32-status`, { temESP32: true });

      // Marca como sincronizado
      await api.post(`/users/${user.id}/mark-synced`);

      return true;
    } catch (err: any) {
      setError(err.message || 'Erro na sincronização');
      throw err;
    }
  }, [user, conectar]);

  const definirMissao = useCallback(async (missionId: string) => {
    try {
      setError(null);
      await espService.definirMissao(missionId);
    } catch (err: any) {
      setError(err.message || 'Erro ao definir missão');
      throw err;
    }
  }, []);

  const obterStatus = useCallback(async () => {
    try {
      setError(null);
      await espService.obterStatus();
    } catch (err: any) {
      setError(err.message || 'Erro ao obter status');
      throw err;
    }
  }, []);

  return {
    status,
    telemetry,
    error,
    conectar,
    desconectar,
    sincronizarComBackend,
    definirMissao,
    obterStatus,
    estaConectado: espService.estaConectado(),
  };
};
