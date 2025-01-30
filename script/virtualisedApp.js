let topScroll = 0;
let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
let startingIndex = 16;
let endingIndex = 16;
let pokemonList = [];
let nextURL = "https://pokeapi.co/api/v2/pokemon"
let isFetching = false;


const container = document.querySelector(".container");
const containerWrapper = document.querySelector(".container-wrapper");
const containerWidth = container.clientWidth;
const cardHeight = 500;
const cardWidth = 300;
const gap = 30;
const cardsPerRow = Math.floor(containerWidth/(cardWidth+gap));
const emptyHorizontalSpace = containerWidth - cardsPerRow*cardWidth - (cardsPerRow-1)*gap;
const leftSpace = emptyHorizontalSpace/2;
const bufferRows = 2;


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
    console.log("added",idx);
    container.appendChild(card);
}

async function renderViewportCards(){
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
    // console.log(startingIndex,endingIndex,oldStartingIndex,oldEndingIndsex);
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

// container.addEventListener("scroll",async (e)=>{
//     console.log("hio");
//     topScroll = e.currentTarget.scrollingElement.scrollTop;
//     console.log(topScroll);
//     await renderViewportCards();
    
// })

containerWrapper.addEventListener("scroll",async (e)=>{
    topScroll = e.target.scrollTop;
    // console.log(topScroll);
    await renderViewportCards();
})

