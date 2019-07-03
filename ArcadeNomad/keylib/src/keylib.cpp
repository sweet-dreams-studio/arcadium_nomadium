#include <nan.h>
#include "mapping/keys.h"
#include "presser/presser.h"

#ifdef _WIN32
using namespace std;

short GetKeyCode(const Nan::FunctionCallbackInfo<v8::Value>& info, bool* ok = nullptr)
{
   *ok = false;

   if (info.Length() != 1 || !info[0]->IsString()) {
      Nan::ThrowTypeError("The first argument must be a string");
      return 0;
   }

   auto keyJsString = info[0]->ToString();
   if (keyJsString->Length() <= 0) {
       Nan::ThrowTypeError("Bad argument");
       return 0;
   }

   v8::String::Utf8Value utf8String(keyJsString);
   auto keyStdString = string(*utf8String);
   auto keyMapping = getInternalKeysMapping();
   if (keyMapping.count(keyStdString) == 0) {
        Nan::ThrowTypeError("Unknown key");
        return 0;
   }

   *ok = true;
   return keyMapping[keyStdString];
}

void Click(const Nan::FunctionCallbackInfo<v8::Value>& info, bool press) {
    bool ok;
    auto keyCode = GetKeyCode(info, &ok);
    if (ok) {
        if (press) {
            Press(keyCode);
        } else {
            Release(keyCode);
        }
    }
    info.GetReturnValue().Set(ok);
}
#endif

void Press(const Nan::FunctionCallbackInfo<v8::Value>& info) {
#ifdef _WIN32
    Click(info, true);
#endif
}

void Release(const Nan::FunctionCallbackInfo<v8::Value>& info) {
#ifdef _WIN32
    Click(info, false);
#endif
}

void Init(v8::Local<v8::Object> exports) {
  exports->Set(Nan::New("press").ToLocalChecked(), Nan::New<v8::FunctionTemplate>(Press)->GetFunction());
  exports->Set(Nan::New("release").ToLocalChecked(), Nan::New<v8::FunctionTemplate>(Release)->GetFunction());
}

NODE_MODULE(hello, Init)
