# Ninho de Pardais - Firmware

Este diretório contém o código fonte para o ESP32.

## Estrutura
- `main.cpp`: Lógica principal do loop e setup.
- `Protocolo`: JSON via Serial a 115200 baud.

## Como Flashear
1. Instale o PlatformIO.
2. Conecte o ESP32 via USB.
3. Execute `pio run -t upload`.
