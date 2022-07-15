let loadingPage = 0;

// get pokemon from server by search
async function fetchFromServer(pokemon: string) {
  clearSearch();
  try {
    let response = await fetch(`http://localhost:3000/pokemon/${pokemon.toLowerCase()}/`);
    if (response.status == 404 || pokemon === "#") {
      // error
      throw "No pokemon matched your search!";
    }
    let json = await response.json();
    //unhide
    const pokemonDiv = document.getElementById("pokemon-div") as HTMLDivElement;
    pokemonDiv.style.display = "";
    //name
    const name = document.getElementById("name");
    name!.innerHTML = `${json.data.name.charAt(0).toUpperCase()}${json.data.name.substring(1)}`;
    //front image
    const frontImg = document.getElementById("frontImg");
    const frontImageAttribute = json.data.front_image || "./noImage.png";
    frontImg!.setAttribute("src", frontImageAttribute);
    //back image
    const backImg = document.getElementById("backImg");
    const backImageAttribute = json.data.back_image || "./noImage.png";
    backImg!.setAttribute("src", backImageAttribute);
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
    //handle error
  } catch (error) {
    const pokemonDiv = document.getElementById("pokemon-div") as HTMLDivElement;
    pokemonDiv.style.display = "none";
    alert("No pokemon matched your search!");
  }
}

//clear search result
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

//clear preview page
async function clearPage() {
  const previewDiv = document.getElementById("pokemonPreviewList");
  previewDiv!.innerHTML = "";
  for (let i = 1; i <= 3; i++) {
    let pageButton;
    if (i == 1) {
      pageButton = document.getElementById("firstButton")!.firstChild;
      pageButton!.classList.remove("currentPage");
    }
    if (i == 2) {
      pageButton = document.getElementById("lastButton")!.firstChild;
      pageButton!.classList.remove("currentPage");
    }
    if (i == 3) {
      for (let x = 0; x <= 4; x++) {
        pageButton = document.getElementsByClassName("button" + x) as HTMLCollection;
        for (let button of pageButton) {
          button.classList.remove("currentPage");
        }
      }
    }
  }
}

//load pokemons on page
async function load() {
  document.getElementById("loading")!.remove();
  document.getElementById("loadingImg")!.remove();
  const searchBar = document.getElementById("searchBar") as HTMLInputElement;
  const searchButton = document.getElementById("searchButton") as HTMLButtonElement;
  searchButton!.onclick = () => {
    fetchFromServer(searchBar!.value);
    searchBar.value = "";
  };
  window!.onkeydown = (e) => {
    if (e.key === "Enter" && searchBar.value.length > 0) {
      fetchFromServer(searchBar.value);
      searchBar.value = "";
    }
  };
  let response = await fetch("http://localhost:3000/pokemonCount");
  let pokemonLength = await response.json();
  let pageCount = Math.ceil(Number(pokemonLength) / 24);
  for (let i = 1; i <= 2; i++) {
    let page: number;
    if (i == 1) page = 1;
    if (i == 2) page = pageCount;
    let pageButton = document.createElement("button");
    pageButton.innerHTML = page!.toString();
    let pageId = "page" + page!;
    pageButton.setAttribute("id", pageId);
    pageButton.addEventListener("click", () => {
      getPage(page);
    });
    if (i == 1) {
      document.getElementById("firstButton")!.appendChild(pageButton);
    } else if (i == 2) {
      document.getElementById("lastButton")!.appendChild(pageButton);
    }
  }
  getPage(1);
  document.getElementById("page1")!.classList.add("currentPage");
}

