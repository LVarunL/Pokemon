let topScroll = 0;
let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
const itemHeight = 500+30;
let startingIndex = 8;
let endingIndex = 8;
let pokemonList = [];
// const pokeURL = "https://pokeapi.co/api/v2/";
let nextURL = "https://pokeapi.co/api/v2/pokemon"
let isFetching = false;


function createCard(idx) {
    const card = document.createElement('pokemon-card');
    card.classList.add("card");
    card.style.position = "absolute";
    card.style.left = 55+(idx%4)*(330);
    card.style.top = 0+Math.floor(idx/4)*(530);
    card.style.backgroundColor = "white";
    card.dataset.idx = idx;
    card.data = pokemonList[idx];
    const container = document.querySelector(".container");
    container.style.height = 0+Math.floor(idx/4)*(530)+530+2000;
    container.appendChild(card);
}

async function renderViewportCards(){
    const oldStartingIndex = startingIndex;
    const oldEndingIndex = endingIndex;
    startingIndex = 4*Math.floor(topScroll/itemHeight);
    endingIndex = 4*Math.floor((topScroll + vh) / itemHeight)+3;
    console.log(startingIndex,endingIndex,oldStartingIndex,oldEndingIndex);
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

document.addEventListener("scroll",async (e)=>{
    await renderViewportCards();
    topScroll = e.currentTarget.scrollingElement.scrollTop;
})

