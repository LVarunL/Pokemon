async function fetchPokemon(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    const data = await response.json();
    // console.log(data);
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

async function loadPokemon() { 
    const pokemonPromises = [];
    for (let id = 1; id <= 1000; id++) { 
        pokemonPromises.push(fetchPokemon(id));
    }
    const pokemonListPromises = await Promise.allSettled(pokemonPromises);
    let pokimonList = [];
    pokemonListPromises.forEach((pokimonPromise)=>{
        if(pokimonPromise.status === 'fulfilled'){
            pokimonList.push(pokimonPromise.value);
        }
    })
    return pokimonList;
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

