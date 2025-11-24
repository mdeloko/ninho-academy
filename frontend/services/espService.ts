import { EspTelemetry, ConnectionStatus } from "../types";

// ===== MOCK SERVICE - Sem Web Serial =====
// Todo integrado manualmente após

let aoReceberTelemetria: ((dados: EspTelemetry) => void) | null = null;
let aoMudarStatus: ((status: ConnectionStatus) => void) | null = null;
let isConnectedMock = false;

const atualizarStatus = (status: ConnectionStatus) => {
  console.log("[MOCK ESP32] Status:", status);
  if (aoMudarStatus) aoMudarStatus(status);
};

const conectar = async () => {
  console.log("[MOCK ESP32] Conectando...");
  atualizarStatus("connecting");

  // Simular delay de conexão
  await new Promise((r) => setTimeout(r, 800));

  isConnectedMock = true;
  atualizarStatus("connected");
  console.log("[MOCK ESP32] Conectado com sucesso!");
};

const desconectar = async () => {
  console.log("[MOCK ESP32] Desconectando...");
  isConnectedMock = false;
  atualizarStatus("disconnected");
  console.log("[MOCK ESP32] Desconectado!");
};

const enviarComando = async (comando: string, payload: any) => {
  if (!isConnectedMock) {
    console.warn("[MOCK ESP32] Não conectado. Comando ignorado:", comando);
    return;
  }

  console.log("[MOCK ESP32] Comando enviado:", { tipo: comando, ...payload });

  // Simular resposta com telemetria aleatória
  if (comando === "SET_MISSION") {
    setTimeout(() => {
      if (aoReceberTelemetria) {
        aoReceberTelemetria({
          type: "TELEMETRY",
          userId: "mock-user",
          deviceId: "mock-device",
          timestamp: Date.now(),
          readings: {
            gpio: {
              led: { mode: "output", value: Math.random() > 0.5 ? 1 : 0 },
              btn: { mode: "input", value: Math.random() > 0.7 ? 1 : 0 },
            },
            adc: {
              pot: Math.floor(Math.random() * 1024),
            },
          },
        } as EspTelemetry);
      }
    }, 1000);
  }
};

const definirIdentidade = async (userId: string): Promise<void> => {
  console.log("[MOCK ESP32] Definindo identidade:", userId);

  if (!isConnectedMock) {
    await conectar();
  }

  // Simular confirmação
  await new Promise((r) => setTimeout(r, 500));
  console.log("[MOCK ESP32] Identidade definida com sucesso!");
};

export const espService = {
  conectar,
  desconectar,
  enviarComando,
  definirIdentidade,
  set onTelemetry(callback: ((dados: EspTelemetry) => void) | null) {
    aoReceberTelemetria = callback;
  },
  set onStatusChange(callback: ((status: ConnectionStatus) => void) | null) {
    aoMudarStatus = callback;
  },
};
