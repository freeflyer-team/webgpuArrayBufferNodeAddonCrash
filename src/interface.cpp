#include <napi.h>
#include <cassert>

//Copy the source buffer into the dest buffer
void update_array_buffer(const Napi::CallbackInfo& info) {
   auto env = info.Env();

   assert(info.Length() == 2);

   //first arg is source buffer
   assert(info[0].IsTypedArray());
   auto src = info[0].As<Napi::Float32Array>();

   //second arg is dest array buffer
   assert(info[1].IsArrayBuffer());
   auto dst = info[1].As<Napi::ArrayBuffer>();

   auto src_bytes = src.ByteLength();
   auto src_ptr = src.Data();

   assert(src.ByteOffset() == 0);

   auto dst_bytes = dst.ByteLength();
   auto dst_ptr = dst.Data();

   assert(src_bytes == dst_bytes);

   memcpy(dst_ptr, src_ptr, dst_bytes);
}

//Initialize the addon
Napi::Object Init(Napi::Env env, Napi::Object exports){
   exports.Set(Napi::String::New(env, "update_array_buffer"), Napi::Function::New(env, update_array_buffer));

   return exports;
}

NODE_API_MODULE(addon,Init)
