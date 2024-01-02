let currentPokemon;
let firstPokemons;
let searchPokemon;
let allPokemons;
let firstPokemonsCount = 30;
let loadMoreStatus = true;
let typeforbackground;
let debounceTimeout;
let isSearching = false;


async function init(){
    await renderAllPokemons();
    createFirstPokemonsHTML();
}

async function renderAllPokemons(){
    let url = `https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`;
    let response = await fetch(url);
    allPokemons = await response.json();

    loadFirstPokemons(allPokemons);
}

function loadFirstPokemons(allPokemons){

    firstPokemons = allPokemons['results'].slice(0, firstPokemonsCount);
}

function createFirstPokemonsHTML(){
    let allPokemonsHTML = document.getElementById('allPokemons');

    allPokemonsHTML.innerHTML = '';
    ForFirstPokemons();
}

async function ForFirstPokemons(){
    for (let i = 0; i < firstPokemons.length; i++) {
    let pokemonURL = firstPokemons[i]['url'];

        renderPokemonInfoCard(pokemonURL, i);
        renderHTMLAllPokemons(pokemonURL, i);
    }
}

function renderHTMLAllPokemons(pokemonURL, i){
    return document.getElementById('allPokemons').innerHTML += /*html*/`
    <div onclick="loadPokemon('${pokemonURL}')" class="pokemon-card boxshadow-${typeforbackground}" id="pokemon-card${i}">
        <div class="number-name-div">
            <div><h3 id="pokemonNameCard${i}"></h3></div><div id="pokemonNumberCard${i}"></div>
        </div>
        <div class="pokemon-image-div-card">
            <div class="mt-3" id="typesCard${i}"></div>
            <img class="pokemon-image-card" id="pokemonImageCard${i}">
        </div>
    </div>
 `;
}

function debounceSearch() {
if(!isSearching){
    isSearching = true;
    searchingPokemon();
}
}

function updateScrollbarColors() {
    let pokedex = document.getElementById("pokedex");
    let computedStyles = getComputedStyle(pokedex);

    let backgroundColor = computedStyles.backgroundColor;

    infoText.style.setProperty('--scrollbar-thumb', backgroundColor);
}

async function renderPokemonInfoCard(pokemonURL, i){
    let response = await fetch(pokemonURL);
    pokemon = await response.json();
    let pokemontypes = pokemon['types'];

    document.getElementById(`pokemonNameCard${i}`).innerHTML = pokemon['name'];
    document.getElementById(`pokemonImageCard${i}`).src = pokemon['sprites']['other']['official-artwork']['front_default'];
    document.getElementById(`pokemonNumberCard${i}`).innerHTML = "#"+pokemon['id'];

    createCurrentTypesForCard(pokemontypes, i);
}

window.addEventListener('scroll', () => {
    // Überprüfen, ob das Ende der Seite erreicht wurde
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        // Hier wird der Code ausgeführt, wenn das Ende der Seite erreicht wurde
        loadMore();

    }
});

function loadMore(){
    firstPokemonsCount += 30;
    firstPokemons = allPokemons['results'].slice(0, firstPokemonsCount);
    typeforbackground = '';
    init();
}

function nextPokemon(id){
    id = (Number(id) + 1);
    let url = `https://pokeapi.co/api/v2/pokemon/${id}/` 
    loadPokemon(url);
}

function lastPokemon(id){
    id = (Number(id) - 1);
    let url = `https://pokeapi.co/api/v2/pokemon/${id}/` 
    loadPokemon(url);
}

function createCurrentTypesForCard(pokemontypes, i){
    document.getElementById(`typesCard${i}`).innerHTML ='';

    for (let j = 0; j < pokemontypes.length; j++) {
        let type = pokemontypes[j]['type']['name'];

        document.getElementById(`typesCard${i}`).innerHTML += /*html*/`
       <div id="type${j}" class="type-area-card mb-3">${type}</div>
     `;
        if (j === 0) {
            typeforbackground = type;
        }
    }
    createCurrentBackgroundforCard(typeforbackground, i);
}

