import { PreviewData } from "./previewData";

// get pokemon from server by search
export async function fetchFromServer(pokemon: string) {
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

export function buildPokemon(pokemon: PreviewData, count: number) {
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