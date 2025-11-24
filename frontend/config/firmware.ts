/**
 * Configuração do firmware
 * Deve ser atualizada sempre que o firmware for modificado
 */

export const FIRMWARE_CONFIG = {
  // Versão esperada do firmware
  version: '1.0.0',

  // Build number
  build: 1,

  // Path do arquivo de firmware
  path: '/firmware/ninho-academy.bin',

  // Offset de gravação no ESP32
  flashOffset: 0x10000,
};
