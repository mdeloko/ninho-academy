#ifndef USER_ID_STORE_H
#define USER_ID_STORE_H

#include <Arduino.h>
#include <Preferences.h>

class UserIdStore {
public:
    void begin();
    void setUserId(const String& id);
    String getUserId();
    bool hasUserId();

private:
    Preferences preferences;
};

#endif
