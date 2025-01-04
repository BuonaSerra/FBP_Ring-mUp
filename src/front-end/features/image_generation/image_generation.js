//This code builts upon the original typescript code of WesWeCan. (2024b). volgspot-generative-agents-forge/src/front-end/assets/ComfyClient.ts at main · WesWeCan/volgspot-generative-agents-forge. GitHub. https://github.com/WesWeCan/volgspot-generative-agents-forge/blob/main/src/front-end/assets/ComfyClient.ts
import workflow from './workflow_api_v1.json' with {type: 'json'};


export var responseId = ""; //lege variabele waarin de promptid wordt gezet
export var remainingQueue;
var Reflection = "";
var Agent = "";



export const serverUrl = "127.0.0.1:8188";
let ws;
var datalog = [];


//open a websocket to be able to get status/execution messages
function openWebSocket(clientId) {
  ws = new WebSocket(`ws://${serverUrl}/ws?clientId=${clientId}`);
  ws.onopen = () => {
    console.log("WebSocket opened");
  }
  ws.onclose = () => {
    console.log("WebSocket closed");
  };
  ws.onmessage = (event) => {
    handleMessage(event.data);
  };
  
}


export async function handleMessage(message) { //receives and sorts any event message; depending on the case as defined below, a certain action is executed.
  if (typeof message === 'string') {
    message = JSON.parse(message);
  }
  switch (message.type) {
    case 'executing':
      if (message.data.node == null) {
        console.log("Execution done");
        console.log('start history');
        const imagesOutput = (await getImages(responseId)); //if the execution of the image generation is done, retrieve the images and execute convertImage to display the image in the DOM
        console.log(imagesOutput);
        convertImage(imagesOutput);
      }
      break;
    case 'execution_start':
      console.log("Execution started...", message.data);
      break;
    case 'excecuted':
      console.log("Execution of node ", message.data.node, " done");
      break;
    case 'status':
      console.log("Status: ", message.data);
      console.log("Queue Remaining", message.data.status.exec_info.queue_remaining);
      if (remainingQueue ==1  && message.data.status.exec_info.queue_remaining == 0) { 
  
      } else {
        remainingQueue = message.data.status.exec_info.queue_remaining;
      }
      break;
    case 'execution_cached':
      console.log("Execution cached...", message.data);
      break;
    case 'progress':
      break;
    default:
      console.log("Unknown message type: ", message);
      break;
  }
}


//asynchronous function to send a post request with the prompt as input
export async function postData(agentPrompt, agentid, reflection, agent) {
  Agent = agent;
  const agentId = agentid;
  const agentRef = reflection;
  workflow["6"]["inputs"]["text"] = agentPrompt;

  const url = 'http://127.0.0.1:8188/prompt'; //api url + enpoint (/prompt)
  const clientId = agentid
  try {
    const p = { prompt: workflow, client_id: clientId }; //combine workflow and clientId to create a valid post request
    const request1 = new Request(url, {
      method: "POST",
      body: JSON.stringify(p),
    });

    const response = await fetch(request1);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
    responseId = json['prompt_id']
    Reflection = reflection;
    datalog.push([agentId, responseId, agentRef]);
    console.log(datalog);

    openWebSocket(clientId);
    

  } catch (error) {
    console.error(error.message);
  }



}

//get history endpoint, which is filled once prompt with promptid is done executing; returns JSON with image location
export async function getHistory(promptId) {


  const histurl = 'http://127.0.0.1:8188/history/' + promptId;
  try {
    const request2 = new Request(histurl, {
      method: "GET",
      body: JSON.stringify(),
    });

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
}

//extract image location from history response, get the image with the getImage function and return arraybuffer from specific image
export async function getImages(promptId) {
  const outputImages = {};
  const history = (await getHistory(promptId))[promptId];
  for (const nodeId in history['outputs']) {
    const nodeOutput = history['outputs'][nodeId];
    if ('images' in nodeOutput) {
      const imagesOutput = [];
      for (const image of nodeOutput['images']) {
        const imageData = await getImage(image['filename'], image['subfolder'], image['type']);
        imagesOutput.push(imageData);
      }
      outputImages[nodeId] = imagesOutput;
    }
  }
  console.log(outputImages);
  return outputImages;
}

//return arraybuffer of specific image based on location
export async function getImage(filename, subfolder, folderType) {
  const data = { filename, subfolder, type: folderType };
  const url = `http://${serverUrl}/view?${new URLSearchParams(data).toString()}`;
  const response = await fetch(url);
  return await response.arrayBuffer();
}

//convert arraybuffer to base64 and insert as source into html image display
export async function convertImage(outputImages) {
  console.log(outputImages);
  for (const nodeId in outputImages) {
    const imageData = outputImages[nodeId];
    for (const image of imageData) {
      console.log("Image data: ", image); // arrayBuffer
      // Create a binary string from the ArrayBuffer
      const binaryString = new Uint8Array(image).reduce((data, byte) => data + String.fromCharCode(byte), '');
      // Encode the binary string to base64
      const base64String = btoa(binaryString);
      // Create the data URL
      const imageUrl = `data:image/jpeg;base64,${base64String}`;

      //create a div element with the image and its corresponding reflection and actorid
      const card = document.createElement("div");
      card.classList.add("card");
      const innerCard = document.createElement("div")
      innerCard.classList.add("innerCard");
      const frontCard = document.createElement("div");
      frontCard.classList.add("frontCard");
      const backCard = document.createElement("div");
      backCard.classList.add("backCard");

      const result = document.getElementById("results");
      const imageEl = document.createElement("img");
      imageEl.classList.add("imageResult");
      const agentEl = document.createElement("p");
      agentEl.innerText = Agent;
      agentEl.classList.add("agentResult");
      const reflectionEl = document.createElement("p");
      reflectionEl.innerText = Reflection;
      reflectionEl.classList.add("reflectionResult");

      imageEl.src = imageUrl;

      result.appendChild(card);
      card.appendChild(innerCard);
      innerCard.appendChild(frontCard);
      innerCard.appendChild(backCard);
      frontCard.appendChild(imageEl);
      backCard.appendChild(agentEl);
      backCard.appendChild(reflectionEl);

       
    }

  }
}
