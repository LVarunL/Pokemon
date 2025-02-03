let [to,from] = [1,20];

async function fetchPokemon(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    const data = await response.json();
    return data;
}

// function renderPokemonCards(pokemonList) {
//     const container = document.querySelector('.container');
//     container.innerHTML = '';
//     console.log(pokemonList);
//     console.log(pokemonList.length);
//     pokemonList.forEach(pokemon => {
//         console.log("hi");
//         console.log(pokemon);
//         const card = document.createElement('pokemon-card');
//         card.data = pokemon;
//         card.classList.add('card');
//         // 
//         container.appendChild(card);
//     });
// }
function renderPokemonCards(pokemonList) { //is pure
    const container = document.querySelector('.container');
    // console.log(pokemonList);
    pokemonList.forEach(pokemon => {
        const card = document.createElement('pokemon-card');
        card.classList.add("card");
        card.data = pokemon;
        container.appendChild(card);
    });
    // if(pokimonList[0] !== 1)
    // showLoader(); //check if this is the correct place to put loader, also check if the function is still pure
}

// function getUniqueTypes(pokemonList) {
//     const types = new Set();
//     pokemonList.forEach(pokemon => {
//         pokemon.types.forEach(type => {
//             types.add(type.type.name);
//         });
//     });
//     return Array.from(types);
// }

// function populateTypeDropdown(types) {
//     const typeFilter = document.getElementById('type-filter');
//     types.forEach(type => {
//         const option = document.createElement('option');
//         option.value = type;
//         option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
//         typeFilter.appendChild(option);
//     });
// }
function loadWishlistIDs(){
    const wishlistIDs = JSON.parse(localStorage.getItem('wishlist')) || [];
    return wishlistIDs;
}
async function loadWishlist(wishlisIDs) {
    const wishlistPromises = wishlistIDs.map(id => fetchPokemon(id));
    const wishlist = await Promise.all(wishlistPromises);
    console.log(wishlist);
    return wishlist;
}

async function loadWishlistInRange(wishlistIDs) {
    const newWishlistPromises = [];
    for(i=from;i<=to;i+=1){
        if(i>=wishlistIDs.length){
            break; //check if break here is enough to stop stuff
        }
        // console.log(wishlistIDs[i]);
        const pokimonPromise = fetchPokemon(wishlistIDs[i]);
        newWishlistPromises.push(pokimonPromise);
    }
    const newWishlist = await Promise.all(newWishlistPromises);
    // console.log(newWishlist);
    return newWishlist;
}

function removeFromWishlist(pokemonToRemove) {
    let wishlistIDs = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlistIDs = wishlistIDs.filter(id => id !== pokemonToRemove.id);
    localStorage.setItem('wishlist', JSON.stringify(wishlistIDs));
}


async function renderPage(currentPage, totalPages, pokimonsPerPage, wishlistIDs) { //keep these functions in some util and import in both js files

    [from, to] = getIDsForCurrentPage(currentPage.value, pokimonsPerPage);
    newPokemonList = await loadWishlistInRange(wishlistIDs);

    // console.log(newPokemonList);
    renderPokemonCards(newPokemonList);
    // renderPaginationWithNav(totalPages, currentPage);
}
function showLoader(){
    const loaderExisting = document.querySelector('.loader');
    if(!loaderExisting){
        const container = document.querySelector('.container');
        const loader = document.createElement('div');
        loader.textContent = "Loading...";
        loader.classList.add("loader");
        container.insertAdjacentElement('afterend',loader);
    }
    else{
        loaderExisting.remove()
    }
}
function getIDsForCurrentPage(currentPage, pokimonsPerPage) { //is pure
    const from = (currentPage - 1) * pokimonsPerPage + 1;
    const to = currentPage * pokimonsPerPage;
    return [from, to];

}
document.addEventListener('DOMContentLoaded', async () => {
    const wishlistIDs = loadWishlistIDs();
    console.log(wishlistIDs);
    const totalPokemons = wishlistIDs.length;
    let pokimonsPerPage = 16; //later on give user option to select number of pokimons per page 
    from = 1;
    to = pokimonsPerPage;
    let wishlist = [];
    const totalPages = Math.ceil(totalPokemons / pokimonsPerPage);  // Calculate total number of pages
    let currentPage = {
        value: 1,
        async set(newValue) { //is very very unpure
            if (newValue > 0 && newValue <= totalPages) {
                this.value = newValue;
            }
            else if (newValue <= 0) {
                this.value = 1;
            }
            else if (newValue > totalPages) {
                this.value = totalPages;
            }
            console.log(this.value);
            showLoader();
            renderPage(this, totalPages, pokimonsPerPage, wishlistIDs);
        }
    }
    // console.log(wishlistIDs);
    wishlist = await loadWishlistInRange(wishlistIDs);

    renderPokemonCards(wishlist);

    const container = document.querySelector('body');
    container.onscroll = () => {
        // if (isLoading) return;

        if (
            Math.ceil(container.clientHeight
                + container.scrollTop) >=
            container.scrollHeight
        ) {
            if (currentPage.value < totalPages) {
                //render logic here
                console.log("adding bro");
                currentPage.set(currentPage.value + 1);

            }
        }
    };
    // const uniqueTypes = getUniqueTypes(wishlist);
    // populateTypeDropdown(uniqueTypes);
    // initializeFilters(wishlist, renderPokemonCards);
});
