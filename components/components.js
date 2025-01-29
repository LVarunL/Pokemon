// class Header extends HTMLElement {
//     connectedCallback() {
//         this.innerHTML = `
//             <div class="header">
//                 <img src="images/header.svg" alt="PokeAPI logo">
//                 <nav class="navbar">
//                     <a href="index.html">Home</a>
//                     <a href="wishlist.html">Wishlist</a>
//                 </nav>  
//             </div>
            
//             <div class="filters-container">
//                 <input type="text" id="search-bar" placeholder="Search Pokémon by name...">
//                 <input type="number" id="min-height-filter" placeholder="Min Height">
//                 <input type="number" id="max-height-filter" placeholder="Max Height">
//                 <input type="number" id="min-weight-filter" placeholder="Min Weight">
//                 <input type="number" id="max-weight-filter" placeholder="Max Weight">
//                 <input type="number" id="min-experience-filter" placeholder="Min Experience">
//                 <input type="number" id="max-experience-filter" placeholder="Max Experience">
//                 <select id="type-filter">
//                     <option value=""disabled selected>Filter by Type</option>
//                     <!-- Add more options here -->
//                 </select>
//                 <div class="sort-controls">
//                     <select id="sort-by">
//                         <option value=""  selected>Sort By...</option>
//                         <option value="name">Name</option>
//                         <option value="height">Height</option>
//                         <option value="weight">Weight</option>
//                         <option value="base_experience">Base Experience</option>
//                     </select>
//                     <label class="toggle-label">
//                         <input type="checkbox" id="toggle-sort-order">
//                         <span>Descending</span>
//                     </label>
//                 </div>
//                 <button id="clear-filters" class="clear-btn">Clear Filters</button>
//             </div>

//             </div>

//           `
//     }
// }
// import { renderedCards } from "../script/virtualisedApp";

class Header extends HTMLElement {
    
    connectedCallback() {
        this.innerHTML = `
            <div class="header">
                <img src="images/header.svg" alt="PokeAPI logo">
                <nav class="navbar">
                    <a href="index.html">Home</a>
                    <a href="wishlist.html">Wishlist</a>
                </nav>  
            </div>
            
            <div class="filters-container">
                <form>
                    <div class="multiselect">
                        <div class="selectBox"">
                            Select Types
                            <div id="checkboxes">
                            
                            </div>
                        </div>
                        
                    </div>
                </form>

            </div>

            </div>

          `
    }
    

    
}

customElements.define('main-header', Header);

class PokemonCard extends HTMLElement {
    connectedCallback(){
        const thisCard = this;

        function handleScrollForCard() {
            console.log(window.innerHeight,"le");
            let bounding = thisCard.getBoundingClientRect();
            if (bounding.top >= -1*(bufferRows+1)*(cardHeight+gap) //document.documentElement.clientHeight<=bounding.top+(cardHeight+gap)*(bufferRows+1) OR bounding.bottom-(bufferRows+1)*cardHeight<=window.innerHeight
                && bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) + (bufferRows+1)*(cardHeight+gap)) {
                    
            } else {
                
                thisCard.remove();
            }

        }
        // function handleScrollForCard() {
        //     let bounding = thisCard.getBoundingClientRect();
        //     const bufferHeight = (cardHeight + gap) * bufferRows; // Buffer height

        //     // Keep cards within buffer range
        //     if (
        //         bounding.top >= -bufferHeight && 
        //         bounding.bottom <= (window.innerHeight + bufferHeight)
        //     ) {
        //         return; // Within buffer, do nothing
        //     }

