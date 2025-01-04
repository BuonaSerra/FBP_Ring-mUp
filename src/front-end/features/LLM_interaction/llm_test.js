import { prompt_llm, changeInput } from "./generation_prompts.js"; //prompt_llm, reflectionInput, 
import { postData } from '../../features/image_generation/image_generation';;
import {conversationTranscript} from '../../features/Speech_transcription/transcribings.js';
import {uidAgent1, uidAgent2, uidAgent3, uidAgent4} from '../../features/Serial_test/serial_test.js';


//read the uid and convert it to an actor name
async function uidAgentValue(uid){
  if (uid == '0x42 0x7D 0xA4 0xF3'){
    return 'Einstein';
  } else if(uid == '0x02 0x49 0xA4 0xF3'){
    return 'Bruno Latour';
  } else if(uid == '0x32 0xA2 0xA4 0xF3'){
    return 'Frida Kahlo';
  } else if(uid == '0xF2 0xA1 0xA4 0xF3'){
    return 'Malala Yousafzai';
  } else if(uid == '0x52 0x9A 0xA4 0xF3'){
    return 'Elon Musk';
  } else if(uid == '0x62 0x9C 0xA4 0xF3'){
    return 'Hannah Arendt';
  } else if(uid == '0x92 0x9A 0xA4 0xF3'){
    return 'Jane Goodall';
  } else if(uid == '0xA2 0x76 0xA4 0xF3'){
    return 'Yuval Noah Harari';
  } else if(uid == '0xC2 0x99 0xA4 0xF3'){
    return 'Michelle Schenandoah';
  } else if(uid == '0xB2 0xA0 0xA4 0xF3'){
    return 'Kim Kardashian';
  } else if(uid == '0xB9 0x4C 0x8B 0xFF'){
    return 'Margaret Thatcher';
  }
  
}

//create an array with agent name and id, and trigger llmTest()
export async function pipelineStuff(){
  const agent1 = await uidAgentValue(uidAgent1);
  console.log(agent1);
  console.log(uidAgent1);
  const agent2 = await uidAgentValue(uidAgent2);
  const agent3 = await uidAgentValue(uidAgent3);
  const agent4 = await uidAgentValue(uidAgent4);
  const agents = [[agent1, 'agent1'], [agent2, 'agent2'], [agent3, 'agent3'], [agent4, 'agent4']];
  console.log(agents);
  
  for (const Agent of agents){
    await llmTest(Agent);
    
  }
  
}

//send a post request with the prompt and actor as input. The actor name defines which prompt is sent form the generation_prompt.js file
async function llmTest([agent, agentid]) {
  const url = 'http://localhost:11434/api/chat'; //api url + endpoint

  const inputReflection = conversationTranscript;
  const agentId = agentid;

  changeInput(inputReflection);

  var data = {
    "model": "gemma2:27B", 
    "messages": [
      prompt_llm[`${agent}`],
    ],
    "stream": false,
  };

  try {
    const request2 = new Request(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("LLM test aangeroepen");

    const response = await fetch(request2);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const agent_answer = await response.json();
    const agentAnswer = agent_answer["message"]["content"]; 
    
    const answer = await llmPrompt(agentAnswer, agentId, agent);
    return answer, agentId;



  } catch (error) {
    console.error(error.message);
  }



}

//with the response from llmTest, send a post request with the response as input for the prompt, generating a prompt for a diffusion model
async function llmPrompt(agentAnswer, agentid, agent) {
  const url = 'http://localhost:11434/api/chat'; //api url + endpoint
  const agentId = agentid;
  const reflection = agentAnswer;

  var data = {
    "model": "gemma2:27B", 
    "messages": [
      { "role": "user", "content": `Answer only in English. Write a prompt to be used for stable diffusion 3, based on the following input: ${agentAnswer} Refrain from depicting faces, or text. Answer only with the prompt.` },
    ],
    "stream": false,
  };

  try {
    const request3 = new Request(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(data),

    });

    console.log("LLM prompt aangeroepen");

    const response = await fetch(request3);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();

    const agentPrompt = json["message"]["content"]; 
    const prompt = await postData(agentPrompt, agentId, reflection, agent);
    return prompt, agentId;


  } catch (error) {
    console.error(error.message);
  }



}