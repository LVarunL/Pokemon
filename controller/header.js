async function getAllTypes() { 
    const data = await getTypes();
    const types = data.map(dataItem => dataItem.name);
    return types;
}

function populateChips(types){
    const filterContainer = document.querySelector(".filters-container");
    
    filterContainer.style.color = "white";
    types = ["All",...types];
    types.forEach((type)=>{
        const newChip = document.createElement("div");
        newChip.classList.add("chip");
        newChip.textContent = type;
        if(type==="All"){
            newChip.style.backgroundColor = "cyan";
        }
        newChip.addEventListener("click",handleChipClick);
        filterContainer.appendChild(newChip);
    })
}

async function handleChipClick(){ //do not make it arrow function, it neeeds binding
    console.log(this);
    this.classList.toggle("selectedChip");
    const isAdding = this.classList.contains("selectedChip");
    const type = this.textContent;
    if(type==="All"){
        //remove selected class from all
        typesDisplayed = [];
        container.innerHTML =  ``;
        pokemonList = [];
        startingIndex = 20;
        endingIndex = 20;
        containerWrapper.scrollTop = 0;
        nextURL = "https://pokeapi.co/api/v2/pokemon";
        const chips = document.querySelectorAll(".chip");
        chips.forEach(chip=>{
            chip.classList.remove("selectedChip");
        });
        await renderViewportCards();
        return;
    }
    if(isAdding){
        console.log("adding " + type);
        const newPokemons = await fetchPokemonsOfType(type);
        if (typesDisplayed.length === 0) {
            container.innerHTML = ``;
            pokemonList = newPokemons;
            console.log(pokemonList);
            startingIndex = 20;
            endingIndex = 20;
            containerWrapper.scrollTop = 0;
            await renderViewportCards();
            typesDisplayed.push(type);
        }
        else {
            pokemonList.push(...newPokemons);
            typesDisplayed.push(type);
            containerWrapper.scrollTop = 0;
            await renderViewportCards();
        }
        
        
    }
    else{
        console.log("removing " + type);
        typesDisplayed = typesDisplayed.filter((typeDisplayed) => {
            return typeDisplayed !== type;
        });
        // const container = document.querySelector(".container");
        container.innerHTML = ``;
        pokemonPromises = [];

        typesDisplayed.forEach((typeDisplayed) => {
            pokemonPromises.push(fetchPokemonsOfType(typeDisplayed));
        })
        const pokemonsToDisplay = await Promise.all(pokemonPromises);
        // console.log(pokemonsToDisplay[0]);
        // renderPokemonCards(pokemonsToDisplay[0]); //check why
        pokemonList = pokemonsToDisplay[0];
        
        console.log(pokemonList);
        if (typesDisplayed.length === 0) {
            container.innerHTML = ``;
            pokemonList = [];
            nextURL = "https://pokeapi.co/api/v2/pokemon";
        }
        startingIndex = 20;
        endingIndex = 20;
        containerWrapper.scrollTop = 0;
        await renderViewportCards();
    }
}