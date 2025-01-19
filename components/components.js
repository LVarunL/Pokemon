class Header extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="header">
                <h1>Pokimon</h1>
            </div>
            <nav class="navbar">
                <a href="index.html">Home</a>
                <a href="wishlist.html">Wishlist</a></li>
            </nav>
            <input type="text" id="search-bar" placeholder="Search Pokémon by name...">
            <input type="number" id="min-height-filter" placeholder="Min height...">
            <input type="number" id="max-height-filter" placeholder="Max height...">
            <input type="number" id="min-weight-filter" placeholder="Min weight...">
            <input type="number" id="max-weight-filter" placeholder="Max weight...">
            <input type="number" id="min-experience-filter" placeholder="Min base experience...">
            <input type="number" id="max-experience-filter" placeholder="Max base experience...">
            <select id="type-filter">
                <option value="">Filter by type...</option>
            </select>
            <button id="clear-filters">Clear Filters</button>
            <select id="sort-by">
                <option value="">Sort by...</option>
                <option value="name">Name</option>
                <option value="height">Height</option>
                <option value="weight">Weight</option>
                <option value="base_experience">Base Experience</option>
            </select>
            <button id="toggle-sort-order">Toggle Sort Order</button>
          `
    }
}

customElements.define('main-header', Header);

class PokemonCard extends HTMLElement {
    set data(pokemon) {
        this.innerHTML = `
            <div class="card">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <h2>${pokemon.name}</h2>
                <p>Species: ${pokemon.species.name}</p>
                <p>Height: ${pokemon.height}</p>
                <p>Weight: ${pokemon.weight}</p>
                <p>Base Experience: ${pokemon.base_experience}</p>
                <p>Forms: ${pokemon.forms.map(form => form.name).join(', ')}</p>
                <p>Types: ${pokemon.types.map(t => t.type.name).join(', ')}</p>
                <p>Abilities: ${pokemon.abilities.map(ab => ab.ability.name).join(', ')}</p>
                <h3>Stats</h3>
                <p>${pokemon.stats[0].stat.name}:${pokemon.stats[0]['base_stat']}</p>
                <p>${pokemon.stats[1].stat.name}:${pokemon.stats[1]['base_stat']}</p>
                <p>${pokemon.stats[2].stat.name}:${pokemon.stats[2]['base_stat']}</p>
                <p>${pokemon.stats[3].stat.name}:${pokemon.stats[3]['base_stat']}</p>
                <p>${pokemon.stats[4].stat.name}:${pokemon.stats[4]['base_stat']}</p>
                <p>${pokemon.stats[5].stat.name}:${pokemon.stats[5]['base_stat']}</p>
                
                <audio controls>
                    <source src="${pokemon.cries.latest}" type="audio/ogg">
                    Your browser does not support the audio element.
                </audio>
            </div>
        `;

        if (!window.location.pathname.includes('wishlist.html')) {
            const wishlistButton = document.createElement('button');
            wishlistButton.className = 'wishlist-btn';
            wishlistButton.textContent = 'Add to Wishlist';

            // Check if the Pokémon is already in the wishlist
            let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            const isInWishlist = wishlist.some(p => p.name === pokemon.name);
            if (isInWishlist) {
                wishlistButton.textContent = 'In Wishlist';
                wishlistButton.disabled = true;
            }

            wishlistButton.addEventListener('click', () => {
                if (!isInWishlist) {
                    wishlist.push(pokemon);
                    localStorage.setItem('wishlist', JSON.stringify(wishlist));
                    wishlistButton.textContent = 'In Wishlist';
                    wishlistButton.disabled = true;
                    alert(`${pokemon.name} added to wishlist!`);
                } else {
                    alert(`${pokemon.name} is already in the wishlist!`);
                }
            });

            this.querySelector('.card').appendChild(wishlistButton);
        }
    }
}

customElements.define('pokemon-card', PokemonCard);

