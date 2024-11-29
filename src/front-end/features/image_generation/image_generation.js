//This code is edited from original typescript code by Wesley Hartogs
import workflow from './workflow_api_v1.json' with {type: 'json'};


export var responseId = ""; //lege variabele waarin de promptid wordt gezet
export var remainingQueue;
var Reflection = "";
var Agent = "";

//getting value from cfg slider and updating value in DOM
/*export const cfgValue = document.getElementById('cfg_value');
export const cfgSlider = document.getElementById('cfg_input');
cfgValue.textContent = cfgSlider.value; //update cfg value constantly, so it gives live feedback on the slider
cfgSlider.addEventListener("input", (event) => {
  cfgValue.textContent = event.target.value;
});*/

//document.getElementById('prompt_trigger').addEventListener('click', postData); //start functie postData, zodra op de knop is geklikt

//open a websocket to be able to get status/execution messages
export const serverUrl = "127.0.0.1:8188";
//export const clientId = 5; //"agent-client-" + Math.random().toString(36).substring(2, 15);
let ws;
var datalog = [];



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

    //console.log("RAW Message: ", message);
  }
  //console.log("function aangeroepen " + message.type)
  switch (message.type) {
    case 'executing':
      //console.log("Executing...", message.data);
      if (message.data.node == null) {
        console.log("Execution done");
        console.log('start history');
        const imagesOutput = (await getImages(responseId));
        console.log(imagesOutput);
        convertImage(imagesOutput);
      }

      //alert("ComfyUI is done executing");
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
      if (remainingQueue ==1  && message.data.status.exec_info.queue_remaining == 0) { //AANDACHT: bij gebrek aan message types is dit een oplossing voor later!! Dit is een workaround.
        // console.log('start history');
        // const imagesOutput = (await getImages(responseId));
        // console.log(imagesOutput);
        // convertImage(imagesOutput);
        //console.log(imageSrc);
      } else {
        remainingQueue = message.data.status.exec_info.queue_remaining;
      }
      break;
    case 'execution_cached':
      console.log("Execution cached...", message.data);
      break;
    case 'progress':
      //console.log("Progress: ", `${message.data.value / message.data.max * 100}%`);
      break;
    default:
      console.log("Unknown message type: ", message);
      break;
  }
}


//asynchrone functie om een post request te sturen naar de api
export async function postData(agentPrompt, agentid, reflection, agent) {
  /*var promptInput = document.getElementById("prompt_input").value //get the value from the textarea prompt_input
  var cfgInput = document.getElementById("cfg_input").value //get the value from the number input cfg_input
  var seedInput = document.getElementById("seed_input") //get the value from the number input seed_input*/
  Agent = agent;
  const agentId = agentid;
  const agentRef = reflection;
  workflow["6"]["inputs"]["text"] = agentPrompt;
  //workflow["6"]["inputs"]["text"] = promptInput; //input the prompt value into the right JSON object name
  //workflow["3"]["inputs"]["cfg"] = cfgInput; //input the cfg value into the right JSON object name

  /*if (seedInput.checked == true){ //checkt of de seedinput checkbox op random staat. Als dat zo is, genereert het een random nummer tussen 1 en 987654321 als seed. Anders is de seed 2.
    workflow["3"]["inputs"]["seed"] = Math.floor(Math.random() * 9876543210) + 1; 
  } else {
    workflow["3"]["inputs"]["seed"] = 2;
  }*/

  const url = 'http://127.0.0.1:8188/prompt'; //api url + enpoint (/prompt), zie server.py in comfyui om andere endpoints te vinden
  const clientId = agentid//randomUUID() //kan berekend worden, even in duiken
  try {
    const p = { prompt: workflow, client_id: clientId }; //combineer workflow met client id
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
    //console.log(responseId, agentId, agentRef);
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
  //console.log(history);
  //const nodeOutput = history[promptId];
  //console.log(nodeOutput);
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
  //const imageStuff = "";
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
      //console.log(imageUrl);
      //console.log(imageUrl);
      //this.callback(imageUrl);
      //imageStuff = base64String;
     // document.getElementById("generated_image").src = imageUrl;

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
      const agentEl = document.createTextNode(Agent);
      const reflectionEl = document.createTextNode(Reflection);

      imageEl.src = imageUrl;

      result.appendChild(card);
      card.appendChild(innerCard);
      innerCard.appendChild(frontCard);
      innerCard.appendChild(backCard);
      frontCard.appendChild(imageEl);
      backCard.appendChild(agentEl);
      backCard.appendChild(reflectionEl);

       
      // result.appendChild(imageEl);
      // result.appendChild(agentEl);
      // result.appendChild(reflectionEl);
      //for vue: create an array and append image, agent and reflection to it as a unit. Then, when I want to show the divs, go through the array with a for loop and create divs with flip card effect.

      //  const imageElement = document.createElement("img");
      //  imageElement.src = imageUrl;
      // imageElement.style.width = "100%";
      // imageElement.style.height = "auto";
      //  document.body.appendChild(imageElement);
    }

  }
  //return imageStuff;
}
