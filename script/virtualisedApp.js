let topScroll = 0;
let startingIndex = 20;
let endingIndex = 20;
let pokemonList = [];
let nextURL = "https://pokeapi.co/api/v2/pokemon";
const pokeURL = "https://pokeapi.co/api/v2/";
let typesDisplayed = [];

const container = document.querySelector(".container");
const containerWrapper = document.querySelector(".container-wrapper");


let cardsPerRow = Math.floor(containerWrapper.clientWidth/(cardWidth+gap));
let emptyHorizontalSpace = containerWrapper.clientWidth - cardsPerRow*cardWidth - (cardsPerRow-1)*gap;
let leftSpace = emptyHorizontalSpace/2;



let isFetching = false;
let isLoadingResize = false;
let isRendering = false;



function createCard(idx) {
    const card = document.createElement('pokemon-card');
    card.classList.add("card");
    card.style.position = "absolute";
    card.style.left = leftSpace+(idx%cardsPerRow)*(cardWidth+gap);
    card.style.top = Math.floor(idx/cardsPerRow)*(cardHeight+gap);
    card.dataset.idx = idx;
    card.data = pokemonList[idx];
    const container = document.querySelector(".container");
    container.style.height = Math.floor(idx/cardsPerRow)*(cardHeight+gap)+4*(cardHeight+gap);
    container.appendChild(card);
}

async function renderViewportCards(){
    showLoading();
    const oldStartingIndex = startingIndex;
    const oldEndingIndex = endingIndex;
    startingIndex = cardsPerRow*(Math.floor(topScroll/(cardHeight+gap)));
    endingIndex = cardsPerRow*(Math.floor((topScroll + containerWrapper.clientHeight) / (cardHeight+gap)))+cardsPerRow-1;
    startingIndex = startingIndex - bufferRows*cardsPerRow;
    endingIndex = endingIndex + bufferRows*cardsPerRow;
    if(startingIndex<0)
    {
        startingIndex = 0;
    }
    if(typesDisplayed.length>0){
        stopShowLoading();
        // await renderViewportCards();
        if(startingIndex!=oldStartingIndex)
            for(i=startingIndex;i<=oldStartingIndex;i+=1){
                if(i>=pokemonList.length){
                    break;
                }
                createCard(i);
            }
            for(i=oldEndingIndex+1;i<=endingIndex;i+=1){
                if(i>=pokemonList.length){
                    break;
                }
                createCard(i);
            }
        return;
    }
    if(endingIndex>pokemonList.length){
        if(isFetching) //check if this is okay
        {
            return;
        }
        isFetching = true;
        await loadNextPokemons();
        isFetching = false;
    }
    for(i=startingIndex;i<oldStartingIndex;i+=1){
        createCard(i);
    }
    for(i=oldEndingIndex+1;i<=endingIndex;i+=1){
        createCard(i);
    }
    stopShowLoading();
}

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

async function loadingResize(){
    isLoadingResize = true;
    const tempStartingIndex = Math.floor((startingIndex+bufferRows*cardsPerRow)/cardsPerRow)*(cardHeight+gap);
    scrollTo(tempStartingIndex,0);
    await renderViewportCards();
    isLoadingResize = false;
}

function showLoading(){
    if(isRendering) return;
    const loader = document.createElement("div");
    loader.textContent = "Loading...";
    loader.classList.add("loader");
    loader.style.position = "absolute";
    loader.style.zIndex = 100;
    loader.style.top = "50vh";
    loader.style.left = "30vw";
    document.body.appendChild(loader);
    isRendering = true;
}

function stopShowLoading(){
    console.log("loaded");
    const loader = document.querySelector(".loader");
    loader.remove();
    isRendering = false;
}


async function getAllTypes() { //is pure
    const typesEndpoint = pokeURL + 'type/?limit=1000';
    const response = await fetch(typesEndpoint);
    const data = (await response.json()).results;

    const types = data.map(dataItem => dataItem.name);
    return types;
}

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

