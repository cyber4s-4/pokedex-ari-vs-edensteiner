import { fetchFromServer, buildPokemon, clearSearch } from "./pokemonFunctions";
let loadingPage = 0; //used to make sure multiples of the same page are not loaded together
const POKEMONS_PER_PAGE = 24; //number of pokemons on each page
let pokemonCount: Promise<any>;

//clear preview page
async function clearPage() {
  const previewDiv = document.getElementById("pokemonPreviewList");
  previewDiv!.innerHTML = "";
  for (let i = 1; i <= 3; i++) {
    let pageButton;
    if (i == 1) {
      pageButton = document.getElementById("firstButton")!.firstChild as HTMLButtonElement;
      pageButton!.classList.remove("currentPage");
    }
    if (i == 2) {
      pageButton = document.getElementById("lastButton")!.firstChild as HTMLButtonElement;
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
  const searchBar = document.getElementById("searchBar") as HTMLInputElement;
  const searchButton = document.getElementById("searchButton") as HTMLButtonElement;
  searchButton!.onclick = async () => {
    if (searchBar.value.length > 0) {
      await fetchFromServer(searchBar!.value);
      searchBar.value = "";
    }
  };
  window!.onkeydown = async (e) => {
    if (e.key === "Enter" && searchBar.value.length > 0) {
      await fetchFromServer(searchBar.value);
      searchBar.value = "";
    }
  };
  let pokemonLength = await pokemonCount;
  let pageCount = Math.ceil(Number(pokemonLength) / POKEMONS_PER_PAGE);
  for (let i = 1; i <= 2; i++) {
    let page: number;
    if (i == 1) page = 1;
    if (i == 2) page = pageCount;
    let pageButton = document.createElement("button");
    pageButton.innerHTML = page!.toString();
    let pageId = "page" + page!;
    pageButton.setAttribute("id", pageId);
    pageButton.addEventListener("click", () => {
      clearSearch();
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

//create page buttons dynamically
function getButtons(first: number, last: number) {
  document.getElementById("dynamicButtons")!.innerHTML = "";
  for (let i = first; i <= last; i++) {
    let pageButton = document.createElement("button");
    pageButton.innerHTML = i.toString();
    pageButton.classList.add("button" + (i - first));
    pageButton.setAttribute("id", "page" + i);
    pageButton.addEventListener("click", () => {
      clearSearch();
      getPage(i);
    });
    document.getElementById("dynamicButtons")!.appendChild(pageButton);
  }
  loadingPage = 0;
}

//loads a preview page of pokemons
async function getPage(page: number) {
  let newLoad = 0;
  //makes sure this does not get executed several times in a row
  if (loadingPage == 0) {
    loadingPage = 1;
    newLoad = 1;
  }
  if (newLoad == 1) {
    let pokemonLength = await pokemonCount;
    let pageCount = Math.ceil(Number(pokemonLength) / POKEMONS_PER_PAGE);
    clearPage();
    const pageRequest = await fetch(`https://pokemon-eden-ariel.herokuapp.com/page/${page}`);
    const pokemons = await pageRequest.json();
    for (let pokemon of pokemons) {
      const count = pokemons.indexOf(pokemon);
      buildPokemon(pokemon, count);
    }
    //limits dynamic buttons in case they are at the edge of the page range
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

// start website
loadWebsite();

// checks if data is loaded on server, while false keep checking. when true load website
async function loadWebsite() {
  let response = await fetch("https://pokemon-eden-ariel.herokuapp.com/pokemonCount");
  pokemonCount = response.json();
  let serverDataIsLoaded = pokemonCount;
  // let serverDataIsLoaded = await response.json();
  if (!serverDataIsLoaded) {
    setTimeout(loadWebsite, 1000);
  } else {
    load();
  }
}
