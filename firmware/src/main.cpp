#include <Arduino.h>
#include "hardware_map.h"
#include "protocol.h"
#include "user_id_store.h"

UserIdStore userStore;
Protocol protocol;

String currentMission = "IDLE";
unsigned long lastTelemetry = 0;
const unsigned long TELEMETRY_INTERVAL = 500;

// Variáveis de estado das missões
unsigned long lastBlink = 0;
bool ledState = false;
int buttonState = 0;
int lastButtonState = 0;
int potValue = 0;

// Estado para missão de alternância (toggle)
bool toggleState = false;

// Máquina de estados para missões 4 e 5
int mode = 0;
unsigned long lastDebounceTime = 0;
unsigned long debounceDelay = 50;

void setup() {
    Serial.begin(115200);
    
    pinMode(PIN_LED, OUTPUT);
    pinMode(PIN_BUTTON, INPUT); // Assumimos resistor externo (pull-down) conforme descrição de uso pull-up/pull-down.
    // Caso se adote o pull-up interno do ESP32, trocar para INPUT_PULLUP e inverter lógica de leitura.
    // A Missão 2 descreve uso simples de INPUT para reforçar o conceito de nível lógico.

    userStore.begin();
}

void handleMissionLogic() {
    unsigned long now = millis();
    buttonState = digitalRead(PIN_BUTTON);
    potValue = analogRead(PIN_POT);

    if (currentMission == "IDLE") {
        digitalWrite(PIN_LED, LOW);
    }
    else if (currentMission == "MISSION_1_ON") {
        digitalWrite(PIN_LED, HIGH);
    }
    else if (currentMission == "MISSION_1_BLINK") {
        if (now - lastBlink >= 1000) {
            lastBlink = now;
            ledState = !ledState;
            digitalWrite(PIN_LED, ledState ? HIGH : LOW);
        }
    }
    else if (currentMission == "MISSION_2_DOORBELL") {
        digitalWrite(PIN_LED, buttonState);
    }
    else if (currentMission == "MISSION_2_TOGGLE") {
        if (buttonState == HIGH && lastButtonState == LOW && (now - lastDebounceTime > debounceDelay)) {
            toggleState = !toggleState;
            lastDebounceTime = now;
        }
        digitalWrite(PIN_LED, toggleState ? HIGH : LOW);
    }
    else if (currentMission == "MISSION_3_READ") {
        // Apenas telemetria; mantemos LED apagado para não gerar ambiguidade visual.
        digitalWrite(PIN_LED, LOW);
    }
    else if (currentMission == "MISSION_3_PWM") {
        // Conversão ADC (0-4095) para faixa de PWM de 8 bits (0-255) para obter variação de brilho perceptível.
        int pwmValue = map(potValue, 0, 4095, 0, 255);
        analogWrite(PIN_LED, pwmValue);
    }
    else if (currentMission == "MISSION_4_STATE_MACHINE") {
        if (buttonState == HIGH && lastButtonState == LOW && (now - lastDebounceTime > debounceDelay)) {
            mode++;
            if (mode > 2) mode = 0;
            // Incrementamos modo e retornamos a 0 para reforçar ciclo finito (3 estados) e facilitar entendimento didático.
            lastDebounceTime = now;
        }

        if (mode == 0) {
            digitalWrite(PIN_LED, LOW);
        } else if (mode == 1) {
            digitalWrite(PIN_LED, HIGH);
        } else if (mode == 2) {
            if (now - lastBlink >= 200) {
                lastBlink = now;
                ledState = !ledState;
                digitalWrite(PIN_LED, ledState ? HIGH : LOW);
            }
        }
    }
    else if (currentMission == "MISSION_5_FINAL") {
        // Semelhante à missão 4, porém modo 2 pisca mais rápido.
        // Descrição: Modo 0: Off, Modo 1: On, Modo 2: Blink rápido.
        if (buttonState == HIGH && lastButtonState == LOW && (now - lastDebounceTime > debounceDelay)) {
            mode++;
            if (mode > 2) mode = 0;
            // Projeto final reutiliza mesma mecânica para consolidar conceito de máquina de estados simples.
            lastDebounceTime = now;
        }

        if (mode == 0) {
            digitalWrite(PIN_LED, LOW);
        } else if (mode == 1) {
            digitalWrite(PIN_LED, HIGH);
        } else if (mode == 2) {
            if (now - lastBlink >= 100) { // Faster blink
                lastBlink = now;
                ledState = !ledState;
                digitalWrite(PIN_LED, ledState ? HIGH : LOW);
            }
        }
    }

    lastButtonState = buttonState;
}

void loop() {
    // Handle Serial Commands
    if (Serial.available()) {
        String line = Serial.readStringUntil('\n');
        Protocol::Command cmd = protocol.parse(line);

        if (cmd.valid) {
            if (cmd.type == "SET_ID") {
                userStore.setUserId(cmd.userId);
                protocol.sendAck("SET_ID");
            }
            else if (cmd.type == "SET_MISSION") {
                currentMission = cmd.missionId;
                // Reset states
                ledState = false;
                toggleState = false;
                mode = 0;
                protocol.sendAck("SET_MISSION");
            }
            else if (cmd.type == "GET_STATUS") {
                // Send immediate telemetry
                protocol.sendTelemetry(userStore.getUserId(), currentMission, digitalRead(PIN_LED), digitalRead(PIN_BUTTON), analogRead(PIN_POT));
            }
        } else {
            // protocol.sendError("Invalid JSON");
        }
    }

    handleMissionLogic();

    // Periodic Telemetry
    if (millis() - lastTelemetry >= TELEMETRY_INTERVAL) {
        lastTelemetry = millis();
        protocol.sendTelemetry(userStore.getUserId(), currentMission, digitalRead(PIN_LED), digitalRead(PIN_BUTTON), analogRead(PIN_POT));
    }
}
