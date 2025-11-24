/*
 * ========================================
 * NINHO ACADEMY - FIRMWARE ESP32
 * ========================================
 *
 * Este firmware controla TODAS as missões práticas da plataforma.
 * Ele recebe comandos via Serial (JSON) e executa a lógica correspondente.
 *
 * Comunicação:
 * - Protocolo: JSON via Serial
 * - Baud Rate: 115200
 * - Comandos: SET_ID, SET_MISSION, GET_STATUS
 *
 * Hardware utilizado:
 * - LED no pino GPIO 2
 * - Botão no pino GPIO 4
 * - Potenciômetro no pino GPIO 34 (ADC)
 */

#include <Arduino.h>
#include "hardware_map.h"
#include "protocol.h"
#include "user_id_store.h"

// Instâncias globais para gerenciar protocolo e armazenamento de ID
UserIdStore userStore;
Protocol protocol;

// ========================================
// VARIÁVEIS GLOBAIS
// ========================================

// Missão atual sendo executada (ex: "MISSION_1_BLINK", "MISSION_2_TOGGLE")
String currentMission = "IDLE";

// Controle de telemetria periódica
unsigned long lastTelemetry = 0;
const unsigned long TELEMETRY_INTERVAL = 500; // Envia telemetria a cada 500ms

// ========================================
// VARIÁVEIS DE ESTADO DAS MISSÕES
// ========================================

// Para missões com LED piscando: guarda o momento da última mudança
unsigned long lastBlink = 0;

// Estado atual do LED (true = aceso, false = apagado)
bool ledState = false;

// Leitura atual do botão (HIGH ou LOW)
int buttonState = 0;

// Leitura anterior do botão (para detectar mudanças)
int lastButtonState = 0;

// Valor lido do potenciômetro (0 a 4095)
int potValue = 0;

// Estado de alternância (toggle) para Missão 2
// Quando o botão é pressionado, esse estado inverte (liga/desliga)
bool toggleState = false;

// ========================================
// MÁQUINA DE ESTADOS (Missões 4 e 5)
// ========================================

// Modo atual: 0 = Desligado, 1 = Aceso, 2 = Piscando
int mode = 0;

// Debounce: evita múltiplas leituras de um único aperto de botão
unsigned long lastDebounceTime = 0;
const unsigned long debounceDelay = 50; // 50ms de debounce

// ========================================
// SETUP - Executado UMA VEZ ao ligar
// ========================================
void setup() {
    // Inicia comunicação serial para receber comandos e enviar telemetria
    Serial.begin(115200);

    // Configura os pinos conforme o hardware
    pinMode(PIN_LED, OUTPUT);

    // Botão configurado como INPUT (assumimos resistor pull-down externo)
    // Se usar pull-up interno (INPUT_PULLUP), a lógica HIGH/LOW seria invertida
    pinMode(PIN_BUTTON, INPUT);

    // Inicializa o armazenamento persistente de userId (EEPROM)
    userStore.begin();
}

