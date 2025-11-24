#include <Arduino.h>
#include <ArduinoJson.h>
#include <Preferences.h>

// ==========================
// CONFIGURAÇÕES DE HARDWARE
// ==========================

const int PIN_LED = 2;  // ajuste se necessário

// ==========================
// VERSÃO REAL DO PROJETO
// ==========================

const char* FIRMWARE_VERSION = "1.0.0";
const int   FIRMWARE_BUILD   = 1;
const char* FIRMWARE_DATE    = "2025-11-24";

// ==========================
// ARMAZENAMENTO DO USER ID
// ==========================

Preferences preferences;

String getUserId() {
  preferences.begin("ninho", true);
  String id = preferences.getString("userId", "");
  preferences.end();
  return id;
}

void setUserId(const String& id) {
  preferences.begin("ninho", false);
  preferences.putString("userId", id);
  preferences.end();
}

// ==========================
// STRUCT DE COMANDO
// ==========================

struct Command {
  String type;
  String userId;
  String missionId;
  bool valid;
};

// ==========================
// PROTÓTIPOS
// ==========================

Command parseCommand(const String& json);
void sendAck(const String& commandType);
void sendError(const String& message);
void sendTelemetry();
void sendVersion();
void handleMissionLogic();

// ==========================
// ESTADO
// ==========================

String currentMission = "IDLE";

bool ledState = false;
unsigned long lastBlink = 0;
const unsigned long BLINK_INTERVAL = 200;  // pisca rápido/forte

unsigned long lastTelemetry = 0;
const unsigned long TELEMETRY_INTERVAL = 500;

// ==========================
// PARSER DE COMANDOS
// ==========================

Command parseCommand(const String& json) {
  Command cmd;
  cmd.valid = false;

  StaticJsonDocument<256> doc;
  DeserializationError err = deserializeJson(doc, json);

  if (err) return cmd;

  cmd.type = doc["type"] | "";
  cmd.userId = doc["userId"] | "";
  cmd.missionId = doc["missionId"] | "";
  cmd.valid = true;

  return cmd;
}

// ==========================
// RESPOSTAS DO PROTOCOLO
// ==========================

void sendAck(const String& commandType) {
  StaticJsonDocument<128> doc;
  doc["type"] = "ACK";
  doc["command"] = commandType;
  serializeJson(doc, Serial);
  Serial.println();
}

void sendError(const String& message) {
  StaticJsonDocument<128> doc;
  doc["type"] = "ERROR";
  doc["message"] = message;
  serializeJson(doc, Serial);
  Serial.println();
}

void sendTelemetry() {
  StaticJsonDocument<256> doc;

  doc["type"] = "TELEMETRY";
  doc["userId"] = getUserId();
  doc["missionId"] = currentMission;

  JsonObject readings = doc.createNestedObject("readings");
  readings["led"] = ledState ? 1 : 0;
  readings["btn"] = 0;
  readings["pot"] = 0;

  serializeJson(doc, Serial);
  Serial.println();
}

void sendVersion() {
  StaticJsonDocument<256> doc;

  doc["type"] = "VERSION";
  doc["version"] = FIRMWARE_VERSION;
  doc["build"] = FIRMWARE_BUILD;
  doc["date"] = FIRMWARE_DATE;

  serializeJson(doc, Serial);
  Serial.println();
}

// ==========================
// MISSÃO FAKE
// ==========================

void handleMissionLogic() {
  unsigned long now = millis();

  if (currentMission == "IDLE") {
    ledState = false;
    digitalWrite(PIN_LED, LOW);
  }

  else if (currentMission == "MISSION_1_BLINK") {
    if (now - lastBlink >= BLINK_INTERVAL) {
      lastBlink = now;
      ledState = !ledState;
      digitalWrite(PIN_LED, ledState ? HIGH : LOW);
    }
  }

  else {
    ledState = false;
    digitalWrite(PIN_LED, LOW);
  }
}

// ==========================
// SETUP
// ==========================

void setup() {
  Serial.begin(115200);
  delay(300);

  pinMode(PIN_LED, OUTPUT);
  digitalWrite(PIN_LED, LOW);

  Serial.println("Ninho Fake Firmware (versao real) iniciado");
}

// ==========================
// LOOP PRINCIPAL
// ==========================

void loop() {
  // === 1) Processa JSON recebido ===
  if (Serial.available()) {
    String line = Serial.readStringUntil('\n');
    line.trim();

    if (line.length() > 0) {
      Command cmd = parseCommand(line);

      if (!cmd.valid) {
        sendError("Invalid JSON");
      }

      else if (cmd.type == "SET_ID") {
        if (cmd.userId.length() > 0) {
          setUserId(cmd.userId);
          sendAck("SET_ID");
        } else sendError("Missing userId");
      }

      else if (cmd.type == "SET_MISSION") {
        if (cmd.missionId == "MISSION_1_BLINK" || cmd.missionId == "IDLE") {
          currentMission = cmd.missionId;
          ledState = false;
          lastBlink = millis();
          digitalWrite(PIN_LED, LOW);
          sendAck("SET_MISSION");
        } else {
          sendError("Unsupported mission");
        }
      }

      else if (cmd.type == "GET_STATUS") {
        sendTelemetry();
      }

      else if (cmd.type == "GET_VERSION") {
        sendVersion();
      }

      else {
        sendError("Unknown command");
      }
    }
  }

  // === 2) Executa lógica da missão ===
  handleMissionLogic();

  // === 3) Telemetria periódica ===
  if (millis() - lastTelemetry >= TELEMETRY_INTERVAL) {
    lastTelemetry = millis();
    sendTelemetry();
  }
}
