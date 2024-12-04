

//code from Google dev example https://developer.chrome.com/docs/capabilities/serial#read-port and electron example https://www.electronjs.org/docs/latest/tutorial/devices#web-serial-api
import {startRecording, stopRecording} from '../../features/Speech_transcription/transcribings.js';
export var uidAgent1;
export var uidAgent2;
export var uidAgent3;
export var uidAgent4;


class LineBreakTransformer {
  constructor() {
    // A container for holding stream data until a new line.
    this.chunks = "";
  }

  transform(chunk, controller) {
    // Append new chunks to existing chunks.
    this.chunks += chunk;
    // For each line breaks in chunks, send the parsed lines out.
    const lines = this.chunks.split("\r\n");
    this.chunks = lines.pop();
    lines.forEach((line) => controller.enqueue(line));
  }

  flush(controller) {
    // When the stream is closed, flush any remaining chunks out.
    controller.enqueue(this.chunks);
  }
}
async function testIt () {
  document.getElementById("instructions").style.display = "block";
  document.getElementById("start").style.display = "none";
    const filters = [
        { usbVendorId: 0x2341, usbProductId: 0x0042 }
    ]

    try {
        const port = await navigator.serial.requestPort({ filters })
        await port.open({ baudRate: 9600, bufferSize: 1024 });

        //const reader = port.readable.getReader();
        const textDecoder = new TextDecoderStream();
        const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
        const reader = textDecoder.readable
          .pipeThrough(new TransformStream(new LineBreakTransformer()))
          .getReader();
        // Listen to data coming from the serial device.
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            // Allow the serial port to be closed later.
            reader.releaseLock();
            break;
          }
          
          // value is a Uint8Array.
          //console.log(value);
          if (value == "start"){
            console.log("start recording");
            document.getElementById("recording").style.display = "block";
            document.getElementById("instructions").style.display = "none";
            document.getElementById("results").style.display = "none";
            startRecording();
          }else if(value == "stop"){
            console.log("stop recording");
            document.getElementById("reflecting").style.display = "block";
            document.getElementById("recording").style.display = "none";
            document.getElementById("results").style.display = "none";
            stopRecording();
            setTimeout(() => {
              document.getElementById("reflecting").style.display = "none";
              document.getElementById("results").style.display = "flex";
            }, 180000); //3min: 180000 ms
            
          }else{
            if(value.substring(0,7)=="reader1"){
              console.log("it's reader 1: " + value.substring(7,value.length));
              uidAgent1= value.substring(7,value.length);
            } else if(value.substring(0,7)=="reader2"){
              console.log("it's reader 2: " + value.substring(7,value.length));
              uidAgent2= value.substring(7,value.length);
            } else if(value.substring(0,7)=="reader3"){
              console.log("it's reader 3: " + value.substring(7,value.length));
              uidAgent3= value.substring(7,value.length);
            }else if(value.substring(0,7)=="reader4"){
              console.log("it's reader 4: " + value.substring(7,value.length));
              uidAgent4= value.substring(7,value.length);
            }
            
            
            
          }
        }
        
        // const textDecoder = new TextDecoderStream();
        // const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
        // const reader = textDecoder.readable.getReader();
        // while (true) {
        //     const { value, done } = await reader.read();
        //     if (done) {
        //       // Allow the serial port to be closed later.
        //       reader.releaseLock();
        //       break;
        //     }
        //     // value is a Uint8Array.
        //     console.log(value);
        //   }
        const portInfo = port.getInfo()
        //document.getElementById('device-name').innerHTML = `vendorId: ${portInfo.usbVendorId} | productId: ${portInfo.usbProductId} `
      } catch (ex) {
        if (ex.name === 'NotFoundError') {
            console.error('No device found');
          //document.getElementById('device-name').innerHTML = 'Device NOT found'
         } //else {
        //   document.getElementById('device-name').innerHTML = ex
        // }
      }
    }

    

    


document.getElementById('serial_test').addEventListener('click', testIt)