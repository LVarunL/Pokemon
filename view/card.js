class PokemonCard extends HTMLElement {
    connectedCallback() {
        const thisCard = this;
        const containerWrapper = document.querySelector(".container-wrapper");

        //resize
        const resizeObserver = new ResizeObserver(() => {
            handleResize(thisCard);
        });
        resizeObserver.observe(containerWrapper);

        //scroll
        containerWrapper.addEventListener("scroll", (e) => {
            handleScrollForCard(e, thisCard);
        });



    }
    set data(pokemon) {
        this.innerHTML = `
            <div class="">
                <div class="card-upper">
                    <div class="pokiimage">
                    <img src="${pokemon?.sprites.front_default}" alt="${pokemon?.name}">
                    </div>

                    <h2>${pokemon?.name.toUpperCase()}</h2>
                    <p><strong>Specie:</strong> ${pokemon?.species.name}</p>
                    <p><strong>Types:</strong> ${pokemon?.types.map(t => `<span class="type-badge">${t.type.name}</span>`).join('')}</p>
                    <span class="wishlist-icon">&#9825</span>
                    <button class="audio-btn" onclick="document.getElementById('audio-${pokemon?.id}').play()">🔊</button>
                </div>
                <div class="card-lower">
                    <div class="card-details">
                        <p><strong>Height:</strong> ${pokemon?.height}</p>
                        <p><strong>Weight:</strong> ${pokemon?.weight}</p>
                        <p><strong>Base Experience:</strong> ${pokemon?.base_experience}</p>
                        <p><strong>Forms:</strong> ${pokemon?.forms.map(form => form.name).join(', ')}</p>
                        <p><strong>Abilities:</strong> ${pokemon?.abilities.map(ab => ab.ability.name).join(', ')}</p>
                    </div>
                    <div class="card-stats">
                        ${pokemon?.stats.map(stat => `<p><strong>${stat.stat.name}:</strong> ${stat.base_stat}</p>`).join('')}
                    </div>
                </div>
                <audio id="audio-${pokemon?.id}" src="${pokemon?.cries.latest}" type="audio/ogg"></audio>
            </div>
        `;

        //wishlist
        const wishlistButton = this.querySelector('.wishlist-icon');
        let isInWishlist = doesWishlistHas(pokemon?.id);
        if (isInWishlist) {
            wishlistButton.innerHTML = '&#9829;';
            wishlistButton.classList.add('added');
        }

        wishlistButton.addEventListener('click', () => {
            handleWishlistButtonClick(isInWishlist, pokemon?.id, wishlistButton, pokemon?.name);
            isInWishlist = doesWishlistHas(pokemon?.id);
        });

        //image
        const pokiImage = this.querySelector('.pokiimage');
        pokiImage.addEventListener('mouseover', function () {
            pokiImage.innerHTML = `<img src="${pokemon?.sprites.other.showdown.front_default ? pokemon?.sprites.other.showdown.front_default : pokemon?.sprites.front_default}" alt="${pokemon?.name}">`
        });

        pokiImage.addEventListener('mouseout', function () {
            pokiImage.innerHTML = `<img src="${pokemon?.sprites.front_default}" alt="${pokemon?.name}">`
        });
    }

}


customElements.define('pokemon-card', PokemonCard);