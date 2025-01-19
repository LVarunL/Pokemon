function renderPokemonCards(pokemonList) {
    const container = document.querySelector('.container');
    container.innerHTML = '';
    pokemonList.forEach(pokemon => {
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

function loadWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    renderPokemonCards(wishlist);


    const uniqueTypes = getUniqueTypes(wishlist);
    populateTypeDropdown(uniqueTypes);
    initializeFilters(wishlist, renderPokemonCards);
}

function removeFromWishlist(pokemonToRemove) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(pokemon => pokemon.name !== pokemonToRemove.name);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}



document.addEventListener('DOMContentLoaded', loadWishlist);
