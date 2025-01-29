let pokimonList = [];
let typesDisplayed = [];
let pokemonsPerPage = 4;
const baseURL = `https://pokeapi.co/api/v2/pokemon/?limit=${pokemonsPerPage}&offset=0`;
let currentPageURL = baseURL;

let visiblePokemons = []; 
let currentOffset = 0; 
const bufferSize = 0; 

let isFetching = false;
// let currentPage = {

//     value: 1,
//     set(newValue) { //is very very unpure
//         if (newValue > 0) {
//             this.value = newValue;
//         }
//         else if (newValue <= 0) {
//             this.value = 1;
//         }
//         showLoader();
//         renderPage().then(() => isFetching = false);
//     },
// }
let nextPageURL;
let prevPageURL;
const pokeURL = "https://pokeapi.co/api/v2/";





async function fetchPokemon(id) { //is pure
    const response = await fetch(pokeURL + "pokemon/" + id);
    const data = await response.json();
    return data;
}

async function fetchPokemonFromURL(url) { //is pure
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function fetchPokemonsOfType(type) { //is pure(can be further divided)
    const response = await fetch(pokeURL + 'type/' + type);
    const data = await response.json();
    const pokemons = data.pokemon;
    let pokimonPromises = [];
    pokemons.forEach((pokemon) => {
        // console.log(pokemon.pokemon.url);
        pokimonPromises.push(fetchPokemonFromURL(pokemon.pokemon.url));
    })
    const pokemonOfTypeList = await Promise.all(pokimonPromises); //change it to allsettled
    return pokemonOfTypeList;
}

async function fetchPokemonsFromURLList(urlList) {
    let pokimonPromises = [];
    urlList.forEach((url) => {
        pokimonPromises.push(fetchPokemonFromURL(url));
    });
    const pokemonsFromURL = await Promise.all(pokimonPromises); //change it to allsettled
    return pokemonsFromURL;
}

// async function getAllTypes() { //is pure
//     const typesEndpoint = pokeURL + 'type/?limit=1000';
//     const response = await fetch(typesEndpoint);
//     const data = (await response.json()).results;

//     const types = data.map(dataItem => dataItem.name);
//     return types;
// }




// function populateTypeDropdown(types) { // is pure
//     const typeFilter = document.getElementById('checkboxes');
//     types.forEach(type => {
//         const option = document.createElement('label');
//         const optionInput = document.createElement('input');
//         optionInput.setAttribute("type", "checkbox");
//         optionInput.setAttribute("name", "typeOption");
//         optionInput.dataset.value = type;
//         optionInput.addEventListener("click", () => handleCheckboxSelect(type));
//         option.textContent = type;
//         option.appendChild(optionInput);
//         typeFilter.appendChild(option);
//     });
// }

// function showLoader() { //is pure
//     const loaderExisting = document.querySelector('.loader');
//     if (!loaderExisting) {
//         const container = document.querySelector('.container');
//         const loader = document.createElement('div');
//         loader.textContent = "Loading...";
//         loader.classList.add("loader");
//         container.insertAdjacentElement('afterend', loader);
//     }
//     else {
//         loaderExisting.remove();
//     }
// }

// function renderPokemonCards(pokemonsToRender) { //is pure
//     if (!pokemonsToRender) return;
//     const container = document.querySelector('.container');
//     pokemonsToRender.forEach(pokemon => {
//         const card = document.createElement('pokemon-card');
//         card.classList.add("card");
//         card.data = pokemon;
//         container.appendChild(card);
//     });
//     showLoader();//check if this is the correct place to put loader, also check if the function is still pure
// }

// function renderPokemonCards(pokemonsToRender) {
//     const container = document.querySelector('.container');
//     container.innerHTML = ''; // Clear the container
//     pokemonsToRender.forEach(pokemon => {
//         const card = document.createElement('pokemon-card');
//         card.classList.add("card");
//         card.data = pokemon;
//         container.appendChild(card);
//     });
// }
// function renderPokemonCards(pokemonsToRender, isPrepend) {
//     const container = document.querySelector('.container');
//     // container.innerHTML = ``;
//     if (isPrepend) {
//         pokemonsToRender.reverse().forEach(pokemon => {
//             const card = document.createElement('pokemon-card');
//             card.classList.add("card");
//             card.data = pokemon;
//             container.prepend(card);
//         });
//     } else {
//         pokemonsToRender.forEach(pokemon => {
//             const card = document.createElement('pokemon-card');
//             card.classList.add("card");
//             card.data = pokemon;
//             container.appendChild(card);
//         });
//     }
// }


async function loadPokemonsByOffset(offset, limit) {
    const response = await fetch(`${pokeURL}pokemon?offset=${offset}&limit=${limit}`);
    const data = await response.json();
    const pokemonURLs = data.results.map(pokemon => pokemon.url);
    nextPageURL = data.next;
    prevPageURL = data.previous;
    console.log(nextPageURL,prevPageURL);
    return await fetchPokemonsFromURLList(pokemonURLs);
}
async function loadNextPokemons() {
    if (!nextPageURL) return;
    showLoader();
    const newPokemons = await loadPokemonsByOffset(currentOffset + pokemonsPerPage, pokemonsPerPage + bufferSize);
    currentOffset += pokemonsPerPage;
    visiblePokemons.push(...newPokemons);
    renderPokemonCards(newPokemons, false);
}

// Load and prepend Pokémon when scrolling up
// async function loadPrevPokemons() {
//     if (!prevPageURL || currentOffset === 0) return;
//     const newOffset = Math.max(0, currentOffset - pokemonsPerPage - bufferSize);
//     const newPokemons = await loadPokemonsByOffset(newOffset, pokemonsPerPage + bufferSize);
//     currentOffset = newOffset;
//     visiblePokemons = [...newPokemons, ...visiblePokemons];
//     renderPokemonCards(newPokemons, true);
// }








// async function handleCheckboxSelect(type) {
    // console.log(type);
    // if (!typesDisplayed.includes(type)) {
    //     console.log("adding " + type);
    //     const newPokimons = await fetchPokemonsOfType(type);
    //     if (typesDisplayed.length === 0) {
    //         // filteredPokemonList = newPokimons;
    //         const container = document.querySelector(".container");
    //         container.innerHTML = ``;
    //         renderPokemonCards(newPokimons);
    //     }
    //     else {
    //         renderPokemonCards(newPokimons);
    //     }
    //     typesDisplayed.push(type);
    // }
    // else {
    //     console.log("removing " + type);
    //     typesDisplayed = typesDisplayed.filter((typeDisplayed) => {
    //         return typeDisplayed !== type;
    //     });
    //     const container = document.querySelector(".container");
    //     container.innerHTML = ``;
    //     pokemonPromises = [];

    //     typesDisplayed.forEach((typeDisplayed) => {
    //         pokemonPromises.push(fetchPokemonsOfType(typeDisplayed));
    //     })
    //     const pokemonsToDisplay = await Promise.all(pokemonPromises);
    //     // console.log(pokemonsToDisplay[0]);
    //     renderPokemonCards(pokemonsToDisplay[0]); //check why
    //     if (typesDisplayed.length === 0) {
    //         currentPage.value = 1;
    //         from = 1;
    //         to = pokemonsPerPage;
    //         renderPage();
    //     }

    // }

// }




// var expanded = false;
// function showCheckboxes() {
//     var checkboxes = document.getElementById("checkboxes");
//     if (!expanded) {
//         checkboxes.style.display = "block";
//         // console.log("lpo")
//         expanded = true;
//     } else {
//         checkboxes.style.display = "none";
//         expanded = false;
//     }
// }

// async function renderPage() {

    
//     const pokemonPromises = await fetch(nextPageURL);
//     const pokemonsData = await pokemonPromises.json();
//     nextPageURL = pokemonsData.next;
//     console.log(nextPageURL);
//     prevPageURL = pokemonsData.prev;
//     const pokemonsURLs = pokemonsData.results.map((pokimonData) => {
//         // console.log(pokimonData.url);
//         return pokimonData.url;

//     });
//     const pokemons = await fetchPokemonsFromURLList(pokemonsURLs);
//     renderPokemonCards(pokemons);
// }

// document.addEventListener('DOMContentLoaded', async () => {
//     const types = await getAllTypes();
//     populateTypeDropdown(types);
//     const selectBox = document.querySelector(".selectBox");
//     selectBox.addEventListener("click", (e) => {
//         showCheckboxes();
//     });
// });

// document.addEventListener('DOMContentLoaded', async () => {
//     from = 1;
//     to = pokemonsPerPage;

//     const initialPokemonsPromise = await fetch(baseURL);
//     const initialPokemonsData = await initialPokemonsPromise.json();
//     nextPageURL = initialPokemonsData.next;
//     prevPageURL = initialPokemonsData.prev;
//     const initialPokemonsURLs = initialPokemonsData.results.map((pokimonData) => {

//         return pokimonData.url

//     });
//     console.log(initialPokemonsURLs);
//     const initialPokemons = await fetchPokemonsFromURLList(initialPokemonsURLs);
//     console.log(initialPokemons);
//     renderPokemonCards(initialPokemons);

//     const container = document.querySelector('body');
//     container.onscroll = () => {

//         if (isFetching) {
//             return;
//         }
//         handleScroll();
//     };
// });

document.addEventListener('DOMContentLoaded', async () => {
    // visiblePokemons = await loadPokemonsByOffset(0, pokemonsPerPage + bufferSize);
    // currentOffset = 0;
    // renderPokemonCards(visiblePokemons);
    // const container = document.querySelector('body');
    // container.onscroll = () => handleScroll();
});


// function handleScroll() {
//     const container = document.querySelector('body');

//     // Fetch next page when scrolling to the bottom
//     if (
//         Math.ceil(container.scrollTop + container.clientHeight) >=
//         container.scrollHeight &&
//         nextPageURL

//     ) {
//         isFetching = true;
//         console.log("adding bro");
//         currentPage.set(currentPage.value + 1);
//     }

//     // Optionally handle loading previous pages (if desired)
//     if (container.scrollTop === 0 && prevPageURL) {
//         console.log('Loading previous page...');
//         // renderPage(prevPageURL);
//     }
// }

// function handleScroll() {
//     const container = document.querySelector('body');

//     if (isFetching) return;

//     if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
//         isFetching = true;
//         console.log("bottom");
//         loadNextPokemons().then(() => (isFetching = false));
//     } else if (container.scrollTop === 0) {
        
//         // isFetching = true;
//         console.log("top");
//         // loadPrevPokemons().then(() => (isFetching = false));
//     }
// }


