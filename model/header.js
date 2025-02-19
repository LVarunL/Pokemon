async function getTypes(){
    const typesEndpoint = pokeURL + 'type/?limit=1000';
    const response = await fetch(typesEndpoint);
    const data = (await response.json()).results;
    
    return data;
}