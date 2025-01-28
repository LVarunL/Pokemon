let pokimonList = [];
let [from, to] = [1, 50]
const pokeURL = "https://pokeapi.co/api/v2/"
let typesDisplayed = [];


async function fetchPokemon(id) { //is pure
    const response = await fetch(pokeURL + "pokemon/" + id);
    const data = await response.json();
    return data;
}

async function fetchPokemonFromURL(url) { //is pure
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function fetchPokemonsOfType(type) { //is pure
    const response = await fetch(pokeURL + 'type/' + type);
    const data = await response.json();
    const pokemons = data.pokemon;
    let pokemonList = [];
    let pokimonPromises = [];
    pokemons.forEach((pokemon) => {
        // console.log(pokemon.pokemon.url);
        pokimonPromises.push(fetchPokemonFromURL(pokemon.pokemon.url));
    })
    pokemonList = await Promise.all(pokimonPromises); //change it to allsettled
    return pokemonList;
}

async function getAllTypes() { //is pure
    const typesEndpoint = pokeURL + 'type/?limit=1000';
    const response = await fetch(typesEndpoint);
    const data = (await response.json()).results;

    const types = data.map(dataItem => dataItem.name);
    // console.log(types);
    return types;
}

function populateTypeDropdown(types) { // is pure
    const typeFilter = document.getElementById('checkboxes');
    types.forEach(type => {
        const option = document.createElement('label');
        const optionInput = document.createElement('input');
        optionInput.setAttribute("type", "checkbox");
        optionInput.setAttribute("name", "typeOption");
        optionInput.dataset.value = type;
        optionInput.addEventListener("click", () => handleCheckboxSelect(type));
        option.textContent = type;
        option.appendChild(optionInput);
        typeFilter.appendChild(option);
    });
}

function showLoader() { //is pure
    const loaderExisting = document.querySelector('.loader');
    if (!loaderExisting) {
        const container = document.querySelector('.container');
        const loader = document.createElement('div');
        loader.textContent = "Loading...";
        loader.classList.add("loader");
        container.insertAdjacentElement('afterend', loader);
    }
    else {
        loaderExisting.remove()
    }
}

function renderPokemonCards(pokemonsToRender) { //is pure
    if(!pokemonsToRender) return;
    const container = document.querySelector('.container');
    pokemonsToRender.forEach(pokemon => {
        const card = document.createElement('pokemon-card');
        card.classList.add("card");
        card.data = pokemon;
        container.appendChild(card);
    });
    showLoader();//check if this is the correct place to put loader, also check if the function is still pure
}

// async function loadPokemon() {
//     const pokemonPromises = [];
//     for (let id = 1; id <= 1025; id++) { //1025 
//         pokemonPromises.push(fetchPokemon(id));
//     }
//     const pokemonListPromises = await Promise.allSettled(pokemonPromises);
//     let pokimonList = [];
//     pokemonListPromises.forEach((pokimonPromise) => {
//         if (pokimonPromise.status === 'fulfilled') {
//             pokimonList.push(pokimonPromise.value);
//         }
//     })
//     return pokimonList;
// }

// async function loadPokemonsInRange() { //uses from and to global variables
//     const pokemonPromises = [];
//     for (let id = from; id <= to; id++) {
//         pokemonPromises.push(fetchPokemon(id));
//     }
//     const pokemonListPromises = await Promise.allSettled(pokemonPromises);
//     let rangePokemonList = [];
//     pokemonListPromises.forEach((pokimonPromise) => {
//         if (pokimonPromise.status === 'fulfilled') {
//             rangePokemonList.push(pokimonPromise.value);
//         }
//     })
//     return rangePokemonList;
// }



async function handleCheckboxSelect(type) { //also handle unchecking of checkbox
    // const checkedBoxes = document.querySelectorAll('input[name="typeOption"]:checked');
    // const selectedTypes = [...checkedBoxes].map(checkedBox=>{
    //     return checkedBox.dataset.value;
    // })
    console.log(type);
    if (!typesDisplayed.includes(type)) {
        console.log("adding " + type);
        const newPokimons = await fetchPokemonsOfType(type);
        if (typesDisplayed.length === 0) {
            // filteredPokemonList = newPokimons;
            const container = document.querySelector(".container");
            container.innerHTML = ``;
            renderPokemonCards(newPokimons);
        }
        else {
            // filteredPokemonList = [...filteredPokemonList, newPokimons];
            renderPokemonCards(newPokimons);
        }
        typesDisplayed.push(type);
    }
    else {
        console.log("removing " + type);
        typesDisplayed = typesDisplayed.filter((typeDisplayed) => {
            return typeDisplayed !== type;
        });
        const container = document.querySelector(".container");
        container.innerHTML = ``;
        pokemonPromises = [];
        
        typesDisplayed.forEach((typeDisplayed)=>{
            pokemonPromises.push(fetchPokemonsOfType(typeDisplayed));
        })
        const pokemonsToDisplay = await Promise.all(pokemonPromises);
        // console.log(pokemonsToDisplay[0]);
        renderPokemonCards(pokemonsToDisplay[0]); //check why
        // if(typesDisplayed.length===0){
        //     renderPokemonCards(pokimonList);
        // }

    }
    // selectedTypes.forEach(async (type)=>{
    //     if(!typesDisplayed.includes(type)){
    //         console.log(type);
    //         const newPokimons = await fetchPokemonsOfType(type);
    //         console.log(newPokimons);
    //         if(typesDisplayed.length === 0){
    //             pokimonList = newPokimons;
    //             const container = document.querySelector(".container");
    //             container.innerHTML = ``;
    //             renderPokemonCards(pokimonList);
    //         }
    //         else{
    //             pokimonList = [...pokimonList,newPokimons];

    //             renderPokemonCards(pokimonList);
    //         }
    //         typesDisplayed.push(type);
    //     }
    // })
}




var expanded = false;
function showCheckboxes() {
    var checkboxes = document.getElementById("checkboxes");
    if (!expanded) {
        checkboxes.style.display = "block";
        // console.log("lpo")
        expanded = true;
    } else {
        checkboxes.style.display = "none";
        expanded = false;
    }
}

// async function renderPage(currentPage, totalPages, pokimonsPerPage, pokimonList) {

//     [from, to] = getIDsForCurrentPage(currentPage.value, pokimonsPerPage);
//     newPokemonList = await loadPokemonsInRange(pokimonList);
//     renderPokemonCards(newPokemonList);
//     // renderPaginationWithNav(totalPages, currentPage);
// }

// function renderPaginationWithNav(totalPages, currentPage) { //is pure
//     const paginationContainer = document.getElementById('pagination');
//     paginationContainer.innerHTML = '';

//     const prevButton = document.createElement('button');
//     prevButton.textContent = 'Previous';
//     prevButton.disabled = currentPage.value === 1;
//     prevButton.onclick = () => {
//         if (currentPage.value > 1) {
//             currentPage.set(currentPage.value - 1);
//         }
//     };
//     paginationContainer.appendChild(prevButton);
//     maxPagesToShow = 5;
//     let startPage = Math.max(1, currentPage.value - Math.floor(maxPagesToShow / 2));
//     let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

//     if (endPage - startPage < maxPagesToShow - 1) {
//         startPage = Math.max(1, endPage - maxPagesToShow + 1);
//     }

//     if(startPage>1){
//         const pageButton = document.createElement('button');
//         pageButton.textContent = '...';
//         pageButton.onclick = () => {
//             //render here
//             currentPage.set(startPage-1);
//         };
//         paginationContainer.appendChild(pageButton);
//     }

//     for (let i = startPage; i <= endPage; i++) {
//         const pageButton = document.createElement('button');
//         pageButton.textContent = i;

//         pageButton.classList.toggle('active', i === currentPage.value); 
//         pageButton.onclick = () => {
//             //render here
//             currentPage.set(i);
//         };
//         paginationContainer.appendChild(pageButton);
//     }

//     if(endPage<totalPages){
//         const pageButton = document.createElement('button');
//         pageButton.textContent = '...';
//         pageButton.onclick = () => {
//             //render here
//             currentPage.set(endPage+1);
//         };
//         paginationContainer.appendChild(pageButton);
//     }


//     const nextButton = document.createElement('button');
//     nextButton.textContent = 'Next';
//     nextButton.disabled = currentPage.value === totalPages;
//     nextButton.onclick = () => {
//         if (currentPage.value < totalPages) {
//             //render logic here
//             currentPage.set(currentPage.value+1);

//         }
//     };
//     paginationContainer.appendChild(nextButton);
// };

// function getIDsForCurrentPage(currentPage, pokimonsPerPage) { //is pure
//     const from = (currentPage - 1) * pokimonsPerPage + 1;
//     const to = currentPage * pokimonsPerPage;
//     return [from, to];

// }



document.addEventListener('DOMContentLoaded', async () => {
    const types = await getAllTypes();
    populateTypeDropdown(types);
    const selectBox = document.querySelector(".selectBox");
    selectBox.addEventListener("click", (e) => {
        // e.stopImmediatePropagation();
        // e.stopPropagation();
        showCheckboxes();
    })
    // populateTypeDropdown(types);
})

document.addEventListener('DOMContentLoaded', async () => {
    const totalPokemons = 1025;
    let pokimonsPerPage = 16; //later on give user option to select number of pokimons per page 
    from = 1;
    to = pokimonsPerPage;
    let pokimonList = [];
    const totalPages = Math.ceil(totalPokemons / pokimonsPerPage);  // Calculate total number of pages
    let currentPage = {
        value: 1,
        async set(newValue) { //is very very unpure
            if (newValue > 0 && newValue <= totalPages) {
                this.value = newValue;
            }
            else if (newValue <= 0) {
                this.value = 1;
            }
            else if (newValue > totalPages) {
                this.value = totalPages;
            }
            showLoader();
            // renderPage(this, totalPages, pokimonsPerPage, pokimonList);
        }
    }

    // pokemonList = await loadPokemonsInRange();
    // renderPokemonCards(pokemonList);

    const container = document.querySelector('body');
    container.onscroll = () => {
        // if (isLoading) return;

        if (
            Math.ceil(container.clientHeight
                + container.scrollTop) >=
            container.scrollHeight
        ) {
            if (currentPage.value < totalPages) {
                //render logic here
                console.log("adding bro");
                currentPage.set(currentPage.value + 1);

            }
        }
    };
    // const uniqueTypes = getUniqueTypes(pokemonList);
    // populateTypeDropdown(uniqueTypes);

    // initializeFilters(pokemonList, renderPokemonCards);

    // renderPaginationWithNav(totalPages, currentPage);
});


// window.addEventListener('scroll', () => {
//     const {
//         scrollTop,
//         scrollHeight,
//         clientHeight
//     } = document.documentElement;

//     if (scrollTop + clientHeight ) {
//         console.log("hi");
//     }
// });


