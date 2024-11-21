import {prompt_llm, changeInput} from "./generation_prompts.js"; //prompt_llm, reflectionInput, 
import * as imageGen from '../../features/image_generation/image_generation';;


document.getElementById('llm_test').addEventListener('click', llmTest); //start functie llmTest, zodra op de knop is geklikt

async function llmTest() {
    const url = 'http://127.0.0.1:1234/v1/chat/completions'; //api url + endpoint

    const AgentChoice = document.getElementById("prompt_input").value
    const inputReflection = document.getElementById("input_reflection").value
    
    changeInput(inputReflection);

    var data = {
        "model": "gemma-2-27b-it",
        "messages": [
            prompt_llm[`${AgentChoice}`],
        ],
        "stream": false,
    };

    try {
        const request2 = new Request(url, {
    method: "POST",
    headers: {
        "Content-Type": "application/json", //From debugging with GPT-4o;
      },
    body: JSON.stringify(data),
  });
  
  console.log("LLM test aangeroepen");

  const response = await fetch(request2);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const agent_answer = await response.json();
  console.log(agent_answer);
  console.log(agent_answer["choices"]["0"]["message"]["content"]); //locatie van de response

  const agentAnswer = agent_answer["choices"]["0"]["message"]["content"];
  llmPrompt(agentAnswer);
  return agentAnswer;
  
  
  
} catch (error) {
  console.error(error.message);
}

    
     
  }


  async function llmPrompt(agentAnswer) {
    const url = 'http://127.0.0.1:1234/v1/chat/completions'; //api url + endpoint

    var data = {
        "model": "gemma-2-27b-it",
        "messages": [
            { "role": "user", "content": `Answer only in English. Write a prompt to be used for stable diffusion 3, based on the following input: ${agentAnswer} Answer only with the prompt. Answer ONLY with the prompt.` },
        ],
        "stream": false,
    };

    try {
        const request3 = new Request(url, {
    method: "POST",
    headers: {
        "Content-Type": "application/json", //From debugging with GPT-4o;
      },
    body: JSON.stringify(data),
    
  });
  
  console.log("LLM prompt aangeroepen");

  const response = await fetch(request3);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const json = await response.json();
  console.log(json);
  console.log(json["choices"]["0"]["message"]["content"]); //locatie van de response

  const agentPrompt = json["choices"]["0"]["message"]["content"];
  imageGen.postData(agentPrompt);

   
  
  return agentPrompt;
  
  
} catch (error) {
  console.error(error.message);
}

    
     
  }


/*async function llmTest() {
    const url = 'http://127.0.0.1:1234/v1/models'; //api url + enpoint (/prompt), zie server.py in comfyui om andere endpoints te vinden
    try {
        const request2 = new Request(url, {
    method: "GET",
    body: JSON.stringify(),
    
  });
  
  console.log("LLM test aangeroepen");

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