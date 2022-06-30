async function fetchAPI(pokemon: string) {
  try {
    let response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}/`
    );
    let json = await response.json();

    const div = document.createElement("div") as HTMLDivElement;
    div.id = "something";
    div.innerHTML = `
      <h1>${json.name}</h1>
      <img src=${json.sprites.front_default}>
      <img src=${json.sprites.back_default}>
    `;
    document.body.appendChild(div);
  } catch (error) {
    const errorMessage = `no pokemon found, ${error} `;
    alert(errorMessage);
  }
}

// fetchAPI("Squirtle");

function load() {
  const searchBar = document.createElement("input") as HTMLInputElement;
  searchBar.type = "text";
  searchBar.placeholder = "Search a pokemon";
  const searchButton = document.createElement("button") as HTMLButtonElement;
  searchButton.innerHTML = "<i class='fa'>&#xf002;</i>";
  searchButton.onclick = () => {
    fetchAPI(searchBar.value);
    searchBar.value = "";
  };

  document.body.appendChild(searchBar);
  document.body.appendChild(searchButton);
}

load();
