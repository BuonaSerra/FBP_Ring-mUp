document.getElementById('transcript_test').addEventListener('click', transcriptTest); //start functie postData, zodra op de knop is geklikt
import { Client } from "@gradio/client";
import { ref } from 'vue';

const recorder = ref(null);
const playback = ref(document.createElement('audio'));
const isRecording = ref(false);
const recordedChunks = ref([]);

const startRecording = async () => {
  console.log('startRecording');
  
  recordedChunks.value = [];

  const preferedDeviceLabel = "Trust";

  const devices = await navigator.mediaDevices.enumerateDevices();
  const audioDevices = devices.filter(device => device.kind === 'audioinput');
  const deviceToUse = audioDevices.find(device => device.label.includes(preferedDeviceLabel)) || audioDevices[0];
  
  const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: deviceToUse ? deviceToUse.deviceId : undefined }
  });

  console.log("selected device", deviceToUse);

  recorder.value = new MediaRecorder(mediaStream);

  recorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) {
          recordedChunks.value.push(event.data);
      }
  };

  recorder.value.start();
  isRecording.value = true;
}

const stopRecording = async () => {
  console.log('stopRecording');

  if (recorder.value && recorder.value.state !== 'inactive') {
      recorder.value.stop();
  }

  isRecording.value = false;

  await new Promise((resolve) => setTimeout(resolve, 100)); // Ensures all data is available

  if (recordedChunks.value.length > 0) {
      const blob = new Blob(recordedChunks.value, { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      playback.value.src = url;
      transcriptTest(url);
  }

  if (recorder.value) {
      recorder.value.stream.getTracks().forEach(track => track.stop());
      recorder.value = null;
  }

  recordedChunks.value = [];

  
}

document.getElementById('start_recording').addEventListener('click', startRecording);
document.getElementById('stop_recording').addEventListener('click', stopRecording);

async function transcriptTest(input){
  console.log('transcription test started');

const client = new Client("http://127.0.0.1:7860/")

client.predict(
  mic_audio=input,
  file_format="txt",
  add_timestamp=True,
  progress="large-v2",
  param_4="Automatic Detection",
  param_5=False,
  param_6=5,
  param_7=-1,
  param_8=0.6,
  param_9="float16",
  param_10=5,
  param_11=1,
  param_12=True,
  param_13=0.5,
  param_14="",
  param_15=0,
  param_16=2.4,
  param_17=1,
  param_18=1,
  param_19=0,
  param_20="",
  param_21=True,
  param_22="[-1]",
  param_23=1,
  param_24=False,
  param_25="'“¿([{-",
  param_26="'.。,，!！?？:：”)]}、",
  param_27=0,
  param_28=30,
  param_29=0,
  param_30="",
  param_31=0,
  param_32=1,
  param_33=24,
  param_34=False,
  param_35=0.5,
  param_36=250,
  param_37=9999,
  param_38=1000,
  param_39=2000,
  param_40=False,
  param_41="cuda",
  param_42="",
  param_43=False,
  param_44="UVR-MDX-NET-Inst_HQ_4",
  param_45="cuda",
  param_46=256,
  param_47=False,
  param_48=True,
  api_name="/transcribe_mic"
)
/*try{
const client = await Client.connect("http://127.0.0.1:7860/");
const result = await client.predict("/transcribe_youtube", {
    youtube_link: "https://www.youtube.com/watch?v=MNJHu9zjpqg",
    file_format: "txt",
    add_timestamp: true,
    progress: "large-v2",
    param_4: "Automatic Detection",
    param_5: false,
    param_6: 5,
    param_7: -1,
    param_8: 0.6,
    param_9: "float16",
    param_10: 5,
    param_11: 1,
    param_12: true,
    param_13: 0.5,
    param_14: "",
    param_15: 0,
    param_16: 2.4,
    param_17: 1,
    param_18: 1,
    param_19: 0,
    param_20: "",
    param_21: true,
    param_22: "[-1]",
    param_23: 1,
    param_24: false,
    param_25: "'“¿([{-",
    param_26: "'.。,，!！?？:：”)]}、",
    param_27: 0,
    param_28: 30,
    param_29: 0,
    param_30: "",
    param_31: 0,
    param_32: 1,
    param_33: 24,
    param_34: false,
    param_35: 0.5,
    param_36: 250,
    param_37: 9999,
    param_38: 1000,
    param_39: 2000,
    param_40: false,
    param_41: "cuda",
    param_42: "",
    param_43: false,
    param_44: "UVR-MDX-NET-Inst_HQ_4",
    param_45: "cuda",
    param_46: 256,
    param_47: false,
    param_48: true,
});
console.log(result.data);

}catch (error) {
  console.error(error);
  // handle the error here
}*/


}
/*async function transcriptTest() {
    const url = 'http://127.0.0.1:7860/transcribe_file'; //api url + enpoint (/prompt), zie server.py in comfyui om andere endpoints te vinden
    try {
        const request2 = new Request(url, {
    method: "POST",
    body: JSON.stringify(),
    mic_audio: {"path":"D:\\pinokio\\api\\whisper-webui.git\\cache\\GRADIO_TEMP_DIR\\2ad2d7d964d34d9531f70405e80fe98f928c7ded94a9f1388483fa4a16eb3cc8\\audio.wav","url":"http://127.0.0.1:7860/gradio_api/file=D:\\pinokio\\api\\whisper-webui.git\\cache\\GRADIO_TEMP_DIR\\2ad2d7d964d34d9531f70405e80fe98f928c7ded94a9f1388483fa4a16eb3cc8\\audio.wav","orig_name":"audio.wav","size":211722,"is_stream":false,"mime_type":"","meta":{"_type":"gradio.FileData"}},
    file_format: "txt",
    add_timestamp: true,
    progress: "large-v2",
    param_4: "Automatic Detection",
    param_5: false,
    param_6: 5,
    param_7: -1,
    param_8: 0.6,
    param_9: "float16",
    param_10: 5,
    param_11: 1,
    param_12: true,
    param_13: 0.5,
    param_14: "",
    param_15: 0,
    param_16: 2.4,
    param_17: 1,
    param_18: 1,
    param_19: 0,
    param_20: "",
    param_21: true,
    param_22: "[-1]",
    param_23: 1,
    param_24: false,
    param_25: "'“¿([{-",
    param_26: "'.。,，!！?？:：”)]}、",
    param_27: 0,
    param_28: 30,
    param_29: 0,
    param_30: "",
    param_31: 0,
    param_32: 1,
    param_33: 24,
    param_34: false,
    param_35: 0.5,
    param_36: 250,
    param_37: 9999,
    param_38: 1000,
    param_39: 2000,
    param_40: false,
    param_41: "cuda",
    param_42: "",
    param_43: false,
    param_44: "UVR-MDX-NET-Inst_HQ_4",
    param_45: "cuda",
    param_46: 256,
    param_47: false,
    param_48: true,
  });
  
  console.log("Transcript test aangeroepen");

  const response = await fetch(request2);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const json = await response.json();
  console.log(json);
  return json;
  
} catch (error) {
  console.error(error.message);
}

    
     
  }*/


/*const Client = window.gradio.Client;
const app = Client.connect("http://127.0.0.1:7860/");
const api_info = await app.view_api();

console.log(api_info);*/

//document.getElementById('prompt_trigger').addEventListener('click', postData);

//function transcribe (){
/*const transcription = await client.predict(
  "/transcribe_mic", {
    mic_audio: {"path":"D:\\pinokio\\api\\whisper-webui.git\\cache\\GRADIO_TEMP_DIR\\2ad2d7d964d34d9531f70405e80fe98f928c7ded94a9f1388483fa4a16eb3cc8\\audio.wav","url":"http://127.0.0.1:7860/gradio_api/file=D:\\pinokio\\api\\whisper-webui.git\\cache\\GRADIO_TEMP_DIR\\2ad2d7d964d34d9531f70405e80fe98f928c7ded94a9f1388483fa4a16eb3cc8\\audio.wav","orig_name":"audio.wav","size":211722,"is_stream":false,"mime_type":"","meta":{"_type":"gradio.FileData"}},
    file_format: "txt",
    add_timestamp: true,
    progress: "large-v2",
    param_4: "Automatic Detection",
    param_5: false,
    param_6: 5,
    param_7: -1,
    param_8: 0.6,
    param_9: "float16",
    param_10: 5,
    param_11: 1,
    param_12: true,
    param_13: 0.5,
    param_14: "",
    param_15: 0,
    param_16: 2.4,
    param_17: 1,
    param_18: 1,
    param_19: 0,
    param_20: "",
    param_21: true,
    param_22: "[-1]",
    param_23: 1,
    param_24: false,
    param_25: "'“¿([{-",
    param_26: "'.。,，!！?？:：”)]}、",
    param_27: 0,
    param_28: 30,
    param_29: 0,
    param_30: "",
    param_31: 0,
    param_32: 1,
    param_33: 24,
    param_34: false,
    param_35: 0.5,
    param_36: 250,
    param_37: 9999,
    param_38: 1000,
    param_39: 2000,
    param_40: false,
    param_41: "cuda",
    param_42: "",
    param_43: false,
    param_44: "UVR-MDX-NET-Inst_HQ_4",
    param_45: "cuda",
    param_46: 256,
    param_47: false,
    param_48: true,
});
//};*/


						