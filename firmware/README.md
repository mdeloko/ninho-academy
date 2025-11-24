# Ninho Academy - Firmware ESP32

Firmware único para todas as missões práticas da plataforma Ninho Academy.

## 📋 Pré-requisitos

- **PlatformIO Core** (CLI)
  - Instalação: `pip install platformio`
  - Ou via VSCode: Extension "PlatformIO IDE"
- **Python 3.7+** (para PlatformIO)

## 🔧 Build via CLI

### Compilar o firmware

```bash
cd firmware
pio run -e esp32dev
```

### Artefato gerado

O arquivo binário estará disponível em:
```
firmware/.pio/build/esp32dev/firmware.bin
```

### Fazer upload direto (se ESP32 conectado)

```bash
pio run -e esp32dev -t upload
```

## 📦 Estrutura do Projeto

```
/firmware
├── platformio.ini          # Configuração PlatformIO
├── src/
│   ├── main.cpp           # Loop principal e lógica das missões
│   ├── protocol.cpp/h     # Protocolo JSON via Serial
│   ├── hardware_map.h     # Mapeamento de pinos
│   ├── telemetry.cpp/h    # Envio de telemetria
│   └── user_id_store.cpp/h # Armazenamento de userId
└── README.md
```

## 🎯 Missões Implementadas

O firmware suporta as seguintes missões (comandos):

| Level | Firmware Command         | Descrição                        |
|-------|--------------------------|----------------------------------|
| 0     | `INTRO`                 | Teórica (sem hardware)           |
| 1     | `MISSION_1_BLINK`       | LED piscando (1s on/off)         |
| 2     | `MISSION_2_TOGGLE`      | Botão como interruptor (toggle)  |
| 3     | `MISSION_3_PWM`         | Potenciômetro controla brilho    |
| 4     | `MISSION_4_STATE_MACHINE` | Máquina de 3 estados           |
| 5     | `MISSION_5_FINAL`       | Projeto final (3 modos)          |

## 📡 Protocolo de Comunicação

Comunicação via Serial (115200 baud) usando JSON.

### Comandos aceitos (Frontend → ESP32)

```json
{"type": "SET_ID", "userId": "abc123"}
{"type": "SET_MISSION", "missionId": "MISSION_1_BLINK"}
{"type": "GET_STATUS"}
```

### Respostas (ESP32 → Frontend)

```json
{"type": "ACK", "command": "SET_MISSION"}
{"type": "TELEMETRY", "userId": "abc123", "missionId": "MISSION_1_BLINK", "readings": {"led": 1, "btn": 0, "pot": 2048}}
{"type": "ERROR", "message": "Invalid command"}
```

## 🔌 Hardware

### Pinagem

| Componente      | Pino ESP32 | Descrição                |
|-----------------|------------|--------------------------|
| LED             | GPIO 2     | Saída digital            |
| Botão           | GPIO 4     | Entrada digital          |
| Potenciômetro   | GPIO 34    | Entrada analógica (ADC)  |

### Esquema de Conexão

```
LED:
- Perna maior → Resistor 220Ω → GPIO 2
- Perna menor → GND

Botão:
- Um lado → GPIO 4
- Outro lado → 3V3
- Resistor 10kΩ (pull-down): GPIO 4 → GND

Potenciômetro:
- Pino central → GPIO 34
- Pino esquerdo → GND
- Pino direito → 3V3
```

## 🚀 Uso na Plataforma

1. O frontend carrega o arquivo `.bin` gerado
2. Usuário conecta ESP32 via USB
3. Frontend faz flash do firmware usando Web Serial API
4. ESP32 reinicia com o firmware carregado
5. Frontend envia comandos JSON via Serial
6. ESP32 responde com ACK e telemetria periódica

## 🐛 Debug

### Monitor Serial

```bash
pio device monitor -b 115200
```

### Limpar build

```bash
pio run -t clean
```

## 📚 Dependências

- **ArduinoJson** v6.21.3 (gerenciamento automático pelo PlatformIO)

## 📝 Notas

- Telemetria é enviada a cada 500ms automaticamente
- userId é armazenado na EEPROM para persistência
- Todas as missões usam o mesmo firmware (decisão por `missionId`)
- O código está amplamente comentado para fins educacionais
