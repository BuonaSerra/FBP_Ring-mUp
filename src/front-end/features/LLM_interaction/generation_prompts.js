//export var reflectionInput = "";

var prompt_llm;

var prompts;
var reflectionInput = "";


export async function changeInput (inputReflection){
    
    reflectionInput = inputReflection;

    prompt_llm = {
        "Einstein": {
            "role": "user", "content":`Antwoord alleen in het Nederlands. Schrijf een korte reflectie en advies. Het moet gaan over het volgende gesprek: ${reflectionInput} Schrijf het namens Albert Einstein. Schrijf het in 1 paragraaf (max 1000 tekens). Schrijf het zoals deze persoon het zelf zou schrijven.  Antwoord alleen met de bericht. Antwoord ALLEEN met de bericht.`
        },

        "Bruno Latour": {
            "role": "user", "content":`Antwoord alleen in het Nederlands. Schrijf een korte reflectie en advies. Het moet gaan over het volgende gesprek: ${reflectionInput} Schrijf het namens Bruno Latour. Schrijf het in 1 paragraaf (max 1000 tekens). Schrijf het zoals deze persoon het zelf zou schrijven.  Antwoord alleen met de bericht. Antwoord ALLEEN met de bericht.`
        },

        "Frida Kahlo": {
            "role": "user", "content":`Antwoord alleen in het Nederlands. Schrijf een korte reflectie en advies. Het moet gaan over het volgende gesprek: ${reflectionInput} Schrijf het namens Frida Kahlo. Schrijf het in 1 paragraaf (max 1000 tekens). Schrijf het zoals deze persoon het zelf zou schrijven.  Antwoord alleen met de bericht. Antwoord ALLEEN met de bericht.`
        },

        "Malala Yousafzai": {
            "role": "user", "content":`Antwoord alleen in het Nederlands. Schrijf een korte reflectie en advies. Het moet gaan over het volgende gesprek: ${reflectionInput} Schrijf het namens Malala Yousafzai. Schrijf het in 1 paragraaf (max 1000 tekens). Schrijf het zoals deze persoon het zelf zou schrijven.  Antwoord alleen met de bericht. Antwoord ALLEEN met de bericht.`
        },

        "Astrid Lindgren": {
            "role": "user", "content":`Antwoord alleen in het Nederlands. Schrijf een korte reflectie en advies. Het moet gaan over het volgende gesprek: ${reflectionInput} Schrijf het namens Astrid Lindgren. Schrijf het in 1 paragraaf (max 1000 tekens). Schrijf het zoals deze persoon het zelf zou schrijven.  Antwoord alleen met de bericht. Antwoord ALLEEN met de bericht.`
        },

        "Hannah Arendt": {
            "role": "user", "content":`Antwoord alleen in het Nederlands. Schrijf een korte reflectie en advies. Het moet gaan over het volgende gesprek: ${reflectionInput} Schrijf het namens Hannah Arendt. Schrijf het in 1 paragraaf (max 1000 tekens). Schrijf het zoals deze persoon het zelf zou schrijven.  Antwoord alleen met de bericht. Antwoord ALLEEN met de bericht.`
        },

        "Jane Goodall": {
            "role": "user", "content":`Antwoord alleen in het Nederlands. Schrijf een korte reflectie en advies. Het moet gaan over het volgende gesprek: ${reflectionInput} Schrijf het namens Jane Goodall. Schrijf het in 1 paragraaf (max 1000 tekens). Schrijf het zoals deze persoon het zelf zou schrijven.  Antwoord alleen met de bericht. Antwoord ALLEEN met de bericht.`
        },

        "Yuval Noah Harrari": {
            "role": "user", "content":`Antwoord alleen in het Nederlands. Schrijf een korte reflectie en advies. Het moet gaan over het volgende gesprek: ${reflectionInput} Schrijf het namens Yuval Noah Harrari. Schrijf het in 1 paragraaf (max 1000 tekens). Schrijf het zoals deze persoon het zelf zou schrijven.  Antwoord alleen met de bericht. Antwoord ALLEEN met de bericht.`
        },

        "Michelle Schenandoah": {
            "role": "user", "content":`Antwoord alleen in het Nederlands. Schrijf een korte reflectie en advies. Het moet gaan over het volgende gesprek: ${reflectionInput} Schrijf het namens Michelle Schenandoah. Schrijf het in 1 paragraaf (max 1000 tekens). Schrijf het zoals deze persoon het zelf zou schrijven.  Antwoord alleen met de bericht. Antwoord ALLEEN met de bericht.`
        },

        "Nelson Mandela": {
            "role": "user", "content":`Antwoord alleen in het Nederlands. Schrijf een korte reflectie en advies. Het moet gaan over het volgende gesprek: ${reflectionInput} Schrijf het namens Nelson Mandela. Schrijf het in 1 paragraaf (max 1000 tekens). Schrijf het zoals deze persoon het zelf zou schrijven.  Antwoord alleen met de bericht. Antwoord ALLEEN met de bericht.`
        },
    }


    console.log(reflectionInput);
    return prompt_llm;
}


export {prompt_llm};
