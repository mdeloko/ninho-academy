#include "protocol.h"

Protocol::Command Protocol::parse(const String& json) {
    Command cmd;
    cmd.valid = false;

    StaticJsonDocument<512> doc;
    DeserializationError error = deserializeJson(doc, json);

    if (error) {
        return cmd;
    }

    cmd.type = doc["type"].as<String>();
    if (doc.containsKey("userId")) cmd.userId = doc["userId"].as<String>();
    if (doc.containsKey("missionId")) cmd.missionId = doc["missionId"].as<String>();
    cmd.valid = true;

    return cmd;
}

void Protocol::sendTelemetry(const String& userId, const String& missionId, int ledState, int btnState, int potValue) {
    StaticJsonDocument<256> doc;
    doc["type"] = "TELEMETRY";
    doc["userId"] = userId;
    doc["missionId"] = missionId;
    
    JsonObject readings = doc.createNestedObject("readings");
    readings["led"] = ledState;
    readings["btn"] = btnState;
    readings["pot"] = potValue;

    serializeJson(doc, Serial);
    Serial.println();
}

void Protocol::sendAck(const String& commandType) {
    StaticJsonDocument<128> doc;
    doc["type"] = "ACK";
    doc["command"] = commandType;
    serializeJson(doc, Serial);
    Serial.println();
}

void Protocol::sendError(const String& message) {
    StaticJsonDocument<128> doc;
    doc["type"] = "ERROR";
    doc["message"] = message;
    serializeJson(doc, Serial);
    Serial.println();
}

void Protocol::sendVersion(const String& version, int build, const String& date) {
    StaticJsonDocument<256> doc;
    doc["type"] = "VERSION";
    doc["version"] = version;
    doc["build"] = build;
    doc["date"] = date;
    serializeJson(doc, Serial);
    Serial.println();
}
