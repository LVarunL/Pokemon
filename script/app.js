async function fetchPokemon(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    const data = await response.json();
    console.log(data);
    return data;
}

function renderPokemonCards(pokemonList) {
    const container = document.querySelector('.container');
    container.innerHTML = ''; 
    pokemonList.forEach(pokemon => {
        const card = document.createElement('pokemon-card');
        card.classList.add("card");
        card.data = pokemon;
        container.appendChild(card);
    });
}

async function loadPokemon() { //check if these 100 would be added in parallel or one by one...if one by one  make them parallel
    const pokemonList = [];
    for (let id = 1; id <= 100; id++) { //fetching 100 pokemons
        const pokemon = await fetchPokemon(id);
        pokemonList.push(pokemon);
    }
    return pokemonList;
}

function getUniqueTypes(pokemonList) {
    const types = new Set();
    pokemonList.forEach(pokemon => {
        pokemon.types.forEach(type => {
            types.add(type.type.name);
        });
    });
    return Array.from(types);
}

function populateTypeDropdown(types) {
    const typeFilter = document.getElementById('type-filter');
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        typeFilter.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const pokemonList = await loadPokemon();
    renderPokemonCards(pokemonList);

    const uniqueTypes = getUniqueTypes(pokemonList);
    populateTypeDropdown(uniqueTypes);
    
    initializeFilters(pokemonList, renderPokemonCards); 
});

