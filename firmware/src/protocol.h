#ifndef PROTOCOL_H
#define PROTOCOL_H

#include <Arduino.h>
#include <ArduinoJson.h>

class Protocol {
public:
    struct Command {
        String type;
        String userId;
        String missionId;
        bool valid;
    };

    Command parse(const String& json);
    void sendTelemetry(const String& userId, const String& missionId, int ledState, int btnState, int potValue);
    void sendAck(const String& commandType);
    void sendError(const String& message);
    void sendVersion(const String& version, int build, const String& date);
};

#endif