function createCurrentBackgroundforCard(typeforbackground, i){
    document.getElementById(`pokemon-card${i}`).classList.add(`background-${typeforbackground}`)
    document.getElementById(`pokemon-card${i}`).classList.add(`boxshadow-${typeforbackground}`)
}

//pokemon search

async function searchingPokemon(){
    let {PokemonForLooking, counter, allPokemonsArea} = createvariablesSearchingPokemon();

    allPokemonsArea.innerHTML = '';

    for (let i = 0; i < allPokemons['results'].length && counter < 30; i++) {
        let rightPokemon = allPokemons['results'][i]['name'];
        let pokemonURL = allPokemons['results'][i]['url'];

        if (rightPokemon.includes(PokemonForLooking)) {
            renderHTMLsearchingPokemon(pokemonURL, i);
            await renderPokemonInfoCard(pokemonURL, i)
            counter++;
        }
    }
    isSearching = false;
}

function createvariablesSearchingPokemon(){
    let PokemonForLooking = document.getElementById('search').value.toLowerCase();
    let counter = 0;
    let allPokemonsArea = document.getElementById('allPokemons');

    return {PokemonForLooking, counter, allPokemonsArea}
}

function renderHTMLsearchingPokemon(pokemonURL, i){
return document.getElementById('allPokemons').innerHTML += /*html*/`
<div onclick="loadPokemon('${pokemonURL}')" class="pokemon-card" id="pokemon-card${i}">
    <div class="number-name-div">
        <div><h3 id="pokemonNameCard${i}"></h3></div><div id="pokemonNumberCard${i}"></div>
    </div>
    <div class="pokemon-image-div-card">
        <div class="mt-3" id="typesCard${i}"></div>
        <img class="pokemon-image-card" id="pokemonImageCard${i}">
    </div>
</div>
`;
}

//pokemon zoom

async function loadPokemon(pokemonURL){
    let url = pokemonURL;
    let response = await fetch(url);
    currentPokemon = await response.json();

    renderPokemonInfo();
} 

function renderPokemonInfo(){
    let id = currentPokemon['id'];
    createPokemonZoom(id);
    let pokemontypes = currentPokemon['types'];

    document.getElementById('pokemonName').innerHTML = currentPokemon['name'];
    document.getElementById('pokemonImage').src = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    document.getElementById('pokemonNumber').innerHTML = "#"+currentPokemon['id'];
    
    controllSliderleft(id);
    createCurrentTypes(pokemontypes);
    loadAbout();
    updateScrollbarColors()
    on();
}

function controllSliderleft(id){
    if(id == 1){
        document.getElementById('sliderLeft').disabled = true;
        document.getElementById('sliderLeft').classList.add('btn')
    }
    else{
        document.getElementById('sliderLeft').disabled = false;
    }
}

function createPokemonZoom(id){
    document.getElementById('pokemonZoomArea').innerHTML ='';
    document.getElementById('pokemonZoomArea').innerHTML += /*html*/`
                <div onclick="notClose(event)" id="pokedex">
            <div class="number-name-div">
                <div><h1 id="pokemonName"></h1></div><div id="pokemonNumber"></div>
            </div>
            <div class="mt-3" id="types"></div>
            <div class="slider-div">
                <button id="sliderLeft" onclick="lastPokemon('${id}')"></button>
                <button class="slider-r" onclick="nextPokemon('${id}')"></button>
            </div>
        </div>
        <div onclick="notClose(event)" class="info-container">
            <div class="pokemon-image-div"><img id="pokemonImage"></div>
            <div id="info-choice" class="info-choice">
                <a id="loadAboutBtn" onclick="loadAbout()" href="#/">About</a>
                <a id="loadStatsBtn" onclick="loadStats()" href="#/">Stats</a>
                <a id="loadMovesBtn" onclick="loadMoves()" href="#/">Moves</a>
            </div>
            <div class="info-text" id="infoText">
            </div>
        </div>
    `;
}

function disableScrollbar() {
    let infoText = document.getElementById("infoText");
    infoText.style.overflow = "hidden";
}

function enableScrollbar() {
    let infoText = document.getElementById("infoText");
    infoText.style.overflow = "auto";
}