// ========================================
// LÓGICA DAS MISSÕES
// ========================================
// Esta função é chamada continuamente no loop()
// Ela decide qual comportamento executar baseado na missão atual
void handleMissionLogic() {
    // Captura o tempo atual (em milissegundos desde que o ESP32 ligou)
    unsigned long now = millis();

    // Lê o estado atual dos sensores/entradas
    buttonState = digitalRead(PIN_BUTTON);  // HIGH se pressionado, LOW se solto
    potValue = analogRead(PIN_POT);         // Valor de 0 a 4095

    // ==================================================
    // MODO IDLE - Estado inicial
    // ==================================================
    // Quando não há missão ativa, mantemos o LED apagado
    if (currentMission == "IDLE") {
        digitalWrite(PIN_LED, LOW);
    }

    // ==================================================
    // MISSÃO 1: LED SEMPRE ACESO
    // ==================================================
    // Conceito: Saída digital em nível HIGH constante
    else if (currentMission == "MISSION_1_ON") {
        digitalWrite(PIN_LED, HIGH);
    }

    // ==================================================
    // MISSÃO 1: LED PISCANDO
    // ==================================================
    // Objetivo: Alternar LED a cada 1 segundo (1000ms)
    // Conceito: Delay não-bloqueante usando millis()
    // Por que não usar delay()? Porque delay() trava o programa inteiro!
    else if (currentMission == "MISSION_1_BLINK") {
        // Verifica se passou 1 segundo desde a última mudança
        if (now - lastBlink >= 1000) {
            lastBlink = now;          // Atualiza o momento da última mudança
            ledState = !ledState;     // Inverte o estado (aceso ↔ apagado)

            // Aplica o novo estado ao pino
            digitalWrite(PIN_LED, ledState ? HIGH : LOW);
        }
    }

    // ==================================================
    // MISSÃO 2: BOTÃO COMO CAMPAINHA
    // ==================================================
    // Conceito: LED espelha o estado do botão em tempo real
    // Enquanto botão pressionado (HIGH), LED aceso. Quando solta, LED apaga.
    else if (currentMission == "MISSION_2_DOORBELL") {
        digitalWrite(PIN_LED, buttonState);
    }

    // ==================================================
    // MISSÃO 2: BOTÃO COMO INTERRUPTOR (TOGGLE)
    // ==================================================
    // Conceito: Cada aperto do botão ALTERNA o estado do LED
    // O LED fica aceso até o próximo aperto, então apaga, e assim por diante.
    else if (currentMission == "MISSION_2_TOGGLE") {
        // Detecta borda de subida: botão estava solto (LOW) e agora foi pressionado (HIGH)
        // O debounce evita que um único aperto seja contado múltiplas vezes
        if (buttonState == HIGH && lastButtonState == LOW && (now - lastDebounceTime > debounceDelay)) {
            toggleState = !toggleState;   // Inverte o estado do toggle
            lastDebounceTime = now;       // Marca o momento para debounce
        }

        // Aplica o estado de toggle ao LED
        digitalWrite(PIN_LED, toggleState ? HIGH : LOW);
    }

    // ==================================================
    // MISSÃO 3: LEITURA DE POTENCIÔMETRO
    // ==================================================
    // Apenas envia telemetria do valor lido, sem controlar o LED
    // Mantemos LED apagado para não confundir visualmente
    else if (currentMission == "MISSION_3_READ") {
        digitalWrite(PIN_LED, LOW);
    }

    // ==================================================
    // MISSÃO 3: CONTROLE DE BRILHO COM PWM
    // ==================================================
    // Conceito: Potenciômetro controla intensidade do LED via PWM
    // O ADC do ESP32 retorna valores de 0 a 4095 (12 bits)
    // PWM trabalha com valores de 0 a 255 (8 bits)
    // Por isso usamos map() para converter a escala
    else if (currentMission == "MISSION_3_PWM") {
        // Converte valor do ADC (0-4095) para valor de PWM (0-255)
        int pwmValue = map(potValue, 0, 4095, 0, 255);

        // Aplica o PWM ao LED (0 = apagado, 255 = brilho máximo)
        analogWrite(PIN_LED, pwmValue);
    }

    // ==================================================
    // MISSÃO 4: MÁQUINA DE ESTADOS (3 MODOS)
    // ==================================================
    // Conceito: O botão cicla entre 3 modos de operação
    // Modo 0: LED desligado
    // Modo 1: LED sempre ligado
    // Modo 2: LED piscando (200ms on/off)
    else if (currentMission == "MISSION_4_STATE_MACHINE") {
        // A cada aperto do botão, avançamos para o próximo modo
        if (buttonState == HIGH && lastButtonState == LOW && (now - lastDebounceTime > debounceDelay)) {
            mode++;                     // Incrementa o modo
            if (mode > 2) mode = 0;    // Quando passa de 2, volta para 0 (ciclo circular)
            lastDebounceTime = now;     // Atualiza debounce
        }

        // Executa comportamento baseado no modo atual
        if (mode == 0) {
            // Modo 0: Desligado
            digitalWrite(PIN_LED, LOW);
        }
        else if (mode == 1) {
            // Modo 1: Sempre ligado
            digitalWrite(PIN_LED, HIGH);
        }
        else if (mode == 2) {
            // Modo 2: Piscando a cada 200ms (pisca mais rápido que Missão 1)
            if (now - lastBlink >= 200) {
                lastBlink = now;
                ledState = !ledState;
                digitalWrite(PIN_LED, ledState ? HIGH : LOW);
            }
        }
    }

    // ==================================================
    // MISSÃO 5: PROJETO FINAL
    // ==================================================
    // Similar à Missão 4, mas o modo 2 pisca AINDA MAIS RÁPIDO (100ms)
    // Isso simula diferentes modos de alerta ou funcionamento
    // Modo 0: Escuro (desligado)
    // Modo 1: Luz Normal (sempre ligado)
    // Modo 2: Alerta (pisca rápido)
    else if (currentMission == "MISSION_5_FINAL") {
        // Avança modo a cada aperto do botão
        if (buttonState == HIGH && lastButtonState == LOW && (now - lastDebounceTime > debounceDelay)) {
            mode++;
            if (mode > 2) mode = 0;
            lastDebounceTime = now;
        }

        // Executa comportamento do modo
        if (mode == 0) {
            // Modo 0: Escuro
            digitalWrite(PIN_LED, LOW);
        }
        else if (mode == 1) {
            // Modo 1: Luz Normal
            digitalWrite(PIN_LED, HIGH);
        }
        else if (mode == 2) {
            // Modo 2: Alerta (pisca MUITO rápido - 100ms)
            if (now - lastBlink >= 100) {
                lastBlink = now;
                ledState = !ledState;
                digitalWrite(PIN_LED, ledState ? HIGH : LOW);
            }
        }
    }

    // Atualiza o estado anterior do botão para a próxima iteração
    // Isso é essencial para detectar mudanças (bordas de subida/descida)
    lastButtonState = buttonState;
}

