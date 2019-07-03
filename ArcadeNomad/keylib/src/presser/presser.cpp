#ifdef _WIN32
#include "presser.h"

#include <windows.h>

INPUT CreateInput(short keyCode, bool press) {
    INPUT ip;
    ip.type = INPUT_KEYBOARD;
    ip.ki.wScan = 0;
    ip.ki.time = 0;
    ip.ki.dwExtraInfo = 0;
    ip.ki.wVk = keyCode;
    ip.ki.dwFlags = press ? 0 : KEYEVENTF_KEYUP;
    return ip;
}

void Press(short keyCode) {
    auto press = CreateInput(keyCode, true);
    SendInput(1, &press, sizeof(INPUT));
}

void Release(short keyCode) {
    auto release = CreateInput(keyCode, false);
    SendInput(1, &release, sizeof(INPUT));
}

#endif
