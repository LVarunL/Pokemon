

function getWishlistIDs(){
    const wishlistIDs = JSON.parse(localStorage.getItem('wishlist')) || [];
    return wishlistIDs;
}

function removeIDFromWishlist(idToRemove){
    const wishlistIDs = getWishlistIDs();
    const updatedWishlistIDs = wishlistIDs.filter(id => id !== idToRemove);
    setWishlist(updatedWishlistIDs);
}

function setWishlist(wishlistIDs){
    localStorage.setItem('wishlist', JSON.stringify(wishlistIDs));
}

function addToWishlist(idToAdd){
    const wishlistIDs = getWishlistIDs();
    wishlistIDs.push(idToAdd);
    setWishlist(wishlistIDs);
}

async function getWishlistFromIDs(wishlistIDs){
    const wishlistPromises = wishlistIDs.map(id => fetchPokemon(id));
    const wishlist = await Promise.all(wishlistPromises);
    console.log(wishlist);
    return wishlist;
}