async function fetchAPI(pokemon: string) {
  clearSearch();
  try {
    let response = await fetch(
      `http://localhost:3000/${pokemon.toLowerCase()}/`
    );
    if (response.status == 404 || pokemon === "#") {
      //hide
      const pokemonDiv = document.getElementById(
        "pokemon-div"
      ) as HTMLDivElement;
      pokemonDiv.style.display = "none";
      // error
      throw "No pokemon matched your search!";
    }
    let json = await response.json();
    //unhide
    const pokemonDiv = document.getElementById("pokemon-div") as HTMLDivElement;
    pokemonDiv.style.display = "";
    //name
    const name = document.getElementById("name");
    name!.innerHTML = `${json.data.name
      .charAt(0)
      .toUpperCase()}${json.data.name.substring(1)}`;
    //front image
    const frontImg = document.getElementById("frontImg");
    frontImg!.setAttribute("src", json.data.front_image);
    //back image
    const backImg = document.getElementById("backImg");
    backImg!.setAttribute("src", json.data.back_image);
    //abilities
    const abilityList = document.getElementById("abilitiesList");
    abilityList!.innerHTML = "Abilities: ";
    for (let eachAbility of json.data.abilities) {
      const ability = document.createElement("li");
      ability.innerHTML = eachAbility;
      abilityList!.appendChild(ability);
    }
    //types
    const typesList = document.getElementById("typesList");
    typesList!.innerHTML = "Types: ";
    for (let eachType of json.data.types) {
      const type = document.createElement("li");
      type.innerHTML = eachType;
      typesList!.appendChild(type);
    }
    //height
    const height = document.getElementById("height");
    height!.innerHTML = "Height: " + json.data.height;
    //weight
    const weight = document.getElementById("weight");
    weight!.innerHTML = "Weight: " + json.data.weight;
    //stats
    const statsList = document.getElementById("statsList");
    statsList!.innerHTML = "Stats: ";
    for (let stat of json.data.stats) {
      const statItem = document.createElement("li");
      statItem.innerHTML = stat;
      statsList!.appendChild(statItem);
    }
  } catch (error) {
    alert("No pokemon matched your search!");
  }
}

function clearSearch() {
  let htmlToClear = document.getElementsByClassName("innerHTML");
  for (let element of htmlToClear) {
    element.innerHTML = "";
  }
  let srcToClear = document.getElementsByClassName("src");
  for (let element of srcToClear) {
    element.removeAttribute("src");
  }
}

function clearPage() {
  const previewDiv = document.getElementById("pokemonPreviewList");
  previewDiv!.innerHTML = "";
  for(let i=1; i<=5; i++){
    const pageButton = document.getElementById("page"+i);
    pageButton!.classList.remove("currentPage");
  }
}

function load() {
  console.log("loaded");
  document.getElementById("loading")!.remove();
  document.getElementById("loadingImg")!.remove();
  const searchBar = document.getElementById("searchBar") as HTMLInputElement;
  const searchButton = document.getElementById(
    "searchButton"
  ) as HTMLButtonElement;
  searchButton!.onclick = () => {
    fetchAPI(searchBar!.value);
    searchBar.value = "";
  };
  window!.onkeydown = (e) => {
    if (e.key === "Enter" && searchBar.value.length > 0) {
      fetchAPI(searchBar.value);
      searchBar.value = "";
    }
  };
  for(let i=1; i<=5; i++){
    const pageButton = document.getElementById("page"+i);
    pageButton!.addEventListener("click", () => {
      getPage(i);
      pageButton!.classList.add("currentPage");
    });
  }
  getPage(1);
  document.getElementById("page1")!.classList.add("currentPage");
}

//interface for pokemon data
interface Data {
  name: string;
  front_image: string;
  back_image: string;
  abilities: string[];
  types: string[];
  stats: string[];
  height: string;
  weight: string;
}

//class for pokemon
class Pokemon {
  data: Data;
  constructor(data: Data) {
    this.data = data;
  }
}

//gets N pokemons
async function getPokemons(n: number, x: number) {
  let pokemonData: Pokemon[] = [];
  for (let i = x; i <= n; i++) {
    let response = await fetch(`http://localhost:3000/${i-1}`);
    let json = await response.json();
    let data = {
      //name
      name: json.data.name,
      //front image
      front_image: json.data.front_image,
      //back image
      back_image: json.data.back_image,
      //abilites array
      abilities: json.data.abilities,
      //types array
      types: json.data.types,
      //stats array
      stats: json.data.stats,
      height: json.height,
      weight: json.weight
    };
    const pokemon = new Pokemon(data);
    pokemonData.push(pokemon);
  }
  return pokemonData;
}
// console logs first 100 pokemons
// getPokemons(100, 1).then((data) => console.log(data));

async function getPage(page: number) {
  clearPage();
  const lastPokemonId = page * 24;
  const firstPokemonId = lastPokemonId - 23;
  const pokemons = await getPokemons(lastPokemonId, firstPokemonId);
  for (let pokemon of pokemons) {
    const count = pokemons.indexOf(pokemon)
    buildPokemon(pokemon, count);
  }
}

function buildPokemon(this: any, pokemon: Pokemon, count: number) {
  //new pokemon div
  const pokemonDiv = document.createElement("div");
  pokemonDiv.classList.add("pokemonPreview");
  pokemonDiv.setAttribute("id", "preview"+count);
  //name
  const name = document.createElement("h3");
  // name.setAttribute("id", pokemon.data.name);
  name.innerHTML = `${pokemon.data.name
    .charAt(0)
    .toUpperCase()}${pokemon.data.name.substring(1)}`;
  //front image
  const frontImg = document.createElement("img");
  frontImg.setAttribute("src", pokemon.data.front_image);
  //back image
  const backImg = document.createElement("img");
  backImg!.setAttribute("src", pokemon.data.back_image);
  //setting onclick
  //appending
  pokemonDiv.appendChild(name);
  pokemonDiv.appendChild(frontImg);
  pokemonDiv.appendChild(backImg);
  document.getElementById("pokemonPreviewList")!.appendChild(pokemonDiv);
  pokemonDiv.addEventListener("click", (e)=>{
    const target = e.target as HTMLElement;
    let nameToFetch: string;
    if(target.id){
    nameToFetch = target.firstChild!.textContent!;
    }else{
      nameToFetch = target.parentElement!.firstChild!.textContent!
    }
    fetchAPI(nameToFetch!);
  })
}

let loading = document.createElement("p");
loading.innerHTML = "The site is loading, please wait..."
loading.setAttribute("style", "text-align: center");
loading.setAttribute("id", "loading");
let loadingImg = document.createElement("img");
loadingImg.setAttribute("id", "loadingImg");
loadingImg.setAttribute("src", "./loading.gif");
document.getElementById("loadingScreen")!.appendChild(loading);
document.getElementById("loadingScreen")!.appendChild(loadingImg);
setTimeout(load, 30000);