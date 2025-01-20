async function fetchPokemon(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    const data = await response.json();
    return data;
}

function renderPokemonCards(pokemonList) {
    const container = document.querySelector('.container');
    container.innerHTML = '';
    console.log(pokemonList);
    console.log(pokemonList.length);
    pokemonList.forEach(pokemon => {
        console.log("hi");
        console.log(pokemon);
        const card = document.createElement('pokemon-card');
        card.data = pokemon;
        card.classList.add('card');
        // 
        container.appendChild(card);
    });
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

async function loadWishlist() {
    const wishlistIDs = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistPromises = wishlistIDs.map(id => fetchPokemon(id));
    const wishlist = await Promise.all(wishlistPromises);
    console.log(wishlist);
    return wishlist;
}

function removeFromWishlist(pokemonToRemove) {
    let wishlistIDs = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlistIDs = wishlistIDs.filter(id => id !== pokemonToRemove.id);
    localStorage.setItem('wishlist', JSON.stringify(wishlistIDs));
}



document.addEventListener('DOMContentLoaded', async () => {
    const wishlist = await loadWishlist();
    
    renderPokemonCards(wishlist);

    const uniqueTypes = getUniqueTypes(wishlist);
    populateTypeDropdown(uniqueTypes);
    initializeFilters(wishlist, renderPokemonCards);
});
