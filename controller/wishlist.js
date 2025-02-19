let topScroll = 0;
let startingIndex = 20;
let endingIndex = 20;
let pokemonList = [];




let cardsPerRow = Math.floor(containerWrapper.clientWidth/(cardWidth+gap));
let emptyHorizontalSpace = containerWrapper.clientWidth - cardsPerRow*cardWidth - (cardsPerRow-1)*gap;
let leftSpace = emptyHorizontalSpace/2;


let isLoadingResize = false;
let isRendering = false;




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






document.addEventListener("DOMContentLoaded", async () => {
    const wishlistIDs = getWishlistIDs();
    pokemonList = await getWishlistFromIDs(wishlistIDs);
    startingIndex = Math.min(startingIndex,pokemonList.length-1);
    endingIndex = Math.min(endingIndex,pokemonList.length-1);
    renderViewportCards();
})




containerWrapper.addEventListener("scroll",async (e)=>{
    topScroll = e.target.scrollTop;
    await renderViewportCards();
});


