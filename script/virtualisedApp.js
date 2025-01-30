let topScroll = 0;
let startingIndex = 20;
let endingIndex = 20;
let pokemonList = [];
let nextURL = "https://pokeapi.co/api/v2/pokemon"

const container = document.querySelector(".container");
const containerWrapper = document.querySelector(".container-wrapper");


const cardHeight = 500;
const cardWidth = 300;
const gap = 30;
const bufferRows = 2;


let cardsPerRow = Math.floor(containerWrapper.clientWidth/(cardWidth+gap));
let emptyHorizontalSpace = containerWrapper.clientWidth - cardsPerRow*cardWidth - (cardsPerRow-1)*gap;
let leftSpace = emptyHorizontalSpace/2;



let isFetching = false;
let isLoadingResize = false;
let isRendering = false;
// const renderedCards = {};

function createCard(idx) {
    const card = document.createElement('pokemon-card');
    card.classList.add("card");
    card.style.position = "absolute";
    card.style.left = leftSpace+(idx%cardsPerRow)*(cardWidth+gap);
    card.style.top = Math.floor(idx/cardsPerRow)*(cardHeight+gap);
    card.dataset.idx = idx;
    card.data = pokemonList[idx];
    const container = document.querySelector(".container");
    container.style.height = Math.floor(idx/cardsPerRow)*(cardHeight+gap)+10*(cardHeight+gap);
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
    if(endingIndex>pokemonList.length){
        if(isFetching)
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

document.addEventListener("DOMContentLoaded", () => {
    renderViewportCards();
})



containerWrapper.addEventListener("scroll",async (e)=>{
    topScroll = e.target.scrollTop;
    await renderViewportCards();
})


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