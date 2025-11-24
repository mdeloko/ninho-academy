/**
 * ESPTool - COPIADO EXATAMENTE do exemplo-esp32-opensource/src/lib/esp.js
 * Apenas convertido para TypeScript, mantendo a lógica 100% idêntica
 */

// Tipos básicos
export interface LogConfig {
  log: (...args: any[]) => void;
  debug: (...args: any[]) => void;
  error: (...args: any[]) => void;
  baudRate: number;
}

/**
 * Conecta ao ESP - LÓGICA EXATA DO OPEN SOURCE
 */
export const connectESP = async (config: LogConfig) => {
  const esploaderMod = await window.esptoolPackage;
  const port = await (navigator as any).serial.requestPort();

  config.log('Connecting...');

  await port.open({
    baudRate: config.baudRate
  });

  config.log('Connected successfully.');

  return new esploaderMod.ESPLoader(port, config);
};

/**
 * Formata MAC Address - EXATO DO OPEN SOURCE
 */
export const formatMacAddr = (macAddr: number[]): string => {
  return macAddr.map((value) => value.toString(16).toUpperCase().padStart(2, '0')).join(':');
};

/**
 * Sleep - EXATO DO OPEN SOURCE
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Verifica suporte - EXATO DO OPEN SOURCE
 */
export const supported = (): boolean => {
  return ('serial' in navigator);
};
