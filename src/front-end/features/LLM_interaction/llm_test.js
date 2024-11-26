import { prompt_llm, changeInput } from "./generation_prompts.js"; //prompt_llm, reflectionInput, 
import { postData } from '../../features/Image_generation/image_generation';;
import {conversationTranscript} from '../../features/Speech_transcription/transcribings.js'

document.getElementById('llm_test').addEventListener('click', pipelineStuff); //start functie llmTest, zodra op de knop is geklikt

async function pipelineStuff(){
  const agent1 = document.getElementById("prompt_input1").value
  const agent2 = document.getElementById("prompt_input2").value
  const agents = [[agent1, 'agent1'], [agent2, 'agent2']];
  console.log(agents);
  
  for (const Agent of agents){
    await llmTest(Agent);
    
  }
  // for (let i = 0; i < agent.length; ++i ){
    
  // }
  
}


async function llmTest([agent, agentid]) {
  const url = 'http://127.0.0.1:1234/v1/chat/completions'; //api url + endpoint

  //const AgentChoice = document.getElementById("prompt_input").value
  //const inputReflection = document.getElementById("input_reflection").value
  const inputReflection = conversationTranscript;
  const agentId = agentid;

  changeInput(inputReflection);

  var data = {
    "model": "gemma-2-27b-it",
    "messages": [
      prompt_llm[`${agent}`],
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
    //console.log(agent_answer);
    //console.log(agent_answer["choices"]["0"]["message"]["content"]); //locatie van de response

    const agentAnswer = agent_answer["choices"]["0"]["message"]["content"];
    
    const answer = await llmPrompt(agentAnswer, agentId);
    return answer, agentId;
    //return agentAnswer;



  } catch (error) {
    console.error(error.message);
  }



}


async function llmPrompt(agentAnswer, agentid) {
  const url = 'http://127.0.0.1:1234/v1/chat/completions'; //api url + endpoint
  const agentId = agentid;
  const reflection = agentAnswer;

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
    //console.log(json);
    //console.log(json["choices"]["0"]["message"]["content"]); //locatie van de response

    const agentPrompt = json["choices"]["0"]["message"]["content"];
    const prompt = await postData(agentPrompt, agentId, reflection);
    return prompt, agentId;

    //return agentPrompt;


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