function doesWishlistHas(idToCheck){
    const wishlistIDs = getWishlistIDs();
    return wishlistIDs.some(id => id === idToCheck);
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




async function loadingResize(){
    isLoadingResize = true;
    const tempStartingIndex = Math.floor((startingIndex+bufferRows*cardsPerRow)/cardsPerRow)*(cardHeight+gap);
    scrollTo(tempStartingIndex,0);
    await renderViewportCards();
    isLoadingResize = false;
}