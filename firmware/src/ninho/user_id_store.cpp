#include "user_id_store.h"

void UserIdStore::begin() {
    preferences.begin("ninho", false);
}

void UserIdStore::setUserId(const String& id) {
    preferences.putString("userId", id);
}

String UserIdStore::getUserId() {
    return preferences.getString("userId", "");
}

bool UserIdStore::hasUserId() {
    return preferences.isKey("userId");
}