// ========================================
// LOOP - Executado CONTINUAMENTE
// ========================================
// O loop() roda infinitamente enquanto o ESP32 está ligado
// Aqui processamos comandos Serial, executamos lógica das missões e enviamos telemetria
void loop() {
    // ========================================
    // 1. PROCESSAR COMANDOS RECEBIDOS VIA SERIAL
    // ========================================
    // Verifica se há dados disponíveis na Serial (comandos JSON da plataforma)
    if (Serial.available()) {
        // Lê uma linha completa até encontrar '\n' (quebra de linha)
        String line = Serial.readStringUntil('\n');

        // Parser JSON: converte a string em um comando estruturado
        Protocol::Command cmd = protocol.parse(line);

        // Se o comando for válido (JSON bem formado), processa
        if (cmd.valid) {
            // --------------------------------------------------
            // COMANDO: SET_ID
            // --------------------------------------------------
            // Define o ID do usuário e armazena na EEPROM (memória persistente)
            // Exemplo: {"type": "SET_ID", "userId": "abc123"}
            if (cmd.type == "SET_ID") {
                userStore.setUserId(cmd.userId);
                protocol.sendAck("SET_ID");  // Confirma recebimento
            }

            // --------------------------------------------------
            // COMANDO: SET_MISSION
            // --------------------------------------------------
            // Muda a missão ativa e reseta estados para começar limpo
            // Exemplo: {"type": "SET_MISSION", "missionId": "MISSION_1_BLINK"}
            else if (cmd.type == "SET_MISSION") {
                currentMission = cmd.missionId;  // Atualiza missão

                // Reseta variáveis de estado para evitar comportamento estranho
                ledState = false;
                toggleState = false;
                mode = 0;

                protocol.sendAck("SET_MISSION");  // Confirma mudança
            }

            // --------------------------------------------------
            // COMANDO: GET_STATUS
            // --------------------------------------------------
            // Envia telemetria imediata (fora do ciclo periódico)
            // Exemplo: {"type": "GET_STATUS"}
            else if (cmd.type == "GET_STATUS") {
                protocol.sendTelemetry(
                    userStore.getUserId(),
                    currentMission,
                    digitalRead(PIN_LED),
                    digitalRead(PIN_BUTTON),
                    analogRead(PIN_POT)
                );
            }
        }
        // Caso o JSON seja inválido, poderíamos enviar erro (comentado)
        // else {
        //     protocol.sendError("Invalid JSON");
        // }
    }

    // ========================================
    // 2. EXECUTAR LÓGICA DA MISSÃO ATUAL
    // ========================================
    // Chama a função que controla o comportamento do LED/sensores
    handleMissionLogic();

    // ========================================
    // 3. ENVIAR TELEMETRIA PERIÓDICA
    // ========================================
    // A cada 500ms, envia automaticamente o estado dos sensores para a plataforma
    // Isso permite que o frontend monitore em tempo real o que está acontecendo
    if (millis() - lastTelemetry >= TELEMETRY_INTERVAL) {
        lastTelemetry = millis();  // Atualiza timestamp

        // Envia JSON com estado atual: LED, botão, potenciômetro
        protocol.sendTelemetry(
            userStore.getUserId(),
            currentMission,
            digitalRead(PIN_LED),
            digitalRead(PIN_BUTTON),
            analogRead(PIN_POT)
        );
    }
}
