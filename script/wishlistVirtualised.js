let topScroll = 0;
let startingIndex = 20;
let endingIndex = 20;
let pokemonList = [];
const pokeURL = "https://pokeapi.co/api/v2/";

const container = document.querySelector(".container");
const containerWrapper = document.querySelector(".container-wrapper");



let cardsPerRow = Math.floor(containerWrapper.clientWidth/(cardWidth+gap));
let emptyHorizontalSpace = containerWrapper.clientWidth - cardsPerRow*cardWidth - (cardsPerRow-1)*gap;
let leftSpace = emptyHorizontalSpace/2;


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
    container.style.height = Math.floor(idx/cardsPerRow)*(cardHeight+gap)+10*(cardHeight+gap);
    container.appendChild(card);
}

async function renderViewportCards(){
    // showLoading();
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
    // endingIndex = Math.min(endingIndex,pokemonList.length-1);
    console.log(endingIndex,oldEndingIndex);
    console.log(startingIndex,oldEndingIndex);
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
    // stopShowLoading();
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

function loadWishlistIDs(){
    const wishlistIDs = JSON.parse(localStorage.getItem('wishlist')) || [];
    return wishlistIDs;
}

async function loadWishlist(wishlistIDs) {
    const wishlistPromises = wishlistIDs.map(id => fetchPokemon(id));
    const wishlist = await Promise.all(wishlistPromises);
    console.log(wishlist);
    return wishlist;
}

async function fetchPokemon(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    const data = await response.json();
    return data;
}

document.addEventListener("DOMContentLoaded", async () => {
    const wishlistIDs = loadWishlistIDs();
    // console.log(wishlistIDs);
    pokemonList = await loadWishlist(wishlistIDs);
    console.log(pokemonList);
    startingIndex = Math.min(startingIndex,pokemonList.length-1);
    endingIndex = Math.min(endingIndex,pokemonList.length-1);
    renderViewportCards();
})



containerWrapper.addEventListener("scroll",async (e)=>{
    topScroll = e.target.scrollTop;
    await renderViewportCards();
})


