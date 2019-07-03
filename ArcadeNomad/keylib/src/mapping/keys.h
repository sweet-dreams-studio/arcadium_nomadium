#ifndef KEYMAP_KEYS_H
#define KEYMAP_KEYS_H
#ifdef _WIN32

#include <windows.h>
#include <map>

using namespace std;

const map<string, short>& getInternalKeysMapping();

#endif //_WIN32
#endif //KEYMAP_KEYS_H
