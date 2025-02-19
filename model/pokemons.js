
async function fetchPokemonFromURL(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}



async function fetchPokemonsFromURLList(urlList) {
    let pokimonPromises = [];
    urlList.forEach((url) => {
        pokimonPromises.push(fetchPokemonFromURL(url));
    });
    const pokemonsFromURL = await Promise.all(pokimonPromises); //change it to allsettled
    return pokemonsFromURL;
}


async function loadNextPokemons() {
    const response = await fetch(nextURL);
    const data = await response.json();
    nextURL = data.next;
    const pokemonURLs = data.results.map(pokemon => pokemon.url);
    const newPokemons = await fetchPokemonsFromURLList(pokemonURLs);
    pokemonList.push(...newPokemons);
}

async function fetchPokemon(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    const data = await response.json();
    return data;
}

async function fetchPokemonsOfType(type) { //is pure(can be further divided)
    const response = await fetch(pokeURL + 'type/' + type);
    const data = await response.json();
    const pokemons = data.pokemon;
    let pokimonPromises = [];
    pokemons.forEach((pokemon) => {
        pokimonPromises.push(fetchPokemonFromURL(pokemon.pokemon.url));
    })
    const pokemonOfTypeList = await Promise.all(pokimonPromises); //change it to allsettled
    return pokemonOfTypeList;
}