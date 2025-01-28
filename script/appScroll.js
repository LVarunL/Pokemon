let pokimonList = [];
let [from, to] = [1, 50];
let typesDisplayed = [];
let pokemonsPerPage = 16;

let isFetching = false;
let currentPage = {
    
    value: 1,
     set(newValue) { //is very very unpure
        if (newValue > 0 ) {
            this.value = newValue;
        }
        else if (newValue <= 0) {
            this.value = 1;
        }
        showLoader();
        renderPage().then(()=>isFetching=false);
    },
}
let nextPageURL;
let prevPageURL;
const pokeURL = "https://pokeapi.co/api/v2/";

const baseURL = `https://pokeapi.co/api/v2/pokemon/?limit=${pokemonsPerPage}&offset=0`;



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

async function fetchPokemonsFromURLList(urlList){
    let pokimonPromises = [];
    urlList.forEach((url) => {
        pokimonPromises.push(fetchPokemonFromURL(url));
    });
    const pokemonsFromURL = await Promise.all(pokimonPromises); //change it to allsettled
    return pokemonsFromURL;
}

async function getAllTypes() { //is pure
    const typesEndpoint = pokeURL + 'type/?limit=1000';
    const response = await fetch(typesEndpoint);
    const data = (await response.json()).results;

    const types = data.map(dataItem => dataItem.name);
    return types;
}

async function getNextPagePokimons(){

} 


function populateTypeDropdown(types) { // is pure
    const typeFilter = document.getElementById('checkboxes');
    types.forEach(type => {
        const option = document.createElement('label');
        const optionInput = document.createElement('input');
        optionInput.setAttribute("type", "checkbox");
        optionInput.setAttribute("name", "typeOption");
        optionInput.dataset.value = type;
        optionInput.addEventListener("click", () => handleCheckboxSelect(type));
        option.textContent = type;
        option.appendChild(optionInput);
        typeFilter.appendChild(option);
    });
}

function showLoader() { //is pure
    const loaderExisting = document.querySelector('.loader');
    if (!loaderExisting) {
        const container = document.querySelector('.container');
        const loader = document.createElement('div');
        loader.textContent = "Loading...";
        loader.classList.add("loader");
        container.insertAdjacentElement('afterend', loader);
    }
    else {
        loaderExisting.remove();
    }
}

function renderPokemonCards(pokemonsToRender) { //is pure
    if (!pokemonsToRender) return;
    const container = document.querySelector('.container');
    pokemonsToRender.forEach(pokemon => {
        const card = document.createElement('pokemon-card');
        card.classList.add("card");
        card.data = pokemon;
        container.appendChild(card);
    });
    showLoader();//check if this is the correct place to put loader, also check if the function is still pure
}





async function handleCheckboxSelect(type) { 
    console.log(type);
    if (!typesDisplayed.includes(type)) {
        console.log("adding " + type);
        const newPokimons = await fetchPokemonsOfType(type);
        if (typesDisplayed.length === 0) {
            // filteredPokemonList = newPokimons;
            const container = document.querySelector(".container");
            container.innerHTML = ``;
            renderPokemonCards(newPokimons);
        }
        else {
            renderPokemonCards(newPokimons);
        }
        typesDisplayed.push(type);
    }
    else {
        console.log("removing " + type);
        typesDisplayed = typesDisplayed.filter((typeDisplayed) => {
            return typeDisplayed !== type;
        });
        const container = document.querySelector(".container");
        container.innerHTML = ``;
        pokemonPromises = [];

        typesDisplayed.forEach((typeDisplayed) => {
            pokemonPromises.push(fetchPokemonsOfType(typeDisplayed));
        })
        const pokemonsToDisplay = await Promise.all(pokemonPromises);
        // console.log(pokemonsToDisplay[0]);
        renderPokemonCards(pokemonsToDisplay[0]); //check why
        if (typesDisplayed.length === 0) {
            currentPage.value = 1;
            from = 1;
            to = pokemonsPerPage;
            renderPage();
        }

    }
    
}




var expanded = false;
function showCheckboxes() {
    var checkboxes = document.getElementById("checkboxes");
    if (!expanded) {
        checkboxes.style.display = "block";
        // console.log("lpo")
        expanded = true;
    } else {
        checkboxes.style.display = "none";
        expanded = false;
    }
}

async function renderPage() {

    const pokemonPromises = await fetch(nextPageURL);
    const pokemonsData = await pokemonPromises.json();
    nextPageURL = pokemonsData.next;
    console.log(nextPageURL);
    prevPageURL = pokemonsData.prev;
    const pokemonsURLs = pokemonsData.results.map((pokimonData)=>{
        // console.log(pokimonData.url);
        return pokimonData.url;

    });
    const pokemons = await fetchPokemonsFromURLList(pokemonsURLs);
    renderPokemonCards(pokemons);
}

document.addEventListener('DOMContentLoaded', async () => {
    const types = await getAllTypes();
    populateTypeDropdown(types);
    const selectBox = document.querySelector(".selectBox");
    selectBox.addEventListener("click", (e) => {
        showCheckboxes();
    });
});

document.addEventListener('DOMContentLoaded', async () => {
    from = 1;
    to = pokemonsPerPage;

    const initialPokemonsPromise = await fetch(baseURL);
    const initialPokemonsData = await initialPokemonsPromise.json();
    nextPageURL = initialPokemonsData.next;
    prevPageURL = initialPokemonsData.prev;
    const initialPokemonsURLs = initialPokemonsData.results.map((pokimonData)=>{
        
        return pokimonData.url

    });
    console.log(initialPokemonsURLs);
    const initialPokemons = await fetchPokemonsFromURLList(initialPokemonsURLs);
    console.log(initialPokemons);
    renderPokemonCards(initialPokemons);

    const container = document.querySelector('body');
    container.onscroll =  () => {
        if(isFetching) 
        {
            return;
        }
        if (
            Math.ceil(container.clientHeight
                + container.scrollTop) >=
            container.scrollHeight
        ) {
           
                isFetching = true;
                console.log("adding bro");
                 currentPage.set(currentPage.value + 1);
                
        }
    };
    
});

