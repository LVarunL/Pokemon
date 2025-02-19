let topScroll = 0;
let startingIndex = 20;
let endingIndex = 20;
let pokemonList = [];

let typesDisplayed = [];



let cardsPerRow = Math.floor(containerWrapper.clientWidth/(cardWidth+gap));
let emptyHorizontalSpace = containerWrapper.clientWidth - cardsPerRow*cardWidth - (cardsPerRow-1)*gap;
let leftSpace = emptyHorizontalSpace/2;



let isFetching = false;
let isLoadingResize = false;
let isRendering = false;



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




document.addEventListener('DOMContentLoaded', async () => {
    const types = await getAllTypes();
    populateChips(types);
});


document.addEventListener("DOMContentLoaded", () => {
    renderViewportCards();
});

containerWrapper.addEventListener("scroll",async (e)=>{
    topScroll = e.target.scrollTop;
    await renderViewportCards();
})


