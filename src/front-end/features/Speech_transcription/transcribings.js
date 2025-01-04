//This code builds upon the original typescript code of WesWeCan. (2024). mu-transformatielab/src/front-end/components/Recording.vue at main · WesWeCan/mu-transformatielab. GitHub. https://github.com/WesWeCan/mu-transformatielab/blob/main/src/front-end/components/Recording.vue
import { pipelineStuff } from '../../features/LLM_interaction/llm_test.js';
import { onMounted, ref, defineProps, defineEmits } from 'vue';
import { pipeline, env } from '@huggingface/transformers';

env.allowLocalModels = false;
env.allowRemoteModels = true;
 
const loadingModel = ref(false);
var conversationTranscript = ''; 
 
const numTranscribed = ref(0);

onMounted(async () => {
    numTranscribed.value = 0;
    console.log('Recording.vue mounted');
 
    checkWasmInCache();
    
 
    loadingModel.value = true;
    
    
    loadingModel.value = false;
    console.log('model loaded');
 
})

const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-base', {
    dtype: {
        encoder_model: 'fp32',
        decoder_model_merged: 'fp32',
    },
    device: 'webgpu'
});

 

 
async function checkWasmInCache() {
    if ('caches' in window) {
        try {
            const response = await fetch('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.0-alpha.19/dist/ort-wasm-simd-threaded.jsep.wasm', { cache: 'force-cache' });
            if (response.ok) {
                console.log('WASM file fetched from cache.');
            } else {
                console.log('WASM file not found in cache.');
 
                alert("AI Model not cached, connect to internet first.")
            }
        } catch (error) {
            console.log('Error fetching WASM file:', error);
            alert("AI Model not cached, connect to internet first.")
        }
    }
}
 
 

const recorder = ref(null);
const playback = ref(document.createElement('audio'));
const isRecording = ref(false);
const recordedChunks = ref([]);
 
export const startRecording = async () => {
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
 
export const stopRecording = async () => {
    console.log('stopRecording');
 
    if (recorder.value && recorder.value.state !== 'inactive') {
        recorder.value.stop();
    }
 
    isRecording.value = false;
 
    await new Promise((resolve) => setTimeout(resolve, 100)); // Ensures all data is available
 
    if (recordedChunks.value.length > 0) {
        const blob = new Blob(recordedChunks.value, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        playback.value.src = url;
    }
 
    if (recorder.value) {
        recorder.value.stream.getTracks().forEach(track => track.stop());
        recorder.value = null;
    }
 
    recordedChunks.value = [];
    await transcribe()
    pipelineStuff();
}
 
const transcribing = ref(false);
const transcribeOutput = ref('');
 
const transcribe = async () => {
    transcribing.value = true;
    transcribeOutput.value = '';
 
    const url = playback.value.src;
 
    try {
        let tempOutput = await transcriber(url, {
            language: 'dutch',
            task: 'transcribe',
            chunk_length_s: 30,
            stride_length_s: 5
        });
 
        transcribeOutput.value = tempOutput.text;
    } catch (error) {
        console.error('Error during transcription:', error);
        transcribeOutput.value = 'Transcription failed.';
    } finally {
        transcribing.value = false;
    }
 
 
 
    console.log(transcribeOutput.value);
    numTranscribed.value++;
    conversationTranscript = transcribeOutput.value;
    return conversationTranscript;
}

export {conversationTranscript};
