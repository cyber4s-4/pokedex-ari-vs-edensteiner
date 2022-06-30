async function fetchAPI(pokemon: string) {
  clear();
  try {
    let response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}/`
    );
    let json = await response.json();

    //name
    const name = document.getElementById("name");
    name!.innerHTML = "Name: "+json.name;
    //front image
    const frontImg = document.getElementById("frontImg");
    frontImg!.setAttribute("src", json.sprites.front_default);
    //back image
    const backImg = document.getElementById("backImg");
    backImg!.setAttribute("src", json.sprites.back_default);
    //abilities
    const abilityList = document.getElementById("abilitiesList");
    abilityList!.innerHTML = "Abilities: ";
    for(let eachAbility of json.abilities){
      const ability = document.createElement("li");
      ability.innerHTML = eachAbility.ability.name;
      abilityList!.appendChild(ability);
    };
    //types
    const typesList = document.getElementById("typesList");
    typesList!.innerHTML = "Types: ";
    for(let eachType of json.types){
      const type = document.createElement("li");
      type.innerHTML = eachType.type.name;
      typesList!.appendChild(type);
    };
    //height
    const height = document.getElementById("height");
    height!.innerHTML = "Height: "+json.height;
    //weight
    const weight = document.getElementById("weight");
    weight!.innerHTML = "Weight: "+json.weight;
    //stats
    const statsList = document.getElementById("statsList");
    statsList!.innerHTML = "Stats: "
    for(let stat of json.stats){
      const statItem = document.createElement("li");
      const statValue = stat.base_stat;
      const statName = stat.stat.name;
      statItem.innerHTML = statName+": "+statValue;
      statsList!.appendChild(statItem);
    };
    console.log(json.stats);
  } catch (error) {
    const errorMessage = `no pokemon found, ${error} `;
    alert(errorMessage);
  }
}

function clear(){
  let htmlToClear = document.getElementsByClassName("innerHTML");
for(let element of htmlToClear){
  element.innerHTML = "";
};
let srcToClear = document.getElementsByClassName("src");
for(let element of srcToClear){
  element.removeAttribute("src");
};
};

function load() {
  const searchBar = document.getElementById("searchBar") as HTMLInputElement;
  const searchButton = document.getElementById("searchButton") as HTMLButtonElement;
  searchButton!.innerHTML = "<i class='fa'>&#xf002;</i>";
  searchButton!.onclick = () => {
    fetchAPI(searchBar!.value);
    searchBar.value = "";
  };
}

load();

/*
-name v
-images v
-abilities v
-types v
-height v
-weight v
-stats
*/