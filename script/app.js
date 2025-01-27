let pokimonList = [];
let [from,to] = [1,20]


async function fetchPokemon(id) { //is pure
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    const data = await response.json();
    return data;
}

function renderPokemonCards(pokemonList) { //is pure
    const container = document.querySelector('.container');
    container.innerHTML = '';
    pokemonList.forEach(pokemon => {
        const card = document.createElement('pokemon-card');
        card.classList.add("card");
        card.data = pokemon;
        container.appendChild(card);
    });
}

async function loadPokemon() {
    const pokemonPromises = [];
    for (let id = 1; id <= 20; id++) { //1025 
        pokemonPromises.push(fetchPokemon(id));
    }
    const pokemonListPromises = await Promise.allSettled(pokemonPromises);
    let pokimonList = [];
    pokemonListPromises.forEach((pokimonPromise) => {
        if (pokimonPromise.status === 'fulfilled') {
            pokimonList.push(pokimonPromise.value);
        }
    })
    return pokimonList;
}

async function loadPokemonsInRange() { //uses from and to global variables
    const pokemonPromises = [];
    for (let id = from; id <= to; id++) {
        pokemonPromises.push(fetchPokemon(id));
    }
    const pokemonListPromises = await Promise.allSettled(pokemonPromises);
    let pokimonList = [];
    pokemonListPromises.forEach((pokimonPromise) => {
        if (pokimonPromise.status === 'fulfilled') {
            pokimonList.push(pokimonPromise.value);
        }
    })
    return pokimonList;
}

function getUniqueTypes(pokemonList) { //is pure (but only gets types which are currently in the list on current page)
    const types = new Set();
    pokemonList.forEach(pokemon => {
        pokemon.types.forEach(type => {
            types.add(type.type.name);
        });
    });
    return Array.from(types);
}

function populateTypeDropdown(types) {
    const typeFilter = document.getElementById('type-filter');
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        typeFilter.appendChild(option);
    });
}

async function renderPage(currentPage, totalPages, pokimonsPerPage) {

    [from,to] = getIDsForCurrentPage(currentPage.value, pokimonsPerPage);
    pokemonList = await loadPokemonsInRange();
    renderPokemonCards(pokemonList);
    renderPaginationWithNav(totalPages, currentPage);
}

function renderPaginationWithNav(totalPages, currentPage) { //is pure
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage.value === 1;
    prevButton.onclick = () => {
        if (currentPage.value > 1) {
            currentPage.set(currentPage.value - 1);
        }
    };
    paginationContainer.appendChild(prevButton);
    maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage.value - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if(startPage>1){
        const pageButton = document.createElement('button');
        pageButton.textContent = '...';
        pageButton.onclick = () => {
            //render here
            currentPage.set(startPage-1);
        };
        paginationContainer.appendChild(pageButton);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        
        pageButton.classList.toggle('active', i === currentPage.value); 
        pageButton.onclick = () => {
            //render here
            currentPage.set(i);
        };
        paginationContainer.appendChild(pageButton);
    }

    if(endPage<totalPages){
        const pageButton = document.createElement('button');
        pageButton.textContent = '...';
        pageButton.onclick = () => {
            //render here
            currentPage.set(endPage+1);
        };
        paginationContainer.appendChild(pageButton);
    }


    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage.value === totalPages;
    nextButton.onclick = () => {
        if (currentPage.value < totalPages) {
            //render logic here
            currentPage.set(currentPage.value+1);
            
        }
    };
    paginationContainer.appendChild(nextButton);
};

function getIDsForCurrentPage(currentPage, pokimonsPerPage) { //is pure
    const from = (currentPage - 1) * pokimonsPerPage + 1;
    const to = currentPage * pokimonsPerPage;
    return [from, to];

}





document.addEventListener('DOMContentLoaded', async () => {
    const totalPokemons = 1025;
    let pokimonsPerPage = 20; //later on give user option to select number of pokimons per page 
    from = 1;
    to = pokimonsPerPage; 
    const totalPages = Math.ceil(totalPokemons / pokimonsPerPage);  // Calculate total number of pages
    let currentPage = {
        value: 1,
        async set(newValue) { //is very very unpure
            if (newValue > 0 && newValue <= totalPages) {
                this.value = newValue;
            }
            else if(newValue<=0){
                this.value = 1;
            }
            else if(newValue>totalPages){
                this.value = totalPages;
            }
            renderPage(this, totalPages, pokimonsPerPage);
        }
    }
    
    pokemonList = await loadPokemonsInRange();
    renderPokemonCards(pokemonList);
    // const uniqueTypes = getUniqueTypes(pokemonList);
    // populateTypeDropdown(uniqueTypes);

    // initializeFilters(pokemonList, renderPokemonCards);

    renderPaginationWithNav(totalPages, currentPage);
});