function populateChips(types){
    const filterContainer = document.querySelector(".filters-container");
    // filterContainer.textContent = "filtersssss";
    filterContainer.style.color = "white";
    types = ["All",...types];
    types.forEach((type)=>{
        const newChip = document.createElement("div");
        newChip.classList.add("chip");
        newChip.textContent = type;
        newChip.addEventListener("click",handleChipClick);
        filterContainer.appendChild(newChip);
    })
}

async function handleChipClick(){
    console.log(this);
    this.classList.toggle("selectedChip");
    const isAdding = this.classList.contains("selectedChip");
    const type = this.textContent;
    if(isAdding){
        console.log("adding " + type);
        const newPokemons = await fetchPokemonsOfType(type);
        if (typesDisplayed.length === 0) {
            container.innerHTML = ``;
            pokemonList = newPokemons;
            console.log(pokemonList);
            startingIndex = 20;
            endingIndex = 20;
            containerWrapper.scrollTop = 0;
            await renderViewportCards();
            typesDisplayed.push(type);
        }
        else {
            pokemonList.push(...newPokemons);
            typesDisplayed.push(type);
            containerWrapper.scrollTop = 0;
            await renderViewportCards();
        }
        
        
    }
    else{
        console.log("removing " + type);
        typesDisplayed = typesDisplayed.filter((typeDisplayed) => {
            return typeDisplayed !== type;
        });
        // const container = document.querySelector(".container");
        container.innerHTML = ``;
        pokemonPromises = [];

        typesDisplayed.forEach((typeDisplayed) => {
            pokemonPromises.push(fetchPokemonsOfType(typeDisplayed));
        })
        const pokemonsToDisplay = await Promise.all(pokemonPromises);
        // console.log(pokemonsToDisplay[0]);
        // renderPokemonCards(pokemonsToDisplay[0]); //check why
        pokemonList = pokemonsToDisplay[0];
        
        console.log(pokemonList);
        if (typesDisplayed.length === 0) {
            container.innerHTML = ``;
            pokemonList = [];
            nextURL = "https://pokeapi.co/api/v2/pokemon";
        }
        startingIndex = 20;
        endingIndex = 20;
        containerWrapper.scrollTop = 0;
        await renderViewportCards();
    }
}
//filter stuff below
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



async function handleCheckboxSelect(type) {
    return;
    if (!typesDisplayed.includes(type)) {
        console.log("adding " + type);
        const newPokemons = await fetchPokemonsOfType(type);
        if (typesDisplayed.length === 0) {
            // const container = document.querySelector(".container");
            container.innerHTML = ``;
            pokemonList = newPokemons;
            console.log(pokemonList);
            startingIndex = 20;
            endingIndex = 20;
            await renderViewportCards();
        }
        else {
            pokemonList.push(...newPokemons);
        }
        typesDisplayed.push(type);
    }
    else {
        console.log("removing " + type);
        typesDisplayed = typesDisplayed.filter((typeDisplayed) => {
            return typeDisplayed !== type;
        });
        // const container = document.querySelector(".container");
        container.innerHTML = ``;
        pokemonPromises = [];

        typesDisplayed.forEach((typeDisplayed) => {
            pokemonPromises.push(fetchPokemonsOfType(typeDisplayed));
        })
        const pokemonsToDisplay = await Promise.all(pokemonPromises);
        // console.log(pokemonsToDisplay[0]);
        // renderPokemonCards(pokemonsToDisplay[0]); //check why
        pokemonList = pokemonsToDisplay[0];
        startingIndex = 20;
        endingIndex = 20;
        console.log(pokemonList);
        if (typesDisplayed.length === 0) {
            container.innerHTML = ``;
            pokemonList = [];
            nextURL = "https://pokeapi.co/api/v2/pokemon";
        }
        await renderViewportCards();
    }

}




document.addEventListener('DOMContentLoaded', async () => {
    const types = await getAllTypes();
    populateChips(types);
    
});

document.addEventListener("DOMContentLoaded", () => {
    renderViewportCards();
})



containerWrapper.addEventListener("scroll",async (e)=>{
    topScroll = e.target.scrollTop;
    await renderViewportCards();
})


