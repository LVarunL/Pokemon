function handleResize(thisCard){
    if(isLoadingResize===false){
        loadingResize();
    }
    const idx = thisCard.getAttribute("data-idx");
    cardsPerRow = Math.floor(containerWrapper.clientWidth / (cardWidth + gap));
    emptyHorizontalSpace = containerWrapper.clientWidth - cardsPerRow * cardWidth - (cardsPerRow - 1) * gap;
    leftSpace = emptyHorizontalSpace / 2;
    thisCard.style.left = leftSpace + (idx % cardsPerRow) * (cardWidth + gap);
    thisCard.style.top = Math.floor(idx / cardsPerRow) * (cardHeight + gap);
}

function handleScrollForCard(e, thisCard) {
    const topScroll = e.target.scrollTop;
    if (thisCard.offsetTop + cardHeight + gap <= topScroll - bufferRows * (cardHeight + gap) || thisCard.offsetTop >= topScroll + containerWrapper.clientHeight + bufferRows * (cardHeight + gap)) {
        thisCard.remove();
    }
}

function handleWishlistButtonClick(isInWishlist,id, wishlistButton, name){
    if (isInWishlist) {
        removeIDFromWishlist(id);
        wishlistButton.innerHTML = '&#9825;';
        wishlistButton.classList.remove('added');
        alert(`${name} removed from wishlist!`);
        if (window.location.pathname.includes('wishlist.html')) {
            location.reload();
        }
        
    } else {
        addToWishlist(id);
        wishlistButton.innerHTML = '&#9829;';
        wishlistButton.classList.add('added');
        alert(`${name} added to wishlist!`);
    }
    console.log(getWishlistIDs());
}



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