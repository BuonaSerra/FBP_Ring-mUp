//export var reflectionInput = "";

var prompt_llm;

var prompts;
var reflectionInput = "";


export async function changeInput (inputReflection){
    
    reflectionInput = inputReflection;

    prompt_llm = {
        "Einstein": {
            "role": "user", "content":`Schrijf een korte reflectie en eindig met advies over het volgende gesprek: ${reflectionInput} Schrijf het in 1 paragraaf (maximaal 1000 tekens). Schrijf het vanuit het perspectief van Albert Einstein. Schrijf het bericht zoals de persoon het zelf zou schrijven. Antwoord alleen in het Nederlands. Antwoord alleen met het bericht.`
        },

        "Bruno Latour": {
            "role": "user", "content":`Schrijf een korte reflectie en eindig met advies over het volgende gesprek: ${reflectionInput} Schrijf het in 1 paragraaf (maximaal 1000 tekens). Schrijf het vanuit het perspectief van Bruno Latour. Schrijf het bericht zoals de persoon het zelf zou schrijven. Antwoord alleen in het Nederlands. Antwoord alleen met het bericht.`
        },

        "Frida Kahlo": {
            "role": "user", "content":`Schrijf een korte reflectie en eindig met advies over het volgende gesprek: ${reflectionInput} Schrijf het in 1 paragraaf (maximaal 1000 tekens). Schrijf het vanuit het perspectief van Frida Kahlo. Schrijf het bericht zoals de persoon het zelf zou schrijven. Antwoord alleen in het Nederlands. Antwoord alleen met het bericht.`
        },

        "Malala Yousafzai": {
            "role": "user", "content":`Schrijf een korte reflectie en eindig met advies over het volgende gesprek: ${reflectionInput} Schrijf het in 1 paragraaf (maximaal 1000 tekens). Schrijf het vanuit het perspectief van Malala Yousafzai. Schrijf het bericht zoals de persoon het zelf zou schrijven. Antwoord alleen in het Nederlands. Antwoord alleen met het bericht.`
        },

        "Elon Musk": {
            "role": "user", "content":`Schrijf een korte reflectie en eindig met advies over het volgende gesprek: ${reflectionInput} Schrijf het in 1 paragraaf (maximaal 1000 tekens). Schrijf het vanuit het perspectief van Elon Musk. Schrijf het bericht zoals de persoon het zelf zou schrijven. Antwoord alleen in het Nederlands. Antwoord alleen met het bericht.`
        },

        "Hannah Arendt": {
            "role": "user", "content":`Schrijf een korte reflectie en eindig met advies over het volgende gesprek: ${reflectionInput} Schrijf het in 1 paragraaf (maximaal 1000 tekens). Schrijf het vanuit het perspectief van Hannah Arendt. Schrijf het bericht zoals de persoon het zelf zou schrijven. Antwoord alleen in het Nederlands. Antwoord alleen met het bericht.`
        },

        "Jane Goodall": {
            "role": "user", "content":`Schrijf een korte reflectie en eindig met advies over het volgende gesprek: ${reflectionInput} Schrijf het in 1 paragraaf (maximaal 1000 tekens). Schrijf het vanuit het perspectief van Jane Goodall. Schrijf het bericht zoals de persoon het zelf zou schrijven. Antwoord alleen in het Nederlands. Antwoord alleen met het bericht.`
        },

        "Yuval Noah Harrari": {
            "role": "user", "content":`Schrijf een korte reflectie en eindig met advies over het volgende gesprek: ${reflectionInput} Schrijf het in 1 paragraaf (maximaal 1000 tekens). Schrijf het vanuit het perspectief van Yuval Noah Harrari. Schrijf het bericht zoals de persoon het zelf zou schrijven. Antwoord alleen in het Nederlands. Antwoord alleen met het bericht.`
        },

        "Michelle Schenandoah": {
            "role": "user", "content":`Schrijf een korte reflectie en eindig met advies over het volgende gesprek: ${reflectionInput} Schrijf het in 1 paragraaf (maximaal 1000 tekens). Schrijf het vanuit het perspectief van Michelle Schenandoah. Schrijf het bericht zoals de persoon het zelf zou schrijven. Antwoord alleen in het Nederlands. Antwoord alleen met het bericht.`
        },

        "Kim Kardashian": {
            "role": "user", "content":`Schrijf een korte reflectie en eindig met advies over het volgende gesprek: ${reflectionInput} Schrijf het in 1 paragraaf (maximaal 1000 tekens). Schrijf het vanuit het perspectief van Kim Kardashian. Schrijf het bericht zoals de persoon het zelf zou schrijven. Antwoord alleen in het Nederlands. Antwoord alleen met het bericht.`
        },

        "Margaret Thatcher": {
            "role": "user", "content":`Schrijf een korte reflectie en eindig met advies over het volgende gesprek: ${reflectionInput} Schrijf het in 1 paragraaf (maximaal 1000 tekens). Schrijf het vanuit het perspectief van Margaret Thatcher. Schrijf het bericht zoals de persoon het zelf zou schrijven. Antwoord alleen in het Nederlands. Antwoord alleen met het bericht.`
        },
    }


    console.log(reflectionInput);
    return prompt_llm;
}


export {prompt_llm};
