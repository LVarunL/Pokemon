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
                <input type="text" id="search-bar" placeholder="Search Pokémon by name...">
                <input type="number" id="min-height-filter" placeholder="Min Height">
                <input type="number" id="max-height-filter" placeholder="Max Height">
                <input type="number" id="min-weight-filter" placeholder="Min Weight">
                <input type="number" id="max-weight-filter" placeholder="Max Weight">
                <input type="number" id="min-experience-filter" placeholder="Min Experience">
                <input type="number" id="max-experience-filter" placeholder="Max Experience">
                <select id="type-filter">
                    <option value=""disabled selected>Filter by Type</option>
                    <!-- Add more options here -->
                </select>
                <div class="sort-controls">
                    <select id="sort-by">
                        <option value=""  selected>Default</option>
                        <option value="name">Name</option>
                        <option value="height">Height</option>
                        <option value="weight">Weight</option>
                        <option value="base_experience">Base Experience</option>
                    </select>
                    <label class="toggle-label">
                        <input type="checkbox" id="toggle-sort-order">
                        <span>Descending</span>
                    </label>
                </div>
                <button id="clear-filters" class="clear-btn">Clear Filters</button>
            </div>

            </div>

          `
    }
}

customElements.define('main-header', Header);

class PokemonCard extends HTMLElement {
    set data(pokemon) {
        this.innerHTML = `
            <div class="">
                <div class="card-upper">
                    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                    <h2>${pokemon.name.toUpperCase()}</h2>
                    <p><strong>Specie:</strong> ${pokemon.species.name}</p>
                    <p><strong>Types:</strong> ${pokemon.types.map(t => `<span class="type-badge">${t.type.name}</span>`).join('')}</p>

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

        const wishlistButton = document.createElement('span');
        wishlistButton.className = 'wishlist-icon';
        wishlistButton.innerHTML = '&#9825;'; 

        let wishlistIDs = JSON.parse(localStorage.getItem('wishlist')) || [];
        let wishlist = [];
        wishlistIDs.forEach(id=>{
            wishlist.push(fetchPokemon(id)); //it's async.....
        })
        const isInWishlist = wishlist.some(p => p.name === pokemon.name);
        if (isInWishlist) {
            wishlistButton.innerHTML = '&#9829;'; 
            wishlistButton.classList.add('added');
        }

        wishlistButton.addEventListener('click', () => {
            if (isInWishlist) {
                wishlist = wishlist.filter(p => p.name !== pokemon.name);
                const wishlisIDs = wishlist.map(p => p.id);
                localStorage.setItem('wishlist', JSON.stringify(wishlisIDs));
                wishlistButton.innerHTML = '&#9825;';
                wishlistButton.classList.remove('added');
                alert(`${pokemon.name} removed from wishlist!`);
                if (window.location.pathname.includes('wishlist.html')) {
                    location.reload(); //find alternative if possible
                }
            } else {
                wishlist.push(pokemon);
                const wishlisIDs = wishlist.map(p => p.id);
                localStorage.setItem('wishlist', JSON.stringify(wishlisIDs));
                wishlistButton.innerHTML = '&#9829;';
                wishlistButton.classList.add('added');
                alert(`${pokemon.name} added to wishlist!`);
            }
        });

        this.querySelector('.card-upper').appendChild(wishlistButton);
    }
}

customElements.define('pokemon-card', PokemonCard);