        //     // Remove only if outside buffer range
        //     thisCard.remove();
        // }
        
        
        document.addEventListener("scroll",()=>{
            // console.log("kji");
            handleScrollForCard();
        });
        
    }
    set data(pokemon) {
        this.innerHTML = `
            <div class="">
                <div class="card-upper">
                    <div class="pokiimage">
                    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                    </div>

                    <h2>${pokemon.name.toUpperCase()}</h2>
                    <p><strong>Specie:</strong> ${pokemon.species.name}</p>
                    <p><strong>Types:</strong> ${pokemon.types.map(t => `<span class="type-badge">${t.type.name}</span>`).join('')}</p>
                    <span class="wishlist-icon">&#9825</span>
                    <button class="audio-btn" onclick="document.getElementById('audio-${pokemon.id}').play()">🔊</button>
                </div>
                <div class="card-lower">
                    <div class="card-details">
                        <p><strong>Height:</strong> ${pokemon.height}</p>
                        <p><strong>Weight:</strong> ${pokemon.weight}</p>
                        <p><strong>Base Experience:</strong> ${pokemon.base_experience}</p>
                        <p><strong>Forms:</strong> ${pokemon.forms.map(form => form.name).join(', ')}</p>
                        <p><strong>Abilities:</strong> ${pokemon.abilities.map(ab => ab.ability.name).join(', ')}</p>
                    </div>
                    <div class="card-stats">
                        ${pokemon.stats.map(stat => `<p><strong>${stat.stat.name}:</strong> ${stat.base_stat}</p>`).join('')}
                    </div>
                </div>
                <audio id="audio-${pokemon.id}" src="${pokemon.cries.latest}" type="audio/ogg"></audio>
            </div>
        `;

        

        

    
        const wishlistButton = this.querySelector('.wishlist-icon');
        let wishlistIDs = JSON.parse(localStorage.getItem('wishlist')) || [];
        const isInWishlist = wishlistIDs.some(id => id === pokemon.id);
        if (isInWishlist) {
            wishlistButton.innerHTML = '&#9829;'; 
            wishlistButton.classList.add('added');
        }

        wishlistButton.addEventListener('click', () => {
            if (isInWishlist) {
                wishlistIDs = wishlistIDs.filter(id => id !== pokemon.id);
                // const wishlisIDs = wishlist.map(p => p.id);
                localStorage.setItem('wishlist', JSON.stringify(wishlistIDs));
                wishlistButton.innerHTML = '&#9825;';
                wishlistButton.classList.remove('added');
                alert(`${pokemon.name} removed from wishlist!`);
                if (window.location.pathname.includes('wishlist.html')) {
                    location.reload(); //find alternative if possible
                }
                // else{
                //     location.reload();
                // }
            } else {
                wishlistIDs.push(pokemon.id);
                localStorage.setItem('wishlist', JSON.stringify(wishlistIDs));
                wishlistButton.innerHTML = '&#9829;';
                wishlistButton.classList.add('added');
                alert(`${pokemon.name} added to wishlist!`);
                location.reload(); //find alternative
            }
        });

        const pokiImage = this.getElementsByClassName('pokiimage');

        for (let i = 0; i < pokiImage.length; i++) {
            pokiImage[i].addEventListener('mouseover', function() {
                // console.log("hi pokiimage");
                // console.log(pokiImage[i]);
                pokiImage[i].innerHTML = `<img src="${pokemon.sprites.other.showdown.front_default?pokemon.sprites.other.showdown.front_default:pokemon.sprites.front_default}" alt="${pokemon.name}">`
            });

            pokiImage[i].addEventListener('mouseout', function() {

                pokiImage[i].innerHTML = `<img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">`
            });
        }

        // console.log(pokiImage);
        // const pokiImage = this.getElementsByClassName('pokiimage');
        // // console.log(pokiImage)
        // pokiImage.addEventListener('mouseover', () => {

        //     pokiImage.innerHTML = `<img src="${pokemon.sprites.other.showdown?pokemon.sprites.other.showdown.front_default:pokemon.sprites.front_default}" alt="${pokemon.name}">`
        // });
        // pokiImage.innerHTML = `<img src="${pokemon.sprites.other.showdown?pokemon.sprites.other.showdown.front_default:pokemon.sprites.front_default}" alt="${pokemon.name}">

        // this.querySelector('.card-upper').appendChild(wishlistButton);
    }
}

customElements.define('pokemon-card', PokemonCard);

