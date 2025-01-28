// function filterPokemon(pokemonList, filters) {
//     return pokemonList.filter(pokemon => {
//         return (
//             (!filters.name || pokemon.name.toLowerCase().includes(filters.name.toLowerCase())) &&
//             (!filters.minHeight || pokemon.height >= filters.minHeight) &&
//             (!filters.maxHeight || pokemon.height <= filters.maxHeight) &&
//             (!filters.minWeight || pokemon.weight >= filters.minWeight) &&
//             (!filters.maxWeight || pokemon.weight <= filters.maxWeight) &&
//             (!filters.minExperience || pokemon.base_experience >= filters.minExperience) &&
//             (!filters.maxExperience || pokemon.base_experience <= filters.maxExperience) &&
//             (!filters.type || pokemon.types.some(t => t.type.name === filters.type))
//         );
//     });
// }

// function applyFilters(pokemonList, filters, renderFunction) {
//     let filteredPokemon = filterPokemon(pokemonList, filters);
//     const sortBy = document.getElementById('sort-by').value;
//     const sortOrder = document.getElementById('toggle-sort-order').dataset.sortOrder || 'asc';
//     if (sortBy) {
//         filteredPokemon = sortPokemon(filteredPokemon, sortBy, sortOrder);
//     }
//     renderFunction(filteredPokemon);
// }

// function initializeFilters(pokemonList, renderFunction) {
//     const filters = {
//         name: '',
//         minHeight: '',
//         maxHeight: '',
//         minWeight: '',
//         maxWeight: '',
//         minExperience: '',
//         maxExperience: '',
//         type: ''
//     };

//     const searchBar = document.getElementById('search-bar');
//     const minHeightFilter = document.getElementById('min-height-filter');
//     const maxHeightFilter = document.getElementById('max-height-filter');
//     const minWeightFilter = document.getElementById('min-weight-filter');
//     const maxWeightFilter = document.getElementById('max-weight-filter');
//     const minExperienceFilter = document.getElementById('min-experience-filter');
//     const maxExperienceFilter = document.getElementById('max-experience-filter');
//     const typeFilter = document.getElementById('type-filter');
//     const clearFiltersButton = document.getElementById('clear-filters');

//     searchBar.addEventListener('input', (event) => {
//         filters.name = event.target.value;
//         applyFilters(pokemonList, filters, renderFunction);
//     });

//     minHeightFilter.addEventListener('input', (event) => {
//         filters.minHeight = event.target.value;
//         applyFilters(pokemonList, filters, renderFunction);
//     });

//     maxHeightFilter.addEventListener('input', (event) => {
//         filters.maxHeight = event.target.value;
//         applyFilters(pokemonList, filters, renderFunction);
//     });

//     minWeightFilter.addEventListener('input', (event) => {
//         filters.minWeight = event.target.value;
//         applyFilters(pokemonList, filters, renderFunction);
//     });

//     maxWeightFilter.addEventListener('input', (event) => {
//         filters.maxWeight = event.target.value;
//         applyFilters(pokemonList, filters, renderFunction);
//     });

//     minExperienceFilter.addEventListener('input', (event) => {
//         filters.minExperience = event.target.value;
//         applyFilters(pokemonList, filters, renderFunction);
//     });

//     maxExperienceFilter.addEventListener('input', (event) => {
//         filters.maxExperience = event.target.value;
//         applyFilters(pokemonList, filters, renderFunction);
//     });

//     typeFilter.addEventListener('change', (event) => {
//         filters.type = event.target.value;
//         applyFilters(pokemonList, filters, renderFunction);
//     });

//     clearFiltersButton.addEventListener('click', () => {
//         filters.name = '';
//         filters.minHeight = '';
//         filters.maxHeight = '';
//         filters.minWeight = '';
//         filters.maxWeight = '';
//         filters.minExperience = '';
//         filters.maxExperience = '';
//         filters.type = '';

//         searchBar.value = '';
//         minHeightFilter.value = '';
//         maxHeightFilter.value = '';
//         minWeightFilter.value = '';
//         maxWeightFilter.value = '';
//         minExperienceFilter.value = '';
//         maxExperienceFilter.value = '';
//         typeFilter.value = '';

//         applyFilters(pokemonList, filters, renderFunction);
//     });
//     document.getElementById('sort-by').addEventListener('change', () => {
//         applyFilters(pokemonList, filters, renderPokemonCards);
//     });
//     document.getElementById('toggle-sort-order').addEventListener('click', () => {
//         const button = document.getElementById('toggle-sort-order');
//         const currentOrder = button.dataset.sortOrder || 'asc';
//         const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
//         button.dataset.sortOrder = newOrder;
//         applyFilters(pokemonList, filters, renderPokemonCards);
//     });
// }

// function sortPokemon(pokemonList, sortBy, sortOrder) {
//     return pokemonList.sort((a, b) => {
//         let comparison = 0;
//         if (sortBy === 'name') {
//             comparison = a.name.localeCompare(b.name);
//         } else if (sortBy === 'height') {
//             comparison = a.height - b.height;
//         } else if (sortBy === 'weight') {
//             comparison = a.weight - b.weight;
//         } else if (sortBy === 'base_experience') {
//             comparison = a.base_experience - b.base_experience;
//         }
//         return sortOrder === 'desc' ? -comparison : comparison;
//     });
// }


//use to make sure not f=refetching anything










// <label for="one">
// <input type="checkbox" id="one" />First checkbox</label>