function loadAbout(){
    controll();
    document.getElementById('loadAboutBtn').classList.add('info-choice-decoration');
    let aboutText = document.getElementById('infoText');
    let {pokemonabilities, base_e, height, weight,} = createAboutVariables();

    aboutText.innerHTML = '';
    aboutText.innerHTML = /*html*/`
        <div class="mt-3" id="pokemonabilities"><b>Abilities:</b></div>
        <div class="mt-3"><b>base exprience:</b> ${base_e}</div>
        <div class="mt-3"><b>height:</b> ${height}</div>
        <div class="mt-3"><b>weight:</b> ${weight}</div>
    `;
    disableScrollbar()
    createCurrentAbilities(pokemonabilities);
}

function loadStats(){
    controll();
    let pokemonstats = currentPokemon['stats'];

    document.getElementById('loadStatsBtn').classList.add('info-choice-decoration');
    let aboutText = document.getElementById('infoText');

    aboutText.innerHTML = '';
    aboutText.innerHTML = /*html*/`
        <div><b>Stats:</b></div>
        <div id=stats></div>
    `;
    createCurrentStats(pokemonstats);
    disableScrollbar()
}

function loadMoves(){
    controll();
    document.getElementById('loadMovesBtn').classList.add('info-choice-decoration');
    let aboutText = document.getElementById('infoText');
    let pokemonmoves = currentPokemon['moves'];

    aboutText.innerHTML = '';
    aboutText.innerHTML = /*html*/`
    <div id="moves"></div>
`;
createCurrentMoves(pokemonmoves);
enableScrollbar()

}

function createAboutVariables(){
    pokemonabilities = currentPokemon['abilities'];
    base_e = currentPokemon['base_experience'];
    height = currentPokemon['height'];
    weight = currentPokemon['weight'];

    return {pokemonabilities, base_e, height, weight};
}

function createCurrentAbilities(pokemonabilities){
    for (let i = 0; i < pokemonabilities.length; i++) {
        let ability = pokemonabilities[i]['ability']['name'];
        document.getElementById('pokemonabilities').innerHTML += /*html*/`
       <div>${ability}</div>
     `;
    }
}

function createCurrentTypes(pokemontypes){
    let typeforbackground;
    document.getElementById('types').innerHTML ='';
    for (let i = 0; i < pokemontypes.length; i++) {
        let type = pokemontypes[i]['type']['name'];

        document.getElementById('types').innerHTML += /*html*/`
       <div id="type${i}" class="type-area mb-3">${type}</div>
     `;
        if (i === 0) {
            typeforbackground = type;
        }
    }
    createCurrentBackground(typeforbackground);
}

function createCurrentBackground(typeforbackground){
    let pokedex = document.getElementById('pokedex');
    
    // entferne alle Klassen die mit `background-` beginnen.
    removeOldBackground(pokedex);

    document.getElementById('pokedex').classList.add(`background-${typeforbackground}`);
}

function removeOldBackground(pokedex){
    let removeClasses = Array.from(pokedex.classList).filter(className => className.startsWith('background-'));
    if(removeClasses.length > 0) {
        pokedex.classList.remove(removeClasses);
    }
}

function controll(){
    let container = document.querySelector('.info-choice-decoration'); //container =  div mit klasse info-choice-decoration

    if(container){
        container.classList.remove('info-choice-decoration') // entfernt klasse info-choice-decoration von container
    }
}

function createCurrentStats(pokemonstats){
    for (let index = 0; index < pokemonstats.length; index++) {
        let statname = pokemonstats[index]['stat']['name'];
        let statvalue = pokemonstats[index]['base_stat'];
        
        document.getElementById('stats').innerHTML += /*html*/`
            <div>${statname}: ${statvalue}</div>
        `;
    }
}

function createCurrentMoves(pokemonmoves){
    for (let index = 0; index < pokemonmoves.length; index++) {
        let move = pokemonmoves[index]['move']['name'];
        
        document.getElementById('moves').innerHTML += /*html*/`
           <div class="move">${move}</div> 
        `;
    }
}

function on(){
    document.getElementById("pokemonZoomArea").style.display = "flex";
}
  
  function off(){
    document.getElementById("pokemonZoomArea").style.display = "none";
}

function notClose(event){
    event.stopPropagation();
}