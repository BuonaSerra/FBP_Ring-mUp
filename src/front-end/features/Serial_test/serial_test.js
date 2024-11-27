

//code from Google dev example https://developer.chrome.com/docs/capabilities/serial#read-port and electron example https://www.electronjs.org/docs/latest/tutorial/devices#web-serial-api
//testIt();
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
          console.log(value);
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