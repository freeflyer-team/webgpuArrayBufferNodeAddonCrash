# Repro of crash using WebGPU in electron-nightly with a C++ node addon

* Run by:
  * yarn install
  * yarn run build
  * yarn run start
* WebGPU spec: https://gpuweb.github.io/gpuweb/
* WebGPU has a method device.createBufferMapped
* This method returns an array containing a GPUBuffer and ArrayBuffer
* If you update this ArrayBuffer on the js side, it works as expected
* If you try to access this returned ArrayBuffer, you crash in napi_get_arraybuffer_info after a few iterations
* Note there's a bug in the rollup-plugin-native plugin on windows such that you need to fix the path to the copy_to_webgpu_arraybuffer.node file at the top of renderer.js to use forward slashes after running `yarn run build`
* This is what the crash callstack looks like:

```
electron.exe!v8::base::OS::Abort() Line 920	C++
electron.exe!V8_Fatal(const char * format=0x00007ff7d47e4e38, ...) Line 167	C++
electron.exe!v8::internal::GlobalBackingStoreRegistry::Register(std::__1::shared_ptr<v8::internal::BackingStore> backing_store={...}) Line 681	C++
electron.exe!v8::ArrayBuffer::GetContents(bool externalize) Line 7478	C++
electron.exe!v8::ArrayBuffer::GetContents() Line 7440	C++
electron.exe!napi_get_arraybuffer_info(napi_env__ * env=0x000002a53fd24830, napi_value__ * arraybuffer=0x000000f9eaefe100, void * * data=0x000000f9eaefda78, unsigned __int64 * byte_length=0x000000f9eaefda80) Line 2683	C++
copy_to_webgpu_arraybuffer.node!Napi::ArrayBuffer::EnsureInfo() Line 1420	C++
copy_to_webgpu_arraybuffer.node!Napi::ArrayBuffer::ByteLength() Line 1412	C++
copy_to_webgpu_arraybuffer.node!update_array_buffer(const Napi::CallbackInfo & info={...}) Line 23	C++
```