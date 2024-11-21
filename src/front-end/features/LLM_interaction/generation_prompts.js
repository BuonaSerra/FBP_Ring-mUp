//export var reflectionInput = "";

var prompt_llm;

var prompts;
var reflectionInput = "";


export async function changeInput (inputReflection){
    
    reflectionInput = inputReflection;

    prompt_llm = {
        Einstein: {
            "role": "user", "content":`Antwoord alleen in het Nederlands. Schrijf een korte reflectie. Het moet gaan over het volgende gesprek: ${reflectionInput} Schrijf het namens Albert Einstein. Schrijf het als 1 paragraaf (max 1000 tekens). Schrijf het zoals deze persoon zelf het zelf zou schrijven. De karaktereigenschappen zijn nieuwsgierig, geniaal. Als persoon is Albert Einstein het volgende: een wereldberoemde wetenschapper. Antwoord alleen met de bericht. Antwoord ALLEEN met de bericht.`
        },
    
        Socrates: {
            "role": "user", "content":`Antwoord alleen in het Nederlands. Schrijf een korte reflectie. Het moet gaan over het volgende gesprek: ${reflectionInput} Schrijf het namens Socrates. Schrijf het als 1 paragraaf (max 1000 tekens). Schrijf het zoals deze persoon zelf het zelf zou schrijven. De karaktereigenschappen zijn nieuwsgierig, eigenwijs, filosoof. Als persoon is Socrates het volgende: een oud griekse filosoof. Antwoord alleen met de bericht. Antwoord ALLEEN met de bericht.`
        },
    }


    console.log(reflectionInput);
    return prompt_llm;
}


export {prompt_llm};
