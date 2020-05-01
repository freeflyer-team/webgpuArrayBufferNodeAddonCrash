import { update_array_buffer } from './copy_to_webgpu_arraybuffer.node';

//Choose the version you want
//let copy_to_arraybuffer = copy_to_arraybuffer_nominal; //<-- Works
let copy_to_arraybuffer = copy_to_arraybuffer_addon; //<-- Crashes

//This version uses the regular js side interfaces
function copy_to_arraybuffer_nominal(src,dest){
  new Float32Array(dest).set(src);

  //Using the node addon function to copy 
  //a js created arraybuffer appears to work fine
  let ab = new ArrayBuffer(64);
  let fa = new Float32Array(16);

  update_array_buffer(fa,ab);
}

//This version uses does the copy in a node addon
function copy_to_arraybuffer_addon(src,dest){
  //copying the to the arraybuffer copying from webgpu
  //crashes after a few times
  update_array_buffer(src,dest);
}

async function init(canvas) {
  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter.requestDevice();

  const uniformBufferSize = 4 * 16; // 4x4 matrix

  const uniformBuffer = device.createBuffer({
    size: uniformBufferSize,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  return function frame() {
    const commandEncoder = device.createCommandEncoder();

    let mvp = new Float32Array(16);
    
    //Update the uniform mvp
    const [uploadBuffer, mapping] = device.createBufferMapped({
      size: mvp.byteLength,
      usage: GPUBufferUsage.COPY_SRC,
    });
  
    console.log("before copy");
    copy_to_arraybuffer(mvp,mapping);
    console.log("after copy");
  
    uploadBuffer.unmap();
    
    commandEncoder.copyBufferToBuffer(uploadBuffer, 0, uniformBuffer, 0, uniformBufferSize);

    device.defaultQueue.submit([commandEncoder.finish()]);
    uploadBuffer.destroy();

    requestAnimationFrame(frame);
  }
}

var is_running = false;

function main()
{
    //Hook this up so we can attach before this starts
    const canvas = document.getElementById("renderCanvas");

    canvas.addEventListener('click',
        () => {
        if(!is_running)
        {
            is_running = true;
            init(canvas).then((frame)=> requestAnimationFrame(frame));
        }});
}

main();