function getButtons(first: number, last: number) {
  document.getElementById("dynamicButtons")!.innerHTML = "";
  for (let i = first; i <= last; i++) {
    let pageButton = document.createElement("button");
    pageButton.innerHTML = i.toString();
    pageButton.classList.add("button" + (i - first));
    pageButton.setAttribute("id", "page" + i);
    pageButton.addEventListener("click", () => {
      getPage(i);
    });
    document.getElementById("dynamicButtons")!.appendChild(pageButton);
  }
  loadingPage = 0;
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

// interface for preview data
interface PreviewData {
  name: string;
  front_image: string;
  back_image: string;
}

//gets N pokemons
async function getPokemons(x: number, n: number) {
  const pokemonData: PreviewData[] = [];
  const promises: Promise<void>[] = [];
  for (let i = x; i <= n; i++) {
    promises.push(
      (async (): Promise<void> => {
        let response = await fetch(`http://localhost:3000/preview/${i}`);
        let json = await response.json();
        let PreviewData = {
          //name
          name: json.name,
          //front image
          front_image: json.front_image,
          //back image
          back_image: json.back_image,
        };
        pokemonData.push(PreviewData);
      })()
    );
  }
  await Promise.all(promises);
  return pokemonData;
}

async function getPage(page: number) {
  let newLoad = 0;
  if (loadingPage == 0) {
    loadingPage = 1;
    newLoad = 1;
  }
  if (newLoad == 1) {
    let response = await fetch("http://localhost:3000/pokemonCount");
    let pokemonLength = await response.json();
    let pageCount = Math.ceil(pokemonLength / 24);
    clearPage();
    const pageRequest = await fetch(`http://localhost:3000/page/${page}`);
    const pokemons = await pageRequest.json();
    for (let pokemon of pokemons) {
      const count = pokemons.indexOf(pokemon);
      buildPokemon(pokemon, count);
    }
    if (page < 4) {
      getButtons(2, 6);
      let current = document.getElementById("page" + page);
      current!.classList.add("currentPage");
    } else if (page > pageCount - 3) {
      getButtons(pageCount - 5, pageCount - 1);
      let current = document.getElementById("page" + page);
      current!.classList.add("currentPage");
    } else {
      getButtons(page - 2, page + 2);
      let current = document.getElementsByClassName("button2");
      for (let currentPage of current) {
        currentPage.classList.add("currentPage");
      }
    }
  }
}

function buildPokemon(pokemon: PreviewData, count: number) {
  console.log(pokemon);
  //new pokemon div
  const pokemonDiv = document.createElement("div");
  pokemonDiv.classList.add("pokemonPreview");
  pokemonDiv.setAttribute("id", "preview" + count);
  //name
  const name = document.createElement("h3");
  // name.setAttribute("id", pokemon.data.name);
  name.innerHTML = `${pokemon.name.charAt(0).toUpperCase()}${pokemon.name.substring(1)}`;
  //front image
  const frontImg = document.createElement("img");
  const frontImageAttribute = pokemon.front_image || "./noImage.png";
  frontImg.setAttribute("src", frontImageAttribute);
  //back image
  const backImg = document.createElement("img");
  const backImageAttribute = pokemon.back_image || "./noImage.png";
  backImg!.setAttribute("src", backImageAttribute);
  //appending
  pokemonDiv.appendChild(name);
  pokemonDiv.appendChild(frontImg);
  pokemonDiv.appendChild(backImg);
  document.getElementById("pokemonPreviewList")!.appendChild(pokemonDiv);
  //setting onclick
  pokemonDiv.addEventListener("click", async (e) => {
    const target = e.target as HTMLElement;
    let nameToFetch: string;
    if (target.id) {
      nameToFetch = target.firstChild!.textContent!;
    } else {
      nameToFetch = target.parentElement!.firstChild!.textContent!;
    }
    await fetchFromServer(nameToFetch!);
  });
}
// loading screen
let loading = document.createElement("p");
loading.innerHTML = "The site is loading, please wait...";
loading.setAttribute("style", "text-align: center");
loading.setAttribute("id", "loading");
let loadingImg = document.createElement("img");
loadingImg.setAttribute("id", "loadingImg");
loadingImg.setAttribute("src", "./loading.gif");
document.getElementById("loadingScreen")!.appendChild(loading);
document.getElementById("loadingScreen")!.appendChild(loadingImg);
// start website
loadWebsite();

// checks if data is loaded on server, while false keep checking. when true load website
async function loadWebsite() {
  let response = await fetch("http://localhost:3000/pokemonCount");
  let serverDataIsLoaded = await response.json();
  if (!serverDataIsLoaded) {
    setTimeout(loadWebsite, 1000);
  } else {
    load();
  }
